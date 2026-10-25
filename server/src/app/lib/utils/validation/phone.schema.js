import { z } from "zod";

const phoneSchema = z
	.string()
	.trim()
	.max(30, "Phone number cannot exceed 30 characters")
	.optional()
	.or(z.literal(""));

export default phoneSchema;
