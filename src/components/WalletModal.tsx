
import React, { useState } from 'react';
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Wallet, CreditCard } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface WalletModalProps {
  cryptoId?: string;
  cryptoName?: string;
  currentPrice?: number;
}

const WalletModal: React.FC<WalletModalProps> = ({ 
  cryptoId, 
  cryptoName = 'Bitcoin',
  currentPrice = 50000
}) => {
  const { toast } = useToast();
  const [amount, setAmount] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [walletBalance, setWalletBalance] = useState(1000); // Mock wallet balance

  const handlePurchase = () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid purchase amount",
        variant: "destructive"
      });
      return;
    }

    const purchaseAmount = parseFloat(amount);
    
    if (purchaseAmount > walletBalance) {
      toast({
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
      setWalletBalance(prev => prev - purchaseAmount);
      
      setIsLoading(false);
      toast({
        title: "Purchase successful!",
        description: `You purchased ${cryptoAmount.toFixed(8)} ${cryptoName}`,
      });
      
      setAmount('');
    }, 1500);
  };

  return (
    <Drawer>
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
        <div className="p-4">
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium">Amount to spend (USD)</label>
            <Input
              type="number"
              placeholder="Enter USD amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="bg-galaxy-secondary/30"
            />
            {amount && (
              <p className="mt-2 text-sm text-muted-foreground">
                You will receive approximately {parseFloat(amount) / currentPrice > 0 
                  ? (parseFloat(amount) / currentPrice).toFixed(8) 
                  : '0'} {cryptoName}
              </p>
            )}
          </div>
        </div>
        <DrawerFooter>
          <Button 
            onClick={handlePurchase} 
            disabled={isLoading}
            className="bg-galaxy-accent text-galaxy-bg hover:bg-galaxy-accent/90"
          >
            {isLoading ? 'Processing...' : 'Confirm Purchase'}
          </Button>
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default WalletModal;
