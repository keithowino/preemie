import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
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
	},
);

const User = mongoose.model("User", userSchema);

export default User;
