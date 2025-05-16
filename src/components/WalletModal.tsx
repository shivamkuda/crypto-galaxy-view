
import React, { useState } from 'react';
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Wallet, CreditCard, DollarSign, Banknote } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface WalletModalProps {
  cryptoId?: string;
  cryptoName?: string;
  currentPrice?: number;
  onPurchaseComplete?: (cryptoId: string, amount: number, price: number) => void;
}

const formSchema = z.object({
  amount: z
    .string()
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
      message: "Please enter a valid amount greater than 0",
    }),
  paymentMethod: z.enum(["credit_card", "bank_transfer", "crypto", "wallet"])
});

const WalletModal: React.FC<WalletModalProps> = ({ 
  cryptoId, 
  cryptoName = 'Bitcoin',
  currentPrice = 50000,
  onPurchaseComplete
}) => {
  const { toast: useToastFn } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [walletBalance, setWalletBalance] = useState(1000); // Mock wallet balance
  const [open, setOpen] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: "",
      paymentMethod: "wallet"
    },
  });

  const handlePurchase = (values: z.infer<typeof formSchema>) => {
    const purchaseAmount = parseFloat(values.amount);
    
    if (values.paymentMethod === "wallet" && purchaseAmount > walletBalance) {
      useToastFn({
        title: "Insufficient funds",
        description: "Your wallet balance is too low for this purchase",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const cryptoAmount = purchaseAmount / currentPrice;
      
      if (values.paymentMethod === "wallet") {
        setWalletBalance(prev => prev - purchaseAmount);
      }
      
      setIsLoading(false);
      
      // Call the onPurchaseComplete callback if provided
      if (onPurchaseComplete && cryptoId) {
        onPurchaseComplete(cryptoId, purchaseAmount, currentPrice);
      }
      
      toast.success(`You purchased ${cryptoAmount.toFixed(8)} ${cryptoName} using ${getPaymentMethodName(values.paymentMethod)}`, {
        description: `Transaction completed successfully!`,
      });
      
      form.reset();
      setOpen(false);
    }, 1500);
  };

  const getPaymentMethodName = (method: string) => {
    switch (method) {
      case "credit_card": return "Credit Card";
      case "bank_transfer": return "Bank Transfer";
      case "crypto": return "Crypto Wallet";
      case "wallet": return "CryptoGalaxy Wallet";
      default: return "Unknown Method";
    }
  };

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline" className="border-galaxy-accent text-galaxy-accent hover:bg-galaxy-accent hover:text-galaxy-bg">
          <Wallet className="mr-2 h-4 w-4" />
          Buy {cryptoId ? cryptoName : 'Crypto'}
        </Button>
      </DrawerTrigger>
      <DrawerContent className="bg-galaxy-card-bg border-t border-galaxy-secondary">
        <DrawerHeader>
          <DrawerTitle className="text-xl">Buy {cryptoName}</DrawerTitle>
          <DrawerDescription>
            Current price: ${currentPrice.toFixed(2)} | Your balance: ${walletBalance.toFixed(2)}
          </DrawerDescription>
        </DrawerHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handlePurchase)} className="p-4 space-y-4">
            <FormField
              control={form.control}
              name="paymentMethod"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel>Payment Method</FormLabel>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                  >
                    <FormItem className={cn(
                      "flex flex-row items-center space-x-2 space-y-0 rounded-md border p-4 cursor-pointer hover:bg-galaxy-secondary/30 transition-all",
                      field.value === "credit_card" && "bg-galaxy-secondary/40 border-galaxy-accent"
                    )}>
                      <FormControl>
                        <RadioGroupItem value="credit_card" />
                      </FormControl>
                      <FormLabel className="font-normal cursor-pointer flex items-center gap-2 w-full">
                        <CreditCard className="h-5 w-5" />
                        Credit Card
                      </FormLabel>
                    </FormItem>
                    <FormItem className={cn(
                      "flex flex-row items-center space-x-2 space-y-0 rounded-md border p-4 cursor-pointer hover:bg-galaxy-secondary/30 transition-all",
                      field.value === "bank_transfer" && "bg-galaxy-secondary/40 border-galaxy-accent"
                    )}>
                      <FormControl>
                        <RadioGroupItem value="bank_transfer" />
                      </FormControl>
                      <FormLabel className="font-normal cursor-pointer flex items-center gap-2 w-full">
                        <DollarSign className="h-5 w-5" />
                        Bank Transfer
                      </FormLabel>
                    </FormItem>
                    <FormItem className={cn(
                      "flex flex-row items-center space-x-2 space-y-0 rounded-md border p-4 cursor-pointer hover:bg-galaxy-secondary/30 transition-all",
                      field.value === "crypto" && "bg-galaxy-secondary/40 border-galaxy-accent"
                    )}>
                      <FormControl>
                        <RadioGroupItem value="crypto" />
                      </FormControl>
                      <FormLabel className="font-normal cursor-pointer flex items-center gap-2 w-full">
                        <Wallet className="h-5 w-5" />
                        Crypto Wallet
                      </FormLabel>
                    </FormItem>
                    <FormItem className={cn(
                      "flex flex-row items-center space-x-2 space-y-0 rounded-md border p-4 cursor-pointer hover:bg-galaxy-secondary/30 transition-all",
                      field.value === "wallet" && "bg-galaxy-secondary/40 border-galaxy-accent"
                    )}>
                      <FormControl>
                        <RadioGroupItem value="wallet" />
                      </FormControl>
                      <FormLabel className="font-normal cursor-pointer flex items-center gap-2 w-full">
                        <Banknote className="h-5 w-5" />
                        CryptoGalaxy Wallet
                      </FormLabel>
                    </FormItem>
                  </RadioGroup>
                  <FormMessage />
                </FormItem>
              )}
            />
          
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount to spend (USD)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter USD amount"
                      className="bg-galaxy-secondary/30"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                  {field.value && !isNaN(parseFloat(field.value)) && parseFloat(field.value) > 0 && (
                    <p className="text-sm text-muted-foreground">
                      You will receive approximately {parseFloat(field.value) / currentPrice > 0 
                        ? (parseFloat(field.value) / currentPrice).toFixed(8) 
                        : '0'} {cryptoName}
                    </p>
                  )}
                </FormItem>
              )}
            />
          
            <DrawerFooter className="px-0 pb-0">
              <Button 
                type="submit"
                disabled={isLoading}
                className="bg-galaxy-accent text-galaxy-bg hover:bg-galaxy-accent/90"
              >
                {isLoading ? 'Processing...' : 'Confirm Purchase'}
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

export default WalletModal;
