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
