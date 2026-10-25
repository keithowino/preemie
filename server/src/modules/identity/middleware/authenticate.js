import { accessTokenService, sessionService } from "../security/index.js";
import { userRepository } from "../repositories/index.js";
import {
	AppError,
	ErrorCodes,
	getId,
	HTTP_STATUS,
} from "../../../app/index.js";

export default async function authenticate(req, res, next) {
	try {
		const authorization = req.headers.authorization;

		if (!authorization) {
			throw new AppError(
				"Authentication required.",
				HTTP_STATUS.UNAUTHORIZED,
				ErrorCodes.UNAUTHORIZED,
			);
		}

		const [scheme, token] = authorization.split(" ");

		if (scheme !== "Bearer" || !token) {
			throw new AppError(
				"Authentication required.",
				HTTP_STATUS.UNAUTHORIZED,
				ErrorCodes.UNAUTHORIZED,
			);
		}

		const payload = accessTokenService.verify(token);

		const session = await sessionService.validateAccessSession(
			payload.sid,
			payload.sub,
		);

		const user = await userRepository.findById(payload.sub);

		if (!user || !user.active) {
			throw new AppError(
				"Authentication required.",
				HTTP_STATUS.UNAUTHORIZED,
				ErrorCodes.UNAUTHORIZED,
			);
		}

		req.user = user;
		req.sessionId = getId(session);

		next();
	} catch (error) {
		next(error);
	}
}
