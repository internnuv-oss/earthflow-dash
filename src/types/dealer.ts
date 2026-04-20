export interface BankDetails {
  accountName: string;
  accNo: string;
  ifsc: string;
  bankBranch: string;
}

export interface Scoring {
  financial: number;
  reputation: number;
  infrastructure: number;
  marketPresence: number;
  compliance: number;
}

export interface Commitments {
  creditPolicy: boolean;
  exclusivity: boolean;
  targetAchievement: boolean;
  returnPolicy: boolean;
  paymentTerms: boolean;
}

export interface Documents {
  gstUrl?: string;
  shopPhotoUrl?: string;
  panUrl?: string;
  signatureUrl?: string;
}

export interface ShopLocation {
  lat: number;
  lng: number;
}

export type Recommendation = 'Green' | 'Yellow' | 'Red';
export type DealerStatus = 'DRAFT' | 'SUBMITTED';

export interface Dealer {
  id: string;
  se_id: string;
  /** Derived/joined from profiles for UI convenience */
  se_name: string;
  shop_name: string;
  owner_name: string;
  contact_mobile: string;
  address: string;
  landmark?: string;
  gst_number?: string;
  pan_number?: string;
  est_year?: string;
  firm_type?: string;
  bank_details?: BankDetails;
  scoring?: Scoring;
  total_score: number;
  recommendation: Recommendation;
  commitments?: Commitments;
  documents?: Documents;
  /** Legacy alias kept for existing UI; mirrors documents.signatureUrl */
  signature_url?: string;
  dealer_signature?: string;
  se_signature?: string;
  pdf_url?: string;
  shop_location?: ShopLocation;
  status: DealerStatus;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
