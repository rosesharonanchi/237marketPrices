import React from 'react';

interface StatusBannerProps {
  updatedText?: string;
  title?: string;
  subtitle?: string;
  feedLabel?: string;
}

export const StatusBanner: React.FC<StatusBannerProps> = ({
  
  title = 'Live Cameroon Commodity Prices',
  subtitle = 'Wholesale & bulk market rates across Douala, Yaoundé, Buea, Bafoussam & Bamenda.',
  feedLabel = 'Live Central Market Feed',
}) => {
  return (
    <section className="rounded-xl border border-mint-200 bg-mint-50 px-5 py-4">
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex flex-wrap items-center gap-3">
          <span className="border-r border-mint-200 pr-3 font-num text-[10px] font-semibold tracking-wider text-forest-900 uppercase">
            Verified Daily Updates
          </span>
         
        </div>

        <span className="inline-flex items-center gap-2 font-medium text-forest-800">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          <span>{feedLabel}</span>
        </span>
      </div>

      <div className="mt-2.5">
        <h1 className="font-display text-lg font-bold tracking-tight text-gray-900 sm:text-xl">
          {title}
        </h1>
        <p className="mt-0.5 text-xs text-gray-600 sm:text-sm">{subtitle}</p>
      </div>
    </section>
  );
};