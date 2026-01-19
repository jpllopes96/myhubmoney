import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';

const DEFAULT_CATEGORIES = [
  { name: 'Salário', type: 'income' as const, color: '#10b981', icon: 'circle' },
  { name: 'Freelance', type: 'income' as const, color: '#3b82f6', icon: 'circle' },
  { name: 'Investimentos', type: 'income' as const, color: '#8b5cf6', icon: 'circle' },
  { name: 'Alimentação', type: 'expense' as const, color: '#f97316', icon: 'circle' },
  { name: 'Transporte', type: 'expense' as const, color: '#06b6d4', icon: 'circle' },
  { name: 'Moradia', type: 'expense' as const, color: '#ec4899', icon: 'circle' },
  { name: 'Saúde', type: 'expense' as const, color: '#ef4444', icon: 'circle' },
  { name: 'Lazer', type: 'expense' as const, color: '#eab308', icon: 'circle' },
];

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3333';

export const useCategoryInitializer = () => {
  const { user, token } = useAuth();
  const queryClient = useQueryClient();
  const hasInitialized = useRef(false);

  useEffect(() => {
    const initializeCategories = async () => {
      if (!user || !token || hasInitialized.current) return;
      hasInitialized.current = true;

      try {
        // Check if user already has categories
        const response = await fetch(`${API_URL}/api/categories`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error('Failed to fetch categories');
        const categories = await response.json();

        // If user has no categories, create defaults
        if (!categories || categories.length === 0) {
          for (const cat of DEFAULT_CATEGORIES) {
            await fetch(`${API_URL}/api/categories`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify(cat),
            });
          }

          // Invalidate categories cache to refetch
          queryClient.invalidateQueries({ queryKey: ['categories'] });
        }
      } catch (error) {
        console.error('Error initializing categories:', error);
      }
    };

    initializeCategories();
  }, [user, token, queryClient]);
};
