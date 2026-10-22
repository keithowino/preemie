import { Router } from "express";

import { createIdeationController } from "../controllers/index.js";
import { ideationRepository } from "../repositories/index.js";
import { createIdeationService } from "../services/index.js";
import { geminiProvider } from "../providers/index.js";
import {
	generationRateLimiter,
	retrievalRateLimiter,
} from "../../../app/index.js";

/**
 * The route ordering is also intentional: POST / handles creation,
 * while GET /:generationId handles retrieval. Both are relative
 * to the ideation router.
 */

const router = Router();

const ideationService = createIdeationService({
	provider: geminiProvider,
	repository: ideationRepository,
});

const controller = createIdeationController({ ideationService });

router.post("/", generationRateLimiter, controller.create);

router.get("/", retrievalRateLimiter, controller.list);

router.get(
	"/:generationId",
	retrievalRateLimiter,
	controller.getByGenerationId,
);

export default router;
