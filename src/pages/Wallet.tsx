import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Wallet, CreditCard, ArrowUpDown, Coins } from 'lucide-react';
import WalletModal from '@/components/WalletModal';
import SellModal from '@/components/SellModal';
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
  
  // Enhanced query with better refetch intervals for accurate prices
  const { data: cryptoData, isLoading, refetch } = useQuery({
    queryKey: ['crypto-prices'],
    queryFn: () => fetchCryptoList(1, 50), // Fetch more coins for better coverage
    staleTime: 30000, // 30 seconds
    refetchInterval: 60000, // Refetch every minute for accurate prices
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
  
  // Handle selling crypto
  const handleSellCrypto = (cryptoId: string, amount: number, price: number) => {
    const usdValue = amount * price;
    
    // Update wallet balance
    setWalletBalance(prev => prev + usdValue);
    
    // Update portfolio
    const updatedPortfolio = portfolio.map(item => {
      if (item.id === cryptoId) {
        const newAmount = item.amount - amount;
        
        if (newAmount <= 0) {
          // Remove from portfolio if amount is 0 or less
          return null;
        }
        
        return {
          ...item,
          amount: newAmount,
          value: newAmount * price,
          pnl: (price - item.purchasePrice) * newAmount,
          pnlPercentage: (price - item.purchasePrice) / item.purchasePrice * 100
        };
      }
      return item;
    }).filter(Boolean) as PortfolioItem[];
    
    setPortfolio(updatedPortfolio);
    
    // Get crypto details for toast
    const crypto = cryptoData?.find(c => c.id === cryptoId);
    toast.success(`Successfully sold ${amount.toFixed(8)} ${crypto?.name || cryptoId}`);
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
      <main className="flex-1 container mx-auto px-3 sm:px-4 py-4 sm:py-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-0 bg-gradient-to-r from-galaxy-accent to-galaxy-positive bg-clip-text text-transparent">
            Your Crypto Wallet
          </h1>
          <Button 
            onClick={() => refetch()} 
            variant="outline" 
            size="sm"
            className="self-start sm:self-auto"
          >
            Refresh Prices
          </Button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6 sm:mb-8">
          <div className="bg-galaxy-card-bg rounded-lg border border-galaxy-secondary p-4 sm:p-6 animate-slide-up">
            <h2 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-4 flex items-center">
              <Wallet className="mr-2 h-4 w-4 sm:h-5 sm:w-5 text-galaxy-accent" />
              <span className="text-sm sm:text-base">Available Balance</span>
            </h2>
            <p className="text-2xl sm:text-3xl font-bold mb-2">{formatPrice(walletBalance)}</p>
            <div className="flex gap-2 mt-3 sm:mt-4">
              <Button className="bg-galaxy-accent text-galaxy-bg hover:bg-galaxy-accent/90 text-sm sm:text-base px-3 sm:px-4">
                <CreditCard className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                Add Funds
              </Button>
            </div>
          </div>
          
          <div className="bg-galaxy-card-bg rounded-lg border border-galaxy-secondary p-4 sm:p-6 animate-slide-up" style={{ animationDelay: '100ms' }}>
            <h2 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-4 flex items-center">
              <Coins className="mr-2 h-4 w-4 sm:h-5 sm:w-5 text-galaxy-accent" />
              <span className="text-sm sm:text-base">Portfolio Value</span>
            </h2>
            <p className="text-2xl sm:text-3xl font-bold mb-2">{formatPrice(totalPortfolioValue)}</p>
            <p className="text-xs sm:text-sm text-muted-foreground">
              {isLoading ? 'Loading portfolio data...' : `${portfolio.length} assets in your portfolio`}
            </p>
          </div>
          
          <div className="bg-galaxy-card-bg rounded-lg border border-galaxy-secondary p-4 sm:p-6 animate-slide-up" style={{ animationDelay: '200ms' }}>
            <h2 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-4">Total Profit/Loss</h2>
            <p className={`text-xl sm:text-3xl font-bold mb-2 ${totalPnL >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {formatPrice(totalPnL)} 
              <span className="text-sm sm:text-lg ml-1">({totalPnLPercentage.toFixed(2)}%)</span>
            </p>
            <p className="text-xs sm:text-sm text-muted-foreground">
              {isLoading ? 'Calculating...' : `Since your first purchase`}
            </p>
          </div>
        </div>
        
        <div className="mb-6 sm:mb-8 animate-slide-up" style={{ animationDelay: '200ms' }}>
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h2 className="text-lg sm:text-xl font-bold">Your Portfolio</h2>
          </div>
          
          <Card className="bg-galaxy-card-bg border-galaxy-secondary">
            <CardHeader className="pb-2 px-3 sm:px-6">
              <CardTitle className="text-base sm:text-lg">Assets Overview</CardTitle>
              <CardDescription className="text-xs sm:text-sm">Track your cryptocurrency portfolio performance</CardDescription>
            </CardHeader>
            <CardContent className="px-3 sm:px-6">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b border-galaxy-secondary">
                      <TableHead className="cursor-pointer text-xs sm:text-sm px-2 sm:px-4" onClick={() => requestSort('name')}>
                        Asset {sortConfig.key === 'name' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                      </TableHead>
                      <TableHead className="text-right cursor-pointer text-xs sm:text-sm px-2 sm:px-4" onClick={() => requestSort('price')}>
                        Price {sortConfig.key === 'price' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                      </TableHead>
                      <TableHead className="text-right cursor-pointer text-xs sm:text-sm px-2 sm:px-4 hidden sm:table-cell" onClick={() => requestSort('amount')}>
                        Holdings {sortConfig.key === 'amount' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                      </TableHead>
                      <TableHead className="text-right cursor-pointer text-xs sm:text-sm px-2 sm:px-4" onClick={() => requestSort('value')}>
                        Value {sortConfig.key === 'value' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                      </TableHead>
                      <TableHead className="text-right cursor-pointer text-xs sm:text-sm px-2 sm:px-4 hidden md:table-cell" onClick={() => requestSort('pnl')}>
                        P&L {sortConfig.key === 'pnl' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                      </TableHead>
                      <TableHead className="text-right text-xs sm:text-sm px-2 sm:px-4">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      [...Array(3)].map((_, i) => (
                        <TableRow key={i} className="border-b border-galaxy-secondary/50">
                          <TableCell className="px-2 sm:px-4"><Skeleton className="h-4 sm:h-6 w-20 sm:w-24" /></TableCell>
                          <TableCell className="text-right px-2 sm:px-4"><Skeleton className="h-4 sm:h-6 w-12 sm:w-16 ml-auto" /></TableCell>
                          <TableCell className="text-right px-2 sm:px-4 hidden sm:table-cell"><Skeleton className="h-4 sm:h-6 w-16 sm:w-20 ml-auto" /></TableCell>
                          <TableCell className="text-right px-2 sm:px-4"><Skeleton className="h-4 sm:h-6 w-16 sm:w-24 ml-auto" /></TableCell>
                          <TableCell className="text-right px-2 sm:px-4 hidden md:table-cell"><Skeleton className="h-4 sm:h-6 w-16 sm:w-24 ml-auto" /></TableCell>
                          <TableCell className="text-right px-2 sm:px-4"><Skeleton className="h-6 sm:h-8 w-12 sm:w-16 ml-auto" /></TableCell>
                        </TableRow>
                      ))
                    ) : sortedPortfolio.length > 0 ? (
                      sortedPortfolio.map((asset) => (
                        <TableRow key={asset.id} className="border-b border-galaxy-secondary/50">
                          <TableCell className="px-2 sm:px-4">
                            <div className="flex flex-col sm:flex-row sm:items-center">
                              <span className="font-medium text-xs sm:text-sm">{asset.name}</span>
                              <span className="sm:ml-2 text-xs text-muted-foreground">{asset.symbol}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right px-2 sm:px-4 text-xs sm:text-sm">
                            {formatPrice(asset.price)}
                          </TableCell>
                          <TableCell className="text-right px-2 sm:px-4 hidden sm:table-cell">
                            <div className="flex flex-col items-end">
                              <span className="text-xs sm:text-sm">{asset.amount.toFixed(6)}</span>
                              <span className="text-xs text-muted-foreground">
                                Avg: {formatPrice(asset.purchasePrice)}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right px-2 sm:px-4 text-xs sm:text-sm">
                            {formatPrice(asset.value || 0)}
                            <div className="sm:hidden text-xs text-muted-foreground">
                              {asset.amount.toFixed(4)} {asset.symbol}
                            </div>
                          </TableCell>
                          <TableCell className="text-right px-2 sm:px-4 hidden md:table-cell">
                            <div className={`flex flex-col items-end text-xs sm:text-sm ${(asset.pnl || 0) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                              <span>{formatPrice(asset.pnl || 0)}</span>
                              <span className="text-xs">{(asset.pnlPercentage || 0).toFixed(2)}%</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right px-2 sm:px-4">
                            <div className="flex justify-end gap-1 sm:gap-2">
                              <WalletModal 
                                cryptoId={asset.id} 
                                cryptoName={asset.name} 
                                currentPrice={asset.price} 
                                onPurchaseComplete={handleBuyCrypto}
                              />
                              <SellModal
                                cryptoId={asset.id}
                                cryptoName={asset.name}
                                cryptoSymbol={asset.symbol}
                                currentPrice={asset.price}
                                availableAmount={asset.amount}
                                onSellComplete={handleSellCrypto}
                              />
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="p-6 sm:p-8 text-center text-muted-foreground text-sm">
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
        
        <div className="mb-6 sm:mb-8 animate-slide-up" style={{ animationDelay: '300ms' }}>
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h2 className="text-lg sm:text-xl font-bold">Buy Cryptocurrency</h2>
          </div>
          
          <div className="bg-galaxy-card-bg rounded-lg border border-galaxy-secondary p-4 sm:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {isLoading ? (
                [...Array(6)].map((_, i) => (
                  <div key={i} className="p-3 sm:p-4 border border-galaxy-secondary rounded-lg">
                    <Skeleton className="h-4 sm:h-6 w-20 sm:w-24 mb-2" />
                    <Skeleton className="h-6 sm:h-8 w-24 sm:w-32 mb-2" />
                    <Skeleton className="h-8 w-full" />
                  </div>
                ))
              ) : (
                cryptoData?.slice(0, 6).map(crypto => (
                  <div key={crypto.id} className="p-3 sm:p-4 border border-galaxy-secondary rounded-lg">
                    <div className="flex items-center mb-2">
                      <img src={crypto.image} alt={crypto.name} className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
                      <span className="font-medium text-sm sm:text-base">{crypto.name}</span>
                    </div>
                    <p className="text-base sm:text-lg font-bold mb-2 sm:mb-3">{formatPrice(crypto.current_price)}</p>
                    <div className={`text-xs sm:text-sm mb-2 ${crypto.price_change_percentage_24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {crypto.price_change_percentage_24h >= 0 ? '+' : ''}{crypto.price_change_percentage_24h?.toFixed(2)}% (24h)
                    </div>
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
      
      <footer className="py-4 sm:py-6 bg-galaxy-secondary mt-auto">
        <div className="container mx-auto px-3 sm:px-4 text-center text-xs sm:text-sm text-muted-foreground">
          <p>CryptoGalaxyView © {new Date().getFullYear()} | Real-time cryptocurrency market data</p>
          <p className="mt-1">Data provided by CoinGecko API</p>
        </div>
      </footer>
    </div>
  );
};

export default WalletPage;
