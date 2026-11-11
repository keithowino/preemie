import { User } from "../models/index.js";

async function create(userData) {
	return User.create(userData);
}

async function findById(target) {
	return User.findById(target);
}

async function findByEmail(email) {
	if (!email) {
		return null;
	}

	return User.findOne({
		email: email.toLowerCase(),
	});
}

// async function save(user) {
// 	return user.save();
// }

async function updateProfile(userId, profileData) {
	return User.findOneAndUpdate(
		{
			_id: userId,
		},
		{
			$set: profileData,
		},
		{
			returnDocument: "after",
			runValidators: true,
		},
	);
}

async function updatePreferences(userId, preferencesData) {
	return User.findOneAndUpdate(
		{
			_id: userId,
		},
		{
			$set: {
				"preferences.appearance.theme":
					preferencesData.appearance.theme,
			},
		},
		{
			returnDocument: "after",
			runValidators: true,
		},
	);
}

async function updatePresence(userId, presenceData) {
	return User.findOneAndUpdate(
		{
			_id: userId,
		},
		{
			$set: {
				"presence.status": presenceData.status,
			},
		},
		{
			returnDocument: "after",
			runValidators: true,
		},
	);
}

export default {
	create,
	findById,
	findByEmail,
	// save,
	updateProfile,
	updatePreferences,
	updatePresence,
};
