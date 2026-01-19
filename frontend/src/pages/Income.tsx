import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { PageLayout } from '@/components/layout/PageLayout';
import { TransactionItem } from '@/components/ui/transaction-item';
import { TransactionForm } from '@/components/TransactionForm';
import { Button } from '@/components/ui/button';
import { useTransactions, useDeleteTransaction, Transaction } from '@/hooks/useTransactions';
import { Plus, Search, Download } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { exportTransactionsToExcel } from '@/utils/exportToExcel';
import { toast } from 'sonner';

export default function Income() {
  const location = useLocation();
  const [formOpen, setFormOpen] = useState(false);
  const [editTransaction, setEditTransaction] = useState<Transaction | null>(null);
  const [search, setSearch] = useState('');
  
  const { data: transactions, isLoading } = useTransactions('income');
  const deleteTransaction = useDeleteTransaction();

  useEffect(() => {
    if (location.state?.editTransaction) {
      setEditTransaction(location.state.editTransaction);
      setFormOpen(true);
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const filteredTransactions = transactions?.filter(
    (t) =>
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.category?.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleEdit = (transaction: Transaction) => {
    setEditTransaction(transaction);
    setFormOpen(true);
  };

  const handleCloseForm = (open: boolean) => {
    setFormOpen(open);
    if (!open) setEditTransaction(null);
  };

  const totalIncome = transactions?.reduce((sum, t) => sum + Number(t.amount), 0) || 0;
  const formattedTotal = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(totalIncome);

  const handleExport = () => {
    if (!transactions || transactions.length === 0) {
      toast.error('Nenhuma transação para exportar');
      return;
    }
    exportTransactionsToExcel(transactions, 'income');
    toast.success('Arquivo Excel exportado com sucesso!');
  };

  return (
    <PageLayout title="Entradas" subtitle={`Total: ${formattedTotal}`}>
      <div className="space-y-4">
        {/* Search and Add */}
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar entradas..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button onClick={handleExport} variant="outline" className="shrink-0">
            <Download className="mr-1 h-4 w-4" />
            Excel
          </Button>
          <Button onClick={() => setFormOpen(true)} className="gradient-income shrink-0">
            <Plus className="mr-1 h-4 w-4" />
            Nova
          </Button>
        </div>

        {/* Transactions List */}
        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-16" />
            <Skeleton className="h-16" />
            <Skeleton className="h-16" />
          </div>
        ) : filteredTransactions && filteredTransactions.length > 0 ? (
          <div className="space-y-3">
            {filteredTransactions.map((transaction) => (
              <TransactionItem
                key={transaction.id}
                name={transaction.name}
                category={transaction.category?.name || 'Sem categoria'}
                amount={Number(transaction.amount)}
                date={transaction.date}
                type="income"
                onEdit={() => handleEdit(transaction)}
                onDelete={() => deleteTransaction.mutate(transaction.id)}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-border/50 p-8 text-center">
            <p className="text-muted-foreground">
              {search ? 'Nenhuma entrada encontrada' : 'Nenhuma entrada registrada'}
            </p>
            {!search && (
              <Button
                variant="link"
                className="mt-2 text-income"
                onClick={() => setFormOpen(true)}
              >
                Adicionar primeira entrada
              </Button>
            )}
          </div>
        )}
      </div>

      <TransactionForm
        open={formOpen}
        onOpenChange={handleCloseForm}
        type="income"
        editTransaction={editTransaction}
      />
    </PageLayout>
  );
}
