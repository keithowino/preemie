import mongoose from "mongoose";

/**
 * A useful detail about this structure: _id: false
 * prevents Mongoose from generating unnecessary
 * MongoDB identifiers for these embedded preference
 * objects. They are settings, not independently
 * addressable documents.
 *
 * models.User || model("User", userSchema) were used,
 * consistent with the approach already used by the
 * Ideation model. This avoids model recompilation
 * problems in environments where modules may be reloaded.
 */

const { Schema, model, models } = mongoose;

const appearancePreferencesSchema = new Schema(
	{
		theme: {
			type: String,
			enum: ["system", "light", "dark"],
			default: "system",
		},
	},
	{
		_id: false,
		strict: true,
	},
);

const preferencesSchema = new Schema(
	{
		appearance: {
			type: appearancePreferencesSchema,
			default: () => ({}),
		},
	},
	{
		_id: false,
		strict: true,
	},
);

const userSchema = new Schema(
	{
		firstName: {
			type: String,
			required: true,
			trim: true,
		},

		lastName: {
			type: String,
			trim: true,
		},

		email: {
			type: String,
			unique: true,
			required: true,
			lowercase: true,
			trim: true,
		},

		phone: {
			type: String,
			trim: true,
		},

		password: {
			type: String,
			required: true,
			minlength: 6,
		},

		avatar: {
			url: String,
			publicId: String,
		},

		preferences: {
			type: preferencesSchema,
			default: () => ({}),
		},

		emailVerified: {
			type: Boolean,
			default: false,
		},

		active: {
			type: Boolean,
			default: true,
		},
	},
	{
		timestamps: true,
		strict: true,
	},
);

const User = models.User || model("User", userSchema);

export default User;
