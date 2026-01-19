import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3333';

export const useUserRole = () => {
  const { user, token } = useAuth();

  return useQuery({
    queryKey: ['user-role', user?.id],
    queryFn: async () => {
      // For now, we'll check if user is admin by checking the user record
      // You can implement a more sophisticated role system in the API
      // This is a placeholder that returns 'user' by default
      return 'user';
    },
    enabled: !!user && !!token,
  });
};

export const useIsAdmin = () => {
  const { data: role, isLoading } = useUserRole();
  return { isAdmin: role === 'admin', isLoading };
};
