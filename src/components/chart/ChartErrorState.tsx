
import React from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

interface ChartErrorStateProps {
  onRetry: () => void;
}

const ChartErrorState: React.FC<ChartErrorStateProps> = ({ onRetry }) => {
  return (
    <div className="p-8 bg-galaxy-card-bg rounded-lg text-center border border-galaxy-secondary">
      <AlertCircle className="mx-auto h-12 w-12 text-galaxy-negative mb-4" />
      <h3 className="text-lg font-medium mb-2">Chart data unavailable</h3>
      <p className="text-muted-foreground mb-4">We couldn't load the chart data for this cryptocurrency.</p>
      <Button onClick={onRetry} variant="secondary" size="sm">
        Try again
      </Button>
    </div>
  );
};

export default ChartErrorState;
