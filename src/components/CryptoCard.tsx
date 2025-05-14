
import React from 'react';
import { Link } from 'react-router-dom';
import { TrendingCoin } from '@/types/crypto';
import { TrendingUp } from 'lucide-react';
import { useCurrency } from '@/contexts/CurrencyContext';

interface CryptoCardProps {
  trending: TrendingCoin;
  trendingRank: number;
}

const CryptoCard: React.FC<CryptoCardProps> = ({ trending, trendingRank }) => {
  // Convert BTC price to approx USD (this is very rough estimation)
  const btcToUsd = 50000; // Simplified fixed value for demo purposes
  const estimatedPrice = trending.item.price_btc * btcToUsd;
  const { formatPrice } = useCurrency();
  
  return (
    <Link to={`/crypto/${trending.item.id}`} className="block">
      <div className="crypto-card p-3 sm:p-4 relative overflow-hidden animate-slide-up" style={{ animationDelay: `${trendingRank * 100}ms` }}>
        <div className="absolute top-0 right-0 bg-galaxy-primary/20 px-2 py-1 text-xs font-medium rounded-bl flex items-center">
          <TrendingUp className="h-3 w-3 mr-1 text-galaxy-accent" />
          #{trendingRank+1}
        </div>
        
        <div className="flex items-center gap-2 sm:gap-3 mb-3">
          <img
            src={trending.item.small}
            alt={trending.item.name}
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full"
            loading="lazy"
          />
          <div>
            <h3 className="font-bold text-sm sm:text-base">{trending.item.name}</h3>
            <span className="text-xs text-muted-foreground uppercase">{trending.item.symbol}</span>
          </div>
        </div>
        
        <div className="flex justify-between items-center mt-2">
          <div className="text-xs text-muted-foreground">
            Rank #{trending.item.market_cap_rank || 'N/A'}
          </div>
          <div className="text-xs sm:text-sm font-medium">
            {formatPrice(estimatedPrice)}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CryptoCard;
