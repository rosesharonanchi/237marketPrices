import React, { useState } from 'react';
import { INITIAL_COMMODITIES, EXTRA_COMMODITIES } from '../data/mockMarketData';
import type { Commodity } from '../types/market';
import { Navbar, type ActiveRoute } from '../components/Navbar';
import { StatusBanner } from '../components/StatusBanner';
import { CommodityCard } from '../components/CommodityCard';
import { Footer } from '../components/Footer';

interface HomePageProps {
  onSelectCommodity?: (commodityId: string) => void;
  onNavigate?: (route: ActiveRoute) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onSelectCommodity,
  onNavigate,
}) => {
  const [activeRoute, setActiveRoute] = useState<ActiveRoute>('prices');
  const [commodities, setCommodities] =
    useState<Commodity[]>(INITIAL_COMMODITIES);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCity, setSelectedCity] = useState<string>('ALL');

  const cities = ['ALL', 'Douala', 'Yaoundé', 'Buea', 'Bafoussam', 'Bamenda'];
  const normalizedQuery = searchQuery.trim().toLowerCase();

  const filteredCommodities = commodities.filter((item) => {
    const matchesCity =
      selectedCity === 'ALL' ||
      item.city.toLowerCase() === selectedCity.toLowerCase() ||
      item.regionalPrices.some(
        (rp) => rp.city.toLowerCase() === selectedCity.toLowerCase()
      );

    const matchesQuery =
      !normalizedQuery ||
      item.name.toLowerCase().includes(normalizedQuery) ||
      item.unit.toLowerCase().includes(normalizedQuery) ||
      item.marketName.toLowerCase().includes(normalizedQuery) ||
      item.city.toLowerCase().includes(normalizedQuery);

    return matchesCity && matchesQuery;
  });

  const handleLoadMore = () => {
    setCommodities((prev) => [...prev, ...EXTRA_COMMODITIES]);
    setHasMore(false);
  };

  const handleNavigate = (route: ActiveRoute) => {
    setActiveRoute(route);
    onNavigate?.(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectCommodity = (commodityId: string) => {
    if (onSelectCommodity) {
      onSelectCommodity(commodityId);
    } else {
      console.log('Selected commodity:', commodityId);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#f8faf8]">
      {/* Top Navbar with Props */}
      <Navbar
        activeRoute={activeRoute}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onNavigate={handleNavigate}
      />

      {/* Main Content */}
      <main className="mx-auto w-full max-w-6xl flex-1 space-y-6 px-4 py-6 sm:px-6">
        <StatusBanner />

        {/* Section Header + City Filter Pills */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <h2 className="text-sm font-bold text-gray-900 sm:text-base">
              Cameroon Regional Markets
            </h2>
            <span className="rounded-full border border-gray-200 bg-white px-2.5 py-0.5 text-[11px] font-medium text-gray-600">
              {filteredCommodities.length}{' '}
              {filteredCommodities.length === 1 ? 'Commodity' : 'Commodities'}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {cities.map((city) => {
              const active = selectedCity === city;
              return (
                <button
                  key={city}
                  type="button"
                  onClick={() => setSelectedCity(city)}
                  className={`rounded-full px-2.5 py-1 text-[11px] font-medium transition ${
                    active
                      ? 'bg-forest-900 text-white'
                      : 'border border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:text-gray-900'
                  }`}
                >
                  {city === 'ALL' ? 'All Cities' : city}
                </button>
              );
            })}
          </div>
        </div>

        {/* Commodity Cards Grid */}
        {filteredCommodities.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-300 bg-white p-8 text-center">
            <p className="text-sm font-semibold text-gray-800">
              No matching commodities found
            </p>
            <p className="mt-1 text-xs text-gray-500">
              Try clearing your search or switching the city filter.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredCommodities.map((commodity) => (
              <CommodityCard
                key={commodity.id}
                commodity={commodity}
                onSelect={handleSelectCommodity}
              />
            ))}
          </div>
        )}

        {/* Load More Button */}
        {hasMore && (
          <div className="pt-2 text-center">
            <button
              type="button"
              onClick={handleLoadMore}
              className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-gray-700 shadow-2xs transition hover:bg-gray-50"
            >
              <span>Load More Commodities</span>
              <span>⌄</span>
            </button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default HomePage;