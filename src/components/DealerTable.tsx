import { useMemo } from 'react';
import { Dealer } from '@/types/dealer';
import RecommendationBadge from './RecommendationBadge';
import { DataTable, DataTableColumn, DataTableFilter } from './DataTable';
import { MapPin, Phone, User } from 'lucide-react';

interface DealerTableProps {
  dealers: Dealer[];
  onSelectDealer: (dealer: Dealer) => void;
}

const DealerTable = ({ dealers, onSelectDealer }: DealerTableProps) => {
  const seNames = useMemo(() => [...new Set(dealers.map(d => d.se_name))], [dealers]);

  const columns: DataTableColumn<Dealer>[] = [
    {
      key: 'shop_name',
      header: 'Shop Name',
      accessor: d => <span className="font-medium">{d.shop_name}</span>,
      sortValue: d => d.shop_name.toLowerCase(),
      sortable: true,
    },
    {
      key: 'owner_name',
      header: 'Owner',
      accessor: d => (
        <div className="flex items-center gap-1.5">
          <User className="h-3.5 w-3.5 text-muted-foreground" />
          {d.owner_name}
        </div>
      ),
      sortValue: d => d.owner_name.toLowerCase(),
      sortable: true,
    },
    {
      key: 'se_name',
      header: 'SE Name',
      accessor: d => <span className="text-muted-foreground">{d.se_name}</span>,
      sortValue: d => d.se_name.toLowerCase(),
      sortable: true,
    },
    {
      key: 'contact_mobile',
      header: 'Contact',
      accessor: d => (
        <div className="flex items-center gap-1.5 whitespace-nowrap">
          <Phone className="h-3.5 w-3.5 text-muted-foreground" />
          {d.contact_mobile}
        </div>
      ),
    },
    {
      key: 'address',
      header: 'Location',
      accessor: d => (
        <div className="flex items-center gap-1.5">
          <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
          {d.address}
        </div>
      ),
      sortValue: d => d.address.toLowerCase(),
      sortable: true,
    },
    {
      key: 'total_score',
      header: 'Score',
      accessor: d => <span className="font-semibold">{d.total_score}</span>,
      sortValue: d => d.total_score,
      sortable: true,
      headerClassName: 'font-semibold text-center whitespace-nowrap',
      className: 'text-center',
    },
    {
      key: 'recommendation',
      header: 'Recommendation',
      accessor: d => <RecommendationBadge recommendation={d.recommendation} />,
      sortValue: d => d.recommendation,
      sortable: true,
      headerClassName: 'font-semibold text-center whitespace-nowrap',
      className: 'text-center',
    },
  ];

  const filters: DataTableFilter<Dealer>[] = [
    {
      key: 'se',
      label: 'SE',
      options: seNames.map(n => ({ value: n, label: n })),
      predicate: (d, v) => d.se_name === v,
      width: 'w-full sm:w-[180px]',
    },
    {
      key: 'recommendation',
      label: 'Status',
      options: [
        { value: 'Green', label: 'Green' },
        { value: 'Yellow', label: 'Yellow' },
        { value: 'Red', label: 'Red' },
      ],
      predicate: (d, v) => d.recommendation === v,
      width: 'w-full sm:w-[160px]',
    },
  ];

  return (
    <DataTable
      data={dealers}
      columns={columns}
      filters={filters}
      searchPlaceholder="Search dealers..."
      searchAccessor={d => `${d.shop_name} ${d.owner_name} ${d.contact_mobile} ${d.address}`}
      rowKey={d => d.id}
      onRowClick={onSelectDealer}
      emptyMessage="No dealers found."
    />
  );
};

export default DealerTable;
