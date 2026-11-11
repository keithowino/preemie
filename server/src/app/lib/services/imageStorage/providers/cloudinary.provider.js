import { cloudinary } from "../../../../config/index.js";

/**
|--------------------------------------------------
| Private Helpers
|--------------------------------------------------
*/

/**
 * Upload a buffer through Cloudinary's upload stream.
 */
function uploadStream(options, buffer) {
	return new Promise((resolve, reject) => {
		const stream = cloudinary.uploader.upload_stream(
			options,
			(error, result) => {
				if (error) {
					return reject(error);
				}

				if (!result) {
					return reject(
						new Error(
							"Cloudinary did not return an upload result.",
						),
					);
				}

				resolve(result);
			},
		);

		stream.on("error", reject);

		stream.end(buffer);
	});
}

/**
|--------------------------------------------------
| Provider Operations
|--------------------------------------------------
*/

async function upload({ buffer, folder, filename, resourceType = "image" }) {
	if (!Buffer.isBuffer(buffer)) {
		throw new TypeError("A valid image buffer is required.");
	}

	if (!folder || !filename) {
		throw new TypeError("A storage folder and filename are required.");
	}

	const uploaded = await uploadStream(
		{
			folder,
			public_id: filename,
			resource_type: resourceType,
			overwrite: false,
		},
		buffer,
	);

	return {
		url: uploaded.secure_url,
		storageKey: uploaded.public_id,

		metadata: {
			width: uploaded.width,
			height: uploaded.height,
			format: uploaded.format,
			bytes: uploaded.bytes,
		},
	};
}

async function destroy(storageKey) {
	if (!storageKey || typeof storageKey !== "string") {
		throw new TypeError("A valid storage key is required.");
	}

	const result = await cloudinary.uploader.destroy(storageKey);

	/*
	|--------------------------------------------------
	| Idempotent Delete
	|--------------------------------------------------
	|
	| Cloudinary returns:
	|
	|   { result: "ok" }
	|   { result: "not found" }
	|
	| Both are considered successful because the asset no longer exists.
	|
	*/

	if (result.result !== "ok" && result.result !== "not found") {
		throw new Error(
			`Failed to delete image from Cloudinary. Result: ${result.result}`,
		);
	}

	return result;
}

/**
 * --------------------------------------------------
 * Provider Interface
 * --------------------------------------------------
 */

export default {
	upload,
	destroy,
};
