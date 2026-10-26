import { Session } from "../models/index.js";

async function create(sessionData) {
	return Session.create(sessionData);
}

// async function save(session) {
// 	return session.save();
// }

// async function findById(id) {
// 	return Session.findById(id);
// }

// async function findByUser(userId) {
// 	return Session.find({
// 		user: userId,
// 		isRevoked: false,
// 	}).sort({
// 		lastActivityAt: -1,
// 	});
// }

async function findActiveByUser(userId) {
	return Session.find({
		user: userId,
		isRevoked: false,
	})
		.sort({ lastActivityAt: -1 })
		.lean();
}

async function findActiveByIdAndUser(sessionId, userId) {
	return Session.findOne({
		_id: sessionId,
		user: userId,
		isRevoked: false,
	});
}

async function findByRefreshTokenHash(hash) {
	return Session.findOne({
		refreshTokenHash: hash,
		isRevoked: false,
	});
}

async function revoke(session) {
	session.isRevoked = true;

	session.revokedAt = new Date();

	return session.save();
}

// async function revokeAll(userId) {
// 	return Session.updateMany(
// 		{
// 			user: userId,
// 			isRevoked: false,
// 		},
// 		{
// 			isRevoked: true,
// 			revokedAt: new Date(),
// 		},
// 	);
// }

async function revokeAllExcept(userId, sessionId) {
	return Session.updateMany(
		{
			user: userId,
			isRevoked: false,
			_id: { $ne: sessionId },
		},
		{
			$set: {
				isRevoked: true,
				revokedAt: new Date(),
			},
		},
	);
}

/**
 * ### Why this is preferable
 *
 * The database itself enforces all four conditions:
 * - _id       === sid
 * - user      === sub
 * - isRevoked === false
 * - expiresAt > now
 * Only when all four match does MongoDB update lastActivityAt.
 *
 * So we don't have a window where: validate session -> session gets revoked -> touch revoked session
 */
async function touchActiveByIdAndUser(sessionId, userId) {
	const now = new Date();

	return Session.findOneAndUpdate(
		{
			_id: sessionId,
			user: userId,
			isRevoked: false,
			expiresAt: { $gt: now },
		},
		{
			$set: {
				lastActivityAt: now,
			},
		},
		{
			returnDocument: "after",
		},
	);
}

export default {
	create,
	// save,
	// findById,
	// findByUser,
	findActiveByUser,
	findActiveByIdAndUser,
	findByRefreshTokenHash,
	revoke,
	// revokeAll,
	revokeAllExcept,

	touchActiveByIdAndUser,
};
