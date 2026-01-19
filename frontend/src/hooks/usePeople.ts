import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3333';

export interface Person {
  id: string;
  userId: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export const usePeople = () => {
  const { user, token } = useAuth();

  return useQuery({
    queryKey: ['people', user?.id],
    queryFn: async () => {
      const response = await fetch(`${API_URL}/api/employees`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch people');
      return response.json() as Promise<Person[]>;
    },
    enabled: !!user && !!token,
  });
};

export const useCreatePerson = () => {
  const queryClient = useQueryClient();
  const { token } = useAuth();

  return useMutation({
    mutationFn: async (name: string) => {
      const response = await fetch(`${API_URL}/api/employees`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name }),
      });

      if (!response.ok) throw new Error('Failed to create person');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['people'] });
      toast.success('Pessoa cadastrada com sucesso!');
    },
    onError: () => {
      toast.error('Erro ao cadastrar pessoa');
    },
  });
};

export const useUpdatePerson = () => {
  const queryClient = useQueryClient();
  const { token } = useAuth();

  return useMutation({
    mutationFn: async ({ id, name }: { id: string; name: string }) => {
      const response = await fetch(`${API_URL}/api/employees/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name }),
      });

      if (!response.ok) throw new Error('Failed to update person');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['people'] });
      toast.success('Pessoa atualizada!');
    },
    onError: () => {
      toast.error('Erro ao atualizar pessoa');
    },
  });
};

export const useDeletePerson = () => {
  const queryClient = useQueryClient();
  const { token } = useAuth();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`${API_URL}/api/employees/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to delete person');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['people'] });
      toast.success('Pessoa excluída!');
    },
    onError: () => {
      toast.error('Erro ao excluir pessoa');
    },
  });
};
