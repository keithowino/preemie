import { Router } from "express";
import { authController } from "../controllers/index.js";
import authenticate from "../middleware/authenticate.js";

const router = Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/refresh", authController.refresh);
router.post("/logout", authController.logout);
// router.post("/forgot-password", authController.forgotPassword);

router.use(authenticate);
router.get("/me", authController.me);
router.get("/sessions", authController.sessions);
router.delete("/sessions/:sessionId", authController.revokeSession);
router.delete("/sessions", authController.revokeOtherSessions);

export default router;
