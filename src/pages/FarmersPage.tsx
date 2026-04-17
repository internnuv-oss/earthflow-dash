import { useEffect, useState } from 'react';
import { getFarmers } from '@/services/mockDirectoryData';
import { Farmer } from '@/types/farmer';
import FarmerTable from '@/components/FarmerTable';
import AppLayout from '@/components/AppLayout';

interface FarmersPageProps {
  onLogout: () => void;
}

const FarmersPage = ({ onLogout }: FarmersPageProps) => {
  const [farmers, setFarmers] = useState<Farmer[]>([]);

  useEffect(() => {
    getFarmers().then(setFarmers);
  }, []);

  return (
    <AppLayout onLogout={onLogout}>
      <div>
        <h2 className="text-lg font-semibold mb-1">Farmer Directory</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Review farmers onboarded by field SEs. {farmers.length} total records.
        </p>
        <FarmerTable farmers={farmers} />
      </div>
    </AppLayout>
  );
};

export default FarmersPage;
