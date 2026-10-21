import { z } from "zod";

// -----------------------------------------------------------------------------
// Shared primitives
// -----------------------------------------------------------------------------

const nonEmptyText = z.string().trim().min(1).max(500);

const textList = z.array(z.string().trim().min(1).max(1000)).max(20);

// -----------------------------------------------------------------------------
// User input
// -----------------------------------------------------------------------------

export const ideationMaterialSchema = z.object({
	name: nonEmptyText,

	quantity: z.number().positive().optional(),

	unit: z.string().trim().min(1).max(30).optional(),

	condition: z.string().trim().max(200).optional(),

	specifications: z.record(z.string(), z.string().trim().max(200)).optional(),
});

export const createIdeationBodySchema = z
	.object({
		materials: z.array(ideationMaterialSchema).min(1).max(30),

		constraints: z
			.object({
				goal: z.string().trim().max(500).optional(),

				environment: z.string().trim().max(300).optional(),

				skillLevel: z
					.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"])
					.optional(),

				notes: z.string().trim().max(1500).optional(),
			})
			.optional(),
	})
	.strict();

// -----------------------------------------------------------------------------
// Generated concept
// -----------------------------------------------------------------------------

export const conceptTypeSchema = z.enum([
	"REPURPOSE",
	"IMPROVEMENT",
	"NOVEL_INVENTION",
]);

const feasibilitySchema = z.object({
	level: z.enum(["LOW", "MEDIUM", "HIGH"]),
	rationale: nonEmptyText,
});

const billOfMaterialsItemSchema = z.object({
	name: nonEmptyText,

	quantity: z.number().positive().finite().optional(),

	unit: z.string().trim().min(1).max(30).optional(),

	source: z.enum(["AVAILABLE", "ADDITIONAL"]),

	specifications: z.record(z.string(), z.string().trim().max(200)).optional(),

	purpose: nonEmptyText,
});

const buildStepSchema = z.object({
	order: z.number().int().positive(),

	title: nonEmptyText,

	description: z.string().trim().min(1).max(2000),

	checkpoint: z.string().trim().max(500).optional(),
});

export const ideationConceptSchema = z.object({
	id: z.uuid(),

	type: conceptTypeSchema,

	title: nonEmptyText,

	summary: z.string().trim().min(1).max(1000),

	rationale: z.string().trim().min(1).max(2000),

	feasibility: feasibilitySchema,

	complexity: z.enum(["LOW", "MEDIUM", "HIGH"]),

	billOfMaterials: z.array(billOfMaterialsItemSchema).min(1).max(40),

	buildPlan: z.object({
		tools: z.array(z.string().trim().min(1).max(200)).max(20),

		steps: z.array(buildStepSchema).min(1).max(20),
	}),

	/**
	 * Explain the scientific or engineering ideas behind
	 * the concept.
	 */
	scientificPrinciples: z
		.array(z.string().trim().min(1).max(1000))
		.min(1)
		.max(10),

	/**
	 * Record constraints, assumptions, and anything not
	 * yet verified.
	 */
	limitations: z.array(z.string().trim().min(1).max(1000)).min(1).max(20),

	assumptions: textList,

	safetyWarnings: textList.min(1),

	tests: textList,
});

// -----------------------------------------------------------------------------
// Complete generation output
// -----------------------------------------------------------------------------

export const ideationGenerationOutputSchema = z
	.object({
		concepts: z
			.array(ideationConceptSchema)
			.length(3)
			.refine(
				(concepts) =>
					new Set(concepts.map((concept) => concept.type)).size === 3,
				{
					message:
						"Generation must contain one concept of each required type.",
				},
			),
	})
	.strict();

// -----------------------------------------------------------------------------
// Retrieval parameters
// -----------------------------------------------------------------------------

export const generationIdParamSchema = z.object({
	generationId: z.uuid(),
});
