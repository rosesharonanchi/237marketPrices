import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { INITIAL_COMMODITIES, EXTRA_COMMODITIES } from './data/mockMarketData';
import type { Commodity, PriceSubmissionInput } from './types/market';
import { Navbar, type ActiveRoute } from './components/Navbar';
import { Footer } from './components/Footer';
import { StatusBanner } from './components/StatusBanner';
import { CommodityCard } from './components/CommodityCard';
import { CommodityDetailPage } from './pages/CommodityDetailsPage';
import { SubmitPricesPage } from './pages/SubmitPricePage';
import { LoginPage } from './pages/LoginPage';

const CardSkeleton: React.FC = () => (
  <div className="flex animate-pulse items-stretch gap-3.5 rounded-xl border border-gray-200/80 bg-white p-3.5">
    <div className="h-22 w-24 shrink-0 rounded-lg bg-gray-200/80" />
    <div className="flex flex-1 flex-col justify-between py-0.5">
      <div className="flex items-start justify-between gap-2">
        <div className="space-y-1.5">
          <div className="h-3.5 w-28 rounded bg-gray-200/80" />
          <div className="h-2.5 w-20 rounded bg-gray-100" />
        </div>
        <div className="h-3 w-11 rounded bg-gray-200/80" />
      </div>
      <div className="mt-3 flex items-baseline justify-between">
        <div className="h-4 w-24 rounded bg-gray-200/80" />
        <div className="h-2.5 w-20 rounded bg-gray-100" />
      </div>
    </div>
  </div>
);

export function App() {
  const [activeRoute, setActiveRoute] = useState<ActiveRoute>('prices');
  const [commodities, setCommodities] =
    useState<Commodity[]>(INITIAL_COMMODITIES);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [isNavigating, setIsNavigating] = useState<boolean>(false);
  const [showCityFilters, setShowCityFilters] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCity, setSelectedCity] = useState<string>('ALL');
  const [selectedCommodityId, setSelectedCommodityId] = useState<string>(
    INITIAL_COMMODITIES[0].id
  );
  const [loggedInUser, setLoggedInUser] = useState<string | null>(null);

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

  const selectedCommodity =
    commodities.find((c) => c.id === selectedCommodityId) ?? commodities[0];

  const handleLoadMore = () => {
    if (isLoadingMore || !hasMore) return;
    setIsLoadingMore(true);
    setTimeout(() => {
      setCommodities((prev) => [...prev, ...EXTRA_COMMODITIES]);
      setHasMore(false);
      setIsLoadingMore(false);
    }, 500);
  };

  const transitionToRoute = (route: ActiveRoute, commodityId?: string) => {
    if (isNavigating) return;
    setIsNavigating(true);
    if (commodityId) {
      setSelectedCommodityId(commodityId);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => {
      setActiveRoute(route);
      setIsNavigating(false);
    }, 200);
  };

  const handleSelectCommodity = (commodityId: string) => {
    transitionToRoute('detail', commodityId);
  };

  const handleNavigate = (route: ActiveRoute) => {
    transitionToRoute(route);
  };

  const handleSubmitPrice = (submission: PriceSubmissionInput) => {
    const cityName = submission.cityAndRegion.split(' (')[0];

    setCommodities((prev) =>
      prev.map((item) => {
        if (item.id !== submission.commodityId) return item;

        return {
          ...item,
          priceFcfa: submission.priceFcfa,
          marketName: submission.marketName,
          city: cityName,
          regionalPrices: [
            {
              id: `sub-${Date.now()}`,
              city: cityName,
              region: submission.cityAndRegion,
              marketName: submission.marketName,
              priceFcfa: submission.priceFcfa,
              unitLabel: submission.packagingUnit.split(' (')[0],
              tag: 'New Report',
              tagType: 'direct',
              note: `Submitted by ${submission.contributorRole}`,
            },
            ...item.regionalPrices,
          ],
        };
      })
    );
  };

  const handleSuccessLogin = (identifier: string) => {
    setLoggedInUser(identifier);
    transitionToRoute('prices');
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#f7f9f7]">
      <Navbar
        activeRoute={activeRoute}
        searchQuery={searchQuery}
        loggedInUser={loggedInUser}
        onSearchChange={setSearchQuery}
        onNavigate={handleNavigate}
        onToggleFilterBar={() => setShowCityFilters((prev) => !prev)}
      />

      {loggedInUser && (
        <div className="border-b border-mint-200 bg-mint-50 px-4 py-1.5 text-center text-[11px] font-medium text-forest-900">
          Signed in as <span className="font-num font-bold">{loggedInUser}</span>
        </div>
      )}

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6">
        {isNavigating ? (
          <div className="space-y-5">
            <div className="h-24 w-full animate-pulse rounded-xl border border-gray-200/80 bg-white" />
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              <CardSkeleton />
              <CardSkeleton />
              <CardSkeleton />
            </div>
          </div>
        ) : (
          <>
            {activeRoute === 'prices' && (
              <div className="space-y-6">
                <StatusBanner />

                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-baseline gap-2.5">
                    <h2 className="font-display text-sm font-bold text-gray-900 sm:text-base">
                      Cameroon Regional Markets
                    </h2>
                    <span className="font-num text-xs text-gray-500">
                      ({filteredCommodities.length}{' '}
                      {filteredCommodities.length === 1
                        ? 'Commodity'
                        : 'Commodities'}
                      )
                    </span>
                  </div>

                  {showCityFilters && (
                    <div className="flex flex-wrap items-center gap-4 border-b border-gray-200/80 pb-1">
                      {cities.map((city) => {
                        const active = selectedCity === city;
                        return (
                          <button
                            key={city}
                            type="button"
                            disabled={isLoadingMore}
                            onClick={() => setSelectedCity(city)}
                            className={`cursor-pointer border-b-2 pb-1 text-xs font-medium transition disabled:opacity-50 ${
                              active
                                ? 'border-forest-900 font-semibold text-forest-900'
                                : 'border-transparent text-gray-500 hover:text-gray-900'
                            }`}
                          >
                            {city === 'ALL' ? 'All Cities' : city}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {filteredCommodities.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-gray-300 bg-white p-8 text-center">
                    <p className="font-display text-sm font-semibold text-gray-800">
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
                        disabled={isLoadingMore}
                        onSelect={handleSelectCommodity}
                      />
                    ))}
                    {isLoadingMore && (
                      <>
                        <CardSkeleton />
                        <CardSkeleton />
                      </>
                    )}
                  </div>
                )}

                {hasMore && (
                  <div className="pt-2 text-center">
                    <button
                      type="button"
                      disabled={isLoadingMore}
                      onClick={handleLoadMore}
                      className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isLoadingMore && (
                        <Loader2
                          className="h-3.5 w-3.5 animate-spin"
                          strokeWidth={2}
                        />
                      )}
                      <span>
                        {isLoadingMore
                          ? 'Loading Commodities...'
                          : 'Load More Commodities'}
                      </span>
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeRoute === 'detail' && selectedCommodity && (
              <CommodityDetailPage
                commodity={selectedCommodity}
                onBack={() => handleNavigate('prices')}
              />
            )}

            {activeRoute === 'submit' && (
              <SubmitPricesPage
                commodities={commodities}
                onSubmitPrice={handleSubmitPrice}
                onBackToPrices={() => handleNavigate('prices')}
              />
            )}

            {activeRoute === 'login' && (
              <LoginPage onSuccessLogin={handleSuccessLogin} />
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default App;