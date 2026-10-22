import assert from "node:assert/strict";
import { afterEach, test } from "node:test";
import express from "express";

import { errorHandler, HTTP_STATUS } from "../../../src/index.js";

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

test("rejects JSON bodies exceeding the configured limit", async () => {
	const app = express();

	app.use(express.json({ limit: "64kb" }));

	app.post("/test", (req, res) => {
		res.status(HTTP_STATUS.OK).json({
			success: true,
			data: req.body,
		});
	});

	app.use(errorHandler);

	server = app.listen(0, "127.0.0.1");

	await new Promise((resolve, reject) => {
		server.once("listening", resolve);
		server.once("error", reject);
	});

	const address = server.address();
	const oversizedPayload = JSON.stringify({
		content: "a".repeat(70 * 1024),
	});

	const response = await fetch(`http://127.0.0.1:${address.port}/test`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: oversizedPayload,
	});

	const body = await response.json();

	assert.equal(response.status, HTTP_STATUS.CONTENT_TOO_LARGE);
	assert.equal(body.success, false);
	assert.equal(body.error.code, "CONTENT_TOO_LARGE");
	assert.equal(body.error.message, "Request body is too large.");
});
