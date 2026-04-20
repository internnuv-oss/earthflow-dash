export type FarmerStatus = 'DRAFT' | 'SUBMITTED' | 'VERIFIED';

export interface Farmer {
  id: string;
  se_id: string;
  se_name: string;
  full_name: string;
  contact_mobile: string;
  village: string;
  district: string;
  state: string;
  land_size_acres: number;
  primary_crop: string;
  irrigation_type: 'Borewell' | 'Canal' | 'Rainfed' | 'Drip';
  aadhaar_masked: string;
  status: FarmerStatus;
  is_active: boolean;
  created_at: string;
}
