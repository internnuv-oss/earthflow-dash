import { Dealer } from '@/types/dealer';

const SE_NAMES = ['Ravi Kumar', 'Anita Sharma', 'Vikram Singh', 'Priya Patel', 'Suresh Reddy'];

const SHOP_NAMES = [
  'Agri World Traders', 'KisanMart Supplies', 'GreenField Agro', 'FarmFirst Dealers',
  'Harvest Hub', 'SeedPoint Agri', 'CropCare Center', 'Bhoomi Agro Services',
  'RuralRoots Trading', 'AgroVita Enterprises', 'Panchayat Agri Store', 'KhetiBadi Mart',
  'Dharti Agro Deals', 'FertileGround Supply', 'Annadata Traders',
];

const OWNERS = [
  'Rajesh Gupta', 'Sunil Mehta', 'Arun Joshi', 'Mohan Lal', 'Deepak Tiwari',
  'Manoj Verma', 'Sanjay Mishra', 'Ramesh Yadav', 'Kishore Pandey', 'Amit Dubey',
  'Bharat Chauhan', 'Naveen Saxena', 'Pankaj Agrawal', 'Dinesh Rawat', 'Gopal Sharma',
];

const LOCATIONS = [
  'Indore, MP', 'Bhopal, MP', 'Nagpur, MH', 'Jaipur, RJ', 'Lucknow, UP',
  'Kanpur, UP', 'Varanasi, UP', 'Patna, BR', 'Ranchi, JH', 'Raipur, CG',
  'Ahmedabad, GJ', 'Surat, GJ', 'Pune, MH', 'Nashik, MH', 'Aurangabad, MH',
];

function randomScore(): number {
  return Math.floor(Math.random() * 5) + 6; // 6-10
}

function getRecommendation(score: number): 'Green' | 'Yellow' | 'Red' {
  if (score >= 40) return 'Green';
  if (score >= 30) return 'Yellow';
  return 'Red';
}

function generateDealer(index: number): Dealer {
  const scoring = {
    financial: randomScore(),
    reputation: randomScore(),
    infrastructure: randomScore(),
    marketPresence: randomScore(),
    compliance: randomScore(),
  };
  const total = Object.values(scoring).reduce((a, b) => a + b, 0);
  const se_index = index % SE_NAMES.length;
  const statuses: ('DRAFT' | 'SUBMITTED')[] = ['DRAFT', 'SUBMITTED'];

  return {
    id: `dealer-${String(index + 1).padStart(3, '0')}`,
    se_id: `se-${se_index + 1}`,
    se_name: SE_NAMES[se_index],
    shop_name: SHOP_NAMES[index % SHOP_NAMES.length],
    owner_name: OWNERS[index % OWNERS.length],
    contact_mobile: `+91 ${9800000000 + index}`,
    address: LOCATIONS[index % LOCATIONS.length],
    gst_number: `22AAAAA${1000 + index}A1Z5`,
    pan_number: `ABCPD${1000 + index}E`,
    est_year: `${2005 + (index % 18)}`,
    firm_type: ['Proprietorship', 'Partnership', 'Pvt Ltd'][index % 3],
    bank_details: {
      accountName: OWNERS[index % OWNERS.length],
      accNo: `${100020003000 + index}`,
      ifsc: 'SBIN0001234',
      bankBranch: 'Main Branch, ' + LOCATIONS[index % LOCATIONS.length].split(',')[0],
    },
    scoring,
    total_score: total,
    recommendation: getRecommendation(total),
    commitments: {
      creditPolicy: Math.random() > 0.3,
      exclusivity: Math.random() > 0.5,
      targetAchievement: Math.random() > 0.4,
      returnPolicy: Math.random() > 0.3,
      paymentTerms: Math.random() > 0.2,
    },
    documents: {
      gstUrl: 'https://res.cloudinary.com/demo/image/upload/v1/sample_gst.jpg',
      shopPhotoUrl: 'https://res.cloudinary.com/demo/image/upload/v1/sample_shop.jpg',
      panUrl: 'https://res.cloudinary.com/demo/image/upload/v1/sample_pan.jpg',
      signatureUrl: 'https://res.cloudinary.com/demo/image/upload/v1/sample_signature.jpg',
    },
    signature_url: 'https://res.cloudinary.com/demo/image/upload/v1/sample_signature.jpg',
    status: statuses[index % 2],
    created_at: new Date(2024, 0, 1 + index).toISOString(),
    updated_at: new Date(2024, 5, 1 + index).toISOString(),
  };
}

export const mockDealers: Dealer[] = Array.from({ length: 25 }, (_, i) => generateDealer(i));

export function getDealers(): Promise<Dealer[]> {
  return Promise.resolve(mockDealers);
}

export function getDealerById(id: string): Promise<Dealer | undefined> {
  return Promise.resolve(mockDealers.find(d => d.id === id));
}
