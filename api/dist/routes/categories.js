import { Router } from "express";
import { listCategories, createCategory, updateCategory, deleteCategory } from "../controllers/category.controller.js";
import { authMiddleware } from "../middleware/auth.js";
const router = Router();
router.get("/", authMiddleware, listCategories);
router.post("/", authMiddleware, createCategory);
router.put("/:id", authMiddleware, updateCategory);
router.delete("/:id", authMiddleware, deleteCategory);
export default router;
