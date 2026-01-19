import { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
import { CategoryType } from "@prisma/client";

/* =======================
   Helpers
======================= */
function isCategoryType(value: unknown): value is CategoryType {
  return value === "INCOME" || value === "EXPENSE";
}

/* =======================
   List
======================= */
export async function listCategories(req: Request, res: Response) {
  const userId = req.userId;
  const { type } = req.query;

  const where: {
    userId: string;
    type?: CategoryType;
  } = { userId };

  if (typeof type === "string" && isCategoryType(type)) {
    where.type = type;
  }

  const categories = await prisma.category.findMany({
    where,
    orderBy: { name: "asc" },
  });

  return res.status(200).json(categories);
}

/* =======================
   Create
======================= */
export async function createCategory(req: Request, res: Response) {
  const userId = req.userId;
  const { name, type, icon, color } = req.body;

  if (!name || !isCategoryType(type)) {
    return res.status(400).json({
      error: "Nome ou tipo inválido",
    });
  }

  const category = await prisma.category.create({
    data: {
      userId,
      name,
      type,
      icon: icon ?? "circle",
      color: color ?? "#6366f1",
    },
  });

  return res.status(201).json(category);
}

/* =======================
   Update
======================= */
export async function updateCategory(req: Request, res: Response) {
  const userId = req.userId;

  const idParam = req.params.id;
  if (typeof idParam !== "string") {
    return res.status(400).json({ error: "ID inválido" });
  }
  const id = idParam;

  const { name, type, icon, color } = req.body;

  const category = await prisma.category.findFirst({
    where: { id, userId },
  });

  if (!category) {
    return res.status(404).json({ error: "Categoria não encontrada" });
  }

  const updated = await prisma.category.update({
    where: { id },
    data: {
      ...(typeof name === "string" && { name }),
      ...(isCategoryType(type) && { type }),
      ...(typeof icon === "string" && { icon }),
      ...(typeof color === "string" && { color }),
    },
  });

  return res.status(200).json(updated);
}

/* =======================
   Delete
======================= */
export async function deleteCategory(req: Request, res: Response) {
  const userId = req.userId;

  const idParam = req.params.id;
  if (typeof idParam !== "string") {
    return res.status(400).json({ error: "ID inválido" });
  }
  const id = idParam;

  const category = await prisma.category.findFirst({
    where: { id, userId },
  });

  if (!category) {
    return res.status(404).json({ error: "Categoria não encontrada" });
  }

  try {
    await prisma.category.delete({
      where: { id },
    });

    return res.status(200).json({ message: "Categoria excluída com sucesso" });
  } catch {
    return res.status(400).json({
      error:
        "Erro ao excluir categoria. Verifique se não há transações vinculadas.",
    });
  }
}
