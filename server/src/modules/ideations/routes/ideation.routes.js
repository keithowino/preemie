import { Router } from "express";

import authenticate from "../../identity/middleware/authenticate.js";

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

/**
 * All routes in this router require authentication.
 *
 * Authentication is applied before route-specific rate limiting
 * and controller execution.
 */

const router = Router();

const ideationService = createIdeationService({
	provider: geminiProvider,
	repository: ideationRepository,
});

const controller = createIdeationController({
	ideationService,
});

router.use(authenticate);

router.post("/", generationRateLimiter, controller.create);

router.get("/", retrievalRateLimiter, controller.list);

router.get(
	"/:generationId",
	retrievalRateLimiter,
	controller.getByGenerationId,
);

router.delete("/:generationId", retrievalRateLimiter, controller.remove);

export default router;
