import { useCallback, useEffect, useMemo, useState } from "react";

import IdentityContext from "./IdentityContext.jsx";

import identityService from "./identity.service.js";

import { sessionManager } from "../session/index.js";

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
		if (!sessionManager.hasAccessToken()) {
			setUser(null);
			setIsLoading(false);
			return;
		}

		try {
			const user = await identityService.me();
			setUser(user);
		} catch (error) {
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

	async function login(credentials) {
		const result = await identityService.login(credentials);

		sessionManager.saveSession({
			accessToken: result.accessToken,
			refreshToken: result.refreshToken,
		});

		const user = await identityService.me();

		setUser(user);

		return user;
	}

	async function register(command) {
		const result = await identityService.register(command);

		sessionManager.saveSession({
			accessToken: result.accessToken,
			refreshToken: result.refreshToken,
		});

		const user = await identityService.me();

		setUser(user);

		return user;
	}

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
