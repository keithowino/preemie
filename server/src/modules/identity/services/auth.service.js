import crypto from "crypto";

import { AppError, env, ErrorCodes, HTTP_STATUS } from "../../../app/index.js";

import { userRepository } from "../repositories/index.js";

import { passwordService, sessionService } from "../security/index.js";

import { userPresenter } from "../presenters/index.js";

// import { passwordResetTokenService } from "../security/index.js";

// import {
// 	createPasswordResetRequestedEvent,
// 	eventBus,
// } from "../../../shared/index.js";

/**
 * Orchestrates authentication workflows (register, login, logout, resetPassword).
 */
class AuthService {
	async sessions(userId, currentSessionId) {
		return sessionService.list(userId, currentSessionId);
	}

	async register({ data, requestMetadata }) {
		const existingUser = await userRepository.findByEmail(data.email);

		if (existingUser) {
			throw new AppError(
				"An account with this email already exists.",
				HTTP_STATUS.CONFLICT,
				ErrorCodes.CONFLICT,
			);
		}

		const hashedPassword = await passwordService.hash(data.password);

		const user = await userRepository.create({
			firstName: data.firstName,
			lastName: data.lastName,
			email: data.email,
			phone: data.phone,
			password: hashedPassword,
		});

		const tokens = await sessionService.create(user, requestMetadata);

		return {
			user: userPresenter.present(user),
			...tokens,
		};
	}

	async login({ data, requestMetadata }) {
		const user = await userRepository.findByEmail(data.email);

		/**
		 * Never reveal whether the email exists.
		 */
		if (!user) {
			throw new AppError(
				"Invalid email or password.",
				HTTP_STATUS.UNAUTHORIZED,
				ErrorCodes.UNAUTHORIZED,
			);
		}

		const passwordMatches = await passwordService.compare(
			data.password,
			user.password,
		);

		if (!passwordMatches) {
			throw new AppError(
				"Invalid email or password.",
				HTTP_STATUS.UNAUTHORIZED,
				ErrorCodes.UNAUTHORIZED,
			);
		}

		const tokens = await sessionService.create(user, requestMetadata);

		return {
			user: userPresenter.present(user),
			...tokens,
		};
	}

	async refresh(refreshToken, metadata = {}) {
		return sessionService.rotate(refreshToken, metadata);
	}

	async logout(refreshToken) {
		return sessionService.logout(refreshToken);
	}

	async revokeSession(userId, sessionId) {
		return sessionService.revoke(userId, sessionId);
	}

	async revokeOtherSessions(userId, currentSessionId) {
		return sessionService.revokeOthers(userId, currentSessionId);
	}

	// async forgotPassword(email) {
	// 	const user = await userRepository.findByEmail(email);

	// 	/**
	// 	 * Account discovery protection.
	// 	 *
	// 	 * The public HTTP response must remain identical whether
	// 	 * or not an account exists for the submitted email.
	// 	 */
	// 	if (!user || !user.active) {
	// 		return null;
	// 	}

	// 	const recovery = await passwordResetTokenService.create(user._id);

	// 	const resetUrlBase = env.PASSWORD_RESET_URL;

	// 	if (!resetUrlBase) {
	// 		throw new AppError(
	// 			"Password reset URL is not configured.",
	// 			HTTP_STATUS.INTERNAL_SERVER_ERROR,
	// 			ErrorCodes.INTERNAL_SERVER_ERROR,
	// 		);
	// 	}

	// 	const resetUrl = new URL(resetUrlBase);

	// 	resetUrl.searchParams.set("token", recovery.token);

	// 	const event = createPasswordResetRequestedEvent({
	// 		userId: getId(user),
	// 		email: user.email,
	// 		resetRequestId: crypto.randomUUID(),
	// 		resetUrl: resetUrl.toString(),
	// 		metadata: {
	// 			source: "identity",
	// 		},
	// 	});

	// 	await eventBus.publish(event);

	// 	return null;
	// }
}

export default new AuthService();
