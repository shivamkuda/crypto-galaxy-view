
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchCryptoChart } from '@/utils/api';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

interface PriceChartProps {
  cryptoId: string;
}

const PriceChart: React.FC<PriceChartProps> = ({ cryptoId }) => {
  const [timeRange, setTimeRange] = useState<number>(7); // Default to 7 days
  
  const { data: chartData, isLoading } = useQuery({
    queryKey: ['chart', cryptoId, timeRange],
    queryFn: () => fetchCryptoChart(cryptoId, timeRange),
    refetchInterval: timeRange === 1 ? 60000 : false, // Refetch every minute for 1-day charts
  });
  
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
    return <div className="p-4 bg-galaxy-card-bg rounded-lg text-center">Chart data unavailable</div>;
  }

  // Format the chart data for Recharts
  const data = chartData.prices.map((item: [number, number]) => ({
    timestamp: item[0],
    price: item[1],
  }));
  
  // Determine if price has increased over the period
  const priceChange = data[data.length - 1].price - data[0].price;
  const isPriceUp = priceChange >= 0;
  const lineColor = isPriceUp ? '#4CC9F0' : '#F72585';
  
  return (
    <div className="w-full">
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
