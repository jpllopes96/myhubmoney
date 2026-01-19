import { cn } from '@/lib/utils';
import { ArrowDownRight, ArrowUpRight, MoreVertical } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

interface TransactionItemProps {
  name: string;
  category: string;
  amount: number;
  date: string;
  type: 'income' | 'expense';
  onEdit: () => void;
  onDelete: () => void;
}

export const TransactionItem: React.FC<TransactionItemProps> = ({
  name,
  category,
  amount,
  date,
  type,
  onEdit,
  onDelete,
}) => {
  const formattedAmount = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(amount);

  const formattedDate = new Date(date).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
  });

  return (
    <div className="flex items-center justify-between rounded-lg border border-border/50 bg-card/50 p-4 transition-all hover:bg-card animate-fade-in">
      <div className="flex items-center gap-3">
        <div
          className={cn(
            'flex h-10 w-10 items-center justify-center rounded-full',
            type === 'income' ? 'bg-income/10' : 'bg-expense/10'
          )}
        >
          {type === 'income' ? (
            <ArrowUpRight className="h-5 w-5 text-income" />
          ) : (
            <ArrowDownRight className="h-5 w-5 text-expense" />
          )}
        </div>
        <div>
          <p className="font-medium text-foreground">{name}</p>
          <p className="text-xs text-muted-foreground">
            {category} • {formattedDate}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <p
          className={cn(
            'font-semibold number-display',
            type === 'income' ? 'text-income' : 'text-expense'
          )}
        >
          {type === 'income' ? '+' : '-'} {formattedAmount}
        </p>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onEdit}>Editar</DropdownMenuItem>
            <DropdownMenuItem onClick={onDelete} className="text-destructive">
              Excluir
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
