import axios from "axios";

import { env } from "../../app/index.js";

import {
	registerAuthInterceptor,
	registerResponseInterceptor,
} from "./interceptors/index.js";

import { normalizeApiError } from "./apiError.js";

const DEFAULT_TIMEOUT_MS = 60_000;

const API_PREFIX = "/api/v1";

const apiClient = axios.create({
	baseURL: `${env.apiBaseUrl.replace(/\/+$/, "")}${API_PREFIX}`,

	timeout: DEFAULT_TIMEOUT_MS,

	headers: {
		Accept: "application/json",
		"Content-Type": "application/json",
	},

	responseType: "json",

	/**
	 * silentJSONParsing: false makes malformed JSON responses
	 * easier to detect rather than silently accepting them as
	 * ordinary strings.
	 */
	transitional: {
		silentJSONParsing: false,
	},
});

registerAuthInterceptor(apiClient);

registerResponseInterceptor(apiClient);

/**
 * Normalize errors after the authentication response interceptor
 * has had an opportunity to refresh the session and retry a request.
 *
 * This keeps authentication concerns separate from the API's
 * application-facing error interface.
 */
apiClient.interceptors.response.use(
	(response) => response,

	(error) => Promise.reject(normalizeApiError(error)),
);

export default apiClient;
