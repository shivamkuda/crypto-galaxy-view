
import { useState, useEffect } from 'react';

interface UsePriceUpdatesResult {
  currentPrice: number | null;
  prevPrice: number | null;
  priceChange: number;
  priceChangeColor: string;
  updatePrice: (newPrice: number) => void;
}

/**
 * Hook to manage price updates and animations
 */
export const usePriceUpdates = (): UsePriceUpdatesResult => {
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);
  const [prevPrice, setPrevPrice] = useState<number | null>(null);
  const [priceChange, setPriceChange] = useState<number>(0);

  // Update price change whenever current or previous price changes
  useEffect(() => {
    if (currentPrice !== null && prevPrice !== null) {
      const change = currentPrice - prevPrice;
      setPriceChange(change);
      
      // Reset change indicator after 2 seconds
      const timer = setTimeout(() => {
        setPriceChange(0);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [currentPrice, prevPrice]);

  // Determine if current real-time price is up or down
  const priceChangeColor = priceChange > 0 
    ? 'text-galaxy-positive' 
    : priceChange < 0 
      ? 'text-galaxy-negative' 
      : '';
  
  // Update the current price and save previous price
  const updatePrice = (newPrice: number) => {
    if (currentPrice !== null && currentPrice !== newPrice) {
      setPrevPrice(currentPrice);
    }
    setCurrentPrice(newPrice);
  };

  return {
    currentPrice,
    prevPrice,
    priceChange,
    priceChangeColor,
    updatePrice
  };
};
