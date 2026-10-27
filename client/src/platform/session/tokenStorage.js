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
