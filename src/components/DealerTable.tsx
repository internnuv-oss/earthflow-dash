import { useState, useMemo } from 'react';
import { Dealer } from '@/types/dealer';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import RecommendationBadge from './RecommendationBadge';
import { Search, MapPin, Phone, User } from 'lucide-react';

interface DealerTableProps {
  dealers: Dealer[];
  onSelectDealer: (dealer: Dealer) => void;
}

const DealerTable = ({ dealers, onSelectDealer }: DealerTableProps) => {
  const [search, setSearch] = useState('');
  const [filterSE, setFilterSE] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const seNames = useMemo(() => [...new Set(dealers.map(d => d.se_name))], [dealers]);

  const filtered = useMemo(() => {
    return dealers.filter(d => {
      const matchSearch =
        !search ||
        d.shop_name.toLowerCase().includes(search.toLowerCase()) ||
        d.owner_name.toLowerCase().includes(search.toLowerCase()) ||
        d.contact_mobile.includes(search) ||
        d.address.toLowerCase().includes(search.toLowerCase());
      const matchSE = filterSE === 'all' || d.se_name === filterSE;
      const matchStatus = filterStatus === 'all' || d.recommendation === filterStatus;
      return matchSearch && matchSE && matchStatus;
    });
  }, [dealers, search, filterSE, filterStatus]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search dealers..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={filterSE} onValueChange={setFilterSE}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by SE" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All SEs</SelectItem>
            {seNames.map(name => (
              <SelectItem key={name} value={name}>{name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-full sm:w-[160px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="Green">Green</SelectItem>
            <SelectItem value="Yellow">Yellow</SelectItem>
            <SelectItem value="Red">Red</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-lg border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="font-semibold">Shop Name</TableHead>
              <TableHead className="font-semibold">Owner</TableHead>
              <TableHead className="font-semibold">SE Name</TableHead>
              <TableHead className="font-semibold">Contact</TableHead>
              <TableHead className="font-semibold">Location</TableHead>
              <TableHead className="font-semibold text-center">Score</TableHead>
              <TableHead className="font-semibold text-center">Recommendation</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                  No dealers found.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map(dealer => (
                <TableRow
                  key={dealer.id}
                  className="cursor-pointer hover:bg-accent/50 transition-colors"
                  onClick={() => onSelectDealer(dealer)}
                >
                  <TableCell className="font-medium">{dealer.shop_name}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      <User className="h-3.5 w-3.5 text-muted-foreground" />
                      {dealer.owner_name}
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{dealer.se_name}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                      {dealer.contact_mobile}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                      {dealer.address}
                    </div>
                  </TableCell>
                  <TableCell className="text-center font-semibold">{dealer.total_score}</TableCell>
                  <TableCell className="text-center">
                    <RecommendationBadge recommendation={dealer.recommendation} />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      <p className="text-xs text-muted-foreground">
        Showing {filtered.length} of {dealers.length} dealers
      </p>
    </div>
  );
};

export default DealerTable;
