
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Wallet, CreditCard, ArrowUpDown, Coins } from 'lucide-react';
import WalletModal from '@/components/WalletModal';
import { useQuery } from '@tanstack/react-query';
import { fetchCryptoList } from '@/utils/api';
import { Skeleton } from '@/components/ui/skeleton';
import { useCurrency } from '@/contexts/CurrencyContext';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { PortfolioItem } from '@/types/crypto';

// Extending the mock portfolio with more data
const initialPortfolio: PortfolioItem[] = [
  { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC', amount: 0.0212, price: 0, purchasePrice: 35000 },
  { id: 'ethereum', name: 'Ethereum', symbol: 'ETH', amount: 0.451, price: 0, purchasePrice: 2200 },
  { id: 'solana', name: 'Solana', symbol: 'SOL', amount: 2.5, price: 0, purchasePrice: 98 }
];

const WalletPage = () => {
  const [walletBalance, setWalletBalance] = useState(1000);
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>(initialPortfolio);
  const [sortConfig, setSortConfig] = useState({ key: 'value', direction: 'desc' });
  const { formatPrice } = useCurrency();
  
  const { data: cryptoData, isLoading } = useQuery({
    queryKey: ['crypto-prices'],
    queryFn: () => fetchCryptoList(1, 20),
    staleTime: 60000, // 1 minute
  });
  
  // Update portfolio with current prices
  useEffect(() => {
    if (cryptoData) {
      const updatedPortfolio = portfolio.map(item => {
        const crypto = cryptoData.find(c => c.id === item.id);
        return {
          ...item,
          price: crypto?.current_price || 0,
          value: (crypto?.current_price || 0) * item.amount,
          pnl: ((crypto?.current_price || 0) - item.purchasePrice) * item.amount,
          pnlPercentage: ((crypto?.current_price || 0) - item.purchasePrice) / item.purchasePrice * 100
        };
      });
      
      setPortfolio(updatedPortfolio);
    }
  }, [cryptoData]);

  // Handle buying crypto
  const handleBuyCrypto = (cryptoId: string, amount: number, price: number) => {
    // Check if crypto is already in portfolio
    const existingCrypto = portfolio.find(item => item.id === cryptoId);
    
    // Get crypto details
    const crypto = cryptoData?.find(c => c.id === cryptoId);
    if (!crypto) return;
    
    // Update wallet balance
    setWalletBalance(prev => prev - amount);
    
    // Calculate amount of crypto purchased
    const cryptoAmount = amount / price;
    
    if (existingCrypto) {
      // Update existing crypto
      const updatedPortfolio = portfolio.map(item => {
        if (item.id === cryptoId) {
          const newAmount = item.amount + cryptoAmount;
          const newPurchasePrice = ((item.amount * item.purchasePrice) + (cryptoAmount * price)) / newAmount;
          return {
            ...item,
            amount: newAmount,
            purchasePrice: newPurchasePrice,
            value: newAmount * price,
            pnl: (price - newPurchasePrice) * newAmount,
            pnlPercentage: (price - newPurchasePrice) / newPurchasePrice * 100
          };
        }
        return item;
      });
      setPortfolio(updatedPortfolio);
    } else {
      // Add new crypto
      const newCrypto: PortfolioItem = {
        id: cryptoId,
        name: crypto.name,
        symbol: crypto.symbol.toUpperCase(),
        amount: cryptoAmount,
        price: crypto.current_price,
        purchasePrice: crypto.current_price,
        value: cryptoAmount * crypto.current_price,
        pnl: 0,
        pnlPercentage: 0
      };
      setPortfolio([...portfolio, newCrypto]);
    }
    
    toast.success(`Successfully purchased ${cryptoAmount.toFixed(8)} ${crypto.name}`);
  };
  
  // Handle sorting
  const requestSort = (key: string) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };
  
  const sortedPortfolio = [...portfolio].sort((a, b) => {
    if (a[sortConfig.key as keyof typeof a] < b[sortConfig.key as keyof typeof b]) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (a[sortConfig.key as keyof typeof a] > b[sortConfig.key as keyof typeof b]) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });
  
  const totalPortfolioValue = portfolio.reduce((total, item) => total + (item.value || 0), 0);
  const totalPnL = portfolio.reduce((total, item) => total + (item.pnl || 0), 0);
  const totalPnLPercentage = (totalPnL / (totalPortfolioValue - totalPnL)) * 100;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-galaxy-accent to-galaxy-positive bg-clip-text text-transparent animate-slide-up">
          Your Crypto Wallet
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-galaxy-card-bg rounded-lg border border-galaxy-secondary p-6 animate-slide-up">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Wallet className="mr-2 h-5 w-5 text-galaxy-accent" />
              Available Balance
            </h2>
            <p className="text-3xl font-bold mb-2">{formatPrice(walletBalance)}</p>
            <div className="flex gap-2 mt-4">
              <Button className="bg-galaxy-accent text-galaxy-bg hover:bg-galaxy-accent/90">
                <CreditCard className="mr-2 h-4 w-4" />
                Add Funds
              </Button>
            </div>
          </div>
          
          <div className="bg-galaxy-card-bg rounded-lg border border-galaxy-secondary p-6 animate-slide-up" style={{ animationDelay: '100ms' }}>
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Coins className="mr-2 h-5 w-5 text-galaxy-accent" />
              Portfolio Value
            </h2>
            <p className="text-3xl font-bold mb-2">{formatPrice(totalPortfolioValue)}</p>
            <p className="text-sm text-muted-foreground">
              {isLoading ? 'Loading portfolio data...' : `${portfolio.length} assets in your portfolio`}
            </p>
          </div>
          
          <div className="bg-galaxy-card-bg rounded-lg border border-galaxy-secondary p-6 animate-slide-up" style={{ animationDelay: '200ms' }}>
            <h2 className="text-xl font-semibold mb-4">Total Profit/Loss</h2>
            <p className={`text-3xl font-bold mb-2 ${totalPnL >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {formatPrice(totalPnL)} ({totalPnLPercentage.toFixed(2)}%)
            </p>
            <p className="text-sm text-muted-foreground">
              {isLoading ? 'Calculating...' : `Since your first purchase`}
            </p>
          </div>
        </div>
        
        <div className="mb-8 animate-slide-up" style={{ animationDelay: '200ms' }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Your Portfolio</h2>
          </div>
          
          <Card className="bg-galaxy-card-bg border-galaxy-secondary">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Assets Overview</CardTitle>
              <CardDescription>Track your cryptocurrency portfolio performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b border-galaxy-secondary">
                      <TableHead 
                        className="cursor-pointer" 
                        onClick={() => requestSort('name')}
                      >
                        Asset {sortConfig.key === 'name' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                      </TableHead>
                      <TableHead 
                        className="text-right cursor-pointer" 
                        onClick={() => requestSort('price')}
                      >
                        Price {sortConfig.key === 'price' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                      </TableHead>
                      <TableHead 
                        className="text-right cursor-pointer" 
                        onClick={() => requestSort('amount')}
                      >
                        Holdings {sortConfig.key === 'amount' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                      </TableHead>
                      <TableHead 
                        className="text-right cursor-pointer" 
                        onClick={() => requestSort('value')}
                      >
                        Value {sortConfig.key === 'value' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                      </TableHead>
                      <TableHead 
                        className="text-right cursor-pointer" 
                        onClick={() => requestSort('pnl')}
                      >
                        Profit/Loss {sortConfig.key === 'pnl' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                      </TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      [...Array(3)].map((_, i) => (
                        <TableRow key={i} className="border-b border-galaxy-secondary/50">
                          <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                          <TableCell className="text-right"><Skeleton className="h-6 w-16 ml-auto" /></TableCell>
                          <TableCell className="text-right"><Skeleton className="h-6 w-20 ml-auto" /></TableCell>
                          <TableCell className="text-right"><Skeleton className="h-6 w-24 ml-auto" /></TableCell>
                          <TableCell className="text-right"><Skeleton className="h-6 w-24 ml-auto" /></TableCell>
                          <TableCell className="text-right"><Skeleton className="h-8 w-16 ml-auto" /></TableCell>
                        </TableRow>
                      ))
                    ) : sortedPortfolio.length > 0 ? (
                      sortedPortfolio.map((asset) => (
                        <TableRow key={asset.id} className="border-b border-galaxy-secondary/50">
                          <TableCell>
                            <div className="flex items-center">
                              <span className="font-medium">{asset.name}</span>
                              <span className="ml-2 text-sm text-muted-foreground">{asset.symbol}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            {formatPrice(asset.price)}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex flex-col items-end">
                              <span>{asset.amount.toFixed(8)}</span>
                              <span className="text-xs text-muted-foreground">
                                Avg Buy: {formatPrice(asset.purchasePrice)}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            {formatPrice(asset.value || 0)}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className={`flex flex-col items-end ${(asset.pnl || 0) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                              <span>{formatPrice(asset.pnl || 0)}</span>
                              <span className="text-xs">{(asset.pnlPercentage || 0).toFixed(2)}%</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <WalletModal 
                                cryptoId={asset.id} 
                                cryptoName={asset.name} 
                                currentPrice={asset.price} 
                                onPurchaseComplete={handleBuyCrypto}
                              />
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="p-8 text-center text-muted-foreground">
                          You don't have any assets yet. Start by buying some crypto.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="mb-8 animate-slide-up" style={{ animationDelay: '300ms' }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Buy Cryptocurrency</h2>
          </div>
          
          <div className="bg-galaxy-card-bg rounded-lg border border-galaxy-secondary p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {isLoading ? (
                [...Array(3)].map((_, i) => (
                  <div key={i} className="p-4 border border-galaxy-secondary rounded-lg">
                    <Skeleton className="h-6 w-24 mb-2" />
                    <Skeleton className="h-8 w-32 mb-2" />
                    <Skeleton className="h-8 w-full" />
                  </div>
                ))
              ) : (
                cryptoData?.slice(0, 6).map(crypto => (
                  <div key={crypto.id} className="p-4 border border-galaxy-secondary rounded-lg">
                    <div className="flex items-center mb-2">
                      <img src={crypto.image} alt={crypto.name} className="w-6 h-6 mr-2" />
                      <span className="font-medium">{crypto.name}</span>
                    </div>
                    <p className="text-lg font-bold mb-3">{formatPrice(crypto.current_price)}</p>
                    <WalletModal 
                      cryptoId={crypto.id} 
                      cryptoName={crypto.name} 
                      currentPrice={crypto.current_price}
                      onPurchaseComplete={handleBuyCrypto}
                    />
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
      
      <footer className="py-6 bg-galaxy-secondary mt-auto">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>CryptoGalaxyView © {new Date().getFullYear()} | Real-time cryptocurrency market data</p>
          <p className="mt-1">Data provided by CoinGecko API</p>
        </div>
      </footer>
    </div>
  );
};

export default WalletPage;
