import { env } from "../../app/index.js";

/**
|--------------------------------------------------
| Configuration
|--------------------------------------------------
*/

const DEFAULT_TIMEOUT_MS = 60_000;

/**
|--------------------------------------------------
| API Error
|--------------------------------------------------
*/

/**
 * Represents an HTTP, network, timeout, or response-parsing failure.
 *
 * The status property is intentionally exposed for compatibility with
 * the retry policy configured in AppProviders.jsx.
 */
export class ApiError extends Error {
	constructor(message, { status = null, code = null, details = null } = {}) {
		super(message);

		this.name = "ApiError";
		this.status = status;
		this.code = code;
		this.details = details;
	}
}

/**
|--------------------------------------------------
| Response handling
|--------------------------------------------------
*/

async function parseResponse(response) {
	const contentType = response.headers.get("content-type") ?? "";

	if (contentType.includes("application/json")) {
		try {
			return await response.json();
		} catch {
			throw new ApiError(
				"The server returned an invalid JSON response.",
				{
					status: response.status,
					code: "INVALID_RESPONSE",
				},
			);
		}
	}

	return null;
}

/**
|--------------------------------------------------
| HTTP client
|--------------------------------------------------
*/

/**
 * * Important: The 60-second timeout is a client-side limit, not a guarantee that the backend will finish within that period. A timeout also does not prove that generation failed on the server. Since generation persists data, we should avoid automatically retrying a timed-out POST, which could create a second generation.
 */

async function request(path, { method = "GET", body, timeoutMs } = {}) {
	const controller = new AbortController();

	const timeoutId = setTimeout(
		() => controller.abort(),
		timeoutMs ?? DEFAULT_TIMEOUT_MS,
	);

	try {
		const response = await fetch(`${env.apiUrl}/api/v1${path}`, {
			method,
			headers: {
				Accept: "application/json",
				...(body !== undefined
					? { "Content-Type": "application/json" }
					: {}),
			},
			...(body !== undefined ? { body: JSON.stringify(body) } : {}),
			signal: controller.signal,
		});

		const payload = await parseResponse(response);

		if (!response.ok) {
			throw new ApiError(
				payload?.error?.message ??
					payload?.message ??
					`The request failed with status ${response.status}.`,
				{
					status: response.status,
					code: payload?.error?.code ?? payload?.code ?? null,
					details:
						payload?.error?.details ??
						payload?.errors ??
						payload?.details ??
						null,
				},
			);
		}

		return payload;
	} catch (error) {
		if (error instanceof ApiError) {
			throw error;
		}

		if (error.name === "AbortError") {
			throw new ApiError("The request timed out. Please try again.", {
				code: "REQUEST_TIMEOUT",
			});
		}

		throw new ApiError(
			"Unable to connect to the server. Check your connection and try again.",
			{
				code: "NETWORK_ERROR",
			},
		);
	} finally {
		clearTimeout(timeoutId);
	}
}

/**
|--------------------------------------------------
| Public API
|--------------------------------------------------
*/

const apiClient = Object.freeze({
	get(path, options = {}) {
		return request(path, options);
	},

	post(path, body, options = {}) {
		return request(path, {
			...options,
			method: "POST",
			body,
		});
	},
});

export default apiClient;
