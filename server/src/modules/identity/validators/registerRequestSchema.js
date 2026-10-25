import { z } from "zod";

import {
	emailSchema,
	passwordSchema,
	phoneSchema,
} from "../../../app/index.js";

const registerRequestSchema = z.object({
	firstName: z
		.string({
			error: "First name is required",
		})
		.trim()
		.min(1, "First name is required")
		.max(50, "First name cannot exceed 50 characters"),

	lastName: z
		.string()
		.trim()
		.max(50, "Last name cannot exceed 50 characters")
		.optional()
		.or(z.literal("")),
	email: emailSchema,
	phone: phoneSchema,
	password: passwordSchema,
});

export default registerRequestSchema;
