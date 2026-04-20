import { useState, useEffect, useMemo } from 'react';
import { getDealers } from '@/services/mockData';
import { getFarmers, getDistributors } from '@/services/mockDirectoryData';
import { Dealer } from '@/types/dealer';
import { Farmer } from '@/types/farmer';
import { Distributor } from '@/types/distributor';
import KpiCard from '@/components/KpiCard';
import AppLayout from '@/components/AppLayout';
import { Users, Clock, AlertTriangle, Wheat, Truck, UserCog } from 'lucide-react';

interface DashboardProps {
  onLogout: () => void;
}

const Dashboard = ({ onLogout }: DashboardProps) => {
  const [dealers, setDealers] = useState<Dealer[]>([]);
  const [farmers, setFarmers] = useState<Farmer[]>([]);
  const [distributors, setDistributors] = useState<Distributor[]>([]);

  useEffect(() => {
    getDealers().then(data => setDealers(data || []));
    getFarmers().then(data => setFarmers(data || []));
    getDistributors().then(data => setDistributors(data || []));
  }, []);

  const kpis = useMemo(() => {
    const safeDealers = dealers || [];
    const safeFarmers = farmers || [];
    const safeDistributors = distributors || [];

    const seIds = new Set<string>();
    safeDealers.forEach(d => d?.se_id && seIds.add(d.se_id));
    safeFarmers.forEach(f => f?.se_id && seIds.add(f.se_id));
    safeDistributors.forEach(d => d?.se_id && seIds.add(d.se_id));

    const pending =
      safeDealers.filter(d => d?.status === 'DRAFT').length +
      safeFarmers.filter(f => f?.status === 'DRAFT').length +
      safeDistributors.filter(d => d?.status === 'DRAFT').length;

    const redCount = safeDealers.filter(d => d?.recommendation === 'Red').length;

    return {
      totalDealers: safeDealers.length,
      totalFarmers: safeFarmers.length,
      totalDistributors: safeDistributors.length,
      totalSEs: seIds.size,
      pending,
      redCount,
    };
  }, [dealers, farmers, distributors]);

  return (
    <AppLayout onLogout={onLogout}>
      <div>
        <h2 className="text-lg font-semibold mb-1">Overview</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Global command center across dealers, distributors, and farmers.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <KpiCard
          title="Total Dealers"
          value={kpis.totalDealers}
          icon={Users}
          description="View dealer directory"
          to="/dealers"
        />
        <KpiCard
          title="Total Distributors"
          value={kpis.totalDistributors}
          icon={Truck}
          description="View distributors"
          to="/distributors"
        />
        <KpiCard
          title="Total Farmers"
          value={kpis.totalFarmers}
          icon={Wheat}
          description="View farmers"
          to="/farmers"
        />
        <KpiCard
          title="Total SEs"
          value={kpis.totalSEs}
          icon={UserCog}
          description="Active sales executives"
        />
        <KpiCard
          title="Pending Approvals"
          value={kpis.pending}
          icon={Clock}
          description="Drafts across all directories"
          accent="muted"
        />
        <KpiCard
          title="High Risk"
          value={kpis.redCount}
          icon={AlertTriangle}
          description="Red recommendation dealers"
          accent="destructive"
        />
      </div>
    </AppLayout>
  );
};

export default Dashboard;
