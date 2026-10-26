import crypto from "crypto";
import jwt from "jsonwebtoken";
import { AppError, env, ErrorCodes, HTTP_STATUS } from "../../../app/index.js";

class RefreshTokenService {
	generate(user) {
		return jwt.sign(
			{
				sub: user._id.toString(),
				jti: crypto.randomUUID(),
			},
			env.jwt.refreshSecret,
			{
				expiresIn: env.jwt.refreshExpires,
				issuer: env.jwt.issuer,
				audience: env.jwt.audience,
			},
		);
	}

	verify(token) {
		try {
			return jwt.verify(token, env.jwt.refreshSecret, {
				issuer: env.jwt.issuer,
				audience: env.jwt.audience,
			});
		} catch (error) {
			if (error.name === "TokenExpiredError") {
				throw new AppError(
					"Refresh token has expired.",
					HTTP_STATUS.UNAUTHORIZED,
					ErrorCodes.UNAUTHORIZED,
				);
			}

			throw new AppError(
				"Invalid refresh token.",
				HTTP_STATUS.UNAUTHORIZED,
				ErrorCodes.UNAUTHORIZED,
			);
		}
	}
}

export default new RefreshTokenService();
