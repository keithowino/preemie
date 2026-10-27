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
