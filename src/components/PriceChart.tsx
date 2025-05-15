
import React, { useState, useEffect, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchCryptoChart } from '@/utils/api';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle } from 'lucide-react';

interface PriceChartProps {
  cryptoId: string;
}

const PriceChart: React.FC<PriceChartProps> = ({ cryptoId }) => {
  const [timeRange, setTimeRange] = useState<number>(7); // Default to 7 days
  const [retryCount, setRetryCount] = useState(0);
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);
  const [prevPrice, setPrevPrice] = useState<number | null>(null);
  const [priceChange, setPriceChange] = useState<number>(0);
  
  const { data: chartData, isLoading, error, refetch } = useQuery({
    queryKey: ['chart', cryptoId, timeRange, retryCount],
    queryFn: () => fetchCryptoChart(cryptoId, timeRange),
    refetchInterval: timeRange === 1 ? 60000 : false, // Refetch every minute for 1-day charts
    retry: 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Add a separate query for real-time price data (shorter interval)
  const { data: realtimeData } = useQuery({
    queryKey: ['realtimePrice', cryptoId],
    queryFn: () => fetchCryptoChart(cryptoId, 1, true), // Pass true to indicate we just need latest price
    refetchInterval: 30000, // Refetch every 30 seconds
    staleTime: 15000, // Consider fresh for 15 seconds
  });
  
  // Update current price when realtime data changes
  useEffect(() => {
    if (realtimeData?.prices?.length > 0) {
      // Get most recent price
      const latestPrice = realtimeData.prices[realtimeData.prices.length - 1][1];
      
      // Save previous price to calculate change
      if (currentPrice !== null && currentPrice !== latestPrice) {
        setPrevPrice(currentPrice);
      }
      
      // Update current price
      setCurrentPrice(latestPrice);
    }
  }, [realtimeData, currentPrice]);
  
  // Calculate price change whenever price updates
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
  
  // Function to handle retry when chart fails to load
  const handleRetry = () => {
    setRetryCount(count => count + 1);
  };
  
  const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp);
    if (timeRange <= 1) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (timeRange <= 30) {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    } else {
      return date.toLocaleDateString([], { month: 'short', year: '2-digit' });
    }
  };
  
  const formatPriceTooltip = (value: number): string => {
    return `$${value.toFixed(2)}`;
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
    return (
      <div className="p-8 bg-galaxy-card-bg rounded-lg text-center border border-galaxy-secondary">
        <AlertCircle className="mx-auto h-12 w-12 text-galaxy-negative mb-4" />
        <h3 className="text-lg font-medium mb-2">Chart data unavailable</h3>
        <p className="text-muted-foreground mb-4">We couldn't load the chart data for this cryptocurrency.</p>
        <Button onClick={handleRetry} variant="secondary" size="sm">
          Try again
        </Button>
      </div>
    );
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
  
  // Determine if current real-time price is up or down
  const priceChangeColor = priceChange > 0 
    ? 'text-galaxy-positive' 
    : priceChange < 0 
      ? 'text-galaxy-negative' 
      : '';
  
  return (
    <div className="w-full">
      {/* Price display with live indicator */}
      {currentPrice && (
        <div className={`mb-4 flex items-center ${priceChangeColor} transition-colors duration-300`}>
          <span className="text-xl font-bold mr-2">${currentPrice.toFixed(2)}</span>
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
      )}
      
      <div className="flex flex-wrap justify-end mb-4 gap-2">
        {[
          { days: 1, label: '1D' }, 
          { days: 7, label: '7D' }, 
          { days: 30, label: '1M' }, 
          { days: 365, label: '1Y' }
        ].map(({ days, label }) => (
          <Button
            key={days}
            variant="outline"
            size="sm"
            className={`text-xs ${timeRange === days 
              ? 'bg-galaxy-primary text-white border-galaxy-primary' 
              : 'border-galaxy-secondary hover:bg-galaxy-secondary'}`}
            onClick={() => setTimeRange(days)}
          >
            {label}
          </Button>
        ))}
      </div>
      
      <div className="p-4 bg-galaxy-card-bg rounded-lg border border-galaxy-secondary">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#323232" />
            <XAxis 
              dataKey="timestamp" 
              tickFormatter={formatDate} 
              tick={{ fill: '#8E9196' }}
              stroke="#323232"
              tickMargin={10}
              minTickGap={30}
            />
            <YAxis 
              dataKey="price" 
              domain={['auto', 'auto']}
              tick={{ fill: '#8E9196' }}
              stroke="#323232"
              tickFormatter={(value) => `$${value.toFixed(2)}`}
              width={80}
            />
            <Tooltip 
              formatter={formatPriceTooltip}
              labelFormatter={formatDate}
              contentStyle={{ 
                backgroundColor: '#1A1F2C', 
                borderColor: '#3A0CA3',
                borderRadius: '0.375rem',
                color: 'white'
              }}
              isAnimationActive={true}
            />
            <Line 
              type="monotone" 
              dataKey="price" 
              stroke={lineColor} 
              strokeWidth={2} 
              dot={false} 
              activeDot={{ r: 4, stroke: lineColor, strokeWidth: 1 }}
              isAnimationActive={true}
              animationDuration={1000}
              animationEasing="ease-in-out"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PriceChart;
