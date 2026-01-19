import { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";

export async function listEmployees(req: Request, res: Response) {
  const userId = (req as any).userId;

  const employees = await prisma.employee.findMany({
    where: { userId },
    orderBy: { name: "asc" },
  });

  return res.status(200).json(employees);
}

export async function createEmployee(req: Request, res: Response) {
  const userId = (req as any).userId;
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Nome é obrigatório" });
  }

  const employee = await prisma.employee.create({
    data: {
      userId,
      name,
    },
  });

  return res.status(201).json(employee);
}

export async function updateEmployee(req: Request, res: Response) {
  const { id } = req.params;
  const userId = (req as any).userId;
  const { name } = req.body;

  const employee = await prisma.employee.findFirst({
    where: { id, userId },
  });

  if (!employee) {
    return res.status(404).json({ error: "Pessoa não encontrada" });
  }

  const updated = await prisma.employee.update({
    where: { id },
    data: {
      ...(name && { name }),
    },
  });

  return res.status(200).json(updated);
}

export async function deleteEmployee(req: Request, res: Response) {
  const { id } = req.params;
  const userId = (req as any).userId;

  const employee = await prisma.employee.findFirst({
    where: { id, userId },
  });

  if (!employee) {
    return res.status(404).json({ error: "Pessoa não encontrada" });
  }

  await prisma.employee.delete({
    where: { id },
  });

  return res.status(200).json({ message: "Pessoa excluída com sucesso" });
}
