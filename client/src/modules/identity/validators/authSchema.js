import { z } from "zod";

/**
 * #### /^\+[1-9]\d{1,14}$/
 *
 * This is a regular expression that matches a phone number
 * in E.164 format — the international standard for phone
 * numbers. The format is: a leading +, a country code that
 * can't start with 0, and up to 15 total digits (country code
 * + subscriber number combined).
 *
 * Here's each piece:
 *
 * 	- ^: Anchors the match to the start of the string. Without it,
 * the regex would also match "hello +254712345678 world" — the ^
 * forces the + to be the very first character.
 * 	- \+: Matches a literal plus sign. The backslash is necessary
 * because + is a regex metacharacter (it means "one or more of
 * the previous thing" — a+ matches "a", "aa", "aaa"). Escaping
 * it with \ makes it match a real + character.
 * 	- [1-9]: A character class matching any single digit from
 * 1 to 9. Notice 0 is deliberately excluded: E.164 country codes
 * cannot start with 0. This is why "+0123" fails — the leading
 * zero after the + is invalid. This is also where "+"-only or
 * "+0..." inputs get rejected.
 * 	- \d{1,14}: \d matches any digit (0–9). {1,14} is a quantifier
 * meaning "between 1 and 14 of these." So this matches 1 to 14
 * more digits after the initial country-code digit.
 * 	- $: Anchors the match to the end of the string. Without it,
 * "+254712345678 extra stuff" would match the prefix and be accepted.
 */

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
	.union([
		z.literal(""),
		z
			.string()
			.trim()
			.regex(
				/^\+[1-9]\d{1,14}$/,
				"Enter a valid phone number including the country code",
			),
	])
	.optional();

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
