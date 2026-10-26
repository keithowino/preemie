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

export default {
	create,
	findById,
	findByEmail,
	// save,
};
