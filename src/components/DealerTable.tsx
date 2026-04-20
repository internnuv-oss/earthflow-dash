import { useMemo } from 'react';
import { Dealer } from '@/types/dealer';
import RecommendationBadge from './RecommendationBadge';
import { DataTable, DataTableColumn, DataTableFilter } from './DataTable';
import { Switch } from '@/components/ui/switch';
import { MapPin, Phone, User } from 'lucide-react';

interface DealerTableProps {
  dealers: Dealer[];
  onSelectDealer: (dealer: Dealer) => void;
  onToggleActive?: (id: string, value: boolean) => void;
}

const DealerTable = ({ dealers, onSelectDealer, onToggleActive }: DealerTableProps) => {
  const safeDealers = dealers || [];
  const seNames = useMemo(() => [...new Set(safeDealers.map(d => d?.se_name).filter(Boolean))], [safeDealers]);
  const locations = useMemo(() => [...new Set(safeDealers.map(d => d?.address).filter(Boolean))], [safeDealers]);

  const columns: DataTableColumn<Dealer>[] = [
    {
      key: 'shop_name',
      header: 'Shop Name',
      accessor: d => <span className="font-medium">{d?.shop_name}</span>,
      sortValue: d => (d?.shop_name || '').toLowerCase(),
      sortable: true,
    },
    {
      key: 'owner_name',
      header: 'Owner',
      accessor: d => (
        <div className="flex items-center gap-1.5">
          <User className="h-3.5 w-3.5 text-muted-foreground" />
          {d?.owner_name}
        </div>
      ),
      sortValue: d => (d?.owner_name || '').toLowerCase(),
      sortable: true,
    },
    {
      key: 'se_name',
      header: 'SE Name',
      accessor: d => <span className="text-muted-foreground">{d?.se_name}</span>,
      sortValue: d => (d?.se_name || '').toLowerCase(),
      sortable: true,
    },
    {
      key: 'contact_mobile',
      header: 'Contact',
      accessor: d => (
        <div className="flex items-center gap-1.5 whitespace-nowrap">
          <Phone className="h-3.5 w-3.5 text-muted-foreground" />
          {d?.contact_mobile}
        </div>
      ),
    },
    {
      key: 'address',
      header: 'Location',
      accessor: d => (
        <div className="flex items-center gap-1.5">
          <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
          {d?.address}
        </div>
      ),
      sortValue: d => (d?.address || '').toLowerCase(),
      sortable: true,
    },
    {
      key: 'total_score',
      header: 'Score',
      accessor: d => <span className="font-semibold">{d?.total_score}</span>,
      sortValue: d => d?.total_score ?? 0,
      sortable: true,
      headerClassName: 'font-semibold text-center whitespace-nowrap',
      className: 'text-center',
    },
    {
      key: 'recommendation',
      header: 'Recommendation',
      accessor: d => <RecommendationBadge recommendation={d?.recommendation} />,
      sortValue: d => d?.recommendation || '',
      sortable: true,
      headerClassName: 'font-semibold text-center whitespace-nowrap',
      className: 'text-center',
    },
    {
      key: 'created_at',
      header: 'Latest',
      accessor: d => (
        <span className="text-xs text-muted-foreground whitespace-nowrap">
          {d?.created_at ? new Date(d.created_at).toLocaleDateString() : '-'}
        </span>
      ),
      sortValue: d => (d?.created_at ? new Date(d.created_at).getTime() : 0),
      sortable: true,
    },
    {
      key: 'is_active',
      header: 'Access',
      accessor: d => (
        <div className="flex items-center justify-center" onClick={e => e.stopPropagation()}>
          <Switch
            checked={!!d?.is_active}
            onCheckedChange={v => onToggleActive?.(d.id, v)}
            aria-label="Toggle active"
          />
        </div>
      ),
      sortValue: d => (d?.is_active ? 1 : 0),
      sortable: true,
      className: 'text-center',
      headerClassName: 'font-semibold text-center whitespace-nowrap',
    },
  ];

  const filters: DataTableFilter<Dealer>[] = [
    {
      key: 'active',
      label: 'Status',
      options: [
        { value: 'active', label: 'Active' },
        { value: 'inactive', label: 'Inactive' },
      ],
      predicate: (d, v) => (v === 'active' ? !!d?.is_active : !d?.is_active),
      width: 'w-full sm:w-[140px]',
    },
    {
      key: 'location',
      label: 'Location',
      options: locations.map(l => ({ value: l, label: l })),
      predicate: (d, v) => d?.address === v,
      width: 'w-full sm:w-[180px]',
    },
    {
      key: 'se',
      label: 'SE',
      options: seNames.map(n => ({ value: n, label: n })),
      predicate: (d, v) => d?.se_name === v,
      width: 'w-full sm:w-[160px]',
    },
    {
      key: 'recommendation',
      label: 'Risk',
      options: [
        { value: 'Green', label: 'Green' },
        { value: 'Yellow', label: 'Yellow' },
        { value: 'Red', label: 'Red' },
      ],
      predicate: (d, v) => d?.recommendation === v,
      width: 'w-full sm:w-[140px]',
    },
  ];

  return (
    <DataTable
      data={safeDealers}
      columns={columns}
      filters={filters}
      searchPlaceholder="Search dealers..."
      searchAccessor={d => `${d?.shop_name || ''} ${d?.owner_name || ''} ${d?.contact_mobile || ''} ${d?.address || ''}`}
      rowKey={d => d.id}
      onRowClick={onSelectDealer}
      emptyMessage="No dealers found."
    />
  );
};

export default DealerTable;
