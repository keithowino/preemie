import { randomUUID } from "node:crypto";

export function createIdeationService({ provider, repository }) {
	if (typeof provider?.generateIdeation !== "function") {
		throw new TypeError("A compatible ideation provider is required.");
	}

	if (
		typeof repository?.create !== "function" ||
		typeof repository?.findByGenerationId !== "function"
	) {
		throw new TypeError("A compatible ideation repository is required.");
	}

	return {
		async create(input) {
			const generation = await provider.generateIdeation(input);

			const record = await repository.create({
				generationId: randomUUID(),
				input: {
					materials: input.materials,
					constraints: input.constraints ?? {},
				},
				concepts: generation.concepts,
			});

			return record;
		},

		async getByGenerationId(generationId) {
			return repository.findByGenerationId(generationId);
		},

		async list(payload) {
			return repository.findGenerations(payload);
		},
	};
}
