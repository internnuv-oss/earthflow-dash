import { useMemo, useState, useEffect } from 'react';
import { Distributor } from '@/types/distributor';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { DataTable, DataTableColumn, DataTableFilter } from './DataTable';
import { Phone, Warehouse, User } from 'lucide-react';

interface DistributorTableProps {
  distributors: Distributor[];
}

const statusBadge = (s: Distributor['status']) => {
  const map: Record<Distributor['status'], string> = {
    DRAFT: 'bg-muted text-muted-foreground',
    SUBMITTED: 'bg-[hsl(var(--badge-yellow-bg))] text-[hsl(var(--badge-yellow-text))]',
    APPROVED: 'bg-[hsl(var(--badge-green-bg))] text-[hsl(var(--badge-green-text))]',
  };
  return <Badge className={`${map[s]} hover:${map[s]} border-0`}>{s}</Badge>;
};

const DistributorTable = ({ distributors }: DistributorTableProps) => {
  const [rows, setRows] = useState<Distributor[]>(distributors || []);

  useEffect(() => setRows(distributors || []), [distributors]);

  const seNames = useMemo(() => [...new Set((rows || []).map(d => d?.se_name).filter(Boolean))], [rows]);
  const locations = useMemo(
    () => [...new Set((rows || []).map(d => `${d?.region}, ${d?.state}`).filter(s => s && s !== ', '))],
    [rows],
  );

  const toggleActive = (id: string, value: boolean) => {
    setRows(prev => (prev || []).map(d => (d.id === id ? { ...d, is_active: value } : d)));
  };

  const columns: DataTableColumn<Distributor>[] = [
    {
      key: 'firm_name',
      header: 'Firm Name',
      accessor: d => <span className="font-medium">{d?.firm_name}</span>,
      sortValue: d => (d?.firm_name || '').toLowerCase(),
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
      key: 'region',
      header: 'Region / State',
      accessor: d => `${d?.region}, ${d?.state}`,
      sortValue: d => d?.region || '',
      sortable: true,
    },
    {
      key: 'warehouse_capacity_tons',
      header: 'Capacity (T)',
      accessor: d => (
        <div className="flex items-center justify-center gap-1.5">
          <Warehouse className="h-3.5 w-3.5 text-muted-foreground" />
          {d?.warehouse_capacity_tons}
        </div>
      ),
      sortValue: d => d?.warehouse_capacity_tons ?? 0,
      sortable: true,
      className: 'text-center',
      headerClassName: 'font-semibold text-center whitespace-nowrap',
    },
    {
      key: 'product_categories',
      header: 'Categories',
      accessor: d => <span className="text-muted-foreground">{d?.product_categories}</span>,
    },
    {
      key: 'se_name',
      header: 'SE',
      accessor: d => <span className="text-muted-foreground">{d?.se_name}</span>,
      sortValue: d => d?.se_name || '',
      sortable: true,
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
      key: 'status',
      header: 'Status',
      accessor: d => statusBadge(d?.status),
      sortValue: d => d?.status || '',
      sortable: true,
      className: 'text-center',
      headerClassName: 'font-semibold text-center whitespace-nowrap',
    },
    {
      key: 'is_active',
      header: 'Access',
      accessor: d => (
        <div className="flex items-center justify-center">
          <Switch
            checked={!!d?.is_active}
            onCheckedChange={v => toggleActive(d.id, v)}
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

  const filters: DataTableFilter<Distributor>[] = [
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
      predicate: (d, v) => `${d?.region}, ${d?.state}` === v,
      width: 'w-full sm:w-[180px]',
    },
    {
      key: 'se',
      label: 'SE',
      options: seNames.map(n => ({ value: n, label: n })),
      predicate: (d, v) => d?.se_name === v,
      width: 'w-full sm:w-[160px]',
    },
  ];

  return (
    <DataTable
      data={rows}
      columns={columns}
      filters={filters}
      searchPlaceholder="Search distributors..."
      searchAccessor={d => `${d?.firm_name || ''} ${d?.owner_name || ''} ${d?.contact_mobile || ''} ${d?.region || ''} ${d?.gst_number || ''}`}
      rowKey={d => d.id}
      emptyMessage="No distributors found."
    />
  );
};

export default DistributorTable;
