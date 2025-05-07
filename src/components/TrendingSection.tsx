
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchTrending } from '@/utils/api';
import CryptoCard from './CryptoCard';
import { TrendingUp } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const TrendingSection: React.FC = () => {
  const { data: trendingData, isLoading } = useQuery({
    queryKey: ['trending'],
    queryFn: fetchTrending,
    refetchInterval: 300000, // 5 minutes
  });

  if (isLoading) {
    return (
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4 flex items-center">
          <TrendingUp className="h-5 w-5 mr-2 text-galaxy-accent" />
          Trending Cryptocurrencies
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 animate-pulse">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="crypto-card p-4">
              <div className="flex items-center gap-3 mb-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div>
                  <Skeleton className="h-5 w-24 mb-1" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
              <div className="flex justify-between items-center mt-2">
                <Skeleton className="h-3 w-12" />
                <Skeleton className="h-4 w-20" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!trendingData || trendingData.coins.length === 0) {
    return null;
  }

  // Limit to first 4 trending coins
  const trendingCoins = trendingData.coins.slice(0, 4);

  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold mb-4 flex items-center">
        <TrendingUp className="h-5 w-5 mr-2 text-galaxy-accent" />
        Trending Cryptocurrencies
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {trendingCoins.map((trending, index) => (
          <CryptoCard key={trending.item.id} trending={trending} trendingRank={index} />
        ))}
      </div>
    </div>
  );
};

export default TrendingSection;
