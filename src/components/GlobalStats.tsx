
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchGlobalData, formatLargeNumber, formatPercent } from '@/utils/api';
import { ChartBar, TrendingUp, Coins, DollarSign } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const GlobalStats: React.FC = () => {
  const { data: globalData, isLoading } = useQuery({
    queryKey: ['globalData'],
    queryFn: fetchGlobalData,
    refetchInterval: 60000,
  });

  if (isLoading) {
    return (
      <div className="grid-stats mb-6 animate-pulse">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="stat-card">
            <Skeleton className="h-6 w-24 mb-2" />
            <Skeleton className="h-8 w-32" />
          </div>
        ))}
      </div>
    );
  }

  if (!globalData) {
    return (
      <div className="p-4 bg-galaxy-card-bg rounded-lg text-center mb-6">
        Failed to load global market data
      </div>
    );
  }

  const marketCap = globalData.total_market_cap.usd;
  const volume = globalData.total_volume.usd;
  const marketCapChange = globalData.market_cap_change_percentage_24h_usd;
  const btcDominance = globalData.market_cap_percentage.btc;

  return (
    <div className="grid-stats mb-6">
      <div className="stat-card animate-slide-up" style={{ animationDelay: '0ms' }}>
        <div className="flex items-center justify-between">
          <span className="stat-label">Market Cap</span>
          <DollarSign className="h-5 w-5 text-galaxy-accent opacity-70" />
        </div>
        <span className="stat-value">{formatLargeNumber(marketCap)}</span>
        <span className={marketCapChange >= 0 ? "text-xs price-up" : "text-xs price-down"}>
          {marketCapChange >= 0 ? '↑' : '↓'} {formatPercent(Math.abs(marketCapChange))}
        </span>
      </div>

      <div className="stat-card animate-slide-up" style={{ animationDelay: '100ms' }}>
        <div className="flex items-center justify-between">
          <span className="stat-label">24h Volume</span>
          <ChartBar className="h-5 w-5 text-galaxy-accent opacity-70" />
        </div>
        <span className="stat-value">{formatLargeNumber(volume)}</span>
      </div>

      <div className="stat-card animate-slide-up" style={{ animationDelay: '200ms' }}>
        <div className="flex items-center justify-between">
          <span className="stat-label">BTC Dominance</span>
          <Coins className="h-5 w-5 text-galaxy-accent opacity-70" />
        </div>
        <span className="stat-value">{formatPercent(btcDominance)}</span>
      </div>

      <div className="stat-card animate-slide-up" style={{ animationDelay: '300ms' }}>
        <div className="flex items-center justify-between">
          <span className="stat-label">Active Cryptocurrencies</span>
          <TrendingUp className="h-5 w-5 text-galaxy-accent opacity-70" />
        </div>
        <span className="stat-value">{globalData.active_cryptocurrencies.toLocaleString()}</span>
      </div>
    </div>
  );
};

export default GlobalStats;
