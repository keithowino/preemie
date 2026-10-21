import { Ideation } from "../models/index.js";

export const ideationRepository = {
	async create(data) {
		return Ideation.create(data);
	},

	async findByGenerationId(generationId) {
		return Ideation.findOne({ generationId }).lean();
	},

	async findGenerations() {
		return Ideation.find().lean();
	},
};
