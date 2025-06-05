
import React, { useState } from 'react';
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { TrendingDown } from 'lucide-react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { useCurrency } from '@/contexts/CurrencyContext';

interface SellModalProps {
  cryptoId: string;
  cryptoName: string;
  cryptoSymbol: string;
  currentPrice: number;
  availableAmount: number;
  onSellComplete?: (cryptoId: string, amount: number, price: number) => void;
}

const formSchema = z.object({
  amount: z
    .string()
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
      message: "Please enter a valid amount greater than 0",
    }),
  sellType: z.enum(["amount", "percentage"])
});

const SellModal: React.FC<SellModalProps> = ({ 
  cryptoId, 
  cryptoName,
  cryptoSymbol,
  currentPrice,
  availableAmount,
  onSellComplete
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const { formatPrice } = useCurrency();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: "",
      sellType: "amount"
    },
  });

  const handleSell = (values: z.infer<typeof formSchema>) => {
    const sellAmount = parseFloat(values.amount);
    
    if (sellAmount > availableAmount) {
      toast.error("Insufficient balance", {
        description: `You only have ${availableAmount.toFixed(8)} ${cryptoSymbol} available`
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const usdValue = sellAmount * currentPrice;
      
      setIsLoading(false);
      
      // Call the onSellComplete callback if provided
      if (onSellComplete) {
        onSellComplete(cryptoId, sellAmount, currentPrice);
      }
      
      toast.success(`Successfully sold ${sellAmount.toFixed(8)} ${cryptoName}`, {
        description: `Received ${formatPrice(usdValue)} in your wallet`,
      });
      
      form.reset();
      setOpen(false);
    }, 1500);
  };

  const handleQuickSell = (percentage: number) => {
    const amount = (availableAmount * percentage / 100).toFixed(8);
    form.setValue('amount', amount);
  };

  const watchedAmount = form.watch('amount');
  const estimatedValue = watchedAmount && !isNaN(parseFloat(watchedAmount)) 
    ? parseFloat(watchedAmount) * currentPrice 
    : 0;

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline" size="sm" className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white">
          <TrendingDown className="mr-1 h-3 w-3" />
          Sell
        </Button>
      </DrawerTrigger>
      <DrawerContent className="bg-galaxy-card-bg border-t border-galaxy-secondary">
        <DrawerHeader>
          <DrawerTitle className="text-xl">Sell {cryptoName}</DrawerTitle>
          <DrawerDescription>
            Current price: {formatPrice(currentPrice)} | Available: {availableAmount.toFixed(8)} {cryptoSymbol}
          </DrawerDescription>
        </DrawerHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSell)} className="p-4 space-y-4">
            <div className="space-y-2">
              <FormLabel>Quick Sell Options</FormLabel>
              <div className="grid grid-cols-4 gap-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleQuickSell(25)}
                  className="text-xs"
                >
                  25%
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleQuickSell(50)}
                  className="text-xs"
                >
                  50%
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleQuickSell(75)}
                  className="text-xs"
                >
                  75%
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleQuickSell(100)}
                  className="text-xs"
                >
                  100%
                </Button>
              </div>
            </div>

            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount to sell ({cryptoSymbol})</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder={`Enter ${cryptoSymbol} amount`}
                      className="bg-galaxy-secondary/30"
                      step="any"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                  {estimatedValue > 0 && (
                    <p className="text-sm text-muted-foreground">
                      You will receive approximately {formatPrice(estimatedValue)}
                    </p>
                  )}
                </FormItem>
              )}
            />
          
            <DrawerFooter className="px-0 pb-0">
              <Button 
                type="submit"
                disabled={isLoading}
                className="bg-red-600 text-white hover:bg-red-700"
              >
                {isLoading ? 'Processing Sale...' : 'Confirm Sale'}
              </Button>
              <DrawerClose asChild>
                <Button variant="outline" onClick={() => form.reset()}>Cancel</Button>
              </DrawerClose>
            </DrawerFooter>
          </form>
        </Form>
      </DrawerContent>
    </Drawer>
  );
};

export default SellModal;
