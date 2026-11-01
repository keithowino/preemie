const MAX_MATERIALS = 30;

const MAX_LENGTHS = {
	materialName: 500,
	unit: 30,
	condition: 200,
	goal: 500,
	environment: 300,
	notes: 1500,
};

const VALID_SKILL_LEVELS = ["BEGINNER", "INTERMEDIATE", "ADVANCED"];

export function validateIdeationInput(input) {
	const errors = {
		materials: [],
		constraints: {},
	};

	const materials = Array.isArray(input?.materials) ? input.materials : [];

	if (materials.length === 0) {
		errors.materials.push({
			index: null,
			fields: {
				general: "Add at least one material.",
			},
		});
	}

	if (materials.length > MAX_MATERIALS) {
		errors.materials.push({
			index: null,
			fields: {
				general: `You can add at most ${MAX_MATERIALS} materials.`,
			},
		});
	}

	materials.forEach((material, index) => {
		const fields = {};

		const name = material?.name ?? "";
		const quantity = material?.quantity;
		const unit = material?.unit ?? "";
		const condition = material?.condition ?? "";

		if (typeof name !== "string" || !name.trim()) {
			fields.name = "Enter a material name.";
		} else if (name.trim().length > MAX_LENGTHS.materialName) {
			fields.name = `Use at most ${MAX_LENGTHS.materialName} characters.`;
		}

		// Quantity is optional, but a supplied value must be positive.
		if (quantity !== "" && quantity !== null && quantity !== undefined) {
			if (
				typeof quantity !== "number" ||
				!Number.isFinite(quantity) ||
				quantity <= 0
			) {
				fields.quantity = "Enter a number greater than zero.";
			}
		}

		if (typeof unit !== "string") {
			fields.unit = "Enter a valid unit.";
		} else if (unit.trim().length > MAX_LENGTHS.unit) {
			fields.unit = `Use at most ${MAX_LENGTHS.unit} characters.`;
		}

		if (typeof condition !== "string") {
			fields.condition = "Enter a valid condition.";
		} else if (condition.trim().length > MAX_LENGTHS.condition) {
			fields.condition = `Use at most ${MAX_LENGTHS.condition} characters.`;
		}

		if (Object.keys(fields).length > 0) {
			errors.materials.push({ index, fields });
		}
	});

	const constraints = input?.constraints ?? {};

	if (
		typeof constraints.goal !== "string" ||
		constraints.goal.length > MAX_LENGTHS.goal
	) {
		errors.constraints.goal = `Goal must be at most ${MAX_LENGTHS.goal} characters.`;
	}

	if (
		typeof constraints.environment !== "string" ||
		constraints.environment.length > MAX_LENGTHS.environment
	) {
		errors.constraints.environment = `Environment must be at most ${MAX_LENGTHS.environment} characters.`;
	}

	if (
		constraints.notes !== undefined &&
		(typeof constraints.notes !== "string" ||
			constraints.notes.length > MAX_LENGTHS.notes)
	) {
		errors.constraints.notes = `Notes must be at most ${MAX_LENGTHS.notes} characters.`;
	}

	if (
		constraints.skillLevel !== undefined &&
		!VALID_SKILL_LEVELS.includes(constraints.skillLevel)
	) {
		errors.constraints.skillLevel = "Choose a valid skill level.";
	}

	return {
		isValid:
			errors.materials.length === 0 &&
			Object.keys(errors.constraints).length === 0,
		errors,
	};
}
