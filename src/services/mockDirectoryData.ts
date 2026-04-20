import { Farmer } from '@/types/farmer';
import { Distributor } from '@/types/distributor';

const SE_NAMES = ['Ravi Kumar', 'Anita Sharma', 'Vikram Singh', 'Priya Patel', 'Suresh Reddy'];

const FARMER_NAMES = [
  'Ramprasad Yadav', 'Sita Devi', 'Mahesh Kumar', 'Lakshmi Bai', 'Govind Patel',
  'Shanti Verma', 'Dilip Sahu', 'Kamla Kumari', 'Mukesh Joshi', 'Geeta Sharma',
  'Hariram Gupta', 'Phoolwati', 'Bhagwan Singh', 'Sarita Devi', 'Naresh Tiwari',
  'Ramesh Patil', 'Savita Pawar', 'Jagdish Rao', 'Munni Bai', 'Omkar Nath',
];

const VILLAGES = ['Khargone', 'Ujjain', 'Dewas', 'Sehore', 'Vidisha', 'Dhar', 'Mandsaur', 'Ratlam'];
const DISTRICTS = ['Indore', 'Bhopal', 'Gwalior', 'Jabalpur'];
const STATES = ['MP', 'MH', 'UP', 'GJ', 'RJ'];
const CROPS = ['Wheat', 'Soybean', 'Cotton', 'Maize', 'Pulses', 'Sugarcane', 'Rice', 'Mustard'];
const IRRIGATION: Farmer['irrigation_type'][] = ['Borewell', 'Canal', 'Rainfed', 'Drip'];
const FARMER_STATUSES: Farmer['status'][] = ['DRAFT', 'SUBMITTED', 'VERIFIED'];

function generateFarmer(i: number): Farmer {
  const seIdx = i % SE_NAMES.length;
  return {
    id: `farmer-${String(i + 1).padStart(3, '0')}`,
    se_id: `se-${seIdx + 1}`,
    se_name: SE_NAMES[seIdx],
    full_name: FARMER_NAMES[i % FARMER_NAMES.length],
    contact_mobile: `+91 ${9700000000 + i}`,
    village: VILLAGES[i % VILLAGES.length],
    district: DISTRICTS[i % DISTRICTS.length],
    state: STATES[i % STATES.length],
    land_size_acres: Number((1 + (i % 20) + Math.random()).toFixed(1)),
    primary_crop: CROPS[i % CROPS.length],
    irrigation_type: IRRIGATION[i % IRRIGATION.length],
    aadhaar_masked: `XXXX-XXXX-${1000 + i}`,
    status: FARMER_STATUSES[i % FARMER_STATUSES.length],
    is_active: i % 6 !== 0,
    created_at: new Date(2024, 0, 1 + i).toISOString(),
  };
}

export const mockFarmers: Farmer[] = Array.from({ length: 42 }, (_, i) => generateFarmer(i));
export const getFarmers = (): Promise<Farmer[]> => Promise.resolve(mockFarmers);

const FIRM_NAMES = [
  'AgroPrime Distributors', 'GreenChain Logistics', 'Bharat AgroSupply', 'KisanLink Trading',
  'FarmBridge Co.', 'Annapurna Distributors', 'Krishi Vahan Pvt Ltd', 'RuralConnect Supply',
  'Dharti Distributors', 'MahaAgri Network', 'Bhoomi Wholesale', 'AgriFlow Partners',
];
const REGIONS = ['Central', 'North', 'South', 'East', 'West'];
const CATEGORIES = ['Seeds', 'Fertilizers', 'Pesticides', 'Equipment', 'Seeds + Fertilizers'];
const DIST_STATUSES: Distributor['status'][] = ['DRAFT', 'SUBMITTED', 'APPROVED'];

function generateDistributor(i: number): Distributor {
  const seIdx = i % SE_NAMES.length;
  return {
    id: `dist-${String(i + 1).padStart(3, '0')}`,
    se_id: `se-${seIdx + 1}`,
    se_name: SE_NAMES[seIdx],
    firm_name: FIRM_NAMES[i % FIRM_NAMES.length],
    owner_name: FARMER_NAMES[i % FARMER_NAMES.length],
    contact_mobile: `+91 ${9600000000 + i}`,
    region: REGIONS[i % REGIONS.length],
    state: STATES[i % STATES.length],
    warehouse_capacity_tons: 100 + (i % 10) * 250,
    product_categories: CATEGORIES[i % CATEGORIES.length],
    gst_number: `27BBBBB${2000 + i}B1Z5`,
    status: DIST_STATUSES[i % DIST_STATUSES.length],
    is_active: i % 5 !== 0,
    created_at: new Date(2024, 1, 1 + i).toISOString(),
  };
}

export const mockDistributors: Distributor[] = Array.from({ length: 30 }, (_, i) => generateDistributor(i));
export const getDistributors = (): Promise<Distributor[]> => Promise.resolve(mockDistributors);
