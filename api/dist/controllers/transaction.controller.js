import { prisma } from "../lib/prisma.js";
import { TransactionType } from "@prisma/client";
/* =======================
   Helpers
======================= */
function isTransactionType(value) {
    return value === "INCOME" || value === "EXPENSE";
}
/* =======================
   List
======================= */
export async function listTransactions(req, res) {
    const userId = req.userId;
    const { type } = req.query;
    const where = { userId };
    if (typeof type === "string" && isTransactionType(type)) {
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
/* =======================
   Summary
======================= */
export async function getTransactionsSummary(req, res) {
    const userId = req.userId;
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    const transactions = await prisma.transaction.findMany({
        where: {
            userId,
            date: { gte: startOfMonth },
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
    for (const t of transactions) {
        const amount = typeof t.amount === "number" ? t.amount : Number(t.amount.toString());
        if (t.type === TransactionType.income) {
            summary.totalIncome += amount;
        }
        else {
            summary.totalExpense += amount;
        }
    }
    summary.balance = summary.totalIncome - summary.totalExpense;
    return res.status(200).json(summary);
}
/* =======================
   Create
======================= */
export async function createTransaction(req, res) {
    const userId = req.userId;
    const { name, type, amount, date, description, categoryId, employeeId, isRecurring, } = req.body;
    if (typeof name !== "string" ||
        !isTransactionType(type) ||
        typeof amount !== "number" ||
        !date) {
        return res.status(400).json({
            error: "Dados inválidos para criação da transação",
        });
    }
    const transaction = await prisma.transaction.create({
        data: {
            userId,
            name,
            type,
            amount,
            date: new Date(date),
            description: typeof description === "string" ? description : null,
            categoryId: typeof categoryId === "string" ? categoryId : null,
            employeeId: typeof employeeId === "string" ? employeeId : null,
            isRecurring: Boolean(isRecurring),
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
/* =======================
   Update
======================= */
export async function updateTransaction(req, res) {
    const userId = req.userId;
    const idParam = req.params.id;
    if (typeof idParam !== "string") {
        return res.status(400).json({ error: "ID inválido" });
    }
    const id = idParam;
    const { name, type, amount, date, description, categoryId, employeeId, isRecurring, } = req.body;
    const transaction = await prisma.transaction.findFirst({
        where: { id, userId },
    });
    if (!transaction) {
        return res.status(404).json({ error: "Transação não encontrada" });
    }
    const updated = await prisma.transaction.update({
        where: { id },
        data: {
            ...(typeof name === "string" && { name }),
            ...(isTransactionType(type) && { type }),
            ...(typeof amount === "number" && { amount }),
            ...(date && { date: new Date(date) }),
            ...(description !== undefined && {
                description: typeof description === "string" ? description : null,
            }),
            ...(categoryId !== undefined && {
                categoryId: typeof categoryId === "string" ? categoryId : null,
            }),
            ...(employeeId !== undefined && {
                employeeId: typeof employeeId === "string" ? employeeId : null,
            }),
            ...(isRecurring !== undefined && { isRecurring: Boolean(isRecurring) }),
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
/* =======================
   Delete
======================= */
export async function deleteTransaction(req, res) {
    const userId = req.userId;
    const idParam = req.params.id;
    if (typeof idParam !== "string") {
        return res.status(400).json({ error: "ID inválido" });
    }
    const id = idParam;
    const transaction = await prisma.transaction.findFirst({
        where: { id, userId },
    });
    if (!transaction) {
        return res.status(404).json({ error: "Transação não encontrada" });
    }
    await prisma.transaction.delete({
        where: { id },
    });
    return res.status(200).json({
        message: "Transação excluída com sucesso",
    });
}
