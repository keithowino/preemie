import { useCallback, useEffect, useMemo, useState } from "react";

import IdentityContext from "./IdentityContext.jsx";

import identityService from "./identity.service.js";

import { sessionManager } from "../session/index.js";

import apiClient from "../api/apiClient.js";
import { refreshSession } from "../api/sessionRefresh.js";

/**
 * #### Why we are not implementing refresh yet
 * You have a refresh endpoint on the backend, but I recommend not implementing automatic token refresh in the IdentityProvider.
 *
 * Instead, it belongs to the HTTP infrastructure because every service (navigation, dashboard, configuration, future modules) relies on apiClient. A response interceptor can detect a 401, call /auth/refresh, update the SessionManager, and retry the original request transparently.
 *
 * Keeping refresh logic in the API client means the Identity layer remains focused on authentication workflows, while the networking layer handles token renewal. This separation matches the responsibilities you've established in the backend.
 */
export function IdentityProvider({ children }) {
	const [user, setUser] = useState(null);
	const [isLoading, setIsLoading] = useState(true);

	const isAuthenticated = user !== null;

	const restoreSession = useCallback(async () => {
		setIsLoading(true);

		try {
			if (!sessionManager.hasAccessToken()) {
				if (!sessionManager.hasRefreshToken()) {
					setUser(null);
					return;
				}

				// Restore the access token using the existing refresh mechanism.
				await refreshSession(apiClient);
			}

			const currentUser = await identityService.me();

			setUser(currentUser);
		} catch {
			sessionManager.clearSession();
			setUser(null);
		} finally {
			setIsLoading(false);
		}
	}, []);

	useEffect(() => {
		restoreSession();
	}, [restoreSession]);

	useEffect(() => {
		return sessionManager.subscribe((event) => {
			if (event.type === "session:cleared") {
				setUser(null);
			}
		});
	}, []);

	/**
	|--------------------------------------------------
	| Authentication
	|--------------------------------------------------
	*/

	/**
	 * Establishes an authenticated session and retrieves its user profile.
	 *
	 * If any step fails after authentication begins, the local session is
	 * cleared to prevent tokens from remaining without a confirmed user.
	 *
	 * @param {object} result - Authentication response data.
	 * @returns {Promise<object>} The authenticated user's profile.
	 */
	const completeAuthentication = useCallback(async (result) => {
		try {
			sessionManager.saveSession({
				accessToken: result.accessToken,
				refreshToken: result.refreshToken,
			});

			const authenticatedUser = await identityService.me();

			setUser(authenticatedUser);

			return authenticatedUser;
		} catch (error) {
			sessionManager.clearSession();
			setUser(null);

			throw error;
		} finally {
			setIsLoading(false);
		}
	}, []);

	/**
	 * Authenticates an existing user.
	 *
	 * @param {object} credentials - Login credentials.
	 * @returns {Promise<object>} The authenticated user's profile.
	 */
	const login = useCallback(
		async (credentials) => {
			const result = await identityService.login(credentials);

			return completeAuthentication(result);
		},
		[completeAuthentication],
	);

	/**
	 * Registers a new user and establishes an authenticated session.
	 *
	 * @param {object} command - Registration details.
	 * @returns {Promise<object>} The registered user's profile.
	 */
	const register = useCallback(
		async (command) => {
			const result = await identityService.register(command);

			return completeAuthentication(result);
		},
		[completeAuthentication],
	);

	const logout = useCallback(async () => {
		try {
			if (sessionManager.hasRefreshToken()) {
				await identityService.logout(sessionManager.getRefreshToken());
			}
		} finally {
			sessionManager.clearSession();
			setUser(null);
		}
	}, []);

	const value = useMemo(
		() => ({
			user,

			isLoading,

			isAuthenticated,

			login,

			register,

			logout,

			restoreSession,
		}),
		[
			user,

			isLoading,

			isAuthenticated,

			login,

			register,

			logout,

			restoreSession,
		],
	);

	return (
		<IdentityContext.Provider value={value}>
			{children}
		</IdentityContext.Provider>
	);
}
