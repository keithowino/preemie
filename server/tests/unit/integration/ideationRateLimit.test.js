import assert from "node:assert/strict";
import { afterEach, test } from "node:test";
import express from "express";

import {
	createIdeationRateLimiter,
	ErrorCodes,
	HTTP_STATUS,
} from "../../../src/index.js";

let server;

afterEach(async () => {
	if (server?.listening) {
		await new Promise((resolve, reject) => {
			server.close((error) => {
				if (error) {
					reject(error);
					return;
				}

				resolve();
			});
		});
	}

	server = undefined;
});

test("returns 429 when the request limit is exceeded", async () => {
	const app = express();

	const rateLimiter = createIdeationRateLimiter({
		max: 2,
		windowMs: 60_000,
	});

	app.get("/test", rateLimiter, (req, res) => {
		res.status(HTTP_STATUS.OK).json({
			success: true,
		});
	});

	server = app.listen(0, "127.0.0.1");

	await new Promise((resolve, reject) => {
		server.once("listening", resolve);
		server.once("error", reject);
	});

	const address = server.address();
	const url = `http://127.0.0.1:${address.port}/test`;

	const firstResponse = await fetch(url);
	const secondResponse = await fetch(url);

	assert.equal(firstResponse.status, HTTP_STATUS.OK);
	assert.equal(secondResponse.status, HTTP_STATUS.OK);

	const thirdResponse = await fetch(url);
	const body = await thirdResponse.json();

	assert.equal(thirdResponse.status, HTTP_STATUS.TOO_MANY_REQUESTS);

	assert.deepEqual(body, {
		success: false,
		error: {
			code: ErrorCodes.TOO_MANY_REQUESTS,
			message: "Too many requests. Please try again later.",
			details: null,
		},
	});
});
