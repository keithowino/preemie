import { Router } from "express";

import { createIdeationController } from "../controllers/index.js";
import { ideationRepository } from "../repositories/index.js";
import { createIdeationService } from "../services/index.js";
import { geminiProvider } from "../providers/index.js";

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

router.post("/", controller.create);

router.get("/", controller.list);

router.get("/:generationId", controller.getByGenerationId);

export default router;
