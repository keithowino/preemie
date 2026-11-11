import { asyncHandler, success, validateRequest } from "../../../app/index.js";

import {
	updateProfileRequestSchema,
	updatePreferencesRequestSchema,
	updatePresenceRequestSchema,
} from "../validators/index.js";

import { accountService } from "../services/index.js";

class AccountController {
	updateProfile = asyncHandler(async (req, res) => {
		const { body } = validateRequest(
			{
				body: updateProfileRequestSchema,
			},
			req,
		);

		const user = await accountService.updateProfile(req.user._id, body);

		return success(res, user, "Profile updated successfully.");
	});

	getPreferences = asyncHandler(async (req, res) => {
		const preferences = await accountService.getPreferences(req.user._id);

		return success(res, preferences, "Preferences retrieved successfully.");
	});

	updatePreferences = asyncHandler(async (req, res) => {
		const { body } = validateRequest(
			{
				body: updatePreferencesRequestSchema,
			},
			req,
		);

		const preferences = await accountService.updatePreferences(
			req.user._id,
			body,
		);

		return success(res, preferences, "Preferences updated successfully.");
	});

	getPresence = asyncHandler(async (req, res) => {
		const presence = await accountService.getPresence(req.user._id);

		return success(res, presence, "Presence retrieved successfully.");
	});

	updatePresence = asyncHandler(async (req, res) => {
		const { body } = validateRequest(
			{
				body: updatePresenceRequestSchema,
			},
			req,
		);

		const presence = await accountService.updatePresence(
			req.user._id,
			body,
		);

		return success(res, presence, "Presence updated successfully.");
	});
}

export default new AccountController();
