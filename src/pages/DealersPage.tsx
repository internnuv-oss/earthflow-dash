import { useEffect, useState } from 'react';
import { getDealers } from '@/services/mockData';
import { Dealer } from '@/types/dealer';
import DealerTable from '@/components/DealerTable';
import DealerDetail from '@/components/DealerDetail';
import AppLayout from '@/components/AppLayout';

interface DealersPageProps {
  onLogout: () => void;
}

const DealersPage = ({ onLogout }: DealersPageProps) => {
  const [dealers, setDealers] = useState<Dealer[]>([]);
  const [selectedDealer, setSelectedDealer] = useState<Dealer | null>(null);

  useEffect(() => {
    getDealers().then(data => setDealers(data || []));
  }, []);

  const handleToggleActive = (id: string, value: boolean) => {
    setDealers(prev => (prev || []).map(d => (d.id === id ? { ...d, is_active: value } : d)));
  };

  return (
    <AppLayout onLogout={onLogout}>
      <div>
        <h2 className="text-lg font-semibold mb-1">Dealer Directory</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Review dealers onboarded by field SEs. {(dealers || []).length} total records.
        </p>
        <DealerTable
          dealers={dealers}
          onSelectDealer={setSelectedDealer}
          onToggleActive={handleToggleActive}
        />
      </div>
      <DealerDetail
        dealer={selectedDealer}
        open={!!selectedDealer}
        onClose={() => setSelectedDealer(null)}
      />
    </AppLayout>
  );
};

export default DealersPage;
