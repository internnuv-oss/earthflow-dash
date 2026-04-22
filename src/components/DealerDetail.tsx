import { useEffect, useMemo, useState } from 'react';
import { Dealer } from '@/types/dealer';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import RecommendationBadge from './RecommendationBadge';
import {
  Store, User, Phone, MapPin, FileText, Building2, Calendar,
  CreditCard, CheckCircle2, BarChart3, Pencil, X, Plus, Trash2, Save,
} from 'lucide-react';

interface ScoringCategory {
  key: string;
  label: string;
  limits: string;
  score: number;
}

interface CommitmentItemEdit {
  id: string;
  text: string;
  checked: boolean;
}

const DEFAULT_CATEGORIES: ScoringCategory[] = [
  { key: 'financial', label: 'Financial Health & Turnover', limits: '10-50 Lacs', score: 5 },
  { key: 'reputation', label: 'Market Reputation', limits: 'Local / Regional', score: 5 },
  { key: 'infrastructure', label: 'Shop Operations & Infrastructure', limits: 'Basic / Advanced', score: 5 },
  { key: 'farmerNetwork', label: 'Farmer Network & Reach', limits: '50-200+', score: 5 },
  { key: 'team', label: 'Team & Professionalism', limits: '1-10 staff', score: 5 },
  { key: 'portfolio', label: 'Current Portfolio', limits: '5-20 brands', score: 5 },
  { key: 'experience', label: 'Experience & Openness to Bio', limits: '1-10 years', score: 5 },
  { key: 'growth', label: 'Growth Orientation', limits: '2.5-7.5 Lacs', score: 5 },
];

const DEFAULT_COMMITMENTS: CommitmentItemEdit[] = [
  { id: 'c1', text: 'GLS Commitments Accepted', checked: true },
  { id: 'c2', text: 'Regulatory Compliance Checklist', checked: true },
  { id: 'c3', text: 'Credit Policy Accepted', checked: true },
  { id: 'c4', text: 'Exclusivity Agreement', checked: false },
  { id: 'c5', text: 'Payment Terms Agreed', checked: true },
];

interface DealerDetailProps {
  dealer: Dealer | null;
  open: boolean;
  onClose: () => void;
  onSave?: (dealerId: string, updates: { scoring: any; commitments: any; total_score: number }) => void;
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

const ScoreBar = ({ label, value, max = 10 }: { label: string; value: number; max?: number }) => (
  <div className="space-y-1">
    <div className="flex justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-semibold">{value}/{max}</span>
    </div>
    <div className="h-2 rounded-full bg-muted overflow-hidden">
      <div
        className="h-full rounded-full bg-primary transition-all"
        style={{ width: `${(value / max) * 100}%` }}
      />
    </div>
  </div>
);

function deriveCategories(dealer: Dealer | null): ScoringCategory[] {
  const stored = (dealer?.scoring as any) || {};
  return DEFAULT_CATEGORIES.map(cat => {
    const existing = stored?.[cat.key];
    if (existing && typeof existing === 'object') {
      return {
        ...cat,
        limits: existing.limits || cat.limits,
        score: typeof existing.score === 'number' ? existing.score : cat.score,
      };
    }
    if (typeof existing === 'number') {
      return { ...cat, score: existing };
    }
    return cat;
  });
}

function deriveCommitments(dealer: Dealer | null): CommitmentItemEdit[] {
  const stored = (dealer?.commitments as any) || {};
  if (Array.isArray(stored)) {
    return (stored || []).map((it: any, i: number) => ({
      id: it?.id || `c${i + 1}`,
      text: String(it?.text ?? ''),
      checked: !!it?.checked,
    }));
  }
  // Map legacy boolean object to default labels, preserving stored booleans where possible
  return DEFAULT_COMMITMENTS.map(d => {
    const legacyKey = d.text.toLowerCase().includes('credit') ? 'creditPolicy'
      : d.text.toLowerCase().includes('exclusivity') ? 'exclusivity'
      : d.text.toLowerCase().includes('payment') ? 'paymentTerms'
      : null;
    if (legacyKey && typeof stored?.[legacyKey] === 'boolean') {
      return { ...d, checked: stored[legacyKey] };
    }
    return d;
  });
}

const DealerDetail = ({ dealer, open, onClose, onSave }: DealerDetailProps) => {
  const [editMode, setEditMode] = useState(false);
  const [categories, setCategories] = useState<ScoringCategory[]>([]);
  const [commitments, setCommitments] = useState<CommitmentItemEdit[]>([]);

  useEffect(() => {
    setCategories(deriveCategories(dealer));
    setCommitments(deriveCommitments(dealer));
    setEditMode(false);
  }, [dealer]);

  const totalScore = useMemo(
    () => (categories || []).reduce((sum, c) => sum + (Number(c?.score) || 0), 0),
    [categories],
  );

  if (!dealer) return null;

  const updateCategory = (idx: number, patch: Partial<ScoringCategory>) => {
    setCategories(prev => prev.map((c, i) => (i === idx ? { ...c, ...patch } : c)));
  };

  const updateCommitment = (id: string, patch: Partial<CommitmentItemEdit>) => {
    setCommitments(prev => (prev || []).map(c => (c.id === id ? { ...c, ...patch } : c)));
  };

  const addCommitment = () => {
    setCommitments(prev => [
      ...(prev || []),
      { id: `c${Date.now()}`, text: 'New commitment', checked: false },
    ]);
  };

  const deleteCommitment = (id: string) => {
    setCommitments(prev => (prev || []).filter(c => c.id !== id));
  };

  const handleSave = async () => {
    const updatedScoring = (categories || []).reduce<Record<string, any>>((acc, c) => {
      acc[c.key] = { label: c.label, limits: c.limits, score: c.score };
      return acc;
    }, {});
    const updatedCommitments = (commitments || []).map(c => ({
      id: c.id,
      text: c.text,
      checked: c.checked,
    }));

    try {
      // TODO: Wire to Supabase once Lovable Cloud is enabled:
      // await supabase.from('dealers').update({
      //   scoring: updatedScoring,
      //   commitments: updatedCommitments,
      //   total_score: totalScore,
      // }).eq('id', dealer.id);
      onSave?.(dealer.id, {
        scoring: updatedScoring,
        commitments: updatedCommitments,
        total_score: totalScore,
      });
      toast.success('Profiling details saved');
      setEditMode(false);
    } catch (e) {
      toast.error('Failed to save changes');
    }
  };

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
              Score: {editMode ? totalScore : (dealer.total_score || totalScore)}/80
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

          {/* Profiling & Compliance */}
          <TabsContent value="profiling" className="space-y-6 pt-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-semibold">Profiling Details</h3>
                <p className="text-xs text-muted-foreground">
                  {editMode ? 'Edit scoring categories and commitments below.' : 'Read-only view of evaluation and commitments.'}
                </p>
              </div>
              {editMode ? (
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => {
                    setCategories(deriveCategories(dealer));
                    setCommitments(deriveCommitments(dealer));
                    setEditMode(false);
                  }}>
                    <X className="h-4 w-4 mr-1" /> Cancel
                  </Button>
                  <Button size="sm" onClick={handleSave}>
                    <Save className="h-4 w-4 mr-1" /> Save Changes
                  </Button>
                </div>
              ) : (
                <Button size="sm" variant="outline" onClick={() => setEditMode(true)}>
                  <Pencil className="h-4 w-4 mr-1" /> Edit Profiling Details
                </Button>
              )}
            </div>

