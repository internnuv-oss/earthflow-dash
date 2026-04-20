import { useMemo, useState, useEffect } from 'react';
import { Farmer } from '@/types/farmer';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { DataTable, DataTableColumn, DataTableFilter } from './DataTable';
import { MapPin, Phone, Sprout } from 'lucide-react';

interface FarmerTableProps {
  farmers: Farmer[];
}

const statusBadge = (s: Farmer['status']) => {
  const map: Record<Farmer['status'], string> = {
    DRAFT: 'bg-muted text-muted-foreground',
    SUBMITTED: 'bg-[hsl(var(--badge-yellow-bg))] text-[hsl(var(--badge-yellow-text))]',
    VERIFIED: 'bg-[hsl(var(--badge-green-bg))] text-[hsl(var(--badge-green-text))]',
  };
  return <Badge className={`${map[s]} hover:${map[s]} border-0`}>{s}</Badge>;
};

const FarmerTable = ({ farmers }: FarmerTableProps) => {
  const [rows, setRows] = useState<Farmer[]>(farmers || []);

  useEffect(() => setRows(farmers || []), [farmers]);

  const seNames = useMemo(() => [...new Set((rows || []).map(f => f?.se_name).filter(Boolean))], [rows]);
  const locations = useMemo(
    () => [...new Set((rows || []).map(f => `${f?.village}, ${f?.district}`).filter(s => s && s !== ', '))],
    [rows],
  );

  const toggleActive = (id: string, value: boolean) => {
    setRows(prev => (prev || []).map(f => (f.id === id ? { ...f, is_active: value } : f)));
  };

  const columns: DataTableColumn<Farmer>[] = [
    {
      key: 'full_name',
      header: 'Farmer Name',
      accessor: f => <span className="font-medium">{f?.full_name}</span>,
      sortValue: f => (f?.full_name || '').toLowerCase(),
      sortable: true,
    },
    {
      key: 'contact_mobile',
      header: 'Contact',
      accessor: f => (
        <div className="flex items-center gap-1.5 whitespace-nowrap">
          <Phone className="h-3.5 w-3.5 text-muted-foreground" />
          {f?.contact_mobile}
        </div>
      ),
    },
    {
      key: 'village',
      header: 'Village / District',
      accessor: f => (
        <div className="flex items-center gap-1.5">
          <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
          {f?.village}, {f?.district}
        </div>
      ),
      sortValue: f => (f?.village || '').toLowerCase(),
      sortable: true,
    },
    {
      key: 'state',
      header: 'State',
      accessor: f => f?.state,
      sortValue: f => f?.state || '',
      sortable: true,
    },
    {
      key: 'land_size_acres',
      header: 'Land (acres)',
      accessor: f => <span className="font-semibold">{f?.land_size_acres}</span>,
      sortValue: f => f?.land_size_acres ?? 0,
      sortable: true,
      className: 'text-center',
      headerClassName: 'font-semibold text-center whitespace-nowrap',
    },
    {
      key: 'primary_crop',
      header: 'Primary Crop',
      accessor: f => (
        <div className="flex items-center gap-1.5">
          <Sprout className="h-3.5 w-3.5 text-primary" />
          {f?.primary_crop}
        </div>
      ),
      sortValue: f => f?.primary_crop || '',
      sortable: true,
    },
    {
      key: 'se_name',
      header: 'SE',
      accessor: f => <span className="text-muted-foreground">{f?.se_name}</span>,
      sortValue: f => f?.se_name || '',
      sortable: true,
    },
    {
      key: 'created_at',
      header: 'Latest',
      accessor: f => (
        <span className="text-xs text-muted-foreground whitespace-nowrap">
          {f?.created_at ? new Date(f.created_at).toLocaleDateString() : '-'}
        </span>
      ),
      sortValue: f => (f?.created_at ? new Date(f.created_at).getTime() : 0),
      sortable: true,
    },
    {
      key: 'status',
      header: 'Status',
      accessor: f => statusBadge(f?.status),
      sortValue: f => f?.status || '',
      sortable: true,
      className: 'text-center',
      headerClassName: 'font-semibold text-center whitespace-nowrap',
    },
    {
      key: 'is_active',
      header: 'Access',
      accessor: f => (
        <div className="flex items-center justify-center">
          <Switch
            checked={!!f?.is_active}
            onCheckedChange={v => toggleActive(f.id, v)}
            aria-label="Toggle active"
          />
        </div>
      ),
      sortValue: f => (f?.is_active ? 1 : 0),
      sortable: true,
      className: 'text-center',
      headerClassName: 'font-semibold text-center whitespace-nowrap',
    },
  ];

  const filters: DataTableFilter<Farmer>[] = [
    {
      key: 'active',
      label: 'Status',
      options: [
        { value: 'active', label: 'Active' },
        { value: 'inactive', label: 'Inactive' },
      ],
      predicate: (f, v) => (v === 'active' ? !!f?.is_active : !f?.is_active),
      width: 'w-full sm:w-[140px]',
    },
    {
      key: 'location',
      label: 'Location',
      options: locations.map(l => ({ value: l, label: l })),
      predicate: (f, v) => `${f?.village}, ${f?.district}` === v,
      width: 'w-full sm:w-[180px]',
    },
    {
      key: 'se',
      label: 'SE',
      options: seNames.map(n => ({ value: n, label: n })),
      predicate: (f, v) => f?.se_name === v,
      width: 'w-full sm:w-[160px]',
    },
  ];

  return (
    <DataTable
      data={rows}
      columns={columns}
      filters={filters}
      searchPlaceholder="Search farmers..."
      searchAccessor={f => `${f?.full_name || ''} ${f?.contact_mobile || ''} ${f?.village || ''} ${f?.district || ''} ${f?.primary_crop || ''}`}
      rowKey={f => f.id}
      emptyMessage="No farmers found."
    />
  );
};

export default FarmerTable;
