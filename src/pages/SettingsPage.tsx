import { useMemo, useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { BarChart3, CheckCircle2, Plus, Trash2, Save, Settings as SettingsIcon } from 'lucide-react';

interface ScoringCategory {
  key: string;
  label: string;
  limits: string;
  maxScore: number;
}

interface CommitmentItem {
  id: string;
  text: string;
  checkedByDefault: boolean;
}

const DEFAULT_CATEGORIES: ScoringCategory[] = [
  { key: 'financial', label: 'Financial Health & Turnover', limits: '10-50 Lacs', maxScore: 10 },
  { key: 'reputation', label: 'Market Reputation', limits: 'Local / Regional / National', maxScore: 10 },
  { key: 'infrastructure', label: 'Shop Operations & Infrastructure', limits: 'Basic / Advanced', maxScore: 10 },
  { key: 'farmerNetwork', label: 'Farmer Network & Reach', limits: '50-200+', maxScore: 10 },
  { key: 'team', label: 'Team & Professionalism', limits: '1-10 staff', maxScore: 10 },
  { key: 'portfolio', label: 'Current Portfolio', limits: '5-20 brands', maxScore: 10 },
  { key: 'experience', label: 'Experience & Openness to Bio', limits: '1-10 years', maxScore: 10 },
  { key: 'growth', label: 'Growth Orientation', limits: '2.5-7.5 Lacs', maxScore: 10 },
];

const DEFAULT_COMMITMENTS: CommitmentItem[] = [
  { id: 'c1', text: 'GLS Commitments Accepted', checkedByDefault: true },
  { id: 'c2', text: 'Regulatory Compliance Checklist', checkedByDefault: true },
  { id: 'c3', text: 'Credit Policy Accepted', checkedByDefault: true },
  { id: 'c4', text: 'Exclusivity Agreement', checkedByDefault: false },
  { id: 'c5', text: 'Payment Terms Agreed', checkedByDefault: true },
];

interface SettingsPageProps {
  onLogout: () => void;
}

const SettingsPage = ({ onLogout }: SettingsPageProps) => {
  const [categories, setCategories] = useState<ScoringCategory[]>(DEFAULT_CATEGORIES);
  const [commitments, setCommitments] = useState<CommitmentItem[]>(DEFAULT_COMMITMENTS);

  const totalMax = useMemo(
    () => (categories || []).reduce((sum, c) => sum + (Number(c?.maxScore) || 0), 0),
    [categories],
  );

  const updateCategory = (idx: number, patch: Partial<ScoringCategory>) => {
    setCategories(prev => (prev || []).map((c, i) => (i === idx ? { ...c, ...patch } : c)));
  };

  const updateCommitment = (id: string, patch: Partial<CommitmentItem>) => {
    setCommitments(prev => (prev || []).map(c => (c.id === id ? { ...c, ...patch } : c)));
  };

  const addCommitment = () => {
    setCommitments(prev => [
      ...(prev || []),
      { id: `c${Date.now()}`, text: 'New commitment', checkedByDefault: false },
    ]);
  };

  const deleteCommitment = (id: string) => {
    setCommitments(prev => (prev || []).filter(c => c.id !== id));
  };

  const handleSave = async () => {
    const template = {
      scoring_categories: (categories || []).map(c => ({
        key: c.key,
        label: c.label,
        limits: c.limits,
        max_score: c.maxScore,
      })),
      commitments: (commitments || []).map(c => ({
        id: c.id,
        text: c.text,
        checked_by_default: c.checkedByDefault,
      })),
    };

    try {
      // TODO: Wire to Supabase once Lovable Cloud is enabled, e.g.:
      // await supabase
      //   .from('form_templates')
      //   .upsert({ name: 'dealer_onboarding', template, updated_at: new Date().toISOString() });
      console.log('[Form Template - Dealer Onboarding] Save payload:', template);
      toast.success('Global form template saved');
    } catch {
      toast.error('Failed to save template');
    }
  };

  return (
    <AppLayout onLogout={onLogout}>
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h2 className="text-lg font-semibold mb-1 flex items-center gap-2">
            <SettingsIcon className="h-5 w-5 text-primary" /> Form Settings
          </h2>
          <p className="text-sm text-muted-foreground">
            Manage the global Dealer Onboarding form template used by field SEs.
          </p>
        </div>
        <Button onClick={handleSave} className="gap-1">
          <Save className="h-4 w-4" /> Save Global Template
        </Button>
      </div>

      {/* Section B: Scoring Categories */}
      <section className="space-y-2">
        <h3 className="text-sm font-semibold text-primary flex items-center gap-2">
          <BarChart3 className="h-4 w-4" /> Scoring Categories
          <span className="ml-auto text-xs text-muted-foreground font-normal">
            Total max: <span className="font-semibold text-foreground">{totalMax}</span>
          </span>
        </h3>
        <Separator />
        <div className="space-y-2 pt-2">
          {(categories || []).map((c, idx) => (
            <div
              key={c.key}
              className="grid grid-cols-12 gap-2 items-center p-3 rounded-md border border-border bg-card"
            >
              <div className="col-span-12 sm:col-span-4">
                <label className="text-xs text-muted-foreground">Category</label>
                <Input
                  value={c.label}
                  onChange={e => updateCategory(idx, { label: e.target.value })}
                  className="h-9 mt-1"
                />
              </div>
              <div className="col-span-8 sm:col-span-6">
                <label className="text-xs text-muted-foreground">Evaluation limits / parameters</label>
                <Input
                  value={c.limits}
                  onChange={e => updateCategory(idx, { limits: e.target.value })}
                  placeholder="e.g. 10-15L"
                  className="h-9 mt-1"
                />
              </div>
              <div className="col-span-4 sm:col-span-2">
                <label className="text-xs text-muted-foreground">Max score</label>
                <Input
                  type="number"
                  min={1}
                  max={10}
                  value={c.maxScore}
                  onChange={e => {
                    const v = Math.max(1, Math.min(10, Number(e.target.value) || 0));
                    updateCategory(idx, { maxScore: v });
                  }}
                  className="h-9 mt-1"
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Section C: Commitments */}
      <section className="space-y-2">
        <h3 className="text-sm font-semibold text-primary flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4" /> Commitments & Compliance Statements
        </h3>
        <Separator />
        <div className="pt-2 space-y-2">
          {(commitments || []).map(c => (
            <div
              key={c.id}
              className="flex items-center gap-2 p-2 rounded-md border border-border bg-card"
            >
              <Checkbox
                checked={c.checkedByDefault}
                onCheckedChange={v => updateCommitment(c.id, { checkedByDefault: !!v })}
                aria-label="Checked by default"
              />
              <Input
                value={c.text}
                onChange={e => updateCommitment(c.id, { text: e.target.value })}
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
      </section>

      <div className="flex justify-end pt-2">
        <Button onClick={handleSave} className="gap-1">
          <Save className="h-4 w-4" /> Save Global Template
        </Button>
      </div>
    </AppLayout>
  );
};

export default SettingsPage;
