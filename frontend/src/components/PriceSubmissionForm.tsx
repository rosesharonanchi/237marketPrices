import React, { useState } from 'react';
import { Upload, Loader2 } from 'lucide-react';
import type { Commodity, PriceSubmissionInput } from '../types/market';

interface PriceSubmissionFormProps {
  commodities: Commodity[];
  isSubmitting?: boolean;
  onSubmitPrice: (submission: PriceSubmissionInput) => void;
}

const PACKAGING_UNITS = [
  'Grande Caisse / Basket (30 - 35kg box)',
  '50kg Bag (Standard Wholesale)',
  '100kg Bag (Bulk Sack)',
  '25L Jerrycan',
  '1kg Retail Measure',
];

const TOWNS_AND_REGIONS = [
  'Buea (Southwest)',
  'Douala (Littoral)',
  'Yaoundé (Centre)',
  'Bafoussam (West)',
  'Bamenda (Northwest)',
  'Garoua (North)',
];

const CONTRIBUTOR_ROLES = [
  'Wholesale Merchant',
  'Market Master / Enumerator',
  'Farmer / Producer',
  'Cooperative Representative',
  'Retail Trader',
];

export const PriceSubmissionForm: React.FC<PriceSubmissionFormProps> = ({
  commodities,
  isSubmitting = false,
  onSubmitPrice,
}) => {
  const [commodityId, setCommodityId] = useState<string>(
    commodities[3]?.id ?? commodities[0]?.id ?? 'fresh-tomatoes'
  );
  const [packagingUnit, setPackagingUnit] = useState<string>(
    PACKAGING_UNITS[0]
  );
  const [cityAndRegion, setCityAndRegion] = useState<string>(
    TOWNS_AND_REGIONS[0]
  );
  const [marketName, setMarketName] = useState<string>('Muea Market');
  const [priceFcfa, setPriceFcfa] = useState<string>('8500');
  const [contributorRole, setContributorRole] = useState<string>(
    CONTRIBUTOR_ROLES[0]
  );
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const selectedCommodity = commodities.find((c) => c.id === commodityId);
  const numericPrice = Number(priceFcfa);
  const isValidForm = Boolean(marketName.trim()) && numericPrice > 0;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setPhotoFile(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!marketName.trim()) {
      setErrorMessage('Please enter a market landmark or name.');
      return;
    }
    if (!numericPrice || numericPrice <= 0) {
      setErrorMessage('Please enter a valid transaction price in FCFA.');
      return;
    }

    setErrorMessage('');
    onSubmitPrice({
      commodityId,
      packagingUnit,
      cityAndRegion,
      marketName: marketName.trim(),
      priceFcfa: numericPrice,
      contributorRole,
      photoFile,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto max-w-2xl rounded-xl border border-gray-200/90 bg-white p-6 sm:p-8"
    >
      {errorMessage && (
        <div className="mb-4 rounded-lg border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-xs font-medium text-rose-700">
          {errorMessage}
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label className="block text-xs font-semibold text-gray-800">
            Select Agricultural Commodity <span className="text-rose-600">*</span>
          </label>
          <select
            disabled={isSubmitting}
            value={commodityId}
            onChange={(e) => setCommodityId(e.target.value)}
            className="mt-1.5 w-full rounded-lg border border-gray-200 bg-gray-50/70 px-3 py-2.5 text-xs font-medium text-gray-900 transition focus:border-forest-700 focus:bg-white focus:outline-none disabled:opacity-60"
          >
            {commodities.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name} ({item.code})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-800">
            Packaging &amp; Bulk Unit <span className="text-rose-600">*</span>
          </label>
          <select
            disabled={isSubmitting}
            value={packagingUnit}
            onChange={(e) => setPackagingUnit(e.target.value)}
            className="mt-1.5 w-full rounded-lg border border-gray-200 bg-gray-50/70 px-3 py-2.5 text-xs font-medium text-gray-900 transition focus:border-forest-700 focus:bg-white focus:outline-none disabled:opacity-60"
          >
            {PACKAGING_UNITS.map((unit) => (
              <option key={unit} value={unit}>
                {unit}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-800">
            Town / Region <span className="text-rose-600">*</span>
          </label>
          <select
            disabled={isSubmitting}
            value={cityAndRegion}
            onChange={(e) => setCityAndRegion(e.target.value)}
            className="mt-1.5 w-full rounded-lg border border-gray-200 bg-gray-50/70 px-3 py-2.5 text-xs font-medium text-gray-900 transition focus:border-forest-700 focus:bg-white focus:outline-none disabled:opacity-60"
          >
            {TOWNS_AND_REGIONS.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-800">
            Market Landmark / Name <span className="text-rose-600">*</span>
          </label>
          <input
            type="text"
            disabled={isSubmitting}
            value={marketName}
            onChange={(e) => setMarketName(e.target.value)}
            placeholder="e.g., Muea Market, Marché Sandaga"
            className="mt-1.5 w-full rounded-lg border border-gray-200 bg-gray-50/70 px-3 py-2.5 text-xs font-medium text-gray-900 placeholder-gray-400 transition focus:border-forest-700 focus:bg-white focus:outline-none disabled:opacity-60"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-800">
            Wholesale Transaction Price <span className="text-rose-600">*</span>
          </label>
          <div className="mt-1.5 flex items-center rounded-lg border border-gray-200 bg-gray-50/70 px-3 transition focus-within:border-forest-700 focus-within:bg-white">
            <input
              type="number"
              min="1"
              step="50"
              disabled={isSubmitting}
              value={priceFcfa}
              onChange={(e) => setPriceFcfa(e.target.value)}
              className="font-num w-full bg-transparent py-2 text-sm font-bold text-gray-900 focus:outline-none disabled:opacity-60"
            />
            <span className="font-num border-l border-gray-200 pl-2.5 text-[10px] font-bold text-gray-600">
              FCFA
            </span>
          </div>
          <div className="mt-1.5 flex items-center justify-between text-[11px]">
            <span className="font-num text-gray-400">
              {selectedCommodity?.benchmarkRangeLabel ?? 'Range: 7,500 – 9,200 FCFA'}
            </span>
            <span className="font-semibold text-forest-800">
              Benchmark Aligned
            </span>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-800">
            Your Contributor Role <span className="text-rose-600">*</span>
          </label>
          <select
            disabled={isSubmitting}
            value={contributorRole}
            onChange={(e) => setContributorRole(e.target.value)}
            className="mt-1.5 w-full rounded-lg border border-gray-200 bg-gray-50/70 px-3 py-2.5 text-xs font-medium text-gray-900 transition focus:border-forest-700 focus:bg-white focus:outline-none disabled:opacity-60"
          >
            {CONTRIBUTOR_ROLES.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Optional Produce Photo / Receipt Upload */}
      <div className="mt-5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-gray-800">
            Produce Photo or Receipt (Optional)
          </label>
          <span className="font-num text-[10px] font-semibold text-forest-900">
            +10 Trust Score
          </span>
        </div>

        <label
          className={`mt-2 flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-gray-50/70 px-4 py-6 text-center transition hover:border-forest-700 hover:bg-mint-50/40 ${
            isSubmitting ? 'pointer-events-none opacity-60' : ''
          }`}
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-forest-800">
            <Upload className="h-4 w-4" strokeWidth={2} />
          </div>
          <p className="mt-2 text-xs font-semibold text-gray-800">
            {photoFile
              ? `Selected: ${photoFile.name}`
              : 'Click to upload or drag & drop commodity image'}
          </p>
          <p className="mt-0.5 text-[11px] text-gray-400">
            JPG, PNG up to 10MB (produce crate or market tally receipt)
          </p>
          <input
            type="file"
            disabled={isSubmitting}
            accept="image/png,image/jpeg"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>
      </div>

      <div className="mt-6">
        <button
          type="submit"
          disabled={isSubmitting || !isValidForm}
          className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-forest-900 px-4 py-3 text-xs font-bold text-white transition hover:bg-forest-800 disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm"
        >
          {isSubmitting && (
            <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2.2} />
          )}
          <span>
            {isSubmitting
              ? 'Submitting Rate...'
              : 'Submit Wholesale Rate for Verification'}
          </span>
        </button>
        <p className="mt-2.5 text-center text-[11px] text-gray-400">
          All submissions are cross-referenced with Central Market indices
          before syndication.
        </p>
      </div>
    </form>
  );
};