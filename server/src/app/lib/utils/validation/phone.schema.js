import { z } from "zod";

export const phoneSchema = z
	.union([
		z.literal(""),
		z
			.string()
			.trim()
			.regex(/^\+[1-9]\d{1,14}$/, "Enter a valid phone number."),
	])
	.optional();

export default phoneSchema;
