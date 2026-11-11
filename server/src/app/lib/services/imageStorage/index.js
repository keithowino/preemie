import { STORAGE_PROVIDERS } from "../../constants/index.js";

import { cloudinaryProvider } from "./providers/index.js";

import { createImageStorageService } from "./imageStorage.service.js";

/**
 * -----------------------------------------------
 * Image Storage Configuration
 * -----------------------------------------------
 *
 * Cloudinary is the initial configured provider.
 *
 * The storage service itself remains provider-independent.
 *
 */

const imageStorageService = createImageStorageService({
	provider: cloudinaryProvider,
	providerName: STORAGE_PROVIDERS.CLOUDINARY,
});

export default imageStorageService;
