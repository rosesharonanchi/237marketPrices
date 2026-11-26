import React, { useState } from 'react';
import type { Commodity } from '../types/market';

interface CommodityCardProps {
  commodity: Commodity;
  disabled?: boolean;
  onSelect: (commodityId: string) => void;
}

export const CommodityCard: React.FC<CommodityCardProps> = ({
  commodity,
  disabled = false,
  onSelect,
}) => {
  const [imgError, setImgError] = useState(false);

  const isPositive = commodity.changePercent >= 0;
  const formattedPrice = `${commodity.priceFcfa.toLocaleString('en-US')} FCFA`;
  const formattedChange = `${isPositive ? '+' : ''}${commodity.changePercent.toFixed(1)}%`;

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => onSelect(commodity.id)}
      className="group flex w-full cursor-pointer items-stretch gap-3.5 rounded-xl border border-gray-200/90 bg-white p-3.5 text-left transition hover:border-forest-700/50 hover:bg-gray-50/40 focus:outline-none focus:ring-2 focus:ring-forest-700/30 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {/* Commodity Photograph */}
      <div className="h-22 w-24 shrink-0 overflow-hidden rounded-lg border border-gray-200 bg-gray-100">
        {commodity.imageUrl && !imgError ? (
          <img
            src={commodity.imageUrl}
            alt={commodity.name}
            loading="lazy"
            onError={() => setImgError(true)}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-mint-50 p-2 text-center text-[11px] font-semibold text-forest-800">
            {commodity.imagePlaceholderLabel}
          </div>
        )}
      </div>

      {/* Card Body */}
      <div className="flex min-w-0 flex-1 flex-col justify-between">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h2 className="font-display truncate text-sm font-bold text-gray-900 transition-colors group-hover:text-forest-900">
              {commodity.name}
            </h2>
            <p className="truncate text-[11px] text-gray-500">{commodity.unit}</p>
          </div>

          <span
            className={`font-num shrink-0 text-xs font-semibold ${
              isPositive ? 'text-emerald-600' : 'text-rose-600'
            }`}
          >
            {formattedChange}
          </span>
        </div>

        <div className="mt-3 flex items-baseline justify-between gap-2">
          <span className="font-num text-sm font-bold tracking-tight text-gray-900 sm:text-[15px]">
            {formattedPrice}
          </span>
          <span className="truncate text-[11px] font-medium text-gray-500">
            {commodity.marketName}
          </span>
        </div>
      </div>
    </button>
  );
};