import { z } from "zod";

const passwordSchema = z
	.string({
		error: "Password is required",
	})
	.min(8, "Password must be at least 8 characters")
	.max(128, "Password cannot exceed 128 characters");

export default passwordSchema;
