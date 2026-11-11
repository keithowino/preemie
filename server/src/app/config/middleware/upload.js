import multer from "multer";
import { AppError, ErrorCodes, HTTP_STATUS } from "../../lib/index.js";

/**
|--------------------------------------------------
| Configuration
|--------------------------------------------------
*/

/**
 * 5 MB
 */
const MAX_FILE_SIZE = 5 * 1024 * 1024;

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];

/**
 *  Multer Storage
 */
const storage = multer.memoryStorage();

/**
 * File Filter
 */
function fileFilter(req, file, callback) {
	if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
		return callback(
			new AppError(
				"Only JPEG, PNG and WEBP images are allowed.",
				HTTP_STATUS.BAD_REQUEST,
				ErrorCodes.VALIDATION_ERROR,
			),
		);
	}

	callback(null, true);
}

/**
 * Upload Middleware
 */
const upload = multer({
	storage,

	fileFilter,

	limits: {
		fileSize: MAX_FILE_SIZE,
	},
});

export default upload;
