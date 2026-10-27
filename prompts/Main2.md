### Phase 9 — Identity domain integration _(backend implemented; client integration pending)_

- [x] Registration, login, refresh, and logout endpoints.
- [x] Current-user endpoint.
- [x] Session listing and individual/other-session revocation endpoints.
- [x] Access-token middleware with server-side session validation.
- [x] Password hashing and hashed refresh-token storage.
- [x] Client authentication provider composed into `AppProviders`.
- [ ] Login and registration screens.
- [ ] Session lifecycle and protected-route behavior.
- [ ] Session-management UI.
- [ ] Ownership enforcement for generations and workspace data.
- [ ] Tests for authenticated and unauthorized access to owned resources.

I am just from scripting the identity authentication provider, here is it's current implemented state:

```text
~\client\src\App.jsx
```

```jsx
import { AppProviders, AppRouter } from "./app/index.js";

export default function App() {
	return (
		<AppProviders>
			<AppRouter />
		</AppProviders>
	);
}
```

```text
~\client\src\app\providers\AppProviders.jsx
```

```jsx
/**
 * Later this will possibly compose providers such as:
 * - Authentication
 * - API
 * - Query client
 * - Theme
 * - Notifications
 * - Localization
 */
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async";
import { IdentityProvider } from "../../platform/index.js";

// /**
//  * Shared server-state configuration.
//  *
//  * Keep one QueryClient instance for the lifetime of the application.
//  *
//  * #### The configuration establishes three policies:
//  *
//  * - Caching: Query data remains fresh for 30 seconds. This reduces
//  * unnecessary requests when navigating between screens.
//  * - Retries: Transient failures can be retried once, while HTTP client
//  * errors such as 400 and 429 are not automatically retried.
//  * - Shared cache: All feature components use the same query client.
//  */
// const queryClient = new QueryClient({
// 	defaultOptions: {
// 		queries: {
// 			staleTime: 30 * 1000,

// 			/**
// 			 * The retry callback accommodates common error shapes, but we
// 			 * must ensure the future API client exposes the HTTP status
// 			 * through error.status or error.response.status. Otherwise,
// 			 * HTTP errors may be treated as transient failures. We will
// 			 * verify that contract when implementing the shared API client.
// 			 */
// 			retry: (failureCount, error) => {
// 				const status = error?.status ?? error?.response?.status;

// 				/**
// 				 * Do not automatically retry client errors, including
// 				 * validation failures and rate-limit responses.
// 				 */
// 				if (status >= 400 && status < 500) {
// 					return false;
// 				}

// 				/**
// 				 * Allow at most one retry for other failures.
// 				 */
// 				return failureCount < 1;
// 			},
// 		},
// 	},
// });

export function AppProviders({ children }) {
	return (
		// <QueryClientProvider client={queryClient}></QueryClientProvider>
		<IdentityProvider>
			<HelmetProvider>{children}</HelmetProvider>
		</IdentityProvider>
	);
}
```

```text
~\client\src\platform\identity\IdentityProvider.jsx
```

```jsx
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
```

```text
~\client\src\platform\session\sessionManager.js
```

```js
import { tokenStorage } from "./tokenStorage.js";

class SessionManager {
	constructor() {
		this.listeners = new Set();
	}

	getAccessToken() {
		return tokenStorage.getAccessToken();
	}

	getRefreshToken() {
		return tokenStorage.getRefreshToken();
	}

	hasAccessToken() {
		return Boolean(this.getAccessToken());
	}

	hasRefreshToken() {
		return Boolean(this.getRefreshToken());
	}

	saveSession({ accessToken, refreshToken }) {
		tokenStorage.setAccessToken(accessToken);
		tokenStorage.setRefreshToken(refreshToken);

		this.notify({
			type: "session:saved",
		});
	}

	clearSession() {
		tokenStorage.clear();

		this.notify({
			type: "session:cleared",
		});
	}

	subscribe(listener) {
		this.listeners.add(listener);

		return () => {
			this.listeners.delete(listener);
		};
	}

	notify(event) {
		this.listeners.forEach((listener) => {
			listener(event);
		});
	}
}

export default new SessionManager();
```

```text
~\client\src\platform\session\tokenStorage.js
```

```js
/**
 * Note: I know your backend also supports refresh tokens. For now, we'll store them because the backend already issues them. Later we can decide whether to migrate the refresh token to an HTTP-only cookie if that better matches your security model.
 */

const ACCESS_TOKEN_KEY = "preemie_three.accessToken";
const REFRESH_TOKEN_KEY = "preemie_three.refreshToken";

export const tokenStorage = {
	getAccessToken() {
		return localStorage.getItem(ACCESS_TOKEN_KEY);
	},

	setAccessToken(token) {
		if (token) {
			localStorage.setItem(ACCESS_TOKEN_KEY, token);
		}
	},

	removeAccessToken() {
		localStorage.removeItem(ACCESS_TOKEN_KEY);
	},

	getRefreshToken() {
		return localStorage.getItem(REFRESH_TOKEN_KEY);
	},

	setRefreshToken(token) {
		if (token) {
			localStorage.setItem(REFRESH_TOKEN_KEY, token);
		}
	},

	removeRefreshToken() {
		localStorage.removeItem(REFRESH_TOKEN_KEY);
	},

	clear() {
		this.removeAccessToken();
		this.removeRefreshToken();
	},
};
```

