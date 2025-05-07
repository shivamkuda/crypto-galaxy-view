
import React from 'react';
import Header from '@/components/Header';
import { useQuery } from '@tanstack/react-query';
import { fetchTrending } from '@/utils/api';
import { TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';

const Trending = () => {
  const { data: trendingData, isLoading } = useQuery({
    queryKey: ['trending'],
    queryFn: fetchTrending,
    refetchInterval: 300000, // 5 minutes
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold mb-6 flex items-center bg-gradient-to-r from-galaxy-accent to-galaxy-positive bg-clip-text text-transparent animate-slide-up">
          <TrendingUp className="mr-2 h-6 w-6 text-galaxy-accent" />
          Trending Cryptocurrencies
        </h1>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-pulse">
            {[...Array(7)].map((_, i) => (
              <div key={i} className="p-6 bg-galaxy-card-bg rounded-lg border border-galaxy-secondary">
                <div className="flex items-center gap-4 mb-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div>
                    <Skeleton className="h-6 w-32 mb-1" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                  <Skeleton className="h-8 w-8 rounded-full ml-auto" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </div>
            ))}
          </div>
        ) : !trendingData || trendingData.coins.length === 0 ? (
          <div className="p-8 bg-galaxy-card-bg rounded-lg text-center">
            <h2 className="text-2xl font-bold mb-4">No trending data available</h2>
            <p>Please check back later for trending cryptocurrency information.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {trendingData.coins.map((trending, index) => (
              <Link 
                key={trending.item.id} 
                to={`/crypto/${trending.item.id}`}
                className="p-6 bg-galaxy-card-bg rounded-lg border border-galaxy-secondary hover:border-galaxy-accent transition-colors animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center gap-4">
                  <img 
                    src={trending.item.large} 
                    alt={trending.item.name} 
                    className="w-12 h-12 rounded-full"
                    loading="lazy"
                  />
                  <div>
                    <h2 className="text-xl font-bold">{trending.item.name}</h2>
                    <span className="text-sm text-muted-foreground uppercase">{trending.item.symbol}</span>
                  </div>
                  <div className="ml-auto flex items-center justify-center w-8 h-8 rounded-full bg-galaxy-primary text-white text-sm font-bold">
                    #{index + 1}
                  </div>
                </div>
                
                <div className="mt-4 flex justify-between items-center">
                  <div className="text-sm">
                    <span className="text-muted-foreground">Market Cap Rank: </span>
                    <span className="font-medium">
                      {trending.item.market_cap_rank ? `#${trending.item.market_cap_rank}` : 'N/A'}
                    </span>
                  </div>
                  <div className="text-sm">
                    <span className="text-muted-foreground">Score: </span>
                    <span className="font-medium">{trending.item.score}</span>
                  </div>
                </div>
                
                <div className="mt-2 text-sm">
                  <span className="text-muted-foreground">Price in BTC: </span>
                  <span className="font-medium">₿ {trending.item.price_btc.toFixed(8)}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
      <footer className="py-6 bg-galaxy-secondary mt-auto">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>CryptoGalaxyView © {new Date().getFullYear()} | Real-time cryptocurrency market data</p>
          <p className="mt-1">Data provided by CoinGecko API</p>
        </div>
      </footer>
    </div>
  );
};

export default Trending;
