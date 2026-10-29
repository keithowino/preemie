import { sessionManager } from "../../session/index.js";
import { refreshSession } from "../sessionRefresh.js";

export default function registerResponseInterceptor(apiClient) {
	apiClient.interceptors.response.use(
		(response) => response,

		async (error) => {
			const originalRequest = error.config;

			const isUnauthorized = error.response?.status === 401;

			if (
				!isUnauthorized ||
				!originalRequest ||
				!originalRequest._authenticatedRequest ||
				originalRequest._skipAuthRefresh ||
				originalRequest._retry
			) {
				return Promise.reject(error);
			}

			if (!sessionManager.hasRefreshToken()) {
				sessionManager.clearSession();

				return Promise.reject(error);
			}

			// Prevent the original request from entering a retry loop.
			originalRequest._retry = true;

			try {
				const accessToken = await refreshSession(apiClient);

				originalRequest.headers = originalRequest.headers ?? {};

				originalRequest.headers.Authorization = `Bearer ${accessToken}`;

				return apiClient(originalRequest);
			} catch {
				sessionManager.clearSession();

				// Preserve the original request's HTTP error for its caller.
				return Promise.reject(error);
			}
		},
	);
}