```text
~\client\src\platform\identity\identity.service.js
```

```js
import { request } from "../api/index.js";

export const register = async (payload) => {
	const { data } = await request.post("/auth/register", payload);

	return data.data;
};

export const login = async (payload) => {
	const { data } = await request.post("/auth/login", payload);

	return data.data;
};

// export const refresh = async (refreshToken) => {
// 	const { data } = await request.post("/auth/refresh", {
// 		refreshToken,
// 	});

// 	return data.data;
// };

export const logout = async (refreshToken) => {
	await request.post("/auth/logout", {
		refreshToken,
	});
};

export const me = async () => {
	const response = await request.get("/auth/me");

	return response.data.data.user;
};

// export const sessions = async () => {
// 	const { data } = await request.get("/auth/sessions");

// 	return data.data;
// };

// export const revokeSession = async (sessionId) => {
// 	await request.delete(`/auth/sessions/${sessionId}`);
// };

// export const revokeOtherSessions = async () => {
// 	await request.delete("/auth/sessions");
// };

const identityService = { login, logout, me, register };

export default identityService;
```

```text
~\client\src\platform\api\request.service.js
```

```js
import apiClient from "./apiClient.js";

class RequestService {
	get(url, config = {}) {
		return apiClient.get(url, config);
	}

	post(url, body = {}, config = {}) {
		return apiClient.post(url, body, config);
	}

	// put(url, body = {}, config = {}) {
	// 	return apiClient.put(url, body, config);
	// }

	// patch(url, body = {}, config = {}) {
	// 	return apiClient.patch(url, body, config);
	// }

	// delete(url, config = {}) {
	// 	return apiClient.delete(url, config);
	// }
}

export default new RequestService();
```

```text
~\client\src\platform\api\apiClient.js
```

```js
import axios from "axios";

import { env } from "../../app/index.js";

import {
	registerAuthInterceptor,
	registerResponseInterceptor,
} from "./interceptors/index.js";

const apiClient = axios.create({
	baseURL: env.apiBaseUrl,

	headers: {
		"Content-Type": "application/json",
	},
});

registerAuthInterceptor(apiClient);
registerResponseInterceptor(apiClient);

export default apiClient;
```

```text
~\client\src\app\config\env.js
```

```js
import { z } from "zod";

const envSchema = z.object({
	MODE: z.enum(["development", "production", "test"]).default("development"),

	VITE_API_URL: z.url("VITE_API_URL must be a valid URL."),

	VITE_APP_NAME: z.string(),
});

const parsedEnv = envSchema.safeParse(import.meta.env);

if (!parsedEnv.success) {
	console.error("Invalid client environment configuration:");

	for (const issue of parsedEnv.error.issues) {
		console.error(`- ${issue.path.join(".")}: ${issue.message}`);
	}

	throw new Error("Invalid client environment configuration.");
}

const env = Object.freeze({
	mode: parsedEnv.data.MODE,
	apiBaseUrl: parsedEnv.data.VITE_API_URL.replace(/\/+$/, ""),
	appName: parsedEnv.data.VITE_API_URL,
});

export default env;
```

```text
~\client\src\platform\api\interceptors\auth.interceptor.js
```

```js
import { tokenStorage } from "../../session/index.js";

export default function registerAuthInterceptor(apiClient) {
	apiClient.interceptors.request.use((config) => {
		/**
		 * Do not attach the access token to this request.
		 */
		if (config._skipAuthHeader) {
			return config;
		}

		const token = tokenStorage.getAccessToken();

		if (token) {
			config.headers.Authorization = `Bearer ${token}`;

			/**
			 * Request actually carried an access token.
			 */
			config._authenticatedRequest = true;
		}

		return config;
	});
}
```

```text
~\client\src\platform\api\interceptors\response.interceptor.js
```

```js
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
```

```text
~\client\src\platform\identity\IdentityContext.jsx
```

```jsx
import { createContext } from "react";

const IdentityContext = createContext(null);

export default IdentityContext;
```

```text
~\client\src\platform\identity\useIdentity.js
```

```js
import { useContext } from "react";

import IdentityContext from "./IdentityContext.jsx";

export function useIdentity() {
	const ctx = useContext(IdentityContext);

	if (!ctx) {
		throw new Error("useIdentity must be used within IdentityProvider.");
	}

	return context;
}
```

```text
~\client\src\platform\index.js
```

```js
export * from "./api/index.js";
export * from "./identity/index.js";
export * from "./routing/index.js";
export * from "./session/index.js";
```

```text
~\client\src\platform\routing\components\AuthenticatedRoute.jsx
```

```jsx
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthenticatedRoute } from "../hooks/index.js";

export default function AuthenticatedRoute() {
	const { isAuthenticated, isLoading } = useAuthenticatedRoute();

	const location = useLocation();

	if (isLoading) {
		return null;
	}

	if (!isAuthenticated) {
		return (
			<Navigate
				to="/login"
				replace
				state={{
					from: location,
				}}
			/>
		);
	}

	return <Outlet />;
}
```

```text
~\client\src\platform\routing\hooks\useAuthenticatedRoute.js
```

```js
import { useIdentity } from "../../identity";

export default function useAuthenticatedRoute() {
	const { isAuthenticated, isLoading } = useIdentity();

	return {
		isAuthenticated,
		isLoading,
	};
}
```
