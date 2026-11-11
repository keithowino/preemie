import { getId, PRESENCE_STATUS, THEME_STATUS } from "../../../app/index.js";

class UserPresenter {
	present(user) {
		if (!user) {
			return null;
		}

		return {
			id: getId(user),
			firstName: user.firstName,
			lastName: user.lastName,
			email: user.email,

			phone: user.phone ?? null,

			avatar:
				user.avatar && Object.keys(user.avatar).length > 0
					? user.avatar
					: null,

			preferences: {
				appearance: {
					theme:
						user.preferences?.appearance?.theme ??
						THEME_STATUS.SYSTEM,
				},
			},

			presence: {
				status: user.presence?.status ?? PRESENCE_STATUS.AVAILABLE,
			},
		};
	}

	presentMany(users) {
		return users.map((user) => this.present(user));
	}
}

export default new UserPresenter();
