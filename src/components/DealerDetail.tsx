import { Dealer } from '@/types/dealer';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import RecommendationBadge from './RecommendationBadge';
import {
  Store, User, Phone, MapPin, FileText, Building2, Calendar,
  CreditCard, CheckCircle2, X, BarChart3,
} from 'lucide-react';

interface DealerDetailProps {
  dealer: Dealer | null;
  open: boolean;
  onClose: () => void;
  /** Optional, kept for backward compatibility. Not used in read-only view. */
  onSave?: (
    dealerId: string,
    updates: { scoring: any; commitments: any; total_score: number },
  ) => void;
}

const InfoRow = ({ icon: Icon, label, value }: { icon: typeof Store; label: string; value?: string }) => (
  <div className="flex items-start gap-3 py-2">
    <Icon className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
    <div className="min-w-0">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-medium break-words">{value || '—'}</p>
    </div>
  </div>
);

const ScoreBar = ({ label, limits, value, max = 10 }: { label: string; limits?: string; value: number; max?: number }) => (
  <div className="space-y-1">
    <div className="flex justify-between items-center text-sm gap-2">
      <span className="text-foreground">{label}</span>
      <span className="text-xs text-muted-foreground ml-auto">{limits}</span>
      <span className="font-semibold w-12 text-right">{value}/{max}</span>
    </div>
    <div className="h-2 rounded-full bg-muted overflow-hidden">
      <div
        className="h-full rounded-full bg-primary transition-all"
        style={{ width: `${(value / max) * 100}%` }}
      />
    </div>
  </div>
);

interface CategoryDisplay {
  key: string;
  label: string;
  limits?: string;
  score: number;
}

interface CommitmentDisplay {
  id: string;
  text: string;
  checked: boolean;
}

const DEFAULT_CATEGORY_LABELS: Record<string, string> = {
  financial: 'Financial Health & Turnover',
  reputation: 'Market Reputation',
  infrastructure: 'Shop Operations & Infrastructure',
  farmerNetwork: 'Farmer Network & Reach',
  marketPresence: 'Market Presence',
  team: 'Team & Professionalism',
  portfolio: 'Current Portfolio',
  experience: 'Experience & Openness to Bio',
  growth: 'Growth Orientation',
  compliance: 'Compliance',
};

function readCategories(dealer: Dealer | null): CategoryDisplay[] {
  const stored = (dealer?.scoring as any) || {};
  return Object.keys(stored || {}).map(key => {
    const v = stored?.[key];
    if (v && typeof v === 'object') {
      return {
        key,
        label: v.label || DEFAULT_CATEGORY_LABELS[key] || key,
        limits: v.limits,
        score: typeof v.score === 'number' ? v.score : 0,
      };
    }
    return {
      key,
      label: DEFAULT_CATEGORY_LABELS[key] || key,
      score: typeof v === 'number' ? v : 0,
    };
  });
}

function readCommitments(dealer: Dealer | null): CommitmentDisplay[] {
  const stored = (dealer?.commitments as any) || {};
  if (Array.isArray(stored)) {
    return (stored || []).map((it: any, i: number) => ({
      id: it?.id || `c${i + 1}`,
      text: String(it?.text ?? ''),
      checked: !!it?.checked,
    }));
  }
  const labelMap: Record<string, string> = {
    creditPolicy: 'Credit Policy Accepted',
    exclusivity: 'Exclusivity Agreement',
    targetAchievement: 'Target Achievement Commitment',
    returnPolicy: 'Return Policy Acknowledged',
    paymentTerms: 'Payment Terms Agreed',
  };
  return Object.keys(stored || {}).map(key => ({
    id: key,
    text: labelMap[key] || key,
    checked: !!stored?.[key],
  }));
}

const DealerDetail = ({ dealer, open, onClose }: DealerDetailProps) => {
  if (!dealer) return null;

  const categories = readCategories(dealer);
  const commitments = readCommitments(dealer);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between gap-3">
            <DialogTitle className="text-xl font-bold">{dealer.shop_name}</DialogTitle>
            <RecommendationBadge recommendation={dealer.recommendation} />
          </div>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="outline" className="text-xs">{dealer.status}</Badge>
            <span className="text-xs text-muted-foreground">
              Score: {dealer.total_score || 0}
            </span>
          </div>
        </DialogHeader>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="profiling">Profiling & Compliance</TabsTrigger>
          </TabsList>

          {/* Overview */}
          <TabsContent value="overview" className="space-y-4 pt-4">
            <div>
              <h3 className="text-sm font-semibold text-primary flex items-center gap-2">
                <Store className="h-4 w-4" /> Basic Information
              </h3>
              <Separator className="my-2" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
                <InfoRow icon={User} label="Owner" value={dealer.owner_name} />
                <InfoRow icon={Phone} label="Contact" value={dealer.contact_mobile} />
                <InfoRow icon={MapPin} label="Address" value={dealer.address} />
                <InfoRow icon={FileText} label="GST Number" value={dealer.gst_number} />
                <InfoRow icon={CreditCard} label="PAN Number" value={dealer.pan_number} />
                <InfoRow icon={Building2} label="Firm Type" value={dealer.firm_type} />
                <InfoRow icon={Calendar} label="Est. Year" value={dealer.est_year} />
                <InfoRow icon={User} label="SE Name" value={dealer.se_name} />
              </div>
              {dealer.bank_details && (
                <div className="mt-2 p-3 rounded-lg bg-muted/50 text-sm space-y-1">
                  <p className="font-medium text-xs text-muted-foreground mb-1">Bank Details</p>
                  <p>A/C: {dealer.bank_details.accountName} — {dealer.bank_details.accNo}</p>
                  <p>IFSC: {dealer.bank_details.ifsc} | Branch: {dealer.bank_details.bankBranch}</p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Profiling & Compliance — read-only */}
          <TabsContent value="profiling" className="space-y-6 pt-4">
            <section className="space-y-2">
              <h4 className="text-sm font-semibold text-primary flex items-center gap-2">
                <BarChart3 className="h-4 w-4" /> Scoring Submitted by SE
              </h4>
              <Separator />
              {(categories || []).length === 0 ? (
                <p className="text-sm text-muted-foreground pt-2">No scoring data submitted.</p>
              ) : (
                <div className="space-y-3 pt-2">
                  {(categories || []).map(c => (
                    <ScoreBar key={c.key} label={c.label} limits={c.limits} value={c.score || 0} />
                  ))}
                </div>
              )}
            </section>

            <section className="space-y-2">
              <h4 className="text-sm font-semibold text-primary flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" /> Commitments & Compliance
              </h4>
              <Separator />
              {(commitments || []).length === 0 ? (
                <p className="text-sm text-muted-foreground pt-2">No commitments recorded.</p>
              ) : (
                <div className="pt-2 space-y-1">
                  {(commitments || []).map(c => (
                    <div key={c.id} className="flex items-center gap-2 py-1">
                      {c.checked ? (
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                      ) : (
                        <X className="h-4 w-4 text-destructive" />
                      )}
                      <span className="text-sm">{c.text}</span>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <p className="text-xs text-muted-foreground italic">
              To edit scoring categories or commitment statements globally, go to Settings → Form Template.
            </p>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default DealerDetail;
