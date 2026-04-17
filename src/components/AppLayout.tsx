import { ReactNode } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Sprout, LogOut, Users, Wheat, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface AppLayoutProps {
  children: ReactNode;
  onLogout: () => void;
}

const navItems = [
  { to: '/dashboard', label: 'Dealers', icon: Users },
  { to: '/farmers', label: 'Farmers', icon: Wheat },
  { to: '/distributors', label: 'Distributors', icon: Truck },
];

const AppLayout = ({ children, onLogout }: AppLayoutProps) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-sm">
        <div className="container flex h-16 items-center justify-between gap-4">
          <Link to="/dashboard" className="flex items-center gap-3 shrink-0">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
              <Sprout className="h-5 w-5 text-primary" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold leading-none">AgriDealer Admin</h1>
              <p className="text-xs text-muted-foreground">Territory Head Dashboard</p>
            </div>
          </Link>

          <nav className="flex items-center gap-1 overflow-x-auto">
            {navItems.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors',
                    isActive
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:bg-accent hover:text-foreground',
                  )
                }
              >
                <item.icon className="h-4 w-4" />
                <span className="hidden sm:inline">{item.label}</span>
              </NavLink>
            ))}
          </nav>

          <Button variant="ghost" size="sm" onClick={handleLogout} className="gap-2 text-muted-foreground shrink-0">
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </div>
      </header>

      <main className="container py-6 space-y-6">{children}</main>
    </div>
  );
};

export default AppLayout;
