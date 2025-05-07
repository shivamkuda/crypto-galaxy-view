import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchCryptoDetails, formatCurrency, formatLargeNumber, formatPercent } from '@/utils/api';
import Header from '@/components/Header';
import PriceChart from '@/components/PriceChart';
import { ArrowUp, ArrowDown, Globe, Coins, ChartBar } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import WalletModal from '@/components/WalletModal';

const CryptoDetail = () => {
  const { id } = useParams<{ id: string }>();
  
  const { data: crypto, isLoading } = useQuery({
    queryKey: ['crypto', id],
    queryFn: () => fetchCryptoDetails(id),
    refetchInterval: 30000, // refetch every 30 seconds
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-6">
          <div className="flex items-center gap-2 mb-4">
            <Link to="/" className="text-sm text-muted-foreground hover:text-galaxy-accent">
              Market
            </Link>
            <span className="text-muted-foreground">/</span>
            <Skeleton className="h-4 w-24" />
          </div>
          
          <div className="animate-pulse">
            <div className="flex items-center gap-4 mb-6">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div>
                <Skeleton className="h-8 w-32 mb-2" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
            
            <div className="mb-6">
              <Skeleton className="h-[300px] w-full mb-8 rounded-lg" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="p-4 bg-galaxy-card-bg rounded-lg">
                  <Skeleton className="h-5 w-24 mb-2" />
                  <Skeleton className="h-6 w-32" />
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!crypto || !id) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-6">
          <div className="p-8 bg-galaxy-card-bg rounded-lg text-center">
            <h2 className="text-2xl font-bold mb-4">Cryptocurrency not found</h2>
            <p className="mb-6">The cryptocurrency you are looking for doesn't exist or couldn't be loaded.</p>
            <Button asChild>
              <Link to="/">Return to Market</Link>
            </Button>
          </div>
        </main>
      </div>
    );
  }

  const priceChangePercent24h = crypto.market_data?.price_change_percentage_24h;
  const isPriceUp = priceChangePercent24h >= 0;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="flex items-center gap-2 mb-4">
          <Link to="/" className="text-sm text-muted-foreground hover:text-galaxy-accent">
            Market
          </Link>
          <span className="text-muted-foreground">/</span>
          <span className="text-sm">{crypto.name}</span>
        </div>
        
        <div className="flex items-center gap-4 mb-6 animate-slide-up">
          <img 
            src={crypto.image?.large} 
            alt={crypto.name} 
            className="w-12 h-12 rounded-full"
          />
          <div className="flex-1">
            <h1 className="text-2xl font-bold flex items-center">
              {crypto.name}
              <span className="ml-2 text-sm font-normal text-muted-foreground uppercase">
                {crypto.symbol}
              </span>
              {crypto.market_data?.market_cap_rank && (
                <span className="ml-2 px-2 py-1 bg-galaxy-primary/20 text-xs rounded-full">
                  Rank #{crypto.market_data.market_cap_rank}
                </span>
              )}
            </h1>
            <div className="flex items-center">
              <span className="text-2xl font-bold mr-2">
                {formatCurrency(crypto.market_data?.current_price?.usd)}
              </span>
              {priceChangePercent24h !== undefined && (
                <span className={isPriceUp ? "price-up" : "price-down"}>
                  {isPriceUp ? (
                    <ArrowUp className="inline h-4 w-4 mr-1" />
                  ) : (
                    <ArrowDown className="inline h-4 w-4 mr-1" />
                  )}
                  {formatPercent(Math.abs(priceChangePercent24h))}
                </span>
              )}
            </div>
          </div>
          <div>
            <WalletModal 
              cryptoId={id} 
              cryptoName={crypto.name} 
              currentPrice={crypto.market_data?.current_price?.usd || 0} 
            />
          </div>
        </div>
        
        <div className="mb-8">
          <PriceChart cryptoId={id} />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="stat-card animate-slide-up" style={{ animationDelay: '0ms' }}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-muted-foreground">Market Cap</span>
              <ChartBar className="h-4 w-4 text-galaxy-accent" />
            </div>
            <span className="text-lg font-medium">
              {formatLargeNumber(crypto.market_data?.market_cap?.usd)}
            </span>
          </div>
          
          <div className="stat-card animate-slide-up" style={{ animationDelay: '100ms' }}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-muted-foreground">24h Trading Vol</span>
              <ChartBar className="h-4 w-4 text-galaxy-accent" />
            </div>
            <span className="text-lg font-medium">
              {formatLargeNumber(crypto.market_data?.total_volume?.usd)}
            </span>
          </div>
          
          <div className="stat-card animate-slide-up" style={{ animationDelay: '200ms' }}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-muted-foreground">Circulating Supply</span>
              <Coins className="h-4 w-4 text-galaxy-accent" />
            </div>
            <span className="text-lg font-medium">
              {crypto.market_data?.circulating_supply?.toLocaleString()} {crypto.symbol?.toUpperCase()}
            </span>
          </div>
          
          <div className="stat-card animate-slide-up" style={{ animationDelay: '300ms' }}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-muted-foreground">Max Supply</span>
              <Coins className="h-4 w-4 text-galaxy-accent" />
            </div>
            <span className="text-lg font-medium">
              {crypto.market_data?.max_supply 
                ? `${crypto.market_data.max_supply.toLocaleString()} ${crypto.symbol?.toUpperCase()}` 
                : 'Unlimited'}
            </span>
          </div>
          
          <div className="stat-card animate-slide-up" style={{ animationDelay: '400ms' }}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-muted-foreground">All-Time High</span>
              <ArrowUp className="h-4 w-4 text-galaxy-positive" />
            </div>
            <div>
              <span className="text-lg font-medium">
                {formatCurrency(crypto.market_data?.ath?.usd)}
              </span>
              <span className="text-xs ml-2 text-muted-foreground">
                {new Date(crypto.market_data?.ath_date?.usd).toLocaleDateString()}
              </span>
            </div>
          </div>
          
          <div className="stat-card animate-slide-up" style={{ animationDelay: '500ms' }}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-muted-foreground">All-Time Low</span>
              <ArrowDown className="h-4 w-4 text-galaxy-negative" />
            </div>
            <div>
              <span className="text-lg font-medium">
                {formatCurrency(crypto.market_data?.atl?.usd)}
              </span>
              <span className="text-xs ml-2 text-muted-foreground">
                {new Date(crypto.market_data?.atl_date?.usd).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
        
        {crypto.description?.en && (
          <div className="mb-6 animate-slide-up">
            <h2 className="text-xl font-bold mb-4">About {crypto.name}</h2>
            <div className="bg-galaxy-card-bg rounded-lg p-4 border border-galaxy-secondary">
              <div 
                className="prose prose-invert max-w-none prose-a:text-galaxy-accent prose-headings:text-white" 
                dangerouslySetInnerHTML={{ 
                  __html: crypto.description.en.slice(0, 500) + (crypto.description.en.length > 500 ? '...' : '') 
                }}
              />
            </div>
          </div>
        )}
        
        <div className="flex flex-wrap gap-4 mb-6 animate-slide-up">
          {crypto.links?.homepage?.[0] && (
            <Button 
              variant="outline" 
              size="sm" 
              className="border-galaxy-accent text-galaxy-accent hover:bg-galaxy-accent hover:text-galaxy-bg"
              asChild
            >
              <a href={crypto.links.homepage[0]} target="_blank" rel="noopener noreferrer">
                <Globe className="mr-2 h-4 w-4" />
                Website
              </a>
            </Button>
          )}
          
          {crypto.links?.blockchain_site?.filter(Boolean).slice(0, 1).map((site, index) => (
            <Button 
              key={index}
              variant="outline" 
              size="sm" 
              className="border-galaxy-secondary hover:bg-galaxy-secondary"
              asChild
            >
              <a href={site} target="_blank" rel="noopener noreferrer">
                <ChartBar className="mr-2 h-4 w-4" />
                Explorer
              </a>
            </Button>
          ))}
        </div>
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

export default CryptoDetail;
