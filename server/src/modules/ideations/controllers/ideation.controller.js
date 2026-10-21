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
} from "../validators/index.js";

/**
 * Accepts an injected service, so we can test the controller
 * without calling Gemini or connecting to MongoDB.
 */
export function createIdeationController({ ideationService }) {
	if (
		typeof ideationService?.create !== "function" ||
		typeof ideationService?.getByGenerationId !== "function"
	) {
		throw new TypeError("A compatible ideation service is required.");
	}

	const create = asyncHandler(async (req, res) => {
		const { body } = validateRequest(
			{ body: createIdeationBodySchema },
			req,
		);

		const generation = await ideationService.create(body);

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
		/**
		 * listIdeationBodySchema validation is yet to be configured
		 */

		// const { query } = validateRequest(
		// 	{
		// 		query: listIdeationBodySchema,
		// 	},
		// 	req,
		// );

		const generations = await ideationService.list(req.query);

		return success(res, generations, "Ideations retrieved successfully.");
	});

	return {
		create,
		getByGenerationId,
		list,
	};
}
