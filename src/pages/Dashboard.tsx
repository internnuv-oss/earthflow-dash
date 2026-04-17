import { useState, useEffect, useMemo } from 'react';
import { getDealers } from '@/services/mockData';
import { Dealer } from '@/types/dealer';
import KpiCard from '@/components/KpiCard';
import DealerTable from '@/components/DealerTable';
import DealerDetail from '@/components/DealerDetail';
import { Users, Clock, AlertTriangle, Sprout, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DashboardProps {
  onLogout: () => void;
}

const Dashboard = ({ onLogout }: DashboardProps) => {
  const [dealers, setDealers] = useState<Dealer[]>([]);
  const [selectedDealer, setSelectedDealer] = useState<Dealer | null>(null);

  useEffect(() => {
    getDealers().then(setDealers);
  }, []);

  const kpis = useMemo(() => {
    const total = dealers.length;
    const pending = dealers.filter(d => d.status === 'DRAFT').length;
    const redCount = dealers.filter(d => d.recommendation === 'Red').length;
    return { total, pending, redCount };
  }, [dealers]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-sm">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
              <Sprout className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-lg font-bold leading-none">AgriDealer Admin</h1>
              <p className="text-xs text-muted-foreground">Territory Head Dashboard</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onLogout} className="gap-2 text-muted-foreground">
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </header>

      {/* Content */}
      <main className="container py-6 space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <KpiCard
            title="Total Dealers Onboarded"
            value={kpis.total}
            icon={Users}
            description="All onboarded dealers"
          />
          <KpiCard
            title="Pending Approvals"
            value={kpis.pending}
            icon={Clock}
            description="Draft submissions"
            accent="muted"
          />
          <KpiCard
            title="High Risk Dealers"
            value={kpis.redCount}
            icon={AlertTriangle}
            description="Red recommendation"
            accent="destructive"
          />
        </div>

        {/* Dealer Table */}
        <div>
          <h2 className="text-lg font-semibold mb-3">Dealer Directory</h2>
          <DealerTable dealers={dealers} onSelectDealer={setSelectedDealer} />
        </div>
      </main>

      {/* Detail Dialog */}
      <DealerDetail
        dealer={selectedDealer}
        open={!!selectedDealer}
        onClose={() => setSelectedDealer(null)}
      />
    </div>
  );
};

export default Dashboard;
