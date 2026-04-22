import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Wheat, Truck, Sprout, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/dealers', label: 'Dealers', icon: Users },
  { to: '/farmers', label: 'Farmers', icon: Wheat },
  { to: '/distributors', label: 'Distributors', icon: Truck },
];

const bottomNavItems = [
  { to: '/settings', label: 'Settings', icon: Settings, end: false as boolean | undefined },
];

interface AppSidebarProps {
  onNavigate?: () => void;
}

const AppSidebar = ({ onNavigate }: AppSidebarProps) => {
  const location = useLocation();

  const renderLink = (item: { to: string; label: string; icon: typeof Users; end?: boolean }) => {
    const active = item.end
      ? location.pathname === item.to
      : location.pathname.startsWith(item.to);
    return (
      <NavLink
        key={item.to}
        to={item.to}
        end={item.end}
        onClick={onNavigate}
        className={cn(
          'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
          active
            ? 'bg-primary/10 text-primary'
            : 'text-muted-foreground hover:bg-accent hover:text-foreground',
        )}
      >
        <item.icon className="h-4 w-4 shrink-0" />
        <span>{item.label}</span>
      </NavLink>
    );
  };

  return (
    <aside className="flex h-full w-full flex-col border-r border-border bg-card">
      <div className="flex items-center gap-3 px-5 py-5 border-b border-border">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
          <Sprout className="h-5 w-5 text-primary" />
        </div>
        <div className="min-w-0">
          <h1 className="text-sm font-bold leading-tight truncate">AgriDealer Admin</h1>
          <p className="text-xs text-muted-foreground truncate">Territory Head</p>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {(navItems || []).map(renderLink)}
      </nav>

      <div className="p-3 space-y-1 border-t border-border">
        {(bottomNavItems || []).map(renderLink)}
      </div>
    </aside>
  );
};

export default AppSidebar;
