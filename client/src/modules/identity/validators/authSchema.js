import { z } from "zod";

export const emailSchema = z
	.email("A valid email address is required.")
	.transform((email) => email.toLowerCase());

export const passwordSchema = z
	.string({
		error: "Password is required",
	})
	.min(8, "Password must be at least 8 characters")
	.max(128, "Password cannot exceed 128 characters");

export const phoneSchema = z
	.string()
	.trim()
	.max(30, "Phone number cannot exceed 30 characters")
	.optional()
	.or(z.literal(""));

export const registerFormSchema = z
	.object({
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
		confirmPassword: passwordSchema,
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords do not match.",
		path: ["confirmPassword"],
	});

export const loginFormSchema = z.object({
	email: emailSchema,
	password: passwordSchema,
});
