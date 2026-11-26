import React from 'react';
import type { RegionalMarketPrice, PriceTagType } from '../types/market';

interface RegionalMarketRowProps {
  market: RegionalMarketPrice;
}

const TAG_STYLES: Record<PriceTagType, string> = {
  lowest: 'border-emerald-200 bg-emerald-50 text-emerald-800',
  direct: 'border-gray-200 bg-gray-100 text-gray-700',
  stable: 'border-mint-200 bg-mint-50 text-forest-800',
  highest: 'border-rose-200 bg-rose-50 text-rose-700',
};

export const RegionalMarketRow: React.FC<RegionalMarketRowProps> = ({
  market,
}) => {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-gray-200/90 bg-white px-4 py-3.5 transition hover:border-gray-300">
      <div>
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="font-display text-sm font-bold text-gray-900">
            {market.city}
          </span>
          {market.tag && market.tagType && (
            <span
              className={`border px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase ${
                TAG_STYLES[market.tagType]
              }`}
            >
              {market.tag}
            </span>
          )}
        </div>
        <p className="mt-0.5 text-xs text-gray-500">
          {market.marketName} •{' '}
          <span
            className={
              market.tagType === 'lowest'
                ? 'font-medium text-emerald-600'
                : market.tagType === 'highest'
                  ? 'font-medium text-rose-600'
                  : 'text-gray-500'
            }
          >
            {market.note}
          </span>
        </p>
      </div>

      <div className="text-right">
        <p className="font-num text-sm font-bold text-gray-900 sm:text-base">
          {market.priceFcfa.toLocaleString('en-US')} FCFA
        </p>
        <p className="text-[11px] text-gray-400">{market.unitLabel}</p>
      </div>
    </div>
  );
};