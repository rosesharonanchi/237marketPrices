import React from 'react';
import type { RegionalMarketPrice } from '../types/market';

interface BenchmarkCardProps {
  type: 'lowest' | 'highest';
  entry: RegionalMarketPrice;
  nationalAverageFcfa: number;
}

export const BenchmarkCard: React.FC<BenchmarkCardProps> = ({
  type,
  entry,
  nationalAverageFcfa,
}) => {
  const isLowest = type === 'lowest';
  const diffPercent =
    nationalAverageFcfa > 0
      ? ((entry.priceFcfa - nationalAverageFcfa) / nationalAverageFcfa) * 100
      : 0;
  const formattedDiff = `${diffPercent >= 0 ? '+' : ''}${diffPercent.toFixed(1)}% National`;

  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-gray-200/90 bg-gray-50/70 px-4 py-3">
      <div>
        <p className="font-num text-[10px] font-semibold tracking-wider text-gray-400 uppercase">
          {isLowest ? 'Lowest Benchmark' : 'Highest Benchmark'}
        </p>
        <p className="font-display mt-0.5 text-xs font-bold text-gray-900 sm:text-sm">
          {entry.city} — {entry.marketName}
        </p>
      </div>

      <div className="text-right">
        <p
          className={`font-num text-sm font-bold sm:text-base ${
            isLowest ? 'text-forest-900' : 'text-rose-700'
          }`}
        >
          {entry.priceFcfa.toLocaleString('en-US')} FCFA
        </p>
        <p
          className={`font-num text-[11px] font-medium ${
            isLowest ? 'text-emerald-600' : 'text-rose-600'
          }`}
        >
          {formattedDiff}
        </p>
      </div>
    </div>
  );
};