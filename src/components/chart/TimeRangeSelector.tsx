
import React from 'react';
import { Button } from '@/components/ui/button';

interface TimeRangeSelectorProps {
  timeRange: number;
  onTimeRangeChange: (days: number) => void;
}

const TimeRangeSelector: React.FC<TimeRangeSelectorProps> = ({ 
  timeRange, 
  onTimeRangeChange 
}) => {
  const timeRanges = [
    { days: 1, label: '1D' }, 
    { days: 7, label: '7D' }, 
    { days: 30, label: '1M' }, 
    { days: 365, label: '1Y' }
  ];

  return (
    <div className="flex flex-wrap justify-end mb-4 gap-2">
      {timeRanges.map(({ days, label }) => (
        <Button
          key={days}
          variant="outline"
          size="sm"
          className={`text-xs ${timeRange === days 
            ? 'bg-galaxy-primary text-white border-galaxy-primary' 
            : 'border-galaxy-secondary hover:bg-galaxy-secondary'}`}
          onClick={() => onTimeRangeChange(days)}
        >
          {label}
        </Button>
      ))}
    </div>
  );
};

export default TimeRangeSelector;
