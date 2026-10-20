import test from "node:test";
import assert from "node:assert/strict";

import { createIdeationService } from "./ideation.service.js";

/**
 * It imports the service directly and supplies fake dependencies,
 * so these tests do not invoke Gemini or connect to MongoDB.
 */

const sampleInput = {
	materials: [
		{
			name: "DC motor",
			quantity: 1,
			unit: "piece",
			condition: "Working",
		},
	],
	constraints: {
		goal: "Build a small useful device",
		skillLevel: "BEGINNER",
	},
};

const sampleConcepts = [
	{
		id: "concept-1",
		type: "REPURPOSE",
		title: "Repurposed Motor Device",
	},
	{
		id: "concept-2",
		type: "IMPROVEMENT",
		title: "Improved Motor Device",
	},
	{
		id: "concept-3",
		type: "NOVEL_INVENTION",
		title: "Novel Motor Application",
	},
];

function makeService({
	providerError,
	repositoryError,
	storedRecord = null,
} = {}) {
	const calls = {
		provider: [],
		create: [],
		findByGenerationId: [],
	};

	const provider = {
		async generateIdeation(input) {
			calls.provider.push(input);

			if (providerError) {
				throw providerError;
			}

			return {
				concepts: sampleConcepts,
			};
		},
	};

	const repository = {
		async create(data) {
			calls.create.push(data);

			if (repositoryError) {
				throw repositoryError;
			}

			return {
				...data,
				createdAt: new Date("2026-01-01T00:00:00.000Z"),
				updatedAt: new Date("2026-01-01T00:00:00.000Z"),
			};
		},

		async findByGenerationId(generationId) {
			calls.findByGenerationId.push(generationId);
			return storedRecord;
		},
	};

	return {
		service: createIdeationService({ provider, repository }),
		calls,
	};
}

test("creates and persists one generation with three concepts", async () => {
	const { service, calls } = makeService();

	const result = await service.create(sampleInput);

	assert.equal(calls.provider.length, 1);
	assert.equal(calls.provider[0], sampleInput);

	assert.equal(calls.create.length, 1);

	const savedData = calls.create[0];

	assert.match(
		savedData.generationId,
		/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
	);

	assert.deepEqual(savedData.input, {
		materials: sampleInput.materials,
		constraints: sampleInput.constraints,
	});

	assert.deepEqual(savedData.concepts, sampleConcepts);
	assert.equal(savedData.concepts.length, 3);

	assert.equal(result.generationId, savedData.generationId);
	assert.deepEqual(result.concepts, sampleConcepts);
});

test("does not persist when the provider fails", async () => {
	const providerError = new Error("Simulated provider failure");

	const { service, calls } = makeService({ providerError });

	await assert.rejects(
		service.create(sampleInput),
		(error) => error === providerError,
	);

	assert.equal(calls.provider.length, 1);
	assert.equal(calls.create.length, 0);
});

test("propagates a database failure without returning a saved result", async () => {
	const repositoryError = new Error("Simulated database failure");

	const { service, calls } = makeService({ repositoryError });

	await assert.rejects(
		service.create(sampleInput),
		(error) => error === repositoryError,
	);

	assert.equal(calls.provider.length, 1);
	assert.equal(calls.create.length, 1);
});

test("retrieves a generation by its public generation ID", async () => {
	const generationId = "c6a2f83b-7f5b-4a42-9b61-24f2e97f5e31";

	const storedRecord = {
		generationId,
		input: sampleInput,
		concepts: sampleConcepts,
	};

	const { service, calls } = makeService({ storedRecord });

	const result = await service.getByGenerationId(generationId);

	assert.deepEqual(calls.findByGenerationId, [generationId]);
	assert.equal(result, storedRecord);
});

test("returns null when a generation cannot be found", async () => {
	const generationId = "c6a2f83b-7f5b-4a42-9b61-24f2e97f5e31";

	const { service, calls } = makeService({ storedRecord: null });

	const result = await service.getByGenerationId(generationId);

	assert.equal(result, null);
	assert.deepEqual(calls.findByGenerationId, [generationId]);
});
