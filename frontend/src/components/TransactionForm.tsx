import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useCategories } from '@/hooks/useCategories';
import { usePeople } from '@/hooks/usePeople';
import { Transaction, useCreateTransaction, useUpdateTransaction } from '@/hooks/useTransactions';
import { z } from 'zod';
import { toast } from 'sonner';

// Retorna a data local no formato YYYY-MM-DD
const getLocalDateString = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const transactionSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório').max(100, 'Nome muito longo'),
  amount: z.number().positive('Valor deve ser positivo'),
  category_id: z.string().optional(),
  employee_id: z.string().optional(),
  date: z.string().min(1, 'Data é obrigatória'),
  description: z.string().max(500, 'Descrição muito longa').optional(),
});

interface TransactionFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: 'income' | 'expense';
  editTransaction?: Transaction | null;
}

export const TransactionForm: React.FC<TransactionFormProps> = ({
  open,
  onOpenChange,
  type,
  editTransaction,
}) => {
  const { data: categories } = useCategories(type);
  const { data: people } = usePeople();
  const createTransaction = useCreateTransaction();
  const updateTransaction = useUpdateTransaction();

  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [date, setDate] = useState(getLocalDateString());
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (editTransaction) {
      setName(editTransaction.name);
      setAmount(String(editTransaction.amount));
      setCategoryId(editTransaction.category_id || '');
      setEmployeeId((editTransaction as any).employee_id || '');
      setDate(editTransaction.date);
      setDescription(editTransaction.description || '');
    } else {
      resetForm();
    }
  }, [editTransaction, open]);

  const resetForm = () => {
    setName('');
    setAmount('');
    setCategoryId('');
    setEmployeeId('');
    setDate(getLocalDateString());
    setDescription('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const validated = transactionSchema.parse({
        name: name.trim(),
        amount: parseFloat(amount),
        category_id: categoryId || undefined,
        employee_id: employeeId || undefined,
        date,
        description: description.trim() || undefined,
      });

      const transactionData = {
        name: validated.name,
        amount: validated.amount,
        category_id: validated.category_id || null,
        employee_id: validated.employee_id || null,
        date: validated.date,
        description: validated.description || null,
        type,
        is_recurring: false,
      };

      if (editTransaction) {
        await updateTransaction.mutateAsync({
          id: editTransaction.id,
          ...transactionData,
        });
      } else {
        await createTransaction.mutateAsync(transactionData);
      }

      onOpenChange(false);
      resetForm();
    } catch (err) {
      if (err instanceof z.ZodError) {
        toast.error(err.errors[0].message);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {editTransaction ? 'Editar' : 'Nova'} {type === 'income' ? 'Entrada' : 'Despesa'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome</Label>
            <Input
              id="name"
              placeholder={type === 'income' ? 'Ex: Salário' : 'Ex: Aluguel'}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Valor (R$)</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0.01"
              placeholder="0,00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Categoria</Label>
            <Select value={categoryId} onValueChange={setCategoryId}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent>
                {categories?.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="person">Pessoa</Label>
            <Select value={employeeId} onValueChange={setEmployeeId}>
              <SelectTrigger>
                <SelectValue placeholder="Quem está lançando?" />
              </SelectTrigger>
              <SelectContent>
                {people?.map((person) => (
                  <SelectItem key={person.id} value={person.id}>
                    {person.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Data</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição (opcional)</Label>
            <Textarea
              id="description"
              placeholder="Adicione detalhes..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className={`flex-1 ${type === 'income' ? 'gradient-income' : 'gradient-expense'}`}
              disabled={createTransaction.isPending || updateTransaction.isPending}
            >
              {createTransaction.isPending || updateTransaction.isPending
                ? 'Salvando...'
                : 'Salvar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
