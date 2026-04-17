import { useEffect, useState } from 'react';
import { getDistributors } from '@/services/mockDirectoryData';
import { Distributor } from '@/types/distributor';
import DistributorTable from '@/components/DistributorTable';
import AppLayout from '@/components/AppLayout';

interface DistributorsPageProps {
  onLogout: () => void;
}

const DistributorsPage = ({ onLogout }: DistributorsPageProps) => {
  const [distributors, setDistributors] = useState<Distributor[]>([]);

  useEffect(() => {
    getDistributors().then(setDistributors);
  }, []);

  return (
    <AppLayout onLogout={onLogout}>
      <div>
        <h2 className="text-lg font-semibold mb-1">Distributor Directory</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Review distributors onboarded by field SEs. {distributors.length} total records.
        </p>
        <DistributorTable distributors={distributors} />
      </div>
    </AppLayout>
  );
};

export default DistributorsPage;
