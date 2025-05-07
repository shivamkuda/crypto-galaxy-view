
import React, { useState } from 'react';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Wallet, CreditCard } from 'lucide-react';
import WalletModal from '@/components/WalletModal';
import { useQuery } from '@tanstack/react-query';
import { fetchCryptoList } from '@/utils/api';
import { Skeleton } from '@/components/ui/skeleton';

const mockPortfolio = [
  { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC', amount: 0.0212, price: 0 },
  { id: 'ethereum', name: 'Ethereum', symbol: 'ETH', amount: 0.451, price: 0 }
];

const WalletPage = () => {
  const [walletBalance, setWalletBalance] = useState(1000);
  
  const { data: cryptoData, isLoading } = useQuery({
    queryKey: ['crypto-prices'],
    queryFn: () => fetchCryptoList(1, 10),
    staleTime: 60000, // 1 minute
  });
  
  // Update mock portfolio with current prices
  const portfolio = mockPortfolio.map(item => {
    const crypto = cryptoData?.find(c => c.id === item.id);
    return {
      ...item,
      price: crypto?.current_price || 0,
      value: (crypto?.current_price || 0) * item.amount
    };
  });
  
  const totalPortfolioValue = portfolio.reduce((total, item) => total + (item.value || 0), 0);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-galaxy-accent to-galaxy-positive bg-clip-text text-transparent animate-slide-up">
          Your Crypto Wallet
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="bg-galaxy-card-bg rounded-lg border border-galaxy-secondary p-6 animate-slide-up">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Wallet className="mr-2 h-5 w-5 text-galaxy-accent" />
              Available Balance
            </h2>
            <p className="text-3xl font-bold mb-2">${walletBalance.toFixed(2)}</p>
            <div className="flex gap-2 mt-4">
              <Button className="bg-galaxy-accent text-galaxy-bg hover:bg-galaxy-accent/90">
                <CreditCard className="mr-2 h-4 w-4" />
                Add Funds
              </Button>
            </div>
          </div>
          
          <div className="bg-galaxy-card-bg rounded-lg border border-galaxy-secondary p-6 animate-slide-up" style={{ animationDelay: '100ms' }}>
            <h2 className="text-xl font-semibold mb-4">Portfolio Value</h2>
            <p className="text-3xl font-bold mb-2">${totalPortfolioValue.toFixed(2)}</p>
            <p className="text-sm text-muted-foreground">
              {isLoading ? 'Loading portfolio data...' : `${portfolio.length} assets in your portfolio`}
            </p>
          </div>
        </div>
        
        <div className="mb-8 animate-slide-up" style={{ animationDelay: '200ms' }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Your Assets</h2>
          </div>
          
          <div className="bg-galaxy-card-bg rounded-lg border border-galaxy-secondary">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-galaxy-secondary">
                    <th className="text-left p-4">Asset</th>
                    <th className="text-right p-4">Balance</th>
                    <th className="text-right p-4">Value</th>
                    <th className="text-right p-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    [...Array(2)].map((_, i) => (
                      <tr key={i} className="border-b border-galaxy-secondary/50">
                        <td className="p-4"><Skeleton className="h-6 w-24" /></td>
                        <td className="p-4 text-right"><Skeleton className="h-6 w-16 ml-auto" /></td>
                        <td className="p-4 text-right"><Skeleton className="h-6 w-20 ml-auto" /></td>
                        <td className="p-4 text-right"><Skeleton className="h-8 w-16 ml-auto" /></td>
                      </tr>
                    ))
                  ) : portfolio.map((asset) => (
                    <tr key={asset.id} className="border-b border-galaxy-secondary/50">
                      <td className="p-4">
                        <div className="flex items-center">
                          <span className="font-medium">{asset.name}</span>
                          <span className="ml-2 text-sm text-muted-foreground">{asset.symbol}</span>
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        {asset.amount.toFixed(8)}
                      </td>
                      <td className="p-4 text-right">
                        ${(asset.price * asset.amount).toFixed(2)}
                      </td>
                      <td className="p-4 text-right">
                        <WalletModal 
                          cryptoId={asset.id} 
                          cryptoName={asset.name} 
                          currentPrice={asset.price} 
                        />
                      </td>
                    </tr>
                  ))}
                  
                  {!isLoading && portfolio.length === 0 && (
                    <tr>
                      <td colSpan={4} className="p-8 text-center text-muted-foreground">
                        You don't have any assets yet. Start by buying some crypto.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
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
                    <p className="text-lg font-bold mb-3">${crypto.current_price.toFixed(2)}</p>
                    <WalletModal 
                      cryptoId={crypto.id} 
                      cryptoName={crypto.name} 
                      currentPrice={crypto.current_price} 
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
