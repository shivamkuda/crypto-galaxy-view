
import React from 'react';
import { useCurrency } from '@/contexts/CurrencyContext';
import { Button } from '@/components/ui/button';
import { DollarSign, Bitcoin } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const CurrencyToggle: React.FC = () => {
  const { currency, setCurrency } = useCurrency();
  const isMobile = useIsMobile();

  return (
    <div className="flex items-center gap-1 bg-galaxy-secondary rounded-md p-0.5">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setCurrency('usd')}
        className={`flex items-center h-7 ${isMobile ? 'px-2' : 'px-3'} rounded-sm ${currency === 'usd' ? 'bg-galaxy-primary text-black' : 'text-gray-400 hover:text-white'}`}
      >
        <DollarSign className="h-3.5 w-3.5 mr-1" /> {!isMobile && "USD"}
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setCurrency('inr')}
        className={`flex items-center h-7 ${isMobile ? 'px-2' : 'px-3'} rounded-sm ${currency === 'inr' ? 'bg-galaxy-primary text-black' : 'text-gray-400 hover:text-white'}`}
      >
        <span className="mr-1 text-base leading-none">₹</span> {!isMobile && "INR"}
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setCurrency('btc')}
        className={`flex items-center h-7 ${isMobile ? 'px-2' : 'px-3'} rounded-sm ${currency === 'btc' ? 'bg-galaxy-primary text-black' : 'text-gray-400 hover:text-white'}`}
      >
        <Bitcoin className="h-3.5 w-3.5 mr-1" /> {!isMobile && "BTC"}
      </Button>
    </div>
  );
};

export default CurrencyToggle;
