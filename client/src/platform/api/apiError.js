/**
 * #### What this preserves
 *
 * - The rest of the application can use a consistent interface regardless
 * of whether the underlying error originated from Axios, the server, or
 * response parsing.
 *
 * --
 *
 * Represents an HTTP, network, timeout, or response-parsing failure.
 *
 * The status property remains available for compatibility with
 * application-level error handling and retry policies.
 */
export class ApiError extends Error {
	constructor(
		message,
		{ status = null, code = null, details = null, cause = undefined } = {},
	) {
		super(message, { cause });

		this.name = "ApiError";
		this.status = status;
		this.code = code;
		this.details = details;
	}
}

/**
 * Converts an Axios error into the application's consistent API error.
 *
 * @param {Error} error - The original Axios or JavaScript error.
 * @returns {ApiError} A normalized application-facing error.
 */
export function normalizeApiError(error) {
	if (error instanceof ApiError) {
		return error;
	}

	const response = error.response;
	const payload = response?.data;

	const status = response?.status ?? null;

	const details =
		payload?.error?.details ?? payload?.errors ?? payload?.details ?? null;

	if (error.code === "ECONNABORTED" || error.code === "ETIMEDOUT") {
		return new ApiError("The request timed out. Please try again.", {
			status,
			code: "REQUEST_TIMEOUT",
			details,
			cause: error,
		});
	}

	if (error instanceof SyntaxError || error.code === "ERR_BAD_RESPONSE") {
		return new ApiError("The server returned an invalid JSON response.", {
			status,
			code: "INVALID_RESPONSE",
			details,
			cause: error,
		});
	}

	if (response) {
		return new ApiError(
			payload?.error?.message ??
				payload?.message ??
				error.message ??
				`The request failed with status ${status}.`,
			{
				status,
				code:
					payload?.error?.code ?? payload?.code ?? error.code ?? null,
				details,
				cause: error,
			},
		);
	}

	return new ApiError(
		"Unable to connect to the server. Check your connection and try again.",
		{
			code: "NETWORK_ERROR",
			cause: error,
		},
	);
}
