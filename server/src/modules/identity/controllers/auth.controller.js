import { authService } from "../services/index.js";
import { userPresenter } from "../presenters/index.js";
import {
	loginRequestSchema,
	logoutRequestSchema,
	refreshRequestSchema,
	// forgotPasswordRequestSchema,
	registerRequestSchema,
} from "../validators/index.js";
import { asyncHandler, success, validateRequest } from "../../../app/index.js";

const sessions = asyncHandler(async (req, res) => {
	const result = await authService.sessions(req.user._id, req.sessionId);

	return success(res, result);
});

const register = asyncHandler(async (req, res) => {
	const { body } = validateRequest(
		{
			body: registerRequestSchema,
		},
		req,
	);

	const result = await authService.register({
		data: body,
		requestMetadata: req.requestMetadata,
	});

	return success(res, result);
});

const login = asyncHandler(async (req, res) => {
	const { body } = validateRequest(
		{
			body: loginRequestSchema,
		},
		req,
	);

	const result = await authService.login({
		data: body,
		requestMetadata: req.requestMetadata,
	});

	return success(res, result);
});

const refresh = asyncHandler(async (req, res) => {
	const { body } = validateRequest(
		{
			body: refreshRequestSchema,
		},
		req,
	);

	const { refreshToken } = body;

	const result = await authService.refresh(refreshToken, req.requestMetadata);

	return success(res, result);
});

const logout = asyncHandler(async (req, res) => {
	const { body } = validateRequest(
		{
			body: logoutRequestSchema,
		},
		req,
	);

	const { refreshToken } = body;

	await authService.logout(refreshToken);

	return success(res, null, "Logged out successfully.");
});

const revokeSession = asyncHandler(async (req, res) => {
	await authService.revokeSession(req.user._id, req.params.sessionId);

	return success(res, null, "Session revoked successfully.");
});

const revokeOtherSessions = asyncHandler(async (req, res) => {
	await authService.revokeOtherSessions(req.user._id, req.sessionId);

	return success(res, null, "Other sessions revoked successfully.");
});

const me = asyncHandler(async (req, res) => {
	const result = {
		user: userPresenter.present(req.user),
	};

	return success(res, result);
});

// const forgotPassword = asyncHandler(async (req, res) => {
// 	const { body } = validateRequest(
// 		{
// 			body: forgotPasswordRequestSchema,
// 		},
// 		req,
// 	);

// 	await authService.forgotPassword(body.email);

// 	return success(
// 		res,
// 		null,
// 		"If an account exists for that email, password reset instructions will be sent.",
// 	);
// });

export default {
	sessions,
	register,
	login,
	refresh,
	logout,
	revokeSession,
	revokeOtherSessions,
	me,
	// forgotPassword,
};
