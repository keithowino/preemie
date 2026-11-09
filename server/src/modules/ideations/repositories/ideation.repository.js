import { Ideation } from "../models/index.js";

function assertOwnerId(ownerId) {
	if (!ownerId) {
		throw new TypeError("An owner ID is required.");
	}
}

export const ideationRepository = {
	async create(data, ownerId) {
		assertOwnerId(ownerId);

		/**
		 * Notice that owner is assigned after spreading data.
		 * This ensures that even if the supplied data contains
		 * an owner property, the repository's authenticated
		 * owner argument takes precedence.
		 */
		return Ideation.create({
			...data,
			owner: ownerId,
		});
	},

	async findByGenerationId(generationId, ownerId) {
		assertOwnerId(ownerId);

		return Ideation.findOne({
			generationId,
			owner: ownerId,
		}).lean();
	},

	async findGenerations(ownerId, { page, limit }) {
		assertOwnerId(ownerId);

		const skip = (page - 1) * limit;

		const filter = {
			owner: ownerId,
		};

		const [items, total] = await Promise.all([
			Ideation.find(filter)
				.sort({ createdAt: -1 })
				.skip(skip)
				.limit(limit)
				.lean(),

			Ideation.countDocuments(filter),
		]);

		return {
			items,
			total,
		};
	},

	async deleteByGenerationId(generationId, ownerId) {
		assertOwnerId(ownerId);

		const deleted = await Ideation.findOneAndDelete({
			generationId,
			owner: ownerId,
		}).lean();

		return Boolean(deleted);
	},
};
