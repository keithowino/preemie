import ms from "ms";
import { sessionRepository } from "../repositories/index.js";
import accessTokenService from "./accessToken.service.js";
import refreshTokenService from "./refreshToken.service.js";
import { hashToken } from "./tokenHasher.js";
import userRepository from "../repositories/user.repository.js";
// import { sessionPresenter } from "../presenters/index.js";
import { AppError, env } from "../../../app/index.js";

class SessionService {
	async create(user, metadata = {}) {
		const refreshToken = refreshTokenService.generate(user);
		const expiresAt = new Date(Date.now() + ms(env.jwt.refreshExpires));

		const session = await sessionRepository.create({
			user: user._id,
			refreshTokenHash: hashToken(refreshToken),
			expiresAt,
			ipAddress: metadata.ipAddress ?? null,
			userAgent: metadata.userAgent ?? null,
			deviceName: metadata.deviceName ?? null,
			browser: metadata.browser ?? null,
			operatingSystem: metadata.operatingSystem ?? null,
		});

		const accessToken = accessTokenService.generate(user, session._id);

		return {
			accessToken,
			refreshToken,
		};
	}

	// async rotate(refreshToken, metadata = {}) {
	// 	/**
	// 	 * 1. Verify JWT signature.
	// 	 */
	// 	refreshTokenService.verify(refreshToken);

	// 	/**
	// 	 * 2. Hash the received token.
	// 	 */
	// 	const refreshTokenHash = hashToken(refreshToken);

	// 	/**
	// 	 * 3. Find the matching active session.
	// 	 */
	// 	const session =
	// 		await sessionRepository.findByRefreshTokenHash(refreshTokenHash);

	// 	if (!session) {
	// 		throw new AppError(
	// 			"Invalid refresh token.",
	// 			HTTP_STATUS.UNAUTHORIZED,
	// 			ErrorCodes.UNAUTHORIZED,
	// 		);
	// 	}

	// 	/**
	// 	 * 4. Load the user.
	// 	 */
	// 	const user = await userRepository.findById(session.user);

	// 	if (!user || !user.active) {
	// 		throw new AppError(
	// 			"Invalid refresh token.",
	// 			HTTP_STATUS.UNAUTHORIZED,
	// 			ErrorCodes.UNAUTHORIZED,
	// 		);
	// 	}

	// 	/**
	// 	 * 5. Revoke the old session.
	// 	 */
	// 	await sessionRepository.revoke(session);

	// 	/**
	// 	 * 6. Issue a brand-new session.
	// 	 */
	// 	return this.create(user, metadata);
	// }

	// async logout(refreshToken) {
	// 	/**
	// 	 * Verify signature and expiration first.
	// 	 */
	// 	refreshTokenService.verify(refreshToken);

	// 	const refreshTokenHash = hashToken(refreshToken);

	// 	const session =
	// 		await sessionRepository.findByRefreshTokenHash(refreshTokenHash);

	// 	if (!session) {
	// 		return;
	// 	}

	// 	await sessionRepository.revoke(session);
	// }

	// async list(userId, currentSessionId) {
	// 	const sessions = await sessionRepository.findActiveByUser(userId);

	// 	return {
	// 		sessions: sessionPresenter.presentCollection(
	// 			sessions,
	// 			currentSessionId,
	// 		),
	// 	};
	// }

	// async revoke(userId, sessionId) {
	// 	const session = await sessionRepository.findActiveByIdAndUser(
	// 		sessionId,
	// 		userId,
	// 	);

	// 	if (!session) {
	// 		throw new AppError(
	// 			"Session not found.",
	// 			HTTP_STATUS.NOT_FOUND,
	// 			ErrorCodes.NOT_FOUND,
	// 		);
	// 	}

	// 	await sessionRepository.revoke(session);
	// }

	// async revokeOthers(userId, currentSessionId) {
	// 	await sessionRepository.revokeAllExcept(userId, currentSessionId);
	// }

	/**
	 * Translates a missing/invalid session into the platform's existing authentication error.
	 */
	async validateAccessSession(sessionId, userId) {
		const session = await sessionRepository.touchActiveByIdAndUser(
			sessionId,
			userId,
		);

		if (!session) {
			throw new AppError(
				"Authentication session is invalid or expired.",
				HTTP_STATUS.UNAUTHORIZED,
				ErrorCodes.UNAUTHORIZED,
			);
		}

		return session;
	}
}

export default new SessionService();
