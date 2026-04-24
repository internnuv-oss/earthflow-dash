import { useMemo, useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Card } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion';
import { toast } from 'sonner';
import {
  BarChart3,
  CheckCircle2,
  FileText,
  Plus,
  Trash2,
  Save,
  Settings as SettingsIcon,
  X,
} from 'lucide-react';

interface ScoringTier {
  id: string;
  scoreThreshold: number;
  col1Value: string;
  col2Value: string;
}

interface ScoringCategory {
  key: string;
  label: string;
  col1Header: string;
  col2Header: string;
  tiers: ScoringTier[];
  maxScore: number;
}

interface CommitmentItem {
  id: string;
  text: string;
  checkedByDefault: boolean;
}

interface AgreementTerm {
  id: string;
  title: string;
  content: string;
}

type TemplateType = 'dealer' | 'farmer' | 'distributor';

const defaultTiers = (
  pairs: Array<[number, string, string]>,
): ScoringTier[] =>
  pairs.map(([score, c1, c2], i) => ({
    id: `t${i + 1}`,
    scoreThreshold: score,
    col1Value: c1,
    col2Value: c2,
  }));

const DEALER_CATEGORIES: ScoringCategory[] = [
  {
    key: 'scoreFinancial',
    label: 'Financial Health & Turnover',
    col1Header: 'Annual Turnover (INR)',
    col2Header: 'Payment Discipline / Evidence',
    maxScore: 10,
    tiers: defaultTiers([
      [2, '₹5L - ₹10L', 'Frequent defaults; relies on local high-interest lenders; high debt.'],
      [4, '₹10L - ₹25L', '"Hand-to-mouth" cash flow; pays only after 60+ days or multiple reminders.'],
      [6, '₹25L - ₹60L', 'Stable; pays within standard 30-day credit cycles; uses bank CC limits.'],
      [8, '₹60L - ₹1 Cr', 'Strong liquidity; pays before due dates; high credit limit with MNCs.'],
      [10, '> ₹1 Cr', 'Cash-rich; often pays advance for extra margins; zero payment friction.'],
    ]),
  },
  {
    key: 'scoreReputation',
    label: 'Market Reputation',
    col1Header: 'Farmer & Peer Feedback',
    col2Header: 'Remarks / Evidence',
    maxScore: 10,
    tiers: defaultTiers([
      [2, 'Negative feedback', 'Known for selling "expired" or "substandard" stock; price-cutter.'],
      [4, 'Neutral/Basic', 'Perceived as a "small player"; farmers go there only for convenience.'],
      [6, 'Reliable', 'Known for fair pricing and providing standard, genuine products.'],
      [8, 'Respected Advisor', 'Farmers seek his advice on pest management; high ethical standing.'],
      [10, 'Market Leader', 'Influences village-level decisions; acts as a "community leader."'],
    ]),
  },
  {
    key: 'scoreOperations',
    label: 'Shop Operations & Infrastructure',
    col1Header: 'Shop Setup',
    col2Header: 'Remarks / Evidence',
    maxScore: 10,
    tiers: defaultTiers([
      [2, 'Very Basic', 'Single counter; no storage; mixed/unorganized stock.'],
      [4, 'Basic', 'Limited shelving; minimal display; informal billing.'],
      [6, 'Standard', 'Organized shelves; computerized billing; basic storage.'],
      [8, 'Advanced', 'Branded display; AC storage for sensitive products; trained staff.'],
      [10, 'Premium', 'Multi-location; warehouse; digital POS; demo / training rooms.'],
    ]),
  },
  {
    key: 'scoreFarmerNetwork',
    label: 'Farmer Network & Reach',
    col1Header: 'Active Farmer Base',
    col2Header: 'Remarks / Evidence',
    maxScore: 10,
    tiers: defaultTiers([
      [2, '< 50 farmers', 'Walk-in only; no farmer database; limited village reach.'],
      [4, '50 - 150 farmers', 'Local village reach; informal farmer contact list.'],
      [6, '150 - 400 farmers', 'Multi-village reach; maintains farmer ledger / WhatsApp groups.'],
      [8, '400 - 800 farmers', 'Strong taluk-level network; runs farmer meetings regularly.'],
      [10, '> 800 farmers', 'District-level influence; organized farmer events and demos.'],
    ]),
  },
];

