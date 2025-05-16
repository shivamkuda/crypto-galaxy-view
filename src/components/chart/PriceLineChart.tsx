
import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { formatDate } from '@/utils/formatters';
import { useCurrency } from '@/contexts/CurrencyContext';

interface ChartDataPoint {
  timestamp: number;
  price: number;
}

interface PriceLineChartProps {
  data: ChartDataPoint[];
  timeRange: number;
  lineColor: string;
}

const PriceLineChart: React.FC<PriceLineChartProps> = ({ data, timeRange, lineColor }) => {
  const { formatPrice, currencySymbol } = useCurrency();
  
  // Format tooltip price values
  const formatPriceTooltip = (value: number): string => {
    return formatPrice(value);
  };
  
  return (
    <div className="p-4 bg-galaxy-card-bg rounded-lg border border-galaxy-secondary">
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#323232" />
          <XAxis 
            dataKey="timestamp" 
            tickFormatter={(timestamp) => formatDate(timestamp, timeRange)} 
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
            tickFormatter={(value) => formatPrice(value)}
            width={80}
          />
          <Tooltip 
            formatter={formatPriceTooltip}
            labelFormatter={(timestamp) => formatDate(timestamp, timeRange)}
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
  );
};

export default PriceLineChart;
