import mongoose from "mongoose";

const { Schema, model, models } = mongoose;

const materialSchema = new Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true,
			maxlength: 500,
		},

		quantity: {
			type: Number,
			min: 0,
		},

		unit: {
			type: String,
			trim: true,
			maxlength: 30,
		},

		condition: {
			type: String,
			trim: true,
			maxlength: 200,
		},

		specifications: {
			type: Map,
			of: String,
		},
	},
	{ _id: false, strict: true },
);

const constraintSchema = new Schema(
	{
		goal: {
			type: String,
			trim: true,
			maxlength: 500,
		},

		environment: {
			type: String,
			trim: true,
			maxlength: 300,
		},

		skillLevel: {
			type: String,
			enum: ["BEGINNER", "INTERMEDIATE", "ADVANCED"],
		},

		notes: {
			type: String,
			trim: true,
			maxlength: 1500,
		},
	},
	{ _id: false, strict: true },
);

const feasibilitySchema = new Schema(
	{
		level: {
			type: String,
			enum: ["LOW", "MEDIUM", "HIGH"],
			required: true,
		},

		rationale: {
			type: String,
			required: true,
			trim: true,
		},
	},
	{ _id: false, strict: true },
);

const billOfMaterialsItemSchema = new Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true,
		},

		quantity: {
			type: Number,
			min: 0,
		},

		unit: {
			type: String,
			trim: true,
			maxlength: 30,
		},

		source: {
			type: String,
			enum: ["AVAILABLE", "ADDITIONAL"],
			required: true,
		},

		specifications: {
			type: Map,
			of: String,
		},

		purpose: {
			type: String,
			required: true,
			trim: true,
		},
	},
	{ _id: false, strict: true },
);

const buildStepSchema = new Schema(
	{
		order: {
			type: Number,
			required: true,
			min: 1,
		},

		title: {
			type: String,
			required: true,
			trim: true,
		},

		description: {
			type: String,
			required: true,
			trim: true,
		},

		checkpoint: {
			type: String,
			trim: true,
			maxlength: 500,
		},
	},
	{ _id: false, strict: true },
);

const buildPlanSchema = new Schema(
	{
		tools: {
			type: [String],
			default: [],
		},

		steps: {
			type: [buildStepSchema],
			required: true,
			validate: {
				validator: (steps) => steps.length >= 1 && steps.length <= 20,
				message: "A build plan must contain between 1 and 20 steps.",
			},
		},
	},
	{ _id: false, strict: true },
);

const conceptSchema = new Schema(
	{
		id: {
			type: String,
			required: true,
		},

		type: {
			type: String,
			enum: ["REPURPOSE", "IMPROVEMENT", "NOVEL_INVENTION"],
			required: true,
		},

		title: {
			type: String,
			required: true,
			trim: true,
		},

		summary: {
			type: String,
			required: true,
			trim: true,
		},

		rationale: {
			type: String,
			required: true,
			trim: true,
		},

		feasibility: {
			type: feasibilitySchema,
			required: true,
		},

		complexity: {
			type: String,
			enum: ["LOW", "MEDIUM", "HIGH"],
			required: true,
		},

		billOfMaterials: {
			type: [billOfMaterialsItemSchema],
			required: true,
			validate: {
				validator: (items) => items.length >= 1 && items.length <= 40,
				message: "A concept must have between 1 and 40 material items.",
			},
		},

		buildPlan: {
			type: buildPlanSchema,
			required: true,
		},

		assumptions: {
			type: [String],
			default: [],
		},

		safetyWarnings: {
			type: [String],
			default: [],
		},

		tests: {
			type: [String],
			default: [],
		},
	},
	{ _id: false, strict: true },
);

const ideationSchema = new Schema(
	{
		generationId: {
			type: String,
			required: true,
			immutable: true,
		},

		input: {
			materials: {
				type: [materialSchema],
				required: true,
				validate: {
					validator: (items) =>
						items.length >= 1 && items.length <= 30,
					message:
						"An ideation must contain between 1 and 30 materials.",
				},
			},

			constraints: {
				type: constraintSchema,
				default: () => ({}),
			},
		},

		concepts: {
			type: [conceptSchema],
			required: true,
			validate: {
				validator: (concepts) =>
					concepts.length === 3 &&
					new Set(concepts.map((concept) => concept.type)).size === 3,
				message:
					"An ideation must contain exactly three distinct concept types.",
			},
		},
	},
	{
		timestamps: true,
		strict: true,
		versionKey: false,
	},
);

ideationSchema.index({ generationId: 1 }, { unique: true });

const Ideation = models.Ideation || model("Ideation", ideationSchema);

export default Ideation;
