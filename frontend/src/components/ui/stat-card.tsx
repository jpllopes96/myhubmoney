import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  variant?: 'default' | 'income' | 'expense';
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  variant = 'default',
  className,
}) => {
  return (
    <div
      className={cn(
        'rounded-xl border border-border/50 p-4 transition-all duration-200',
        'gradient-card hover:border-border animate-fade-in',
        className
      )}
    >
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{title}</p>
          <p
            className={cn(
              'text-2xl font-bold number-display',
              variant === 'income' && 'text-income',
              variant === 'expense' && 'text-expense',
              variant === 'default' && 'text-foreground'
            )}
          >
            {value}
          </p>
        </div>
        <div
          className={cn(
            'flex h-10 w-10 items-center justify-center rounded-lg',
            variant === 'income' && 'bg-income/10 text-income',
            variant === 'expense' && 'bg-expense/10 text-expense',
            variant === 'default' && 'bg-primary/10 text-primary'
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
};
