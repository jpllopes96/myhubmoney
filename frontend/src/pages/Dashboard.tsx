import { useState, useMemo } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { StatCard } from '@/components/ui/stat-card';
import { TransactionItem } from '@/components/ui/transaction-item';
import { useTransactions, useDeleteTransaction } from '@/hooks/useTransactions';
import { TrendingUp, TrendingDown, Wallet, ArrowUpRight, ArrowDownRight, Calendar, Download } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { useNavigate } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { parseISO, isWithinInterval, format } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { exportAllTransactionsToExcel } from '@/utils/exportToExcel';
import { toast } from 'sonner';

type FilterMode = 'range' | 'all';

const CustomTooltip = ({ active, payload, formatter }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-border bg-popover p-2 shadow-md">
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            <div
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-muted-foreground">
              {entry.dataKey === 'income' ? 'Entradas' : entry.dataKey === 'expense' ? 'Despesas' : entry.name}:
            </span>
            <span className="font-medium text-foreground">{formatter(entry.value)}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

// Get local date in YYYY-MM-DD format
const getLocalDateString = (date: Date = new Date()) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export default function Dashboard() {
  const { user } = useAuth();
  const { data: transactions, isLoading: transactionsLoading } = useTransactions();
  const deleteTransaction = useDeleteTransaction();
  const navigate = useNavigate();
  
  const [filterMode, setFilterMode] = useState<FilterMode>('range');
  const [startDate, setStartDate] = useState('2026-01-01');
  const [endDate, setEndDate] = useState(getLocalDateString());

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);

  // Filter transactions based on date range or all
  const filteredTransactions = useMemo(() => {
    if (!transactions) return [];
    
    if (filterMode === 'all') {
      return transactions;
    }

    try {
      const start = parseISO(startDate);
      const end = parseISO(endDate);
      
      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        return transactions;
      }

      return transactions.filter((t) => {
        const transactionDate = parseISO(t.date);
        return isWithinInterval(transactionDate, { start, end });
      });
    } catch {
      return transactions;
    }
  }, [transactions, filterMode, startDate, endDate]);

  // Calculate summary from filtered transactions
  const summary = useMemo(() => {
    const totalIncome = filteredTransactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + Number(t.amount), 0);
    
    const totalExpense = filteredTransactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + Number(t.amount), 0);

    return {
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense,
    };
  }, [filteredTransactions]);

  const recentTransactions = filteredTransactions.slice(0, 5);

  // Aggregate expenses by category for pie chart
  const expensesByCategory = filteredTransactions
    .filter((t) => t.type === 'expense')
    .reduce((acc, t) => {
      const categoryName = t.category?.name || 'Sem categoria';
      const existing = acc.find((c) => c.name === categoryName);
      if (existing) {
        existing.value += Number(t.amount);
      } else {
        acc.push({
          name: categoryName,
          value: Number(t.amount),
          color: t.category?.color || '#6366f1',
        });
      }
      return acc;
    }, [] as { name: string; value: number; color: string }[]);

  // Aggregate income by category for pie chart
  const incomeByCategory = filteredTransactions
    .filter((t) => t.type === 'income')
    .reduce((acc, t) => {
      const categoryName = t.category?.name || 'Sem categoria';
      const existing = acc.find((c) => c.name === categoryName);
      if (existing) {
        existing.value += Number(t.amount);
      } else {
        acc.push({
          name: categoryName,
          value: Number(t.amount),
          color: t.category?.color || '#10b981',
        });
      }
      return acc;
    }, [] as { name: string; value: number; color: string }[]);

  // Monthly data for bar chart
  const chartData = useMemo(() => {
    return filteredTransactions.reduce((acc, t) => {
      const month = parseISO(t.date).toLocaleDateString('pt-BR', { month: 'short' });
      const existing = acc.find((m) => m.period === month);
      if (existing) {
        if (t.type === 'income') {
          existing.income += Number(t.amount);
        } else {
          existing.expense += Number(t.amount);
        }
      } else {
        acc.push({
          period: month,
          income: t.type === 'income' ? Number(t.amount) : 0,
          expense: t.type === 'expense' ? Number(t.amount) : 0,
        });
      }
      return acc;
    }, [] as { period: string; income: number; expense: number }[]);
  }, [filteredTransactions]);

  const handleEditTransaction = (transaction: typeof transactions extends (infer T)[] | undefined ? T : never) => {
    if (transaction.type === 'expense') {
      navigate('/expenses', { state: { editTransaction: transaction } });
    } else {
      navigate('/income', { state: { editTransaction: transaction } });
    }
  };

  const getSubtitle = () => {
    if (filterMode === 'all') {
      return 'Todas as transações';
    }
    try {
      const start = parseISO(startDate);
      const end = parseISO(endDate);
      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        return 'Período selecionado';
      }
      return `De ${format(start, 'dd/MM/yyyy')} até ${format(end, 'dd/MM/yyyy')}`;
    } catch {
      return 'Período selecionado';
    }
  };

  const handleExportAll = () => {
    if (!filteredTransactions || filteredTransactions.length === 0) {
      toast.error('Nenhuma transação para exportar');
      return;
    }
    exportAllTransactionsToExcel(filteredTransactions);
    toast.success('Arquivo Excel exportado com sucesso!');
  };

  return (
    <PageLayout title={`Olá${user?.user_metadata?.full_name ? `, ${user.user_metadata.full_name.split(' ')[0]}` : ''}!`} subtitle={getSubtitle()}>
      <div className="space-y-6">
        {/* Date Filter */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant={filterMode === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterMode('all')}
            >
              Todos
            </Button>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={filterMode === 'range' ? 'default' : 'outline'}
                  size="sm"
                  className="gap-2"
                  onClick={() => setFilterMode('range')}
                >
                  <Calendar className="h-4 w-4" />
                  Período
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-4" align="start">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Data inicial</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endDate">Data final</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
          <Button onClick={handleExportAll} variant="outline" size="sm">
            <Download className="mr-1 h-4 w-4" />
            Excel
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {transactionsLoading ? (
            <>
              <Skeleton className="h-24" />
              <Skeleton className="h-24" />
              <Skeleton className="h-24" />
            </>
          ) : (
            <>
              <StatCard
                title="Total Entradas"
                value={formatCurrency(summary.totalIncome)}
                icon={TrendingUp}
                variant="income"
              />
              <StatCard
                title="Total Despesas"
                value={formatCurrency(summary.totalExpense)}
                icon={TrendingDown}
                variant="expense"
              />
              <StatCard
                title="Saldo"
                value={formatCurrency(summary.balance)}
                icon={Wallet}
                variant={summary.balance >= 0 ? 'income' : 'expense'}
              />
            </>
          )}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {/* Expenses by Category */}
          {expensesByCategory.length > 0 && (
            <div className="rounded-xl border border-border/50 bg-card/50 p-4">
              <h3 className="mb-4 font-semibold text-foreground">Gastos por Categoria</h3>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={expensesByCategory}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={70}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {expensesByCategory.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip formatter={formatCurrency} />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {expensesByCategory.slice(0, 4).map((cat) => (
                  <div key={cat.name} className="flex items-center gap-1.5 text-xs">
                    <div
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: cat.color }}
                    />
                    <span className="text-muted-foreground">{cat.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Income by Category */}
          {incomeByCategory.length > 0 && (
            <div className="rounded-xl border border-border/50 bg-card/50 p-4">
              <h3 className="mb-4 font-semibold text-foreground">Ganhos por Categoria</h3>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={incomeByCategory}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={70}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {incomeByCategory.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip formatter={formatCurrency} />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {incomeByCategory.slice(0, 4).map((cat) => (
                  <div key={cat.name} className="flex items-center gap-1.5 text-xs">
                    <div
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: cat.color }}
                    />
                    <span className="text-muted-foreground">{cat.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Evolution Chart */}
        {chartData.length > 0 && (
          <div className="rounded-xl border border-border/50 bg-card/50 p-4">
            <h3 className="mb-4 font-semibold text-foreground">Evolução Mensal</h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <XAxis dataKey="period" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                  <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                  <Tooltip content={<CustomTooltip formatter={formatCurrency} />} />
                  <Bar dataKey="income" name="Entradas" fill="hsl(var(--income))" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="expense" name="Despesas" fill="hsl(var(--expense))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-2 flex gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <ArrowUpRight className="h-3 w-3 text-income" />
                <span className="text-muted-foreground">Entradas</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ArrowDownRight className="h-3 w-3 text-expense" />
                <span className="text-muted-foreground">Despesas</span>
              </div>
            </div>
          </div>
        )}

        {/* Recent Transactions */}
        <div>
          <h3 className="mb-4 font-semibold text-foreground">Transações Recentes</h3>
          {transactionsLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-16" />
              <Skeleton className="h-16" />
              <Skeleton className="h-16" />
            </div>
          ) : recentTransactions.length > 0 ? (
            <div className="space-y-3">
              {recentTransactions.map((transaction) => (
                <TransactionItem
                  key={transaction.id}
                  name={transaction.name}
                  category={transaction.category?.name || 'Sem categoria'}
                  amount={Number(transaction.amount)}
                  date={transaction.date}
                  type={transaction.type as 'income' | 'expense'}
                  onEdit={() => handleEditTransaction(transaction)}
                  onDelete={() => deleteTransaction.mutate(transaction.id)}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-border/50 p-8 text-center">
              <p className="text-muted-foreground">Nenhuma transação no período</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Adicione sua primeira entrada ou despesa
              </p>
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
}
