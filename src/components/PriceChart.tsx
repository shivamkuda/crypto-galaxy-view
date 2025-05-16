
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';
import { fetchCoinGeckoChart, fetchCurrentPrice } from '@/utils/cryptoApi';
import { usePriceUpdates } from '@/hooks/usePriceUpdates';
import { useCurrency } from '@/contexts/CurrencyContext';
import TimeRangeSelector from '@/components/chart/TimeRangeSelector';
import PriceDisplay from '@/components/chart/PriceDisplay';
import PriceLineChart from '@/components/chart/PriceLineChart';
import ChartErrorState from '@/components/chart/ChartErrorState';

interface PriceChartProps {
  cryptoId: string;
}

const PriceChart: React.FC<PriceChartProps> = ({ cryptoId }) => {
  const [timeRange, setTimeRange] = useState<number>(7); // Default to 7 days
  const [retryCount, setRetryCount] = useState(0);
  const { currency } = useCurrency();
  
  // Use our custom hook for price updates
  const {
    currentPrice,
    priceChange,
    priceChangeColor,
    updatePrice
  } = usePriceUpdates();
  
  // Query for historical chart data
  const { data: chartData, isLoading, error } = useQuery({
    queryKey: ['chart', cryptoId, timeRange, retryCount],
    queryFn: () => fetchCoinGeckoChart(cryptoId, timeRange),
    refetchInterval: false,
    retry: 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Query for real-time price data (shorter interval)
  const { data: realtimePrice } = useQuery({
    queryKey: ['realtimePrice', cryptoId],
    queryFn: () => fetchCurrentPrice(cryptoId),
    refetchInterval: 30000, // Refetch every 30 seconds
    staleTime: 15000, // Consider fresh for 15 seconds
  });
  
  // Update current price when realtime data changes
  useEffect(() => {
    if (realtimePrice !== undefined && typeof realtimePrice === 'number') {
      updatePrice(realtimePrice);
    }
  }, [realtimePrice, updatePrice]);
  
  // Function to handle retry when chart fails to load
  const handleRetry = () => {
    setRetryCount(count => count + 1);
  };

  if (isLoading) {
    return (
      <div className="w-full">
        <div className="flex flex-wrap justify-end mb-4 gap-2 animate-pulse">
          {[1, 7, 30, 365].map((day) => (
            <Skeleton key={day} className="h-8 w-14" />
          ))}
        </div>
        <Skeleton className="h-[300px] w-full" />
      </div>
    );
  }

  if (!chartData || chartData.prices.length === 0) {
    return <ChartErrorState onRetry={handleRetry} />;
  }

  // Format the chart data for Recharts
  const data = chartData.prices.map((item: [number, number]) => ({
    timestamp: item[0],
    price: item[1],
  }));
  
  // Determine if price has increased over the period
  const periodPriceChange = data[data.length - 1].price - data[0].price;
  const isPriceUp = periodPriceChange >= 0;
  const lineColor = isPriceUp ? '#4CC9F0' : '#F72585';
  
  return (
    <div className="w-full">
      <PriceDisplay 
        currentPrice={currentPrice}
        priceChange={priceChange}
        priceChangeColor={priceChangeColor}
      />
      
      <TimeRangeSelector 
        timeRange={timeRange} 
        onTimeRangeChange={(days) => setTimeRange(days)} 
      />
      
      <PriceLineChart 
        data={data}
        timeRange={timeRange}
        lineColor={lineColor}
      />
    </div>
  );
};

export default PriceChart;
