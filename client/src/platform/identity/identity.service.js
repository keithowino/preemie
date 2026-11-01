import { ApiError, request } from "../api/index.js";

/**
|--------------------------------------------------
| Response validation
|--------------------------------------------------
*/

/**
 * Extracts the data payload from a successful API response envelope.
 *
 * @param {object} payload - The server response envelope.
 * @param {string} operation - The operation being performed.
 * @returns {object} The response data.
 * @throws {ApiError} When the response does not match the expected structure.
 */
function getResponseData(payload, operation) {
	if (
		payload?.success !== true ||
		!payload.data ||
		typeof payload.data !== "object"
	) {
		throw new ApiError(
			`The server returned an invalid response during ${operation}.`,
			{
				code: "INVALID_RESPONSE",
			},
		);
	}

	return payload.data;
}

/**
 * Validates that an authentication response contains both session tokens.
 *
 * @param {object} data - The authentication response data.
 * @param {string} operation - The authentication operation.
 * @returns {object} The validated authentication data.
 * @throws {ApiError} When either token is missing.
 */
function validateSessionResponse(data, operation) {
	if (
		typeof data?.accessToken !== "string" ||
		!data.accessToken.trim() ||
		typeof data?.refreshToken !== "string" ||
		!data.refreshToken.trim()
	) {
		throw new ApiError(
			`The server returned an incomplete session during ${operation}.`,
			{
				code: "INVALID_RESPONSE",
			},
		);
	}

	return data;
}

/**
 * Registers a user.
 *
 * @param {object} payload - Registration details.
 * @returns {Promise<object>} User and session-token data.
 */
export async function register(payload) {
	const response = await request.post("/auth/register", payload);

	const data = getResponseData(response, "registration");

	if (!data.user || typeof data.user !== "object") {
		throw new ApiError(
			"The registration response did not contain a valid user.",
			{
				code: "INVALID_RESPONSE",
			},
		);
	}

	return validateSessionResponse(data, "registration");
}

/**
 * Authenticates an existing user.
 *
 * @param {object} payload - Login credentials.
 * @returns {Promise<object>} User and session-token data.
 */
export async function login(payload) {
	const response = await request.post("/auth/login", payload);

	const data = getResponseData(response, "login");

	if (!data.user || typeof data.user !== "object") {
		throw new ApiError("The login response did not contain a valid user.", {
			code: "INVALID_RESPONSE",
		});
	}

	return validateSessionResponse(data, "login");
}

// export const refresh = async (refreshToken) => {
// 	const { data } = await request.post("/auth/refresh", {
// 		refreshToken,
// 	});

// 	return data.data;
// };

/**
 * Logs out the current session on the server.
 *
 * @param {string} refreshToken - The refresh token to revoke.
 * @returns {Promise<void>}
 */
export async function logout(refreshToken) {
	const response = await request.post("/auth/logout", {
		refreshToken,
	});

	if (response?.success !== true) {
		throw new ApiError(
			"The server could not confirm the logout operation.",
			{
				code: "INVALID_RESPONSE",
			},
		);
	}
}

/**
 * Retrieves the currently authenticated user.
 *
 * @returns {Promise<object>} The current user's public profile.
 */
export async function me() {
	const response = await request.get("/auth/me");

	const data = getResponseData(response, "current-user retrieval");

	if (!data.user || typeof data.user !== "object") {
		throw new ApiError(
			"The current-user response did not contain a valid user.",
			{
				code: "INVALID_RESPONSE",
			},
		);
	}

	return data.user;
}

/**
 * Retrieves all active sessions belonging to the authenticated user.
 *
 * @returns {Promise<Array<object>>} Active session records.
 */
export async function sessions() {
	const response = await request.get("/auth/sessions");

	const data = getResponseData(response, "session retrieval");

	if (!Array.isArray(data.sessions)) {
		throw new ApiError(
			"The server returned an invalid sessions collection.",
			{
				code: "INVALID_RESPONSE",
			},
		);
	}

	return data.sessions;
}

/**
 * Revokes a specific session.
 *
 * @param {string} sessionId - The session identifier.
 * @returns {Promise<void>}
 */
export async function revokeSession(sessionId) {
	if (typeof sessionId !== "string" || !sessionId.trim()) {
		throw new ApiError("A valid session ID is required.", {
			code: "INVALID_INPUT",
		});
	}

	const response = await request.delete(
		`/auth/sessions/${encodeURIComponent(sessionId)}`,
	);

	if (response?.success !== true) {
		throw new ApiError(
			"The server could not confirm the session revocation.",
			{
				code: "INVALID_RESPONSE",
			},
		);
	}
}

/**
 * Revokes every active session except the current session.
 *
 * @returns {Promise<void>}
 */
export async function revokeOtherSessions() {
	const response = await request.delete("/auth/sessions");

	if (response?.success !== true) {
		throw new ApiError(
			"The server could not confirm the other sessions revocation.",
			{
				code: "INVALID_RESPONSE",
			},
		);
	}
}

const identityService = {
	login,
	logout,
	me,
	register,
	sessions,
	revokeSession,
	revokeOtherSessions,
};

export default identityService;
