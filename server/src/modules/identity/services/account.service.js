import { AppError, ErrorCodes, HTTP_STATUS } from "../../../app/index.js";

import { userRepository } from "../repositories/index.js";
import { userPresenter } from "../presenters/index.js";

class AccountService {
	/**
	 * Retrieves an account and translates a missing account
	 * into the platform's standard not-found error.
	 */
	async findAccount(userId) {
		const user = await userRepository.findById(userId);

		if (!user) {
			throw new AppError(
				"Account not found.",
				HTTP_STATUS.NOT_FOUND,
				ErrorCodes.NOT_FOUND,
			);
		}

		return user;
	}

	async getProfile(userId) {
		const user = await this.findAccount(userId);

		return userPresenter.present(user);
	}

	async updateProfile(userId, profileData) {
		const allowedFields = ["firstName", "lastName", "phone"];

		const updates = Object.fromEntries(
			Object.entries(profileData).filter(
				([key, value]) =>
					allowedFields.includes(key) && value !== undefined,
			),
		);

		const user = await userRepository.updateProfile(userId, updates);

		if (!user) {
			throw new AppError(
				"Account not found.",
				HTTP_STATUS.NOT_FOUND,
				ErrorCodes.NOT_FOUND,
			);
		}

		return userPresenter.present(user);
	}

	async getPreferences(userId) {
		const user = await this.findAccount(userId);

		return userPresenter.present(user).preferences;
	}

	async updatePreferences(userId, preferencesData) {
		const user = await userRepository.updatePreferences(
			userId,
			preferencesData,
		);

		if (!user) {
			throw new AppError(
				"Account not found.",
				HTTP_STATUS.NOT_FOUND,
				ErrorCodes.NOT_FOUND,
			);
		}

		return userPresenter.present(user).preferences;
	}

	async getPresence(userId) {
		const user = await this.findAccount(userId);

		return userPresenter.present(user).presence;
	}

	async updatePresence(userId, presenceData) {
		const user = await userRepository.updatePresence(userId, presenceData);

		if (!user) {
			throw new AppError(
				"Account not found.",
				HTTP_STATUS.NOT_FOUND,
				ErrorCodes.NOT_FOUND,
			);
		}

		return userPresenter.present(user).presence;
	}
}

export default new AccountService();
