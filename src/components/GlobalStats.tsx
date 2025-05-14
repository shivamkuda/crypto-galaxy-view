
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchGlobalData } from '@/utils/api';
import { Skeleton } from '@/components/ui/skeleton';
import { useCurrency } from '@/contexts/CurrencyContext';

const GlobalStats: React.FC = () => {
  const { data: globalData, isLoading } = useQuery({
    queryKey: ['globalData'],
    queryFn: fetchGlobalData,
    refetchInterval: 60000, // 1 minute
  });

  const { formatPrice } = useCurrency();

  if (isLoading || !globalData) {
    return (
      <div className="mb-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-galaxy-card-bg rounded-lg p-3 sm:p-4 animate-pulse">
              <Skeleton className="h-3 sm:h-4 w-16 sm:w-24 mb-2" />
              <Skeleton className="h-5 sm:h-6 w-20 sm:w-32" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mb-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-galaxy-card-bg rounded-lg p-3 sm:p-4 border border-galaxy-secondary animate-slide-up">
          <h3 className="text-xs sm:text-sm text-muted-foreground mb-1">Cryptocurrencies</h3>
          <p className="text-base sm:text-xl font-medium truncate">
            {globalData.active_cryptocurrencies.toLocaleString()}
          </p>
        </div>
        <div className="bg-galaxy-card-bg rounded-lg p-3 sm:p-4 border border-galaxy-secondary animate-slide-up" style={{ animationDelay: '100ms' }}>
          <h3 className="text-xs sm:text-sm text-muted-foreground mb-1">Markets</h3>
          <p className="text-base sm:text-xl font-medium truncate">
            {globalData.markets.toLocaleString()}
          </p>
        </div>
        <div className="bg-galaxy-card-bg rounded-lg p-3 sm:p-4 border border-galaxy-secondary animate-slide-up" style={{ animationDelay: '200ms' }}>
          <h3 className="text-xs sm:text-sm text-muted-foreground mb-1">Total Market Cap</h3>
          <p className="text-base sm:text-xl font-medium truncate">
            {formatPrice(globalData.total_market_cap.usd)}
          </p>
        </div>
        <div className="bg-galaxy-card-bg rounded-lg p-3 sm:p-4 border border-galaxy-secondary animate-slide-up" style={{ animationDelay: '300ms' }}>
          <h3 className="text-xs sm:text-sm text-muted-foreground mb-1">24h Volume</h3>
          <p className="text-base sm:text-xl font-medium truncate">
            {formatPrice(globalData.total_volume.usd)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default GlobalStats;
