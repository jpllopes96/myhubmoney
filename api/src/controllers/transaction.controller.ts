import { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";

export async function listTransactions(req: Request, res: Response) {
  const userId = (req as any).userId;
  const { type } = req.query;

  let where: any = { userId };
  if (type) {
    where.type = type;
  }

  const transactions = await prisma.transaction.findMany({
    where,
    include: {
      category: {
        select: {
          id: true,
          name: true,
          color: true,
        },
      },
    },
    orderBy: { date: "desc" },
  });

  return res.status(200).json(transactions);
}

export async function getTransactionsSummary(req: Request, res: Response) {
  const userId = (req as any).userId;

  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const transactions = await prisma.transaction.findMany({
    where: {
      userId,
      date: {
        gte: startOfMonth,
      },
    },
    select: {
      type: true,
      amount: true,
    },
  });

  const summary = {
    totalIncome: 0,
    totalExpense: 0,
    balance: 0,
  };

  transactions.forEach((t) => {
    const amount = typeof t.amount === "number" ? t.amount : parseFloat(t.amount.toString());
    if (t.type === "income") {
      summary.totalIncome += amount;
    } else {
      summary.totalExpense += amount;
    }
  });

  summary.balance = summary.totalIncome - summary.totalExpense;

  return res.status(200).json(summary);
}

export async function createTransaction(req: Request, res: Response) {
  const userId = (req as any).userId;
  const { name, type, amount, date, description, categoryId, employeeId, isRecurring } = req.body;

  if (!name || !type || !amount || !date) {
    return res
      .status(400)
      .json({ error: "Nome, tipo, valor e data são obrigatórios" });
  }

  const transaction = await prisma.transaction.create({
    data: {
      userId,
      name,
      type,
      amount,
      date: new Date(date),
      description,
      categoryId: categoryId || null,
      employeeId: employeeId || null,
      isRecurring: isRecurring || false,
    },
    include: {
      category: {
        select: {
          id: true,
          name: true,
          color: true,
        },
      },
    },
  });

  return res.status(201).json(transaction);
}

export async function updateTransaction(req: Request, res: Response) {
  const { id } = req.params;
  const userId = (req as any).userId;
  const { name, type, amount, date, description, categoryId, employeeId, isRecurring } = req.body;

  const transaction = await prisma.transaction.findFirst({
    where: { id, userId },
  });

  if (!transaction) {
    return res.status(404).json({ error: "Transação não encontrada" });
  }

  const updated = await prisma.transaction.update({
    where: { id },
    data: {
      ...(name && { name }),
      ...(type && { type }),
      ...(amount && { amount }),
      ...(date && { date: new Date(date) }),
      ...(description !== undefined && { description }),
      ...(categoryId !== undefined && { categoryId: categoryId || null }),
      ...(employeeId !== undefined && { employeeId: employeeId || null }),
      ...(isRecurring !== undefined && { isRecurring }),
    },
    include: {
      category: {
        select: {
          id: true,
          name: true,
          color: true,
        },
      },
    },
  });

  return res.status(200).json(updated);
}

export async function deleteTransaction(req: Request, res: Response) {
  const { id } = req.params;
  const userId = (req as any).userId;

  const transaction = await prisma.transaction.findFirst({
    where: { id, userId },
  });

  if (!transaction) {
    return res.status(404).json({ error: "Transação não encontrada" });
  }

  await prisma.transaction.delete({
    where: { id },
  });

  return res.status(200).json({ message: "Transação excluída com sucesso" });
}
