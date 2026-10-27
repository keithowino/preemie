import { sessionManager } from "../../session/index.js";

let refreshPromise = null;

async function refreshSession(apiClient) {
	if (refreshPromise) {
		return refreshPromise;
	}

	const refreshToken = sessionManager.getRefreshToken();

	if (!refreshToken) {
		throw new Error("No refresh token is available.");
	}

	refreshPromise = apiClient
		.post(
			"/auth/refresh",
			{
				refreshToken,
			},
			{
				_skipAuthHeader: true,
				_skipAuthRefresh: true,
			},
		)
		.then((response) => {
			const session = response?.data?.data;

			if (!session?.accessToken || !session?.refreshToken) {
				throw new Error(
					"Refresh response did not contain a complete session.",
				);
			}

			sessionManager.saveSession({
				accessToken: session.accessToken,
				refreshToken: session.refreshToken,
			});

			return session.accessToken;
		})
		.finally(() => {
			refreshPromise = null;
		});

	return refreshPromise;
}

export default function registerResponseInterceptor(apiClient) {
	apiClient.interceptors.response.use(
		(response) => response,

		async (error) => {
			const originalRequest = error.config;

			const isUnauthorized = error.response?.status === 401;

			if (
				!isUnauthorized ||
				!originalRequest ||
				!originalRequest._authenticatedRequest
			) {
				return Promise.reject(error);
			}

			if (originalRequest._retry || originalRequest._skipAuthRefresh) {
				return Promise.reject(error);
			}

			if (!sessionManager.hasRefreshToken()) {
				sessionManager.clearSession();

				return Promise.reject(error);
			}

			originalRequest._retry = true;

			try {
				const accessToken = await refreshSession(apiClient);

				originalRequest.headers = originalRequest.headers ?? {};

				originalRequest.headers.Authorization = `Bearer ${accessToken}`;

				return apiClient(originalRequest);
			} catch (refreshError) {
				sessionManager.clearSession();

				return Promise.reject(error);
			}
		},
	);
}
