import { Router } from "express";
import { login, signup, changePassword, getCurrentUser } from "../controllers/auth.controller.js";
import { authMiddleware } from "../middleware/auth.js";
const router = Router();
router.post("/login", login);
router.post("/signup", signup);
router.post("/change-password", authMiddleware, changePassword);
router.get("/me", authMiddleware, getCurrentUser);
export default router;
