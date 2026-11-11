import { z } from "zod";

import { phoneSchema } from "../../../app/index.js";

const updateProfileRequestSchema = z
	.object({
		firstName: z
			.string()
			.trim()
			.min(1, "First name cannot be empty.")
			.max(50, "First name cannot exceed 50 characters.")
			.optional(),

		lastName: z
			.string()
			.trim()
			.max(50, "Last name cannot exceed 50 characters.")
			.optional(),

		phone: phoneSchema,
	})
	.strict()
	.refine((data) => Object.keys(data).length > 0, {
		message: "At least one profile field must be provided.",
	});

export default updateProfileRequestSchema;
