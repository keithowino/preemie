import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
			index: true,
		},

		refreshTokenHash: {
			type: String,
			required: true,
			unique: true,
		},

		expiresAt: {
			type: Date,
			required: true,
		},

		lastActivityAt: {
			type: Date,
			default: Date.now,
		},

		ipAddress: {
			type: String,
			default: null,
		},

		userAgent: {
			type: String,
			default: null,
		},

		deviceName: {
			type: String,
			default: null,
		},

		browser: {
			type: String,
			default: null,
		},

		operatingSystem: {
			type: String,
			default: null,
		},

		isRevoked: {
			type: Boolean,
			default: false,
			index: true,
		},

		revokedAt: {
			type: Date,
			default: null,
		},
	},
	{
		timestamps: true,
	},
);

sessionSchema.index({
	user: 1,
	isRevoked: 1,
});

sessionSchema.index({
	expiresAt: 1,
});

const Session = mongoose.model("Session", sessionSchema);

export default Session;
