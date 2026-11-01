import apiClient from "../../../platform/api/apiClient.js";
import { ApiError } from "../../../platform/api/apiError.js";

/**
|--------------------------------------------------
| Ideation API
|--------------------------------------------------
*/

/**
 * Creates and persists an ideation through the backend API.
 *
 * @param {{
 *   materials: Array<object>,
 *   constraints?: object
 * }} input - Validated ideation input.
 *
 * @returns {Promise<object>} The persisted ideation data.
 *
 * @throws {ApiError} When the request fails or the response is invalid.
 */
export async function createIdeation(input) {
	const response = await apiClient.post("/ideations", input);

	const payload = response.data;

	if (
		payload?.success !== true ||
		typeof payload?.data?.generationId !== "string" ||
		payload.data.generationId.trim().length === 0
	) {
		throw new ApiError(
			"The server response did not contain a valid generation ID.",
			{
				status: response.status,
				code: "INVALID_RESPONSE",
				details: null,
			},
		);
	}

	return payload.data;
}

/**
 * Retrieves a persisted ideation by its generation ID.
 *
 * @param {string} generationId
 * @returns {Promise<object>} The persisted ideation data.
 * @throws {ApiError} When retrieval fails or the response is invalid.
 */
export async function getIdeation(generationId) {
	const response = await apiClient.get(
		`/ideations/${encodeURIComponent(generationId)}`,
	);

	const payload = response.data;

	if (
		payload?.success !== true ||
		typeof payload?.data?.generationId !== "string" ||
		!Array.isArray(payload?.data?.concepts)
	) {
		throw new ApiError(
			"The server response did not contain a valid ideation.",
			{
				status: response.status,
				code: "INVALID_RESPONSE",
				details: null,
			},
		);
	}

	return payload.data;
}
