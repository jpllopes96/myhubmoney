import { Home, TrendingDown, TrendingUp, Tags, Users, LogOut, Moon, Sun, Shield, Menu } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useIsAdmin } from '@/hooks/useUserRole';
import { cn } from '@/lib/utils';
import { ChangePasswordDialog } from '@/components/ChangePasswordDialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const navItems = [
  { icon: Home, label: 'Início', path: '/dashboard' },
  { icon: TrendingDown, label: 'Despesas', path: '/expenses' },
  { icon: TrendingUp, label: 'Entradas', path: '/income' },
  { icon: Users, label: 'Pessoas', path: '/people' },
  { icon: Tags, label: 'Categorias', path: '/categories' },
];

export const BottomNav = () => {
  const location = useLocation();
  const { signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { isAdmin } = useIsAdmin();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass border-t border-border/50 safe-area-inset-bottom">
      <div className="flex items-center justify-around px-1 py-2">
        {navItems.map(({ icon: Icon, label, path }) => {
          const isActive = location.pathname === path;
          return (
            <Link
              key={path}
              to={path}
              className={cn(
                'flex flex-col items-center gap-0.5 rounded-lg px-2 py-1.5 transition-all duration-200',
                isActive
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <Icon className={cn('h-5 w-5', isActive && 'drop-shadow-[0_0_8px_hsl(var(--primary))]')} />
              <span className="text-[10px] font-medium">{label}</span>
            </Link>
          );
        })}
        {isAdmin && (
          <Link
            to="/admin"
            className={cn(
              'flex flex-col items-center gap-0.5 rounded-lg px-2 py-1.5 transition-all duration-200',
              location.pathname === '/admin'
                ? 'text-primary'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <Shield className={cn('h-5 w-5', location.pathname === '/admin' && 'drop-shadow-[0_0_8px_hsl(var(--primary))]')} />
            <span className="text-[10px] font-medium">Admin</span>
          </Link>
        )}
        
        {/* More menu for theme, password, logout */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex flex-col items-center gap-0.5 rounded-lg px-2 py-1.5 text-muted-foreground transition-all hover:text-foreground">
              <Menu className="h-5 w-5" />
              <span className="text-[10px] font-medium">Mais</span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={toggleTheme} className="gap-2">
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              {theme === 'dark' ? 'Tema Claro' : 'Tema Escuro'}
            </DropdownMenuItem>
            <ChangePasswordDialog inDropdown />
            <DropdownMenuItem onClick={signOut} className="gap-2 text-destructive focus:text-destructive">
              <LogOut className="h-4 w-4" />
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
};
