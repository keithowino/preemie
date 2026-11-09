import {
	AppError,
	asyncHandler,
	ErrorCodes,
	HTTP_STATUS,
	success,
	validateRequest,
} from "../../../app/index.js";

import {
	createIdeationBodySchema,
	generationIdParamSchema,
	listIdeationsQuerySchema,
} from "../validators/index.js";

/**
 * Accepts an injected service, so we can test the controller
 * without calling Gemini or connecting to MongoDB.
 */
export function createIdeationController({ ideationService }) {
	if (
		typeof ideationService?.create !== "function" ||
		typeof ideationService?.getByGenerationId !== "function" ||
		typeof ideationService?.list !== "function" ||
		typeof ideationService?.deleteByGenerationId !== "function"
	) {
		throw new TypeError("A compatible ideation service is required.");
	}

	const create = asyncHandler(async (req, res) => {
		const { body } = validateRequest(
			{ body: createIdeationBodySchema },
			req,
		);

		const generation = await ideationService.create(body, req.user._id);

		return success(
			res,
			generation,
			"Ideation generated successfully.",
			HTTP_STATUS.CREATED,
		);
	});

	const getByGenerationId = asyncHandler(async (req, res) => {
		const { params } = validateRequest(
			{ params: generationIdParamSchema },
			req,
		);

		const generation = await ideationService.getByGenerationId(
			params.generationId,
			req.user._id,
		);

		if (!generation) {
			throw new AppError(
				"Ideation generation not found.",
				HTTP_STATUS.NOT_FOUND,
				ErrorCodes.NOT_FOUND,
			);
		}

		return success(res, generation, "Ideation retrieved successfully.");
	});

	const list = asyncHandler(async (req, res) => {
		const { query } = validateRequest(
			{ query: listIdeationsQuerySchema },
			req,
		);

		const result = await ideationService.list(req.user._id, query);

		return success(res, result, "Ideations retrieved successfully.");
	});

	const remove = asyncHandler(async (req, res) => {
		const { params } = validateRequest(
			{ params: generationIdParamSchema },
			req,
		);

		const deleted = await ideationService.deleteByGenerationId(
			params.generationId,
			req.user._id,
		);

		if (!deleted) {
			throw new AppError(
				"Ideation generation not found.",
				HTTP_STATUS.NOT_FOUND,
				ErrorCodes.NOT_FOUND,
			);
		}

		return success(res, null, "Ideation deleted successfully.");
	});

	return {
		create,
		getByGenerationId,
		list,
		remove,
	};
}
