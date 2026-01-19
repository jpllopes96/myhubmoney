import { Router } from "express";
import { createUser } from "../controllers/user.controller.js";
import { authMiddleware } from "../middleware/auth.js";

const router = Router();

router.post("/users", authMiddleware, createUser);

export default router;
