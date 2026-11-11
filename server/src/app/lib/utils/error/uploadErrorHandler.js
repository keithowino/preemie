import multer from "multer";

import { AppError } from "./appError.js";
import ErrorCodes from "./errorCodes.js";

import { HTTP_STATUS } from "../../constants/index.js";

export default function uploadErrorHandler(error, req, res, next) {
	if (error instanceof multer.MulterError) {
		switch (error.code) {
			case "LIMIT_FILE_SIZE":
				return next(
					new AppError(
						"Image size must not exceed 5 MB.",
						HTTP_STATUS.BAD_REQUEST,
						ErrorCodes.VALIDATION_ERROR,
					),
				);

			case "LIMIT_UNEXPECTED_FILE":
				return next(
					new AppError(
						"Unexpected upload field.",
						HTTP_STATUS.BAD_REQUEST,
						ErrorCodes.VALIDATION_ERROR,
					),
				);

			default:
				return next(
					new AppError(
						error.message,
						HTTP_STATUS.BAD_REQUEST,
						ErrorCodes.VALIDATION_ERROR,
					),
				);
		}
	}

	/**
	 * Keep this commented block for fallback purposes until further notice.
	 */
	// if (
	// 	error.message?.includes("Invalid image") ||
	// 	error.message?.includes("image file")
	// ) {
	// 	return next(
	// 		new AppError(
	// 			"Only image files are allowed.",
	// 			HTTP_STATUS.BAD_REQUEST,
	// 			ErrorCodes.VALIDATION_ERROR,
	// 		),
	// 	);
	// }

	next(error);
}
