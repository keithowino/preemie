import { Router } from "express";
import { accountController, authController } from "../controllers/index.js";
import authenticate from "../middleware/authenticate.js";

const router = Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/refresh", authController.refresh);
router.post("/logout", authController.logout);
// router.post("/forgot-password", authController.forgotPassword);

/** Auth */
router.use(authenticate);
// Existing account bootstrap endpoint
router.get("/me", authController.me);

/** Account profile */
// New account endpoints
router.patch("/me", accountController.updateProfile);

/** Account preferences */
router.get("/preferences", accountController.getPreferences);
router.patch("/preferences", accountController.updatePreferences);

/** Manual account presence */
router.get("/presence", accountController.getPresence);
router.patch("/presence", accountController.updatePresence);

/** Session mng. */
router.get("/sessions", authController.sessions);
router.delete("/sessions/:sessionId", authController.revokeSession);
router.delete("/sessions", authController.revokeOtherSessions);

export default router;
