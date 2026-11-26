export type PriceTagType = 'lowest' | 'direct' | 'stable' | 'highest';

export interface RegionalMarketPrice {
  id: string;
  city: string;
  region: string;
  marketName: string;
  priceFcfa: number;
  unitLabel: string; // e.g., "Per kg" or "50kg Bag"
  tag?: string;
  tagType?: PriceTagType;
  note: string;
}

export interface Commodity {
  id: string;
  code: string;
  name: string;
  unit: string;
  categoryBadge?: string;
  priceFcfa: number;
  pricePerUnitLabel?: string; // e.g., "FCFA/kg" on detail view
  changePercent: number;
  changePeriodLabel?: string; // e.g., "this week"
  marketName: string;
  city: string;
  imagePlaceholderLabel: string;
  imageUrl?: string;
  benchmarkRangeLabel?: string; // e.g., "Range: 7,500 – 9,200 FCFA"
  regionalPrices: RegionalMarketPrice[];
}

export interface PriceSubmissionInput {
  commodityId: string;
  packagingUnit: string;
  cityAndRegion: string;
  marketName: string;
  priceFcfa: number;
  contributorRole: string;
  photoFile?: File | null;
}