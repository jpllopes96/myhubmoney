import * as XLSX from 'xlsx';
import { Transaction } from '@/hooks/useTransactions';
import { format, parseISO } from 'date-fns';

const prepareTransactionData = (transactions: Transaction[]) => {
  return transactions.map((t) => ({
    'Tipo': t.type === 'income' ? 'Entrada' : 'Despesa',
    'Nome': t.name,
    'Categoria': t.category?.name || 'Sem categoria',
    'Valor (R$)': Number(t.amount).toFixed(2).replace('.', ','),
    'Data': format(parseISO(t.date), 'dd/MM/yyyy'),
    'Descrição': t.description || '',
    'Recorrente': t.is_recurring ? 'Sim' : 'Não',
    'Criado em': format(parseISO(t.created_at), 'dd/MM/yyyy HH:mm'),
  }));
};

export const exportTransactionsToExcel = (
  transactions: Transaction[],
  type: 'income' | 'expense'
) => {
  const typeName = type === 'income' ? 'Entradas' : 'Despesas';
  
  // Prepare data for Excel (without 'Tipo' column for single type)
  const data = transactions.map((t) => ({
    'Nome': t.name,
    'Categoria': t.category?.name || 'Sem categoria',
    'Valor (R$)': Number(t.amount).toFixed(2).replace('.', ','),
    'Data': format(parseISO(t.date), 'dd/MM/yyyy'),
    'Descrição': t.description || '',
    'Recorrente': t.is_recurring ? 'Sim' : 'Não',
    'Criado em': format(parseISO(t.created_at), 'dd/MM/yyyy HH:mm'),
  }));

  // Create worksheet
  const worksheet = XLSX.utils.json_to_sheet(data);

  // Set column widths
  worksheet['!cols'] = [
    { wch: 30 }, // Nome
    { wch: 20 }, // Categoria
    { wch: 15 }, // Valor
    { wch: 12 }, // Data
    { wch: 40 }, // Descrição
    { wch: 12 }, // Recorrente
    { wch: 18 }, // Criado em
  ];

  // Create workbook
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, typeName);

  // Generate filename with current date
  const fileName = `${typeName}_${format(new Date(), 'dd-MM-yyyy')}.xlsx`;

  // Download file
  XLSX.writeFile(workbook, fileName);
};

export const exportAllTransactionsToExcel = (transactions: Transaction[]) => {
  const data = prepareTransactionData(transactions);

  // Create worksheet
  const worksheet = XLSX.utils.json_to_sheet(data);

  // Set column widths
  worksheet['!cols'] = [
    { wch: 10 }, // Tipo
    { wch: 30 }, // Nome
    { wch: 20 }, // Categoria
    { wch: 15 }, // Valor
    { wch: 12 }, // Data
    { wch: 40 }, // Descrição
    { wch: 12 }, // Recorrente
    { wch: 18 }, // Criado em
  ];

  // Create workbook
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Transações');

  // Generate filename with current date
  const fileName = `Transacoes_${format(new Date(), 'dd-MM-yyyy')}.xlsx`;

  // Download file
  XLSX.writeFile(workbook, fileName);
};
