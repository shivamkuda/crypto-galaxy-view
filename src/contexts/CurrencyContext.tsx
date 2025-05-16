
import React, { createContext, useContext, useState, useEffect } from 'react';

type CurrencyType = 'usd' | 'inr' | 'btc';

interface CurrencyContextType {
  currency: CurrencyType;
  setCurrency: (currency: CurrencyType) => void;
  formatPrice: (price: number) => string;
  currencySymbol: string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currency, setCurrency] = useState<CurrencyType>('usd');
  const [currencySymbol, setCurrencySymbol] = useState('$');

  useEffect(() => {
    // Update currency symbol when currency changes
    if (currency === 'usd') {
      setCurrencySymbol('$');
    } else if (currency === 'inr') {
      setCurrencySymbol('₹');
    } else if (currency === 'btc') {
      setCurrencySymbol('₿');
    }
  }, [currency]);

  const formatPrice = (price: number): string => {
    if (!price && price !== 0) return 'N/A';
    
    // Convert USD to selected currency
    let convertedPrice = price;
    if (currency === 'inr') {
      convertedPrice = price * 83.5; // Approximate INR conversion rate
    } else if (currency === 'btc') {
      convertedPrice = price / 60000; // Approximate BTC value in USD
    }
    
    // Format the price based on the selected currency
    if (currency === 'btc') {
      // For BTC, show more decimal places and use BTC symbol
      return `₿${convertedPrice.toFixed(convertedPrice < 0.001 ? 8 : 6)}`;
    } else {
      // For fiat currencies, use Intl.NumberFormat
      return new Intl.NumberFormat('en-' + (currency === 'usd' ? 'US' : 'IN'), {
        style: 'currency',
        currency: currency.toUpperCase(),
        minimumFractionDigits: convertedPrice < 1 ? 4 : 2,
        maximumFractionDigits: convertedPrice < 1 ? 4 : 2
      }).format(convertedPrice);
    }
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, formatPrice, currencySymbol }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = (): CurrencyContextType => {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};
