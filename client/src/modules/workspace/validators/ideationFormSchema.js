import * as z from "zod";

const MAX_MATERIALS = 30;

export const materialSchema = z.object({
	name: z
		.string()
		.trim()
		.min(1, "Enter a material name.")
		.max(500, "Use at most 500 characters."),

	/**
	 * Stored as a string in the form; coerced to a number on submit.
	 * Empty string means "not specified" and is valid.
	 */
	quantity: z
		.string()
		.refine(
			(value) =>
				value === "" ||
				(!Number.isNaN(Number(value)) && Number(value) > 0),
			{ message: "Enter a number greater than zero." },
		),

	unit: z.string().trim().max(30, "Use at most 30 characters."),

	condition: z.string().trim().max(200, "Use at most 200 characters."),
});

export const formSchema = z.object({
	materials: z
		.array(materialSchema)
		.min(1, "Add at least one material.")
		.max(MAX_MATERIALS, `You can add at most ${MAX_MATERIALS} materials.`),

	constraints: z.object({
		goal: z
			.string()
			.trim()
			.max(500, "Use at most 500 characters.")
			.optional(),
		environment: z
			.string()
			.trim()
			.max(300, "Use at most 300 characters.")
			.optional(),
		skillLevel: z
			.enum(
				["BEGINNER", "INTERMEDIATE", "ADVANCED", ""],
				"Choose a valid skill level.",
			)
			.optional(),
		notes: z
			.string()
			.trim()
			.max(1500, "Use at most 1500 characters.")
			.optional(),
	}),
});