            {/* Section B: Scoring */}
            <section className="space-y-2">
              <h4 className="text-sm font-semibold text-primary flex items-center gap-2">
                <BarChart3 className="h-4 w-4" /> Scoring Configuration
                <span className="ml-auto text-xs text-muted-foreground font-normal">
                  Total: <span className="font-semibold text-foreground">{totalScore}/80</span>
                </span>
              </h4>
              <Separator />

              {!editMode ? (
                <div className="space-y-3 pt-2">
                  {(categories || []).map(c => (
                    <div key={c.key} className="space-y-1">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-foreground">{c.label}</span>
                        <span className="text-xs text-muted-foreground">{c.limits}</span>
                      </div>
                      <ScoreBar label="" value={c.score || 0} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-3 pt-2">
                  {(categories || []).map((c, idx) => (
                    <div key={c.key} className="grid grid-cols-12 gap-2 items-center p-2 rounded-md border border-border">
                      <div className="col-span-12 sm:col-span-5 text-sm font-medium">{c.label}</div>
                      <div className="col-span-8 sm:col-span-5">
                        <Input
                          value={c.limits}
                          onChange={(e) => updateCategory(idx, { limits: e.target.value })}
                          placeholder="Evaluation limits"
                          className="h-9"
                        />
                      </div>
                      <div className="col-span-4 sm:col-span-2">
                        <Input
                          type="number"
                          min={1}
                          max={10}
                          value={c.score}
                          onChange={(e) => {
                            const v = Math.max(1, Math.min(10, Number(e.target.value) || 0));
                            updateCategory(idx, { score: v });
                          }}
                          className="h-9"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Section C: Commitments */}
            <section className="space-y-2">
              <h4 className="text-sm font-semibold text-primary flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" /> Commitments & Compliance
              </h4>
              <Separator />

              {!editMode ? (
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
              ) : (
                <div className="pt-2 space-y-2">
                  {(commitments || []).map(c => (
                    <div key={c.id} className="flex items-center gap-2 p-2 rounded-md border border-border">
                      <Checkbox
                        checked={c.checked}
                        onCheckedChange={(v) => updateCommitment(c.id, { checked: !!v })}
                      />
                      <Input
                        value={c.text}
                        onChange={(e) => updateCommitment(c.id, { text: e.target.value })}
                        className="h-9 flex-1"
                      />
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => deleteCommitment(c.id)}
                        aria-label="Delete commitment"
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  ))}
                  <Button size="sm" variant="outline" onClick={addCommitment} className="gap-1">
                    <Plus className="h-4 w-4" /> Add commitment
                  </Button>
                </div>
              )}
            </section>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default DealerDetail;
