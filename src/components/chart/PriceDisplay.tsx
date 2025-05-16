
import React from 'react';
import { useCurrency } from '@/contexts/CurrencyContext';

interface PriceDisplayProps {
  currentPrice: number | null;
  priceChange: number;
  priceChangeColor: string;
}

const PriceDisplay: React.FC<PriceDisplayProps> = ({
  currentPrice,
  priceChange,
  priceChangeColor
}) => {
  const { formatPrice, currencySymbol } = useCurrency();
  
  if (currentPrice === null) return null;

  return (
    <div className="mb-3 sm:mb-4 flex flex-wrap items-center gap-1 sm:gap-2">
      <span className="text-xl sm:text-2xl font-bold text-white break-all">
        {typeof currentPrice === 'number' ? formatPrice(currentPrice) : 'N/A'}
      </span>
      {priceChange !== 0 && (
        <span className={`${priceChangeColor} text-xs sm:text-sm font-medium px-1.5 py-0.5 rounded bg-opacity-20 ${priceChangeColor === 'text-galaxy-positive' ? 'bg-galaxy-positive/10' : 'bg-galaxy-negative/10'}`}>
          {priceChange > 0 ? '+' : ''}{priceChange.toFixed(2)}%
        </span>
      )}
      <span className="ml-1 relative flex h-2 w-2">
        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${priceChangeColor === 'text-galaxy-positive' ? 'bg-galaxy-positive' : 'bg-galaxy-negative'} opacity-75`}></span>
        <span className={`relative inline-flex rounded-full h-2 w-2 ${priceChangeColor === 'text-galaxy-positive' ? 'bg-galaxy-positive' : 'bg-galaxy-negative'}`}></span>
      </span>
    </div>
  );
};

export default PriceDisplay;