const FARMER_CATEGORIES: ScoringCategory[] = [
  {
    key: 'landSize',
    label: 'Land Holding Size',
    col1Header: 'Acres Owned',
    col2Header: 'Remarks / Evidence',
    maxScore: 10,
    tiers: defaultTiers([
      [2, '< 1 acre', 'Marginal; subsistence farming.'],
      [4, '1 - 3 acres', 'Small holding; mixed crops.'],
      [6, '3 - 6 acres', 'Medium holding; some commercial crops.'],
      [8, '6 - 10 acres', 'Large holding; clear commercial focus.'],
      [10, '> 10 acres', 'Very large; progressive commercial farmer.'],
    ]),
  },
];

const DISTRIBUTOR_CATEGORIES: ScoringCategory[] = [
  {
    key: 'turnover',
    label: 'Annual Turnover',
    col1Header: 'Turnover (INR)',
    col2Header: 'Remarks / Evidence',
    maxScore: 10,
    tiers: defaultTiers([
      [2, '< ₹50L', 'Sub-scale; minimal market presence.'],
      [4, '₹50L - ₹1 Cr', 'Small distributor; localized.'],
      [6, '₹1 Cr - ₹3 Cr', 'Mid-scale; multi-district reach.'],
      [8, '₹3 Cr - ₹5 Cr', 'Large; state-level presence.'],
      [10, '> ₹5 Cr', 'Top-tier; multi-state operations.'],
    ]),
  },
];

const DEALER_COMMITMENTS: CommitmentItem[] = [
  { id: 'c1', text: 'GLS Commitments Accepted', checkedByDefault: true },
  { id: 'c2', text: 'Regulatory Compliance Checklist', checkedByDefault: true },
  { id: 'c3', text: 'Credit Policy Accepted', checkedByDefault: true },
  { id: 'c4', text: 'Exclusivity Agreement', checkedByDefault: false },
  { id: 'c5', text: 'Payment Terms Agreed', checkedByDefault: true },
];

const FARMER_COMMITMENTS: CommitmentItem[] = [
  { id: 'fc1', text: 'KYC / Aadhaar Verified', checkedByDefault: true },
  { id: 'fc2', text: 'Land Ownership Declaration', checkedByDefault: true },
  { id: 'fc3', text: 'Willing to Adopt Bio Inputs', checkedByDefault: false },
  { id: 'fc4', text: 'Consent for Field Visits', checkedByDefault: true },
];

const DISTRIBUTOR_COMMITMENTS: CommitmentItem[] = [
  { id: 'dc1', text: 'GST Registration Verified', checkedByDefault: true },
  { id: 'dc2', text: 'Warehouse Inspection Cleared', checkedByDefault: true },
  { id: 'dc3', text: 'Distribution Agreement Signed', checkedByDefault: true },
  { id: 'dc4', text: 'Exclusivity Clause Accepted', checkedByDefault: false },
  { id: 'dc5', text: 'Payment & Credit Terms Agreed', checkedByDefault: true },
];

