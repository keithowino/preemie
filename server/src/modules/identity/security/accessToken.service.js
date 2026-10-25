import jwt from "jsonwebtoken";
import { AppError, env, ErrorCodes, HTTP_STATUS } from "../../../app/index.js";

class AccessTokenService {
	generate(user, sessionId) {
		return jwt.sign(
			{
				sub: user._id.toString(),
				email: user.email,
				sid: sessionId.toString(),
			},
			env.jwt.accessSecret,
			{
				expiresIn: env.jwt.accessExpires,
				issuer: env.jwt.issuer,
				audience: env.jwt.audience,
			},
		);
	}

	verify(token) {
		try {
			return jwt.verify(token, env.jwt.accessSecret, {
				issuer: env.jwt.issuer,
				audience: env.jwt.audience,
			});
		} catch (error) {
			if (error.name === "TokenExpiredError") {
				throw new AppError(
					"Access token has expired.",
					HTTP_STATUS.UNAUTHORIZED,
					ErrorCodes.UNAUTHORIZED,
				);
			}

			throw new AppError(
				"Invalid access token.",
				HTTP_STATUS.UNAUTHORIZED,
				ErrorCodes.UNAUTHORIZED,
			);
		}
	}
}

export default new AccessTokenService();
