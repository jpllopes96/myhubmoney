import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3333';

export interface Transaction {
  id: string;
  userId: string;
  categoryId: string | null;
  type: 'income' | 'expense';
  name: string;
  amount: number;
  date: string;
  description: string | null;
  isRecurring: boolean;
  createdAt: string;
  updatedAt: string;
  category?: {
    id: string;
    name: string;
    color: string;
  };
}

export const useTransactions = (type?: 'income' | 'expense') => {
  const { user, token } = useAuth();

  return useQuery({
    queryKey: ['transactions', user?.id, type],
    queryFn: async () => {
      const url = new URL(`${API_URL}/api/transactions`);
      if (type) {
        url.searchParams.append('type', type);
      }

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch transactions');
      return response.json() as Promise<Transaction[]>;
    },
    enabled: !!user && !!token,
  });
};

export const useTransactionsSummary = () => {
  const { user, token } = useAuth();

  return useQuery({
    queryKey: ['transactions-summary', user?.id],
    queryFn: async () => {
      const response = await fetch(`${API_URL}/api/transactions/summary`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch summary');
      return response.json();
    },
    enabled: !!user && !!token,
  });
};

export const useCreateTransaction = () => {
  const queryClient = useQueryClient();
  const { token } = useAuth();

  return useMutation({
    mutationFn: async (transaction: Omit<Transaction, 'id' | 'userId' | 'createdAt' | 'updatedAt' | 'category'>) => {
      const response = await fetch(`${API_URL}/api/transactions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(transaction),
      });

      if (!response.ok) throw new Error('Failed to create transaction');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['transactions-summary'] });
      toast.success('Transação criada com sucesso!');
    },
    onError: () => {
      toast.error('Erro ao criar transação');
    },
  });
};

export const useUpdateTransaction = () => {
  const queryClient = useQueryClient();
  const { token } = useAuth();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Transaction> & { id: string }) => {
      const response = await fetch(`${API_URL}/api/transactions/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) throw new Error('Failed to update transaction');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['transactions-summary'] });
      toast.success('Transação atualizada!');
    },
    onError: () => {
      toast.error('Erro ao atualizar transação');
    },
  });
};

export const useDeleteTransaction = () => {
  const queryClient = useQueryClient();
  const { token } = useAuth();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`${API_URL}/api/transactions/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to delete transaction');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['transactions-summary'] });
      toast.success('Transação excluída!');
    },
    onError: () => {
      toast.error('Erro ao excluir transação');
    },
  });
};
