import * as XLSX from "xlsx";
import { Transaction } from "@/hooks/useTransactions";
import { format, parseISO } from "date-fns";

/* =========================
   Helpers
========================= */

const formatDateSafe = (date?: string | null) => {
  if (!date) return "";

  const parsed = parseISO(date);
  return isNaN(parsed.getTime()) ? "" : format(parsed, "dd/MM/yyyy");
};

const formatAmount = (amount: unknown) => {
  const value = Number(amount);
  if (isNaN(value)) return "0,00";
  return value.toFixed(2).replace(".", ",");
};

/* =========================
   Prepare Data
========================= */

const prepareTransactionData = (transactions: Transaction[]) => {
  return transactions.map((t) => ({
    Tipo: t.type === "income" ? "Entrada" : "Despesa",
    Nome: t.name,
    Categoria: t.category?.name ?? "Sem categoria",
    "Valor (R$)": formatAmount(t.amount),
    Data: formatDateSafe(t.date),
    Descrição: t.description ?? "",
  }));
};

/* =========================
   Export single type
========================= */

export const exportTransactionsToExcel = (
  transactions: Transaction[],
  type: "income" | "expense",
) => {
  const typeName = type === "income" ? "Entradas" : "Despesas";

  const data = transactions.map((t) => ({
    Nome: t.name,
    Categoria: t.category?.name ?? "Sem categoria",
    "Valor (R$)": formatAmount(t.amount),
    Data: formatDateSafe(t.date),
    Descrição: t.description ?? "",
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);

  worksheet["!cols"] = [
    { wch: 30 }, // Nome
    { wch: 20 }, // Categoria
    { wch: 15 }, // Valor
    { wch: 12 }, // Data
    { wch: 40 }, // Descrição
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, typeName);

  const fileName = `${typeName}_${format(new Date(), "dd-MM-yyyy")}.xlsx`;

  XLSX.writeFile(workbook, fileName);
};

/* =========================
   Export all
========================= */

export const exportAllTransactionsToExcel = (transactions: Transaction[]) => {
  const data = prepareTransactionData(transactions);

  const worksheet = XLSX.utils.json_to_sheet(data);

  worksheet["!cols"] = [
    { wch: 10 }, // Tipo
    { wch: 30 }, // Nome
    { wch: 20 }, // Categoria
    { wch: 15 }, // Valor
    { wch: 12 }, // Data
    { wch: 40 }, // Descrição
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Transações");

  const fileName = `Transacoes_${format(new Date(), "dd-MM-yyyy")}.xlsx`;

  XLSX.writeFile(workbook, fileName);
};
