import { useMemo, useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
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

type TemplateType = 'dealer' | 'farmer' | 'distributor';

const DEALER_CATEGORIES: ScoringCategory[] = [
  { key: 'financial', label: 'Financial Health & Turnover', limits: '10-50 Lacs', maxScore: 10 },
  { key: 'reputation', label: 'Market Reputation', limits: 'Local / Regional / National', maxScore: 10 },
  { key: 'infrastructure', label: 'Shop Operations & Infrastructure', limits: 'Basic / Advanced', maxScore: 10 },
  { key: 'farmerNetwork', label: 'Farmer Network & Reach', limits: '50-200+', maxScore: 10 },
  { key: 'team', label: 'Team & Professionalism', limits: '1-10 staff', maxScore: 10 },
  { key: 'portfolio', label: 'Current Portfolio', limits: '5-20 brands', maxScore: 10 },
  { key: 'experience', label: 'Experience & Openness to Bio', limits: '1-10 years', maxScore: 10 },
  { key: 'growth', label: 'Growth Orientation', limits: '2.5-7.5 Lacs', maxScore: 10 },
];

const DEALER_COMMITMENTS: CommitmentItem[] = [
  { id: 'c1', text: 'GLS Commitments Accepted', checkedByDefault: true },
  { id: 'c2', text: 'Regulatory Compliance Checklist', checkedByDefault: true },
  { id: 'c3', text: 'Credit Policy Accepted', checkedByDefault: true },
  { id: 'c4', text: 'Exclusivity Agreement', checkedByDefault: false },
  { id: 'c5', text: 'Payment Terms Agreed', checkedByDefault: true },
];

const FARMER_CATEGORIES: ScoringCategory[] = [
  { key: 'landSize', label: 'Land Holding Size', limits: '1-10 acres', maxScore: 10 },
  { key: 'irrigation', label: 'Irrigation Access', limits: 'Borewell / Canal / Drip / Rainfed', maxScore: 10 },
  { key: 'cropDiversity', label: 'Crop Diversity', limits: '1-5 crops', maxScore: 10 },
  { key: 'bioAdoption', label: 'Openness to Bio Inputs', limits: 'Low / Medium / High', maxScore: 10 },
  { key: 'incomeBracket', label: 'Annual Income Bracket', limits: '1-10 Lacs', maxScore: 10 },
  { key: 'techAdoption', label: 'Technology Adoption', limits: 'Basic / Advanced', maxScore: 10 },
];

const FARMER_COMMITMENTS: CommitmentItem[] = [
  { id: 'fc1', text: 'KYC / Aadhaar Verified', checkedByDefault: true },
  { id: 'fc2', text: 'Land Ownership Declaration', checkedByDefault: true },
  { id: 'fc3', text: 'Willing to Adopt Bio Inputs', checkedByDefault: false },
  { id: 'fc4', text: 'Consent for Field Visits', checkedByDefault: true },
];

const DISTRIBUTOR_CATEGORIES: ScoringCategory[] = [
  { key: 'turnover', label: 'Annual Turnover', limits: '50 Lacs - 5 Cr', maxScore: 10 },
  { key: 'warehouse', label: 'Warehouse Capacity', limits: '50-500 tons', maxScore: 10 },
  { key: 'logistics', label: 'Logistics & Fleet', limits: '1-10 vehicles', maxScore: 10 },
  { key: 'dealerNetwork', label: 'Dealer Network Coverage', limits: '20-200 dealers', maxScore: 10 },
  { key: 'creditworthiness', label: 'Creditworthiness', limits: 'Low / Medium / High', maxScore: 10 },
  { key: 'regionalReach', label: 'Regional Reach', limits: 'District / State / Multi-State', maxScore: 10 },
  { key: 'compliance', label: 'GST & Regulatory Compliance', limits: 'Basic / Full', maxScore: 10 },
];

const DISTRIBUTOR_COMMITMENTS: CommitmentItem[] = [
  { id: 'dc1', text: 'GST Registration Verified', checkedByDefault: true },
  { id: 'dc2', text: 'Warehouse Inspection Cleared', checkedByDefault: true },
  { id: 'dc3', text: 'Distribution Agreement Signed', checkedByDefault: true },
  { id: 'dc4', text: 'Exclusivity Clause Accepted', checkedByDefault: false },
  { id: 'dc5', text: 'Payment & Credit Terms Agreed', checkedByDefault: true },
];

interface SettingsPageProps {
  onLogout: () => void;
}

interface TemplateEditorProps {
  type: TemplateType;
  title: string;
  categories: ScoringCategory[];
  commitments: CommitmentItem[];
  setCategories: React.Dispatch<React.SetStateAction<ScoringCategory[]>>;
  setCommitments: React.Dispatch<React.SetStateAction<CommitmentItem[]>>;
}

const TemplateEditor = ({
  type,
  title,
  categories,
  commitments,
  setCategories,
  setCommitments,
}: TemplateEditorProps) => {
  const totalMax = useMemo(
    () => (categories || []).reduce((sum, c) => sum + (Number(c?.maxScore) || 0), 0),
    [categories],
  );

  const updateCategory = (idx: number, patch: Partial<ScoringCategory>) => {
    setCategories(prev => (prev || []).map((c, i) => (i === idx ? { ...c, ...patch } : c)));
  };

  const addCategory = () => {
    setCategories(prev => [
      ...(prev || []),
      { key: `cat_${Date.now()}`, label: 'New criterion', limits: '', maxScore: 10 },
    ]);
  };

  const deleteCategory = (idx: number) => {
    setCategories(prev => (prev || []).filter((_, i) => i !== idx));
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
      type,
      scoring_schema: (categories || []).map(c => ({
        key: c.key,
        label: c.label,
        limits: c.limits,
        max_score: c.maxScore,
      })),
      commitments_schema: (commitments || []).map(c => ({
        id: c.id,
        text: c.text,
        checked_by_default: c.checkedByDefault,
      })),
    };

    try {
      if (type === 'dealer') {
        // TODO: supabase.from('form_templates').upsert({ type: 'dealer', scoring_schema: ..., commitments_schema: ... })
      } else if (type === 'farmer') {
        // TODO: supabase.from('form_templates').upsert({ type: 'farmer', scoring_schema: ..., commitments_schema: ... })
      } else if (type === 'distributor') {
        // TODO: supabase.from('form_templates').upsert({ type: 'distributor', scoring_schema: ..., commitments_schema: ... })
      }
      console.log(`[Form Template - ${type}] Save payload:`, template);
      toast.success(`${title} saved`);
    } catch {
      toast.error(`Failed to save ${title}`);
    }
  };

  const saveLabel =
    type === 'dealer'
      ? 'Save Dealer Template'
      : type === 'farmer'
      ? 'Save Farmer Template'
      : 'Save Distributor Template';

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <p className="text-sm text-muted-foreground">
          Manage the global onboarding form template used by field SEs for {type}s.
        </p>
        <Button onClick={handleSave} className="gap-1">
          <Save className="h-4 w-4" /> {saveLabel}
        </Button>
      </div>

      {/* Section B: Scoring Categories */}
      <section className="space-y-2">
        <h3 className="text-sm font-semibold text-primary flex items-center gap-2">
          <BarChart3 className="h-4 w-4" /> Scoring / Evaluation Criteria
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
                <label className="text-xs text-muted-foreground">Criterion</label>
                <Input
                  value={c?.label || ''}
                  onChange={e => updateCategory(idx, { label: e.target.value })}
                  className="h-9 mt-1"
                />
              </div>
              <div className="col-span-8 sm:col-span-5">
                <label className="text-xs text-muted-foreground">Evaluation limits / parameters</label>
                <Input
                  value={c?.limits || ''}
                  onChange={e => updateCategory(idx, { limits: e.target.value })}
                  placeholder="e.g. 10-15L"
                  className="h-9 mt-1"
                />
              </div>
              <div className="col-span-3 sm:col-span-2">
                <label className="text-xs text-muted-foreground">Max score</label>
                <Input
                  type="number"
                  min={1}
                  max={10}
                  value={c?.maxScore ?? 0}
                  onChange={e => {
                    const v = Math.max(1, Math.min(10, Number(e.target.value) || 0));
                    updateCategory(idx, { maxScore: v });
                  }}
                  className="h-9 mt-1"
                />
              </div>
              <div className="col-span-1 flex items-end justify-end h-full">
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => deleteCategory(idx)}
                  aria-label="Delete criterion"
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </div>
          ))}
          <Button size="sm" variant="outline" onClick={addCategory} className="gap-1">
            <Plus className="h-4 w-4" /> Add criterion
          </Button>
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
                checked={c?.checkedByDefault}
                onCheckedChange={v => updateCommitment(c.id, { checkedByDefault: !!v })}
                aria-label="Checked by default"
              />
              <Input
                value={c?.text || ''}
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
          <Save className="h-4 w-4" /> {saveLabel}
        </Button>
      </div>
    </div>
  );
};

