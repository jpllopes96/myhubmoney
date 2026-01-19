import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import { Category, useCreateCategory, useUpdateCategory } from '@/hooks/useCategories';
import { z } from 'zod';
import { toast } from 'sonner';

const COLORS = [
  { name: 'Verde', value: '#10b981' },
  { name: 'Azul', value: '#3b82f6' },
  { name: 'Roxo', value: '#8b5cf6' },
  { name: 'Rosa', value: '#ec4899' },
  { name: 'Vermelho', value: '#ef4444' },
  { name: 'Laranja', value: '#f97316' },
  { name: 'Amarelo', value: '#eab308' },
  { name: 'Ciano', value: '#06b6d4' },
];

const categorySchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório').max(50, 'Nome muito longo'),
  type: z.enum(['income', 'expense']),
  color: z.string(),
});

interface CategoryFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editCategory?: Category | null;
}

export const CategoryForm: React.FC<CategoryFormProps> = ({
  open,
  onOpenChange,
  editCategory,
}) => {
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();

  const [name, setName] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [color, setColor] = useState(COLORS[0].value);

  useEffect(() => {
    if (editCategory) {
      setName(editCategory.name);
      setType(editCategory.type as 'income' | 'expense');
      setColor(editCategory.color);
    } else {
      resetForm();
    }
  }, [editCategory, open]);

  const resetForm = () => {
    setName('');
    setType('expense');
    setColor(COLORS[0].value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const validated = categorySchema.parse({
        name: name.trim(),
        type,
        color,
      });

      const categoryData = {
        name: validated.name,
        type: validated.type,
        color: validated.color,
        icon: 'circle',
      };

      if (editCategory) {
        await updateCategory.mutateAsync({
          id: editCategory.id,
          ...categoryData,
        });
      } else {
        await createCategory.mutateAsync(categoryData);
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
            {editCategory ? 'Editar' : 'Nova'} Categoria
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome</Label>
            <Input
              id="name"
              placeholder="Ex: Alimentação"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Tipo</Label>
            <Select value={type} onValueChange={(v) => setType(v as 'income' | 'expense')}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="expense">Despesa</SelectItem>
                <SelectItem value="income">Entrada</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Cor</Label>
            <div className="flex flex-wrap gap-2">
              {COLORS.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setColor(c.value)}
                  className={`h-8 w-8 rounded-full transition-all ${
                    color === c.value
                      ? 'ring-2 ring-foreground ring-offset-2 ring-offset-background'
                      : 'hover:scale-110'
                  }`}
                  style={{ backgroundColor: c.value }}
                  title={c.name}
                />
              ))}
            </div>
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
              className="flex-1 gradient-primary"
              disabled={createCategory.isPending || updateCategory.isPending}
            >
              {createCategory.isPending || updateCategory.isPending
                ? 'Salvando...'
                : 'Salvar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
