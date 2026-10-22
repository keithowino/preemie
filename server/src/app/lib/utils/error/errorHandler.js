import { ZodError } from "zod";

import { HTTP_STATUS } from "../../constants/index.js";
import { AppError } from "./appError.js";
import ErrorCodes from "./errorCodes.js";

export default function errorHandler(err, req, res, next) {
	let error = err;

	/**
	 * Zod validation errors
	 */
	if (error instanceof ZodError) {
		error = new AppError(
			"Validation failed.",
			HTTP_STATUS.BAD_REQUEST,
			ErrorCodes.VALIDATION_ERROR,
			error.issues,
		);
	}

	/**
	 * Oversized JSON request bodies
	 *
	 * express.json() rejects requests that exceed the configured limit
	 * before they reach a controller.
	 */
	if (
		error.status === HTTP_STATUS.CONTENT_TOO_LARGE &&
		error.type === "entity.too.large"
	) {
		error = new AppError(
			"Request body is too large.",
			HTTP_STATUS.CONTENT_TOO_LARGE,
			ErrorCodes.CONTENT_TOO_LARGE,
		);
	}

	/**
	 * Malformed JSON request bodies
	 *
	 * express.json() can throw a SyntaxError before the request
	 * reaches a controller.
	 */
	if (
		error instanceof SyntaxError &&
		error.status === HTTP_STATUS.BAD_REQUEST &&
		"body" in error
	) {
		error = new AppError(
			"Invalid JSON payload.",
			HTTP_STATUS.BAD_REQUEST,
			ErrorCodes.BAD_REQUEST,
		);
	}

	/**
	 * Normalize unexpected errors.
	 *
	 * Internal implementation details should never be exposed
	 * to the client.
	 */
	if (!(error instanceof AppError)) {
		console.error(error);

		error = new AppError(
			"Internal Server Error",
			HTTP_STATUS.INTERNAL_SERVER_ERROR,
			ErrorCodes.INTERNAL_SERVER_ERROR,
		);
	}

	/**
	 * Log server-side errors.
	 */
	if (error.statusCode >= HTTP_STATUS.INTERNAL_SERVER_ERROR) {
		console.error(error.stack);
	}

	return res.status(error.statusCode).json({
		success: false,
		error: {
			code: error.code,
			message: error.message,
			details: error.details,
		},
	});
}
