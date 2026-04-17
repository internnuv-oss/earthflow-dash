import { useState, useEffect, useMemo } from 'react';
import { getDealers } from '@/services/mockData';
import { getFarmers, getDistributors } from '@/services/mockDirectoryData';
import { Dealer } from '@/types/dealer';
import KpiCard from '@/components/KpiCard';
import DealerTable from '@/components/DealerTable';
import DealerDetail from '@/components/DealerDetail';
import AppLayout from '@/components/AppLayout';
import { Users, Clock, AlertTriangle, Wheat, Truck } from 'lucide-react';

interface DashboardProps {
  onLogout: () => void;
}

const Dashboard = ({ onLogout }: DashboardProps) => {
  const [dealers, setDealers] = useState<Dealer[]>([]);
  const [farmerCount, setFarmerCount] = useState(0);
  const [distributorCount, setDistributorCount] = useState(0);
  const [selectedDealer, setSelectedDealer] = useState<Dealer | null>(null);

  useEffect(() => {
    getDealers().then(setDealers);
    getFarmers().then(f => setFarmerCount(f.length));
    getDistributors().then(d => setDistributorCount(d.length));
  }, []);

  const kpis = useMemo(() => {
    const total = dealers.length;
    const pending = dealers.filter(d => d.status === 'DRAFT').length;
    const redCount = dealers.filter(d => d.recommendation === 'Red').length;
    return { total, pending, redCount };
  }, [dealers]);

  return (
    <AppLayout onLogout={onLogout}>
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <KpiCard
          title="Total Dealers Onboarded"
          value={kpis.total}
          icon={Users}
          description="All onboarded dealers"
          to="/dashboard"
        />
        <KpiCard
          title="Total Farmers"
          value={farmerCount}
          icon={Wheat}
          description="Browse farmer directory"
          to="/farmers"
        />
        <KpiCard
          title="Total Distributors"
          value={distributorCount}
          icon={Truck}
          description="Browse distributor directory"
          to="/distributors"
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

      {/* Detail Dialog */}
      <DealerDetail
        dealer={selectedDealer}
        open={!!selectedDealer}
        onClose={() => setSelectedDealer(null)}
      />
    </AppLayout>
  );
};

export default Dashboard;
