
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchCryptoList, formatCurrency, formatLargeNumber, formatPercent } from '@/utils/api';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const CryptoTable: React.FC = () => {
  const [page, setPage] = useState<number>(1);
  const perPage = 20;

  const { data: cryptos, isLoading } = useQuery({
    queryKey: ['cryptos', page],
    queryFn: () => fetchCryptoList(page, perPage),
    refetchInterval: 30000,
    keepPreviousData: true,
  });

  if (isLoading) {
    return (
      <div className="w-full overflow-x-auto">
        <div className="w-full border-b border-galaxy-secondary">
          <div className="grid grid-cols-7 gap-4 px-4 py-3 text-sm font-medium text-muted-foreground">
            <div>#</div>
            <div>Name</div>
            <div>Price</div>
            <div>24h %</div>
            <div className="hidden sm:block">Market Cap</div>
            <div className="hidden md:block">Volume (24h)</div>
            <div className="hidden lg:block">Circulating Supply</div>
          </div>
        </div>
        <div className="animate-pulse">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="grid grid-cols-7 gap-4 px-4 py-4 border-b border-galaxy-secondary">
              <Skeleton className="h-5 w-5" />
              <div className="flex items-center gap-2">
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-4 w-20" />
              </div>
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="hidden sm:block h-4 w-24" />
              <Skeleton className="hidden md:block h-4 w-24" />
              <Skeleton className="hidden lg:block h-4 w-28" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!cryptos || cryptos.length === 0) {
    return <div className="p-4 bg-galaxy-card-bg rounded-lg text-center">No cryptocurrency data available</div>;
  }

  return (
    <div className="w-full">
      <div className="w-full overflow-x-auto rounded-lg border border-galaxy-secondary mb-4">
        <table className="w-full">
          <thead>
            <tr className="border-b border-galaxy-secondary bg-galaxy-card-bg">
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">#</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Name</th>
              <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">Price</th>
              <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">24h %</th>
              <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground hidden sm:table-cell">Market Cap</th>
              <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground hidden md:table-cell">Volume (24h)</th>
              <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground hidden lg:table-cell">Circulating Supply</th>
            </tr>
          </thead>
          <tbody>
            {cryptos.map((crypto) => (
              <tr 
                key={crypto.id} 
                className="border-b border-galaxy-secondary hover:bg-galaxy-secondary/20 transition-colors"
              >
                <td className="px-4 py-4 text-sm">{crypto.market_cap_rank}</td>
                <td className="px-4 py-4">
                  <Link to={`/crypto/${crypto.id}`} className="flex items-center gap-2 hover:text-galaxy-accent">
                    <img 
                      src={crypto.image} 
                      alt={crypto.name} 
                      className="w-6 h-6" 
                      loading="lazy" 
                    />
                    <span className="font-medium">{crypto.name}</span>
                    <span className="text-xs text-muted-foreground uppercase">{crypto.symbol}</span>
                  </Link>
                </td>
                <td className="px-4 py-4 text-right">{formatCurrency(crypto.current_price)}</td>
                <td className="px-4 py-4 text-right">
                  <span 
                    className={crypto.price_change_percentage_24h >= 0 ? "price-up" : "price-down"}
                  >
                    {crypto.price_change_percentage_24h >= 0 ? (
                      <ArrowUp className="inline h-3 w-3 mr-1" />
                    ) : (
                      <ArrowDown className="inline h-3 w-3 mr-1" />
                    )}
                    {formatPercent(Math.abs(crypto.price_change_percentage_24h))}
                  </span>
                </td>
                <td className="px-4 py-4 text-right hidden sm:table-cell">
                  {formatLargeNumber(crypto.market_cap)}
                </td>
                <td className="px-4 py-4 text-right hidden md:table-cell">
                  {formatLargeNumber(crypto.total_volume)}
                </td>
                <td className="px-4 py-4 text-right hidden lg:table-cell">
                  {crypto.circulating_supply.toLocaleString()} {crypto.symbol.toUpperCase()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="flex justify-between">
        <Button
          variant="outline"
          disabled={page === 1}
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          className="border-galaxy-secondary text-sm hover:bg-galaxy-secondary"
        >
          Previous
        </Button>
        <span className="flex items-center px-4">Page {page}</span>
        <Button
          variant="outline"
          onClick={() => setPage((prev) => prev + 1)}
          className="border-galaxy-secondary text-sm hover:bg-galaxy-secondary"
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default CryptoTable;
