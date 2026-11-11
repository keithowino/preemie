import path from "node:path";
import crypto from "node:crypto";

/**
|--------------------------------------------------
| Private Helpers
|--------------------------------------------------
*/

function sanitizeFilename(filename) {
	const sanitized = path
		.parse(filename || "")
		.name.trim()
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "");

	return sanitized || "avatar";
}

function generateFilename(originalname) {
	const name = sanitizeFilename(originalname);

	const suffix = crypto.randomBytes(4).toString("hex");

	return `${name}-${suffix}`;
}

function buildUserAvatarFolder(userId) {
	return `preemie/uploads/users/profile/avatar/${userId}`;
}

/**
 * -----------------------------------------------
 * Storage Service Factory
 * -----------------------------------------------
 *
 * The provider is injected into this factory.
 *
 * The service does not know whether the provider
 * is Cloudinary, ImageKit, or another storage service.
 *
 */

/**
 * Receives a provider through dependency injection.
 */
export function createImageStorageService({ provider, providerName }) {
	if (!provider || typeof provider.upload !== "function") {
		throw new TypeError(
			"An image storage provider with an upload() method is required.",
		);
	}

	if (typeof provider.destroy !== "function") {
		throw new TypeError(
			"The image storage provider must implement destroy().",
		);
	}

	if (!providerName || typeof providerName !== "string") {
		throw new TypeError("A valid image storage provider name is required.");
	}

	/**
	 * Upload User Avatar
	 */
	async function uploadUserAvatarImage({ file, userId }) {
		if (!file?.buffer) {
			throw new TypeError("A valid image file is required.");
		}

		if (!userId) {
			throw new TypeError("A user ID is required.");
		}

		const uploaded = await provider.upload({
			buffer: file.buffer,
			folder: buildUserAvatarFolder(userId),
			filename: generateFilename(file.originalname),
			resourceType: "image",
		});

		if (!uploaded?.url || !uploaded?.storageKey) {
			throw new Error(
				"The storage provider returned an invalid upload result.",
			);
		}

		return {
			url: uploaded.url,

			storage: {
				provider: providerName,
				key: uploaded.storageKey,
			},

			metadata: uploaded.metadata,
		};
	}

	/**
	 * Delete User Avatar
	 */
	async function deleteUserAvatarImage({ storageKey }) {
		if (!storageKey) {
			return;
		}

		return provider.destroy(storageKey);
	}

	return {
		uploadUserAvatarImage,
		deleteUserAvatarImage,
	};
}
