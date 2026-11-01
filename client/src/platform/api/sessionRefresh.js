import { sessionManager } from "../session/index.js";

/**
|--------------------------------------------------
| Shared session refresh
|--------------------------------------------------
*/

let refreshPromise = null;

/**
 * Refreshes the current session.
 *
 * Concurrent callers share one refresh request. Successful refreshes persist
 * both rotated tokens through the existing SessionManager.
 *
 * @param {import("axios").AxiosInstance} apiClient
 * @returns {Promise<string>} The new access token.
 */
export async function refreshSession(apiClient) {
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
			{ refreshToken },
			{
				_skipAuthHeader: true,
				_skipAuthRefresh: true,
			},
		)
		.then((response) => {
			const session = response?.data?.data;

			if (
				typeof session?.accessToken !== "string" ||
				!session.accessToken.trim() ||
				typeof session?.refreshToken !== "string" ||
				!session.refreshToken.trim()
			) {
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
