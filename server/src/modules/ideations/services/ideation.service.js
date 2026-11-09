import { randomUUID } from "node:crypto";

function withoutOwner(record) {
	if (!record) {
		return record;
	}

	const document =
		typeof record.toObject === "function" ? record.toObject() : record;

	const { owner, ...publicRecord } = document;

	return publicRecord;
}

export function createIdeationService({ provider, repository }) {
	if (typeof provider?.generateIdeation !== "function") {
		throw new TypeError("A compatible ideation provider is required.");
	}

	if (
		typeof repository?.create !== "function" ||
		typeof repository?.findByGenerationId !== "function" ||
		typeof repository?.findGenerations !== "function" ||
		typeof repository?.deleteByGenerationId !== "function"
	) {
		throw new TypeError("A compatible ideation repository is required.");
	}

	return {
		async create(input, ownerId) {
			const generation = await provider.generateIdeation(input);

			const record = await repository.create(
				{
					generationId: randomUUID(),

					input: {
						materials: input.materials,
						constraints: input.constraints ?? {},
					},

					concepts: generation.concepts,
				},
				ownerId,
			);

			return withoutOwner(record);
		},

		async getByGenerationId(generationId, ownerId) {
			const record = await repository.findByGenerationId(
				generationId,
				ownerId,
			);

			return withoutOwner(record);
		},

		async list(ownerId, { page, limit }) {
			const result = await repository.findGenerations(ownerId, {
				page,
				limit,
			});

			const totalPages = Math.ceil(result.total / limit);

			return {
				items: result.items.map(withoutOwner),

				pagination: {
					page,
					limit,
					total: result.total,
					totalPages,
					hasNextPage: page < totalPages,
					hasPreviousPage: page > 1,
				},
			};
		},

		async deleteByGenerationId(generationId, ownerId) {
			return repository.deleteByGenerationId(generationId, ownerId);
		},
	};
}