const INITIAL_DEALER_AGREEMENT: AgreementTerm[] = [
  { id: 'a1', title: 'Annexure – A: Territory Coverage', content: 'Talukas covered:\nVillages covered:\nTotal cultivable area:\nMajor crops in territory:' },
  { id: 'a2', title: 'Annexure – B: Principal Companies & Product Range', content: '1. Principal suppliers:\n2. Chemical products range:\n3. Biological / organic products range:\n4. Other products:' },
  { id: 'a3', title: 'Annexure – C: Infrastructure Details', content: 'Godown / storage capacity:\nPhotos:' },
  { id: 'a4', title: 'Annexure – D: Bank & Credit References', content: 'List of references with Name, Contact, and Behavior/Feedback.' },
  { id: 'a5', title: 'Annexure – E: Monthly Sales Reporting Format', content: 'Confirmation that they will share monthly GLS sales breakup (dealer-wise, crop-wise).' },
  { id: 'a6', title: 'Annexure – F: Future Expansion Plan', content: 'Their 2-year growth vision and willingness to focus on biologicals.' },
  { id: 't0', title: 'Terms & Conditions Introduction', content: 'The following terms form an integral part of the Dealer Appointment Letter / MoU and are binding upon signing.' },
  { id: 't1', title: '1. Territory:', content: 'The Dealer shall operate primarily in the villages / area mentioned in Annexure A. The Dealer agrees not to actively sell GLS products outside the agreed area without prior approval.' },
  { id: 't2', title: '2. Status & Focus:', content: 'As an Authorised Dealer, the Dealer can directly honour GLS farmer schemes, loyalty benefits, and Farm Card discounts.\nAs an Exclusive Dealer, the Dealer shall focus primarily on GLS biological products and receive maximum field and marketing support.' },
  { id: 't3', title: '3. Payment Terms:', content: 'Payment to be made to the linked Distributor as per mutually agreed terms.\nTimely payment is essential to maintain smooth supply and scheme benefits.\nDelayed payments may result in temporary suspension of supplies or scheme eligibility.' },
  { id: 't4', title: '4. Security Deposit:', content: '(if applicable) A nominal refundable security deposit may be required as per Distributor / GLS policy.' },
  { id: 't5', title: '5. Stock Maintenance:', content: 'The Dealer shall maintain adequate stock of GLS products to meet local farmer demand and shall store them properly (cool, dry place, away from direct sunlight).' },
  { id: 't6', title: '6. Technical & Marketing Support from GLS:', content: 'Access to dedicated Field Executives for farmer guidance and demonstrations.\nCrop-specific packages, Farm Card + Calendar, application training, and promotional material.\nFull participation in company-funded loyalty program and special schemes.' },
  { id: 't7', title: '7. Dealer Obligations:', content: '• Promote GLS products following recommended crop packages and practices.\n• Allow GLS Field Executives to engage directly with farmers linked to the shop.\n• Honour Farm Card, loyalty benefits, and crop-specific discounts for eligible farmers.\n• Maintain proper records of sales and farmer feedback.\n• Ensure the shop has valid FCO authorization and Insecticide selling license (where required).\n• Participate in demonstrations, farmer meetings, and training programs organized by GLS.' },
  { id: 't8', title: '8. Legal & Compliance:', content: 'The Dealer must hold and maintain all necessary licenses (FCO for biofertilizers, Insecticide License for biopesticides, GST, Shop & Establishment). GLS shall not be responsible for any legal issues arising from the Dealer\u2019s non-compliance.' },
  { id: 't9', title: '9. Data Sharing and Confidentiality:', content: 'The Dealer agrees to share with GLS (and its authorised Field Executives) all necessary data generated during the partnership, including but not limited to:\n• Farmer details (name, contact, farm location, crop history, Farm Card records, application data, yield feedback).\n• Sales records of GLS products.\n• Any other information required for technical support, loyalty program execution, monitoring results, and business improvement.' },
  { id: 't9a', title: 'Obligations (Under Clause 9):', content: 'All shared data will be used by GLS only for the purpose of supporting farmers, implementing crop packages, running the loyalty program, and strengthening the partnership.\nThe Dealer shall collect farmer consent where personal data is involved and shall comply with applicable data protection laws.\nBoth parties shall keep all shared information confidential and shall not disclose it to any third party without prior written consent, except as required by law.\nUpon termination or request, the Dealer shall return or securely delete all GLS-related data in its possession.\nGLS shall similarly protect any confidential business information of the Dealer.' },
  { id: 't10', title: '10. Termination:', content: 'Either party may terminate the appointment with 30 days\u2019 written notice. Immediate termination may occur for breach of payment, license violation, misuse of data, or actions damaging GLS reputation. On termination, all pending dues must be settled and remaining stock adjusted.' },
  { id: 't11', title: '11. Jurisdiction:', content: 'All disputes shall be subject to the exclusive jurisdiction of courts in Vadodara, Gujarat.' },
  { id: 't12', title: 'I/We agree to:', content: '• Promote GLS biological inputs following recommended crop packages.\n• Allow GLS field team to engage with my farmers for demos and support.\n• Honour loyalty program and Farm Card benefits for farmers.\n• Maintain proper storage and display for GLS products.' },
];

