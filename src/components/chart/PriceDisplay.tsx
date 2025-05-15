
import React from 'react';

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
  if (currentPrice === null) return null;

  return (
    <div className={`mb-4 flex items-center ${priceChangeColor} transition-colors duration-300`}>
      <span className="text-xl font-bold mr-2">
        ${typeof currentPrice === 'number' ? currentPrice.toFixed(2) : '0.00'}
      </span>
      {priceChange !== 0 && (
        <span className="text-sm font-medium">
          {priceChange > 0 ? '+' : ''}{priceChange.toFixed(2)}
        </span>
      )}
      <span className="ml-2 relative flex h-3 w-3">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-galaxy-accent opacity-75"></span>
        <span className="relative inline-flex rounded-full h-3 w-3 bg-galaxy-accent"></span>
      </span>
    </div>
  );
};

export default PriceDisplay;
