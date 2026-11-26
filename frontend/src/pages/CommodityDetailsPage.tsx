import React, { useMemo, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import type { Commodity } from '../types/market';
import { BenchmarkCard } from '../components/BenchMarkCard';
import { RegionalMarketRow } from '../components/RegionalMarketRow';

interface CommodityDetailPageProps {
  commodity: Commodity;
  onBack: () => void;
  onSetAlert?: (commodityName: string) => void;
}

type SortOrder = 'lowest-first' | 'highest-first';

export const CommodityDetailPage: React.FC<CommodityDetailPageProps> = ({
  commodity,
  onBack,
  onSetAlert,
}) => {
  const [sortOrder, setSortOrder] = useState<SortOrder>('lowest-first');
  const [alertSaved, setAlertSaved] = useState(false);
  const [savingAlert, setSavingAlert] = useState(false);

  const sortedMarkets = useMemo(() => {
    const copy = [...commodity.regionalPrices];
    copy.sort((a, b) =>
      sortOrder === 'lowest-first'
        ? a.priceFcfa - b.priceFcfa
        : b.priceFcfa - a.priceFcfa
    );
    return copy;
  }, [commodity.regionalPrices, sortOrder]);

  const { lowestEntry, highestEntry, nationalAvg } = useMemo(() => {
    if (commodity.regionalPrices.length === 0) {
      return { lowestEntry: null, highestEntry: null, nationalAvg: 0 };
    }
    const byPrice = [...commodity.regionalPrices].sort(
      (a, b) => a.priceFcfa - b.priceFcfa
    );
    const sum = byPrice.reduce((acc, item) => acc + item.priceFcfa, 0);
    return {
      lowestEntry: byPrice[0],
      highestEntry: byPrice[byPrice.length - 1],
      nationalAvg: Math.round(sum / byPrice.length),
    };
  }, [commodity.regionalPrices]);

  const isPositive = commodity.changePercent >= 0;

  const handleAlertClick = () => {
    if (alertSaved || savingAlert) return;
    setSavingAlert(true);
    setTimeout(() => {
      setSavingAlert(false);
      setAlertSaved(true);
      onSetAlert?.(commodity.name);
    }, 450);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex cursor-pointer items-center gap-1.5 text-xs font-semibold text-forest-800 transition hover:text-forest-950"
        >
          <ArrowLeft className="h-3.5 w-3.5" strokeWidth={2.2} />
          <span>Back to Market Prices</span>
        </button>

        <span className="border-b border-gray-300 pb-0.5 text-[11px] font-medium text-gray-500">
          Verified Cameroon National Aggregation
        </span>
      </div>

      <section className="rounded-xl border border-gray-200/90 bg-white p-5">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-gray-200 bg-gray-100">
              {commodity.imageUrl ? (
                <img
                  src={commodity.imageUrl}
                  alt={commodity.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-mint-50 text-xs font-bold text-forest-800">
                  {commodity.imagePlaceholderLabel}
                </div>
              )}
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="font-display text-lg font-extrabold text-gray-900 sm:text-xl">
                  {commodity.name}
                </h1>
                {commodity.categoryBadge && (
                  <span className="border border-gray-200 bg-gray-50 px-2 py-0.5 font-num text-[10px] font-semibold tracking-wider text-gray-600 uppercase">
                    {commodity.categoryBadge}
                  </span>
                )}
              </div>
              <p className="mt-0.5 text-xs text-gray-600">{commodity.unit}</p>
              <p className="mt-1 font-num text-[10px] font-medium tracking-wider text-gray-400 uppercase">
                CODE: {commodity.code} • SYNCHRONIZED DAILY
              </p>
            </div>
          </div>

          <div className="sm:text-right">
            <div className="font-num text-2xl font-bold tracking-tight text-gray-900">
              {commodity.pricePerUnitLabel
                ? commodity.pricePerUnitLabel
                : `${commodity.priceFcfa.toLocaleString('en-US')} FCFA`}
            </div>
            <div
              className={`font-num mt-1 text-xs font-semibold ${
                isPositive ? 'text-emerald-600' : 'text-rose-600'
              }`}
            >
              {isPositive ? '+' : ''}
              {commodity.changePercent.toFixed(1)}%{' '}
              {commodity.changePeriodLabel ?? 'this week'}
            </div>
          </div>
        </div>

        {lowestEntry && highestEntry && (
          <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2">
            <BenchmarkCard
              type="lowest"
              entry={lowestEntry}
              nationalAverageFcfa={nationalAvg}
            />
            <BenchmarkCard
              type="highest"
              entry={highestEntry}
              nationalAverageFcfa={nationalAvg}
            />
          </div>
        )}
      </section>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-baseline gap-2.5">
          <h2 className="font-display text-sm font-bold text-gray-900 sm:text-base">
            Regional Markets
          </h2>
          <span className="font-num text-xs text-gray-500">
            ({sortedMarkets.length}{' '}
            {sortedMarkets.length === 1 ? 'Town' : 'Towns'})
          </span>
        </div>

        <label className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-700">
          <span>Sort:</span>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as SortOrder)}
            className="cursor-pointer bg-transparent font-semibold text-gray-900 focus:outline-none"
          >
            <option value="lowest-first">Lowest Price First</option>
            <option value="highest-first">Highest Price First</option>
          </select>
        </label>
      </div>

      <div className="space-y-2.5">
        {sortedMarkets.map((market) => (
          <RegionalMarketRow key={market.id} market={market} />
        ))}
      </div>

      <div className="pt-2 text-center">
        <button
          type="button"
          disabled={savingAlert || alertSaved}
          onClick={handleAlertClick}
          className="cursor-pointer rounded-lg bg-forest-900 px-6 py-2.5 text-xs font-semibold text-white transition hover:bg-forest-800 disabled:cursor-not-allowed disabled:opacity-70 sm:text-sm"
        >
          {alertSaved
            ? `Price Alert Active for ${commodity.name}`
            : savingAlert
              ? 'Enabling Alert...'
              : `Set Price Alert for ${commodity.name}`}
        </button>
        <p className="mt-2.5 text-[11px] text-gray-400">
          Updates refreshed 15 minutes ago via Ministry &amp; Community Feeds
        </p>
      </div>
    </div>
  );
};