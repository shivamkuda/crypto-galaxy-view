
import React, { createContext, useContext, useState, useEffect } from 'react';

type CurrencyType = 'usd' | 'inr';

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
    setCurrencySymbol(currency === 'usd' ? '$' : '₹');
  }, [currency]);

  const formatPrice = (price: number): string => {
    if (!price && price !== 0) return 'N/A';
    
    // Convert USD to INR if needed (using approximate conversion rate)
    const convertedPrice = currency === 'inr' ? price * 83.5 : price;
    
    return new Intl.NumberFormat('en-' + (currency === 'usd' ? 'US' : 'IN'), {
      style: 'currency',
      currency: currency.toUpperCase(),
      minimumFractionDigits: convertedPrice < 1 ? 4 : 2,
      maximumFractionDigits: convertedPrice < 1 ? 4 : 2
    }).format(convertedPrice);
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
