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
