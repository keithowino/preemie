import test from "node:test";
import assert from "node:assert/strict";
import express from "express";

import { createIdeationController, errorHandler } from "../../../src/index.js";

/**
 * These tests exercise the real controller, request
 * validation, Express routing, and global error handler.
 * The provider and database failures are simulated; these
 * tests do not establish that Gemini or MongoDB works in
 * a live request.
 */

const generationId = "c6a2f83b-7f5b-4a42-9b61-24f2e97f5e31";

const sampleInput = {
	materials: [{ name: "DC motor", quantity: 1, unit: "piece" }],
	constraints: {
		goal: "Build a small useful device",
		skillLevel: "BEGINNER",
	},
};

const sampleGeneration = {
	generationId,
	input: sampleInput,
	concepts: [
		{ id: "concept-1", type: "REPURPOSE", title: "Repurposed device" },
		{ id: "concept-2", type: "IMPROVEMENT", title: "Improved device" },
		{ id: "concept-3", type: "NOVEL_INVENTION", title: "Novel device" },
	],
};

async function withTestServer(ideationService, run) {
	const app = express();

	app.use(express.json());

	const controller = createIdeationController({ ideationService });

	app.post("/api/v1/ideations", controller.create);
	app.get("/api/v1/ideations/:generationId", controller.getByGenerationId);

	// Match the production application's global error handling.
	app.use(errorHandler);

	const server = app.listen(0, "127.0.0.1");

	try {
		await new Promise((resolve, reject) => {
			server.once("listening", resolve);
			server.once("error", reject);
		});

		const address = server.address();
		const baseUrl = `http://127.0.0.1:${address.port}`;

		await run(baseUrl);
	} finally {
		await new Promise((resolve, reject) => {
			server.close((error) => {
				if (error) {
					reject(error);
				} else {
					resolve();
				}
			});
		});
	}
}

function makeService({
	createResult = sampleGeneration,
	getResult = sampleGeneration,
	createError,
	getError,
} = {}) {
	const calls = {
		create: [],
		getByGenerationId: [],
	};

	const service = {
		async create(input) {
			calls.create.push(input);

			if (createError) {
				throw createError;
			}

			return createResult;
		},

		async getByGenerationId(id) {
			calls.getByGenerationId.push(id);

			if (getError) {
				throw getError;
			}

			return getResult;
		},
	};

	return { service, calls };
}

test("POST /api/v1/ideations returns 201 and the generated record", async () => {
	const { service, calls } = makeService();

	await withTestServer(service, async (baseUrl) => {
		const response = await fetch(`${baseUrl}/api/v1/ideations`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(sampleInput),
		});

		const body = await response.json();

		assert.equal(response.status, 201);
		assert.equal(body.success, true);
		assert.equal(body.message, "Ideation generated successfully.");
		assert.deepEqual(body.data, sampleGeneration);

		assert.equal(calls.create.length, 1);
		assert.deepEqual(calls.create[0], sampleInput);
	});
});

test("POST with an invalid body returns 400 without calling the service", async () => {
	const { service, calls } = makeService();

	await withTestServer(service, async (baseUrl) => {
		const response = await fetch(`${baseUrl}/api/v1/ideations`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ materials: [] }),
		});

		const body = await response.json();

		assert.equal(response.status, 400);
		assert.equal(body.success, false);
		assert.equal(body.error.message, "Validation failed.");
		assert.equal(calls.create.length, 0);
	});
});

test("GET with a valid generation ID returns the stored record", async () => {
	const { service, calls } = makeService();

	await withTestServer(service, async (baseUrl) => {
		const response = await fetch(
			`${baseUrl}/api/v1/ideations/${generationId}`,
		);

		const body = await response.json();

		assert.equal(response.status, 200);
		assert.equal(body.success, true);
		assert.equal(body.message, "Ideation retrieved successfully.");
		assert.deepEqual(body.data, sampleGeneration);
		assert.deepEqual(calls.getByGenerationId, [generationId]);
	});
});

test("GET with an invalid generation UUID returns 400 without calling the service", async () => {
	const { service, calls } = makeService();

	await withTestServer(service, async (baseUrl) => {
		const response = await fetch(`${baseUrl}/api/v1/ideations/not-a-uuid`);

		const body = await response.json();

		assert.equal(response.status, 400);
		assert.equal(body.success, false);
		assert.equal(body.error.message, "Validation failed.");
		assert.equal(calls.getByGenerationId.length, 0);
	});
});

test("GET for an unknown generation returns 404", async () => {
	const { service, calls } = makeService({ getResult: null });

	await withTestServer(service, async (baseUrl) => {
		const response = await fetch(
			`${baseUrl}/api/v1/ideations/${generationId}`,
		);

		const body = await response.json();

		assert.equal(response.status, 404);
		assert.equal(body.success, false);
		assert.equal(body.error.message, "Ideation generation not found.");
		assert.deepEqual(calls.getByGenerationId, [generationId]);
	});
});

test("POST provider failure returns a sanitized 500 response", async () => {
	const { service, calls } = makeService({
		createError: new Error("Private provider failure details"),
	});

	await withTestServer(service, async (baseUrl) => {
		const response = await fetch(`${baseUrl}/api/v1/ideations`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(sampleInput),
		});

		const body = await response.json();

		assert.equal(response.status, 500);
		assert.equal(body.success, false);
		assert.equal(body.error.message, "Internal Server Error");
		assert.equal(
			JSON.stringify(body).includes("Private provider failure details"),
			false,
		);
		assert.equal(calls.create.length, 1);
	});
});

test("POST database failure returns a sanitized 500 response", async () => {
	const { service, calls } = makeService({
		createError: new Error("Private database failure details"),
	});

	await withTestServer(service, async (baseUrl) => {
		const response = await fetch(`${baseUrl}/api/v1/ideations`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(sampleInput),
		});

		const body = await response.json();

		assert.equal(response.status, 500);
		assert.equal(body.success, false);
		assert.equal(body.error.message, "Internal Server Error");
		assert.equal(
			JSON.stringify(body).includes("Private database failure details"),
			false,
		);
		assert.equal(calls.create.length, 1);
	});
});
