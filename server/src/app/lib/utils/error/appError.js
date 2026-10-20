import { HTTP_STATUS } from "../../constants/index.js";
import ErrorCodes from "./errorCodes.js";

export class AppError extends Error {
	constructor(
		message,
		statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR,
		code = ErrorCodes.INTERNAL_SERVER_ERROR,
		details = null,
	) {
		super(message);
		this.name = "AppError";
		this.statusCode = statusCode;
		this.code = code;
		this.details = details;
		Error.captureStackTrace(this, this.constructor);
	}
}
