import test from "node:test";
import assert from "node:assert/strict";
import { createGeminiProvider } from "./gemini.provider.js";

const requiredTypes = ["REPURPOSE", "IMPROVEMENT", "NOVEL_INVENTION"];

function makeConcept(type) {
	return {
		// Deliberately invalid: the provider should replace model-supplied IDs.
		id: "model-generated-id",
		type,
		title: `${type} concept`,
		summary: "A practical concept using the submitted materials.",
		rationale: "This concept makes use of the available materials.",
		feasibility: {
			level: "MEDIUM",
			rationale:
				"Feasibility depends on the available tools and materials.",
		},
		complexity: "LOW",
		billOfMaterials: [
			{
				name: "DC motor",
				source: "AVAILABLE",
				purpose: "Provides rotational motion.",
			},
		],
		buildPlan: {
			tools: ["Screwdriver"],
			steps: [
				{
					order: 1,
					title: "Inspect the materials",
					description:
						"Check the materials for damage before assembly.",
					checkpoint:
						"Materials are suitable for the proposed build.",
				},
			],
		},
		assumptions: ["The motor is functional."],
		safetyWarnings: ["Disconnect power before adjusting wiring."],
		tests: ["Check that the assembly operates as intended."],
	};
}

function makeValidResponse() {
	return {
		concepts: requiredTypes.map(makeConcept),
	};
}

function makeProvider(responseOrError) {
	const client = {
		models: {
			generateContent: async () => {
				if (responseOrError instanceof Error) {
					throw responseOrError;
				}

				return responseOrError;
			},
		},
	};

	return createGeminiProvider({
		client,
		model: "test-model",
	});
}

const sampleInput = {
	materials: [{ name: "DC motor" }],
};

test("returns three validated concepts and replaces model IDs", async () => {
	const provider = makeProvider({
		text: JSON.stringify(makeValidResponse()),
	});

	const result = await provider.generateIdeation(sampleInput);

	assert.equal(result.concepts.length, 3);
	assert.deepEqual(
		result.concepts.map((concept) => concept.type).sort(),
		[...requiredTypes].sort(),
	);

	for (const concept of result.concepts) {
		assert.match(
			concept.id,
			/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
		);
		assert.notEqual(concept.id, "model-generated-id");
	}

	assert.equal(new Set(result.concepts.map((concept) => concept.id)).size, 3);
});

test("rejects invalid JSON", async () => {
	const provider = makeProvider({ text: "{not valid JSON" });

	await assert.rejects(
		provider.generateIdeation(sampleInput),
		/returned invalid JSON/,
	);
});

test("rejects output that does not match the concept schema", async () => {
	const provider = makeProvider({
		text: JSON.stringify({ concepts: [] }),
	});

	await assert.rejects(
		provider.generateIdeation(sampleInput),
		/invalid concept structure/,
	);
});

test("rejects an empty provider response", async () => {
	const provider = makeProvider({ text: "" });

	await assert.rejects(
		provider.generateIdeation(sampleInput),
		/returned an empty response/,
	);
});

test("normalizes provider request failures", async () => {
	const provider = makeProvider(new Error("simulated network failure"));

	await assert.rejects(
		provider.generateIdeation(sampleInput),
		/provider request failed/,
	);
});

test("normalizes provider timeout failures", async () => {
	const timeout = new Error("request timed out");
	timeout.name = "TimeoutError";

	const provider = makeProvider(timeout);

	await assert.rejects(
		provider.generateIdeation(sampleInput),
		/provider timed out/,
	);
});

test("requires a compatible client and model", () => {
	assert.throws(
		() => createGeminiProvider({ client: {}, model: "test-model" }),
		/compatible Gemini client/,
	);

	assert.throws(
		() =>
			createGeminiProvider({
				client: {
					models: { generateContent: async () => ({ text: "{}" }) },
				},
				model: " ",
			}),
		/model name is required/,
	);
});