const seedCategories = (type: TemplateType): ScoringCategory[] => {
  if (type === 'dealer') return DEALER_CATEGORIES;
  if (type === 'farmer') return FARMER_CATEGORIES;
  return DISTRIBUTOR_CATEGORIES;
};

const seedCommitments = (type: TemplateType): CommitmentItem[] => {
  if (type === 'dealer') return DEALER_COMMITMENTS;
  if (type === 'farmer') return FARMER_COMMITMENTS;
  return DISTRIBUTOR_COMMITMENTS;
};

const seedAgreement = (type: TemplateType): AgreementTerm[] =>
  type === 'dealer' ? INITIAL_DEALER_AGREEMENT : [];

interface SettingsTemplatePageProps {
  type: TemplateType;
  onLogout: () => void;
}

const SettingsTemplatePage = ({ type, onLogout }: SettingsTemplatePageProps) => {
  const [categories, setCategories] = useState<ScoringCategory[]>(() => seedCategories(type));
  const [commitments, setCommitments] = useState<CommitmentItem[]>(() => seedCommitments(type));
  const [agreementTerms, setAgreementTerms] = useState<AgreementTerm[]>(() => seedAgreement(type));

  const totalMax = useMemo(
    () => (categories || []).reduce((sum, c) => sum + (Number(c?.maxScore) || 0), 0),
    [categories],
  );

  const typeLabel = type.charAt(0).toUpperCase() + type.slice(1);

  // ===== Scoring CRUD =====
  const updateCategory = (idx: number, patch: Partial<ScoringCategory>) => {
    setCategories(prev => (prev || []).map((c, i) => (i === idx ? { ...c, ...patch } : c)));
  };
  const addCategory = () => {
    setCategories(prev => [
      ...(prev || []),
      {
        key: `cat_${Date.now()}`,
        label: 'New criterion',
        col1Header: 'Column 1',
        col2Header: 'Remarks / Evidence',
        maxScore: 10,
        tiers: [{ id: `t_${Date.now()}`, scoreThreshold: 2, col1Value: '', col2Value: '' }],
      },
    ]);
  };
  const deleteCategory = (idx: number) =>
    setCategories(prev => (prev || []).filter((_, i) => i !== idx));

  const updateTier = (catIdx: number, tierId: string, patch: Partial<ScoringTier>) => {
    setCategories(prev =>
      (prev || []).map((c, i) =>
        i === catIdx
          ? { ...c, tiers: (c.tiers || []).map(t => (t.id === tierId ? { ...t, ...patch } : t)) }
          : c,
      ),
    );
  };
  const addTier = (catIdx: number) => {
    setCategories(prev =>
      (prev || []).map((c, i) =>
        i === catIdx
          ? {
              ...c,
              tiers: [
                ...(c.tiers || []),
                {
                  id: `t_${Date.now()}`,
                  scoreThreshold: ((c.tiers || []).at(-1)?.scoreThreshold || 0) + 2,
                  col1Value: '',
                  col2Value: '',
                },
              ],
            }
          : c,
      ),
    );
  };
  const deleteTier = (catIdx: number, tierId: string) => {
    setCategories(prev =>
      (prev || []).map((c, i) =>
        i === catIdx ? { ...c, tiers: (c.tiers || []).filter(t => t.id !== tierId) } : c,
      ),
    );
  };

  // ===== Commitments CRUD =====
  const updateCommitment = (id: string, patch: Partial<CommitmentItem>) =>
    setCommitments(prev => (prev || []).map(c => (c.id === id ? { ...c, ...patch } : c)));
  const addCommitment = () =>
    setCommitments(prev => [
      ...(prev || []),
      { id: `c${Date.now()}`, text: 'New commitment', checkedByDefault: false },
    ]);
  const deleteCommitment = (id: string) =>
    setCommitments(prev => (prev || []).filter(c => c.id !== id));

  // ===== Agreement CRUD =====
  const updateTerm = (id: string, patch: Partial<AgreementTerm>) =>
    setAgreementTerms(prev => (prev || []).map(t => (t.id === id ? { ...t, ...patch } : t)));
  const addTerm = () =>
    setAgreementTerms(prev => [
      ...(prev || []),
      { id: `term_${Date.now()}`, title: 'New clause', content: '' },
    ]);
  const deleteTerm = (id: string) =>
    setAgreementTerms(prev => (prev || []).filter(t => t.id !== id));

  // ===== Save =====
  const handleSave = () => {
    const payload = {
      type,
      scoring_schema: (categories || []).map(c => ({
        key: c?.key,
        label: c?.label,
        col1_header: c?.col1Header,
        col2_header: c?.col2Header,
        max_score: c?.maxScore,
        tiers: (c?.tiers || []).map(t => ({
          id: t?.id,
          score_threshold: t?.scoreThreshold,
          col1_value: t?.col1Value,
          col2_value: t?.col2Value,
        })),
      })),
      commitments_schema: (commitments || []).map(c => ({
        id: c?.id,
        text: c?.text,
        checked_by_default: c?.checkedByDefault,
      })),
      agreement_schema: (agreementTerms || []).map(t => ({
        id: t?.id,
        title: t?.title,
        content: t?.content,
      })),
    };

    // TODO: supabase.from('form_templates').upsert({ type, scoring_schema, commitments_schema, agreement_schema })
    console.log(`[Form Template - ${type}] Save payload:`, payload);
    toast.success(`${typeLabel} onboarding template saved`);
  };

  return (
    <AppLayout onLogout={onLogout}>
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h2 className="text-lg font-semibold mb-1 flex items-center gap-2">
            <SettingsIcon className="h-5 w-5 text-primary" />
            Manage {typeLabel} Onboarding Template
          </h2>
          <p className="text-sm text-muted-foreground">
            Global form template used by field SEs to onboard {type}s.
          </p>
        </div>
        <Button onClick={handleSave} className="gap-1">
          <Save className="h-4 w-4" /> Save Template
        </Button>
      </div>

      <Tabs defaultValue="criteria" className="w-full">
        <TabsList className="grid grid-cols-3 w-full max-w-xl">
          <TabsTrigger value="criteria">Scoring Criteria</TabsTrigger>
          <TabsTrigger value="commitments">GLS Commitments</TabsTrigger>
          <TabsTrigger value="agreement">Legal Agreement</TabsTrigger>
        </TabsList>

        {/* Tab 1: Scoring Criteria */}
        <TabsContent value="criteria" className="mt-4 space-y-2">
          <h3 className="text-sm font-semibold text-primary flex items-center gap-2">
            <BarChart3 className="h-4 w-4" /> Scoring / Evaluation Criteria
            <span className="ml-auto text-xs text-muted-foreground font-normal">
              Total max: <span className="font-semibold text-foreground">{totalMax}</span>
            </span>
          </h3>
          <Separator />

          <Accordion type="multiple" className="space-y-2 pt-2">
            {(categories || []).map((c, idx) => (
              <AccordionItem
                key={c?.key || idx}
                value={c?.key || `cat-${idx}`}
                className="border border-border rounded-md bg-card px-3"
              >
                <div className="flex items-center gap-2">
                  <AccordionTrigger className="flex-1 hover:no-underline py-3">
                    <div className="flex items-center gap-2 text-left">
                      <span className="text-sm font-medium">{c?.label || 'Untitled'}</span>
                      <span className="text-xs text-muted-foreground">
                        ({(c?.tiers || []).length} tiers · max {c?.maxScore ?? 0})
                      </span>
                    </div>
                  </AccordionTrigger>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={e => {
                      e.stopPropagation();
                      deleteCategory(idx);
                    }}
                    aria-label="Delete category"
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>

                <AccordionContent className="pt-2 pb-4 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <div>
                      <label className="text-xs text-muted-foreground">Category label</label>
                      <Input
                        value={c?.label || ''}
                        onChange={e => updateCategory(idx, { label: e.target.value })}
                        className="h-9 mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground">Column 1 header</label>
                      <Input
                        value={c?.col1Header || ''}
                        onChange={e => updateCategory(idx, { col1Header: e.target.value })}
                        className="h-9 mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground">Column 2 header</label>
                      <Input
                        value={c?.col2Header || ''}
                        onChange={e => updateCategory(idx, { col2Header: e.target.value })}
                        className="h-9 mt-1"
                      />
                    </div>
                  </div>

                  <div className="rounded-md border border-border overflow-hidden">
                    <div className="grid grid-cols-12 gap-2 px-3 py-2 bg-muted text-xs font-medium text-muted-foreground">
                      <div className="col-span-2">Score ≤</div>
                      <div className="col-span-4">{c?.col1Header || 'Column 1'}</div>
                      <div className="col-span-5">{c?.col2Header || 'Column 2'}</div>
                      <div className="col-span-1" />
                    </div>
                    <div className="divide-y divide-border">
                      {(c?.tiers || []).map(t => (
                        <div
                          key={t.id}
                          className="grid grid-cols-12 gap-2 px-3 py-2 items-center"
                        >
                          <div className="col-span-2">
                            <Input
                              type="number"
                              value={t?.scoreThreshold ?? 0}
                              onChange={e =>
                                updateTier(idx, t.id, {
                                  scoreThreshold: Number(e.target.value) || 0,
                                })
                              }
                              className="h-9 max-w-[80px]"
                            />
                          </div>
                          <div className="col-span-4">
                            <Input
                              value={t?.col1Value || ''}
                              onChange={e =>
                                updateTier(idx, t.id, { col1Value: e.target.value })
                              }
                              className="h-9"
                            />
                          </div>
                          <div className="col-span-5">
                            <Input
                              value={t?.col2Value || ''}
                              onChange={e =>
                                updateTier(idx, t.id, { col2Value: e.target.value })
                              }
                              className="h-9"
                            />
                          </div>
                          <div className="col-span-1 flex justify-end">
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => deleteTier(idx, t.id)}
                              aria-label="Delete tier"
                            >
                              <X className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => addTier(idx)}
                      className="gap-1"
                    >
                      <Plus className="h-4 w-4" /> Add tier
                    </Button>
                    <div className="flex items-center gap-2">
                      <label className="text-xs text-muted-foreground">Max score</label>
                      <Input
                        type="number"
                        min={1}
                        value={c?.maxScore ?? 0}
                        onChange={e =>
                          updateCategory(idx, {
                            maxScore: Math.max(1, Number(e.target.value) || 0),
                          })
                        }
                        className="h-9 w-20"
                      />
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <Button size="sm" variant="outline" onClick={addCategory} className="gap-1 mt-2">
            <Plus className="h-4 w-4" /> Add new category
          </Button>
        </TabsContent>

        {/* Tab 2: Commitments */}
        <TabsContent value="commitments" className="mt-4 space-y-2">
          <h3 className="text-sm font-semibold text-primary flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4" /> GLS Commitments & Compliance Statements
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
        </TabsContent>

        {/* Tab 3: Legal Agreement */}
        <TabsContent value="agreement" className="mt-4 space-y-2">
          <h3 className="text-sm font-semibold text-primary flex items-center gap-2">
            <FileText className="h-4 w-4" /> Legal Agreement Clauses
            <span className="ml-auto text-xs text-muted-foreground font-normal">
              {(agreementTerms || []).length} clauses
            </span>
          </h3>
          <Separator />

          <div className="pt-2 space-y-3">
            {(agreementTerms || []).map(term => (
              <Card key={term.id} className="p-3 space-y-2 border border-border">
                <div className="flex items-center gap-2">
                  <Input
                    value={term?.title || ''}
                    onChange={e => updateTerm(term.id, { title: e.target.value })}
                    placeholder="Clause title"
                    className="h-9 flex-1 font-medium"
                  />
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => deleteTerm(term.id)}
                    aria-label="Delete clause"
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
                <Textarea
                  value={term?.content || ''}
                  onChange={e => updateTerm(term.id, { content: e.target.value })}
                  placeholder="Clause content"
                  className="min-h-[100px] text-sm"
                />
              </Card>
            ))}

            <Button size="sm" variant="outline" onClick={addTerm} className="gap-1">
              <Plus className="h-4 w-4" /> Add new clause
            </Button>
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end pt-2">
        <Button onClick={handleSave} className="gap-1">
          <Save className="h-4 w-4" /> Save Template
        </Button>
      </div>
    </AppLayout>
  );
};

export default SettingsTemplatePage;
