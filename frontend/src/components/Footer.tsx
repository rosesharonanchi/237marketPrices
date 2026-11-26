import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-14 border-t border-gray-200/80 bg-white py-4 text-[11px] text-gray-500">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 sm:flex-row sm:px-6">
        <p>
          © 2026 237MarketPrices Cameroon. Commodity Tracking &amp; Regional
          Market Insights.
        </p>
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 text-gray-600">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Central Market Data Sync Active
          </span>
          <span className="font-num text-gray-400">v2.4-web</span>
        </div>
      </div>
    </footer>
  );
};