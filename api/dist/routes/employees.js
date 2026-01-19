import { Router } from "express";
import { listEmployees, createEmployee, updateEmployee, deleteEmployee } from "../controllers/employee.controller.js";
import { authMiddleware } from "../middleware/auth.js";
const router = Router();
router.get("/", authMiddleware, listEmployees);
router.post("/", authMiddleware, createEmployee);
router.put("/:id", authMiddleware, updateEmployee);
router.delete("/:id", authMiddleware, deleteEmployee);
export default router;
