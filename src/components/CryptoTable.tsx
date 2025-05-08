
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { fetchCryptoList, formatPercent } from '@/utils/api';
import { ArrowUp, ArrowDown, Search } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useCurrency } from '@/contexts/CurrencyContext';

const CryptoTable: React.FC = () => {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const { formatPrice } = useCurrency();
  
  const { data: cryptoList, isLoading } = useQuery({
    queryKey: ['cryptoList', page],
    queryFn: () => fetchCryptoList(page),
    staleTime: 60000, // 1 minute
  });

  const filteredCryptoList = cryptoList?.filter(
    crypto => 
      crypto.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      crypto.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handlePrevPage = () => {
    if (page > 1) setPage(page - 1);
  };
  
  const handleNextPage = () => {
    setPage(page + 1);
  };

  if (isLoading) {
    return (
      <div className="overflow-x-auto">
        <div className="mb-4">
          <Skeleton className="h-10 w-full" />
        </div>
        <table className="w-full table-auto">
          <thead>
            <tr className="border-b border-galaxy-secondary">
              <th className="px-4 py-3 text-left"># Rank</th>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-right">Price</th>
              <th className="px-4 py-3 text-right">24h %</th>
              <th className="px-4 py-3 text-right">Market Cap</th>
              <th className="px-4 py-3 text-right">Volume (24h)</th>
            </tr>
          </thead>
          <tbody>
            {[...Array(10)].map((_, i) => (
              <tr key={i} className="border-b border-galaxy-secondary/50">
                <td className="px-4 py-4"><Skeleton className="h-4 w-8" /></td>
                <td className="px-4 py-4">
                  <div className="flex items-center">
                    <Skeleton className="h-8 w-8 rounded-full mr-2" />
                    <div>
                      <Skeleton className="h-4 w-24 mb-1" />
                      <Skeleton className="h-3 w-12" />
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4 text-right"><Skeleton className="h-4 w-24 ml-auto" /></td>
                <td className="px-4 py-4 text-right"><Skeleton className="h-4 w-16 ml-auto" /></td>
                <td className="px-4 py-4 text-right"><Skeleton className="h-4 w-32 ml-auto" /></td>
                <td className="px-4 py-4 text-right"><Skeleton className="h-4 w-32 ml-auto" /></td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-4 flex justify-between">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <div className="mb-4 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input 
          placeholder="Search cryptocurrencies..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-galaxy-card-bg"
        />
      </div>
      <table className="w-full table-auto">
        <thead>
          <tr className="border-b border-galaxy-secondary">
            <th className="px-4 py-3 text-left"># Rank</th>
            <th className="px-4 py-3 text-left">Name</th>
            <th className="px-4 py-3 text-right">Price</th>
            <th className="px-4 py-3 text-right">24h %</th>
            <th className="px-4 py-3 text-right">Market Cap</th>
            <th className="px-4 py-3 text-right">Volume (24h)</th>
          </tr>
        </thead>
        <tbody>
          {filteredCryptoList?.map((crypto) => {
            const isPriceUp = crypto.price_change_percentage_24h >= 0;
            
            return (
              <tr key={crypto.id} className="hover:bg-galaxy-card-bg/50 border-b border-galaxy-secondary/50">
                <td className="px-4 py-4 text-muted-foreground">
                  {crypto.market_cap_rank}
                </td>
                <td className="px-4 py-4">
                  <Link to={`/crypto/${crypto.id}`} className="flex items-center">
                    <img 
                      src={crypto.image} 
                      alt={crypto.name} 
                      className="w-8 h-8 rounded-full mr-2"
                      loading="lazy"
                    />
                    <div>
                      <span className="font-medium">{crypto.name}</span>
                      <span className="block text-xs text-muted-foreground uppercase">{crypto.symbol}</span>
                    </div>
                  </Link>
                </td>
                <td className="px-4 py-4 text-right font-medium">
                  {formatPrice(crypto.current_price)}
                </td>
                <td className={`px-4 py-4 text-right ${isPriceUp ? 'text-galaxy-positive' : 'text-galaxy-negative'}`}>
                  <div className="flex items-center justify-end">
                    {isPriceUp ? (
                      <ArrowUp className="h-4 w-4 mr-1" />
                    ) : (
                      <ArrowDown className="h-4 w-4 mr-1" />
                    )}
                    {formatPercent(Math.abs(crypto.price_change_percentage_24h))}
                  </div>
                </td>
                <td className="px-4 py-4 text-right">
                  {formatPrice(crypto.market_cap)}
                </td>
                <td className="px-4 py-4 text-right">
                  {formatPrice(crypto.total_volume)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="mt-4 flex justify-between">
        <Button 
          variant="outline" 
          onClick={handlePrevPage} 
          disabled={page === 1}
          className="border-galaxy-secondary"
        >
          Previous
        </Button>
        <Button 
          variant="outline" 
          onClick={handleNextPage}
          className="border-galaxy-secondary"
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default CryptoTable;
