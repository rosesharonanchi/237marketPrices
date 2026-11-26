import React, { useEffect, useState } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';

export type ActiveRoute = 'prices' | 'detail' | 'submit' | 'login';

interface NavbarProps {
  activeRoute: ActiveRoute;
  searchQuery: string;
  loggedInUser?: string | null;
  onSearchChange: (value: string) => void;
  onNavigate: (route: ActiveRoute) => void;
  onToggleFilterBar?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeRoute,
  searchQuery,
  loggedInUser,
  onSearchChange,
  onNavigate,
  onToggleFilterBar,
}) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      setScrolled(scrollTop > 8);
      setScrollProgress(
        docHeight > 0
          ? Math.min(100, Math.max(0, (scrollTop / docHeight) * 100))
          : 0
      );
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-30 bg-forest-900 text-white transition-shadow ${
        scrolled ? 'shadow-md' : 'shadow-2xs'
      }`}
    >
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-2.5 sm:px-6">
        {/* Brand */}
        <button
          type="button"
          onClick={() => onNavigate('prices')}
          className="flex cursor-pointer items-center gap-2.5 text-left focus:outline-none"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-md border border-white/20 bg-forest-800 font-num text-xs font-bold tracking-tight text-emerald-300">
            237
          </span>
          <span className="leading-tight">
            <span className="block font-display text-sm font-bold tracking-tight text-white">
              237MarketPrices
            </span>
            <span className="block text-[11px] text-sage-text">
              Cameroon Market Rates
            </span>
          </span>
        </button>

        {/* Search + Filter */}
        <div className="order-3 flex w-full items-center gap-2 md:order-2 md:w-auto md:flex-1 md:max-w-md">
          <div className="relative flex-1">
            <Search
              className="pointer-events-none absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-gray-400"
              strokeWidth={2}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search commodity or regional market..."
              aria-label="Search commodity or regional market"
              className="w-full rounded-md border border-transparent bg-white py-1.5 pr-3 pl-8 text-xs text-gray-900 placeholder-gray-400 transition focus:border-emerald-400 focus:outline-none"
            />
          </div>
          <button
            type="button"
            onClick={() => {
              onNavigate('prices');
              onToggleFilterBar?.();
            }}
            title="Toggle city filter bar"
            aria-label="Toggle city filter bar"
            className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-md border border-white/15 bg-forest-800 text-emerald-100 transition hover:bg-forest-700"
          >
            <SlidersHorizontal className="h-3.5 w-3.5" strokeWidth={2} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="order-2 flex items-center gap-5 text-xs font-medium md:order-3">
          <button
            type="button"
            onClick={() => onNavigate('prices')}
            className={`cursor-pointer border-b-2 py-1 transition ${
              activeRoute === 'prices' || activeRoute === 'detail'
                ? 'border-emerald-300 font-semibold text-white'
                : 'border-transparent text-sage-text hover:text-white'
            }`}
          >
            Market Prices
          </button>
          <button
            type="button"
            onClick={() => onNavigate('submit')}
            className={`cursor-pointer border-b-2 py-1 transition ${
              activeRoute === 'submit'
                ? 'border-emerald-300 font-semibold text-white'
                : 'border-transparent text-sage-text hover:text-white'
            }`}
          >
            Submit Price
          </button>
          <button
            type="button"
            onClick={() => onNavigate('prices')}
            className="hidden cursor-pointer border-b-2 border-transparent py-1 text-sage-text transition hover:text-white sm:inline-block"
          >
            Alerts
          </button>
          <button
            type="button"
            onClick={() => onNavigate('login')}
            className="hidden cursor-pointer border-b-2 border-transparent py-1 text-sage-text transition hover:text-white sm:inline-block"
          >
            Profile
          </button>
          <button
            type="button"
            onClick={() => onNavigate('login')}
            className="cursor-pointer rounded-md bg-white px-3.5 py-1.5 text-xs font-semibold text-forest-900 transition hover:bg-mint-100"
          >
            {loggedInUser ? 'Account' : 'Login'}
          </button>
        </nav>
      </div>

      {/* Scroll Progress Bar */}
      <div className="h-0.5 w-full bg-forest-950/60">
        <div
          className="h-full bg-emerald-400 transition-[width] duration-100"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>
    </header>
  );
};