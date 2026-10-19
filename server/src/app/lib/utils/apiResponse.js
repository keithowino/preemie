import { HTTP_STATUS } from "../constants/index.js";

export function success(
	res,
	data = null,
	message = "Success",
	status = HTTP_STATUS.OK,
) {
	return res.status(status).json({
		success: true,
		message,
		data,
	});
}

export function error(
	res,
	message = "Error",
	status = HTTP_STATUS.INTERNAL_SERVER_ERROR,
	code = null,
	details = null,
) {
	return res.status(status).json({
		success: false,
		error: {
			code,
			message,
			details,
		},
	});
}
