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

/**
 * Shared server-state configuration.
 *
 * Keep one QueryClient instance for the lifetime of the application.
 *
 * #### The configuration establishes three policies:
 *
 * - Caching: Query data remains fresh for 30 seconds. This reduces
 * unnecessary requests when navigating between screens.
 * - Retries: Transient failures can be retried once, while HTTP client
 * errors such as 400 and 429 are not automatically retried.
 * - Shared cache: All feature components use the same query client.
 */
const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 30 * 1000,

			/**
			 * The retry callback accommodates common error shapes, but we
			 * must ensure the future API client exposes the HTTP status
			 * through error.status or error.response.status. Otherwise,
			 * HTTP errors may be treated as transient failures. We will
			 * verify that contract when implementing the shared API client.
			 */
			retry: (failureCount, error) => {
				const status = error?.status ?? error?.response?.status;

				/**
				 * Do not automatically retry client errors, including
				 * validation failures and rate-limit responses.
				 */
				if (status >= 400 && status < 500) {
					return false;
				}

				/**
				 * Allow at most one retry for other failures.
				 */
				return failureCount < 1;
			},
		},
	},
});

export function AppProviders({ children }) {
	return (
		<QueryClientProvider client={queryClient}>
			<HelmetProvider>{children}</HelmetProvider>
		</QueryClientProvider>
	);
}
