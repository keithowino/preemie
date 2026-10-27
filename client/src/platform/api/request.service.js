import apiClient from "./apiClient.js";

class RequestService {
	async get(url, config = {}) {
		const response = await apiClient.get(url, config);

		return response.data;
	}

	async post(url, body = {}, config = {}) {
		const response = await apiClient.post(url, body, config);

		return response.data;
	}

	// Not queried yet.
	async put(url, body = {}, config = {}) {
		const response = await apiClient.put(url, body, config);

		return response.data;
	}

	// Not queried yet.
	async patch(url, body = {}, config = {}) {
		const response = await apiClient.patch(url, body, config);

		return response.data;
	}

	// Not queried yet.
	async delete(url, config = {}) {
		const response = await apiClient.delete(url, config);

		return response.data;
	}
}

export default new RequestService();
