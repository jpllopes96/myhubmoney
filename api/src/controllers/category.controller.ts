import { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";

export async function listCategories(req: Request, res: Response) {
  const userId = (req as any).userId;
  const { type } = req.query;

  const where: any = { userId };
  if (type) {
    where.type = type;
  }

  const categories = await prisma.category.findMany({
    where,
    orderBy: { name: "asc" },
  });

  return res.status(200).json(categories);
}

export async function createCategory(req: Request, res: Response) {
  const userId = (req as any).userId;
  const { name, type, icon, color } = req.body;

  if (!name || !type) {
    return res.status(400).json({ error: "Nome e tipo são obrigatórios" });
  }

  const category = await prisma.category.create({
    data: {
      userId,
      name,
      type,
      icon: icon || "circle",
      color: color || "#6366f1",
    },
  });

  return res.status(201).json(category);
}

export async function updateCategory(req: Request, res: Response) {
  const { id } = req.params;
  const userId = (req as any).userId;
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
      ...(name && { name }),
      ...(type && { type }),
      ...(icon && { icon }),
      ...(color && { color }),
    },
  });

  return res.status(200).json(updated);
}

export async function deleteCategory(req: Request, res: Response) {
  const { id } = req.params;
  const userId = (req as any).userId;

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
  } catch (error) {
    return res
      .status(400)
      .json({
        error:
          "Erro ao excluir categoria. Verifique se não há transações vinculadas.",
      });
  }
}
