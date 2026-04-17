import { useMemo } from 'react';
import { Farmer } from '@/types/farmer';
import { Badge } from '@/components/ui/badge';
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
  const seNames = useMemo(() => [...new Set(farmers.map(f => f.se_name))], [farmers]);
  const crops = useMemo(() => [...new Set(farmers.map(f => f.primary_crop))], [farmers]);

  const columns: DataTableColumn<Farmer>[] = [
    {
      key: 'full_name',
      header: 'Farmer Name',
      accessor: f => <span className="font-medium">{f.full_name}</span>,
      sortValue: f => f.full_name.toLowerCase(),
      sortable: true,
    },
    {
      key: 'contact_mobile',
      header: 'Contact',
      accessor: f => (
        <div className="flex items-center gap-1.5 whitespace-nowrap">
          <Phone className="h-3.5 w-3.5 text-muted-foreground" />
          {f.contact_mobile}
        </div>
      ),
    },
    {
      key: 'village',
      header: 'Village / District',
      accessor: f => (
        <div className="flex items-center gap-1.5">
          <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
          {f.village}, {f.district}
        </div>
      ),
      sortValue: f => f.village.toLowerCase(),
      sortable: true,
    },
    {
      key: 'state',
      header: 'State',
      accessor: f => f.state,
      sortValue: f => f.state,
      sortable: true,
    },
    {
      key: 'land_size_acres',
      header: 'Land (acres)',
      accessor: f => <span className="font-semibold">{f.land_size_acres}</span>,
      sortValue: f => f.land_size_acres,
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
          {f.primary_crop}
        </div>
      ),
      sortValue: f => f.primary_crop,
      sortable: true,
    },
    {
      key: 'irrigation_type',
      header: 'Irrigation',
      accessor: f => <span className="text-muted-foreground">{f.irrigation_type}</span>,
    },
    {
      key: 'se_name',
      header: 'SE',
      accessor: f => <span className="text-muted-foreground">{f.se_name}</span>,
      sortValue: f => f.se_name,
      sortable: true,
    },
    {
      key: 'status',
      header: 'Status',
      accessor: f => statusBadge(f.status),
      sortValue: f => f.status,
      sortable: true,
      className: 'text-center',
      headerClassName: 'font-semibold text-center whitespace-nowrap',
    },
  ];

  const filters: DataTableFilter<Farmer>[] = [
    {
      key: 'se',
      label: 'SE',
      options: seNames.map(n => ({ value: n, label: n })),
      predicate: (f, v) => f.se_name === v,
    },
    {
      key: 'crop',
      label: 'Crop',
      options: crops.map(c => ({ value: c, label: c })),
      predicate: (f, v) => f.primary_crop === v,
      width: 'w-full sm:w-[160px]',
    },
    {
      key: 'status',
      label: 'Status',
      options: [
        { value: 'DRAFT', label: 'Draft' },
        { value: 'SUBMITTED', label: 'Submitted' },
        { value: 'VERIFIED', label: 'Verified' },
      ],
      predicate: (f, v) => f.status === v,
      width: 'w-full sm:w-[160px]',
    },
  ];

  return (
    <DataTable
      data={farmers}
      columns={columns}
      filters={filters}
      searchPlaceholder="Search farmers..."
      searchAccessor={f => `${f.full_name} ${f.contact_mobile} ${f.village} ${f.district} ${f.primary_crop}`}
      rowKey={f => f.id}
      emptyMessage="No farmers found."
    />
  );
};

export default FarmerTable;
