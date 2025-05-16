
import React from 'react';
import { useCurrency } from '@/contexts/CurrencyContext';
import { Button } from '@/components/ui/button';
import { DollarSign, Bitcoin } from 'lucide-react';

const CurrencyToggle: React.FC = () => {
  const { currency, setCurrency } = useCurrency();

  return (
    <div className="flex items-center gap-2">
      <Button
        variant={currency === 'usd' ? 'default' : 'outline'}
        size="sm"
        onClick={() => setCurrency('usd')}
        className="flex items-center"
      >
        <DollarSign className="h-4 w-4 mr-1" /> USD
      </Button>
      <Button
        variant={currency === 'inr' ? 'default' : 'outline'}
        size="sm"
        onClick={() => setCurrency('inr')}
        className="flex items-center"
      >
        <span className="mr-1 text-lg leading-none">₹</span> INR
      </Button>
      <Button
        variant={currency === 'btc' ? 'default' : 'outline'}
        size="sm"
        onClick={() => setCurrency('btc')}
        className="flex items-center"
      >
        <Bitcoin className="h-4 w-4 mr-1" /> BTC
      </Button>
    </div>
  );
};

export default CurrencyToggle;
