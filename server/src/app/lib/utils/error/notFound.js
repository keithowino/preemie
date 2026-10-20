import { HTTP_STATUS } from "../../constants/index.js";
import { AppError } from "./appError.js";
import ErrorCodes from "./errorCodes.js";

export default function notFound(req, res, next) {
	next(
		new AppError(
			`Route ${req.originalUrl} not found`,
			HTTP_STATUS.NOT_FOUND,
			ErrorCodes.NOT_FOUND,
		),
	);
}
