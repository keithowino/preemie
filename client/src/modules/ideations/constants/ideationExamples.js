export const SKILL_LEVEL_OPTIONS = [
	{ value: "BEGINNER", label: "Beginner" },
	{ value: "INTERMEDIATE", label: "Intermediate" },
	{ value: "ADVANCED", label: "Advanced" },
];

export const MATERIAL_UNIT_SUGGESTIONS = [
	"pieces",
	"meters",
	"centimeters",
	"grams",
	"kilograms",
	"milliliters",
	"liters",
	"sheets",
	"lengths",
	"other",
];

export const IDEATION_EXAMPLES = [
	{
		id: "household",
		label: "Household reuse",
		description: "Turn everyday discarded items into something useful.",
		materials: [
			{
				name: "Plastic bottles",
				quantity: 5,
				unit: "pieces",
				condition: "Clean and intact",
			},
			{
				name: "Cardboard boxes",
				quantity: 2,
				unit: "pieces",
				condition: "Dry and reusable",
			},
		],
		constraints: {
			goal: "Create useful household items from available materials",
			environment: "Small home workspace",
			skillLevel: "BEGINNER",
			notes: "Prefer simple hand tools and low-cost additional materials.",
		},
	},
	{
		id: "garden",
		label: "Small-space gardening",
		description:
			"Explore practical ways to reuse materials for growing plants.",
		materials: [
			{
				name: "Plastic bottles",
				quantity: 6,
				unit: "pieces",
				condition: "Clean and intact",
			},
			{
				name: "Twine",
				quantity: 3,
				unit: "meters",
				condition: "Strong and usable",
			},
		],
		constraints: {
			goal: "Create a simple growing system for a small space",
			environment: "Balcony or small outdoor area",
			skillLevel: "BEGINNER",
			notes: "Prefer designs that are easy to maintain and drain water safely.",
		},
	},
	{
		id: "workshop",
		label: "Workshop project",
		description: "Find a useful project for leftover building materials.",
		materials: [
			{
				name: "Scrap wood",
				quantity: 4,
				unit: "pieces",
				condition: "Dry and structurally sound",
			},
			{
				name: "Wood screws",
				quantity: 12,
				unit: "pieces",
				condition: "Usable and not badly corroded",
			},
		],
		constraints: {
			goal: "Build a practical organizer for tools or workshop supplies",
			environment: "Small home workshop",
			skillLevel: "INTERMEDIATE",
			notes: "Use basic hand tools where possible and prioritize stability.",
		},
	},
];
