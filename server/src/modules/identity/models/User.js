import mongoose from "mongoose";
import {
	IMAGE_SOURCE,
	IMAGE_SOURCE_VALUES,
	PRESENCE_STATUS,
	PRESENCE_STATUS_VALUES,
	STORAGE_PROVIDER_VALUES,
	THEME_STATUS,
	THEME_STATUS_VALUES,
} from "../../../app/index.js";

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

/**
|--------------------------------------------------
| Appearance Preferences
|--------------------------------------------------
*/

const appearancePreferencesSchema = new Schema(
	{
		theme: {
			type: String,
			enum: THEME_STATUS_VALUES,
			default: THEME_STATUS.SYSTEM,
		},
	},
	{
		_id: false,
		strict: true,
	},
);

/**
|--------------------------------------------------
| User Preferences
|--------------------------------------------------
*/

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

/**
|--------------------------------------------------
| User Presence
|--------------------------------------------------
*/

const presenceSchema = new Schema(
	{
		status: {
			type: String,
			enum: PRESENCE_STATUS_VALUES,
			default: PRESENCE_STATUS.AVAILABLE,
		},
	},
	{
		_id: false,
		strict: true,
	},
);

/**
 * --------------------------------------------------
 * Avatar Storage
 * --------------------------------------------------
 *
 * Provider-independent storage reference.
 *
 * Example:
 * {
 *     provider: "CLOUDINARY",
 *     key: "preemie/uploads/users/profile/avatar/..."
 * }
 *
 */

const avatarStorageSchema = new Schema(
	{
		provider: {
			type: String,
			enum: STORAGE_PROVIDER_VALUES,
			required: true,
			trim: true,
			uppercase: true,
		},

		key: {
			type: String,
			required: true,
			trim: true,
		},
	},
	{
		_id: false,
		strict: true,
	},
);

/**
|--------------------------------------------------
| Avatar Metadata
|--------------------------------------------------
*/

const avatarMetadataSchema = new Schema(
	{
		width: {
			type: Number,
			min: 1,
		},

		height: {
			type: Number,
			min: 1,
		},

		format: {
			type: String,
			trim: true,
			lowercase: true,
		},

		bytes: {
			type: Number,
			min: 1,
		},
	},
	{
		_id: false,
		strict: true,
	},
);

/**
 * --------------------------------------------------
 * User Avatar
 * --------------------------------------------------
 *
 * source:
 * - UPLOAD: image uploaded through Preemie.
 * - EXTERNAL: image hosted externally.
 *
 * storage and metadata are required for UPLOAD.
 * They are not required for EXTERNAL.
 *
 */

const avatarSchema = new Schema(
	{
		url: {
			type: String,
			required: true,
			trim: true,
		},

		source: {
			type: String,
			required: true,
			enum: IMAGE_SOURCE_VALUES,
		},

		storage: {
			type: avatarStorageSchema,

			required: function () {
				return this.source === IMAGE_SOURCE.UPLOAD;
			},
		},

		metadata: {
			type: avatarMetadataSchema,
		},
	},
	{
		_id: false,
		strict: true,
	},
);

/**
|--------------------------------------------------
| User Model
|--------------------------------------------------
*/

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
			type: avatarSchema,
			default: undefined,
		},

		preferences: {
			type: preferencesSchema,
			default: () => ({}),
		},

		presence: {
			type: presenceSchema,
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
