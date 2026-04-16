import { Dealer } from '@/types/dealer';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import RecommendationBadge from './RecommendationBadge';
import {
  Store, User, Phone, MapPin, FileText, Building2, Calendar,
  CreditCard, CheckCircle2, XCircle, Image, PenTool, BarChart3
} from 'lucide-react';

interface DealerDetailProps {
  dealer: Dealer | null;
  open: boolean;
  onClose: () => void;
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

const CommitmentItem = ({ label, checked }: { label: string; checked: boolean }) => (
  <div className="flex items-center gap-2 py-1">
    {checked ? (
      <CheckCircle2 className="h-4 w-4 text-primary" />
    ) : (
      <XCircle className="h-4 w-4 text-destructive" />
    )}
    <span className="text-sm">{label}</span>
  </div>
);

const DocCard = ({ label, url, icon: Icon }: { label: string; url?: string; icon: typeof Image }) => (
  <a
    href={url || '#'}
    target="_blank"
    rel="noopener noreferrer"
    className="flex flex-col items-center gap-2 p-4 rounded-lg border border-border bg-muted/30 hover:bg-accent/50 transition-colors text-center"
  >
    <Icon className="h-8 w-8 text-muted-foreground" />
    <span className="text-xs font-medium text-muted-foreground">{label}</span>
  </a>
);

const DealerDetail = ({ dealer, open, onClose }: DealerDetailProps) => {
  if (!dealer) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold">{dealer.shop_name}</DialogTitle>
            <RecommendationBadge recommendation={dealer.recommendation} />
          </div>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="outline" className="text-xs">{dealer.status}</Badge>
            <span className="text-xs text-muted-foreground">Score: {dealer.total_score}/50</span>
          </div>
        </DialogHeader>

        {/* Section A: Basic Info */}
        <div className="space-y-1">
          <h3 className="text-sm font-semibold text-primary flex items-center gap-2">
            <Store className="h-4 w-4" /> Basic Information
          </h3>
          <Separator />
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

        {/* Section B: Scoring */}
        <div className="space-y-1">
          <h3 className="text-sm font-semibold text-primary flex items-center gap-2">
            <BarChart3 className="h-4 w-4" /> Scoring Breakdown
          </h3>
          <Separator />
          {dealer.scoring && (
            <div className="space-y-3 pt-2">
              <ScoreBar label="Financial" value={dealer.scoring.financial} />
              <ScoreBar label="Reputation" value={dealer.scoring.reputation} />
              <ScoreBar label="Infrastructure" value={dealer.scoring.infrastructure} />
              <ScoreBar label="Market Presence" value={dealer.scoring.marketPresence} />
              <ScoreBar label="Compliance" value={dealer.scoring.compliance} />
            </div>
          )}
        </div>

        {/* Section C: Commitments */}
        <div className="space-y-1">
          <h3 className="text-sm font-semibold text-primary flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4" /> Commitments
          </h3>
          <Separator />
          {dealer.commitments && (
            <div className="pt-1">
              <CommitmentItem label="Credit Policy Accepted" checked={dealer.commitments.creditPolicy} />
              <CommitmentItem label="Exclusivity Agreement" checked={dealer.commitments.exclusivity} />
              <CommitmentItem label="Target Achievement Commitment" checked={dealer.commitments.targetAchievement} />
              <CommitmentItem label="Return Policy Acknowledged" checked={dealer.commitments.returnPolicy} />
              <CommitmentItem label="Payment Terms Agreed" checked={dealer.commitments.paymentTerms} />
            </div>
          )}
        </div>

        {/* Documents */}
        <div className="space-y-1">
          <h3 className="text-sm font-semibold text-primary flex items-center gap-2">
            <Image className="h-4 w-4" /> Documents
          </h3>
          <Separator />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <DocCard label="GST Certificate" url={dealer.documents?.gstUrl} icon={FileText} />
            <DocCard label="Shop Photo" url={dealer.documents?.shopPhotoUrl} icon={Image} />
            <DocCard label="PAN Card" url={dealer.documents?.panUrl} icon={CreditCard} />
            <DocCard label="Signature" url={dealer.documents?.signatureUrl} icon={PenTool} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DealerDetail;