const SettingsPage = ({ onLogout }: SettingsPageProps) => {
  const [dealerCategories, setDealerCategories] = useState<ScoringCategory[]>(DEALER_CATEGORIES);
  const [dealerCommitments, setDealerCommitments] = useState<CommitmentItem[]>(DEALER_COMMITMENTS);

  const [farmerCategories, setFarmerCategories] = useState<ScoringCategory[]>(FARMER_CATEGORIES);
  const [farmerCommitments, setFarmerCommitments] = useState<CommitmentItem[]>(FARMER_COMMITMENTS);

  const [distributorCategories, setDistributorCategories] =
    useState<ScoringCategory[]>(DISTRIBUTOR_CATEGORIES);
  const [distributorCommitments, setDistributorCommitments] =
    useState<CommitmentItem[]>(DISTRIBUTOR_COMMITMENTS);

  return (
    <AppLayout onLogout={onLogout}>
      <div>
        <h2 className="text-lg font-semibold mb-1 flex items-center gap-2">
          <SettingsIcon className="h-5 w-5 text-primary" /> Form Settings
        </h2>
        <p className="text-sm text-muted-foreground">
          Manage global onboarding form templates for Dealers, Farmers, and Distributors.
        </p>
      </div>

      <Tabs defaultValue="dealers" className="w-full">
        <TabsList className="grid grid-cols-3 w-full max-w-xl">
          <TabsTrigger value="dealers">Dealer Template</TabsTrigger>
          <TabsTrigger value="farmers">Farmer Template</TabsTrigger>
          <TabsTrigger value="distributors">Distributor Template</TabsTrigger>
        </TabsList>

        <TabsContent value="dealers" className="mt-4">
          <TemplateEditor
            type="dealer"
            title="Dealer Template"
            categories={dealerCategories}
            commitments={dealerCommitments}
            setCategories={setDealerCategories}
            setCommitments={setDealerCommitments}
          />
        </TabsContent>

        <TabsContent value="farmers" className="mt-4">
          <TemplateEditor
            type="farmer"
            title="Farmer Template"
            categories={farmerCategories}
            commitments={farmerCommitments}
            setCategories={setFarmerCategories}
            setCommitments={setFarmerCommitments}
          />
        </TabsContent>

        <TabsContent value="distributors" className="mt-4">
          <TemplateEditor
            type="distributor"
            title="Distributor Template"
            categories={distributorCategories}
            commitments={distributorCommitments}
            setCategories={setDistributorCategories}
            setCommitments={setDistributorCommitments}
          />
        </TabsContent>
      </Tabs>
    </AppLayout>
  );
};

export default SettingsPage;
