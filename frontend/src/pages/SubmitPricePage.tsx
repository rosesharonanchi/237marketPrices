import React, { useState } from 'react';
import type { Commodity, PriceSubmissionInput } from '../types/market';
import { PriceSubmissionForm } from '../components/PriceSubmissionForm';

interface SubmitPricesPageProps {
  commodities: Commodity[];
  onSubmitPrice: (submission: PriceSubmissionInput) => void;
  onBackToPrices: () => void;
}

export const SubmitPricesPage: React.FC<SubmitPricesPageProps> = ({
  commodities,
  onSubmitPrice,
  onBackToPrices,
}) => {
  const [submittedRecord, setSubmittedRecord] =
    useState<PriceSubmissionInput | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFormSubmit = (submission: PriceSubmissionInput) => {
    setIsSubmitting(true);
    setTimeout(() => {
      onSubmitPrice(submission);
      setSubmittedRecord(submission);
      setIsSubmitting(false);
    }, 550);
  };

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-mint-200/90 bg-mint-50/80 px-4 py-7 text-center sm:px-6">
        <p className="font-num text-[10px] font-semibold tracking-wider text-forest-900 uppercase">
          Community Market Contribution
        </p>

        <h1 className="font-display mt-2 text-xl font-extrabold tracking-tight text-gray-900 sm:text-2xl">
          Submit Local Commodity Price
        </h1>
        <p className="mx-auto mt-1.5 max-w-lg text-xs text-gray-600 sm:text-sm">
          Help fellow Cameroonian farmers, distributors, and market merchants
          track authentic wholesale rates in real time.
        </p>
      </section>

      {submittedRecord && (
        <div className="mx-auto flex max-w-2xl flex-wrap items-center justify-between gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs text-emerald-950">
          <div>
            <p className="font-semibold">
              Recorded{' '}
              <span className="font-num font-bold">
                {submittedRecord.priceFcfa.toLocaleString('en-US')} FCFA
              </span>{' '}
              at {submittedRecord.marketName} ({submittedRecord.cityAndRegion})
            </p>
            <p className="mt-0.5 text-emerald-700">
              Updated in your dashboard state.
            </p>
          </div>
          <button
            type="button"
            onClick={onBackToPrices}
            className="cursor-pointer rounded-lg bg-forest-900 px-3 py-1.5 font-semibold text-white transition hover:bg-forest-800"
          >
            View Market Prices
          </button>
        </div>
      )}

      <PriceSubmissionForm
        commodities={commodities}
        isSubmitting={isSubmitting}
        onSubmitPrice={handleFormSubmit}
      />
    </div>
  );
};

export default SubmitPricesPage;