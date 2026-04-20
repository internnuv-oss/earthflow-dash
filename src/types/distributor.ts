export type DistributorStatus = 'DRAFT' | 'SUBMITTED' | 'APPROVED';

export interface Distributor {
  id: string;
  se_id: string;
  se_name: string;
  firm_name: string;
  owner_name: string;
  contact_mobile: string;
  region: string;
  state: string;
  warehouse_capacity_tons: number;
  product_categories: string;
  gst_number: string;
  status: DistributorStatus;
  is_active: boolean;
  created_at: string;
}
