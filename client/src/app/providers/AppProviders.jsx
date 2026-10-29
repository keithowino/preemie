/**
 * Later this will possibly compose providers such as:
 * - Authentication
 * - API
 * - Query client
 * - Theme
 * - Notifications
 * - Localization
 */
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async";

import { IdentityProvider } from "../../platform/index.js";

/**
|--------------------------------------------------
| Query client configuration
|--------------------------------------------------
*/

/**
 * Shared server-state configuration.
 *
 * Policies:
 *
 * - Caching: Query data remains fresh for 30 seconds.
 * - Retries: Eligible transient query failures are retried once.
 * - Client errors: HTTP 4xx responses are not automatically retried.
 * - Mutations: No global mutation retry is configured.
 *
 * Query functions should be reserved for read operations. State-changing
 * requests must use mutations or explicit service calls with appropriate
 * idempotency guarantees.
 */
const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 30_000,

			/**
			 * Retry eligible transient query failures at most once.
			 *
			 * TanStack Query passes failureCount = 0 for the first failure.
			 * Therefore, failureCount < 1 permits one retry.
			 */
			retry: (failureCount, error) => {
				const status = error?.status ?? error?.response?.status;

				/**
				 * Do not retry HTTP client errors, including:
				 * - 400 Bad Request
				 * - 401 Unauthorized
				 * - 403 Forbidden
				 * - 404 Not Found
				 * - 408 Request Timeout
				 * - 409 Conflict
				 * - 429 Too Many Requests
				 *
				 * Authentication refresh is handled separately by the
				 * API client's response interceptor.
				 */
				if (Number.isInteger(status) && status >= 400 && status < 500) {
					return false;
				}

				/**
				 * Permit at most one retry for eligible failures,
				 * including network errors and server-side 5xx errors.
				 */
				return failureCount < 1;
			},
		},

		mutations: {
			/**
			 * State-changing operations must not be retried automatically.
			 *
			 * In particular, repeating a generation POST after a timeout
			 * could create another persisted ideation.
			 */
			retry: false,
		},
	},
});

/**
|--------------------------------------------------
| Application providers
|--------------------------------------------------
*/
export function AppProviders({ children }) {
	return (
		<IdentityProvider>
			<QueryClientProvider client={queryClient}>
				<HelmetProvider>{children}</HelmetProvider>
			</QueryClientProvider>
		</IdentityProvider>
	);
}
