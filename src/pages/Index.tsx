
import React from 'react';
import Header from '@/components/Header';
import GlobalStats from '@/components/GlobalStats';
import CryptoTable from '@/components/CryptoTable';
import TrendingSection from '@/components/TrendingSection';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-galaxy-bg">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-4">
        <h1 className="text-xl md:text-2xl font-bold mb-4 text-white">
          Cryptocurrency Market
        </h1>
        
        <GlobalStats />
        
        <div className="my-6">
          <TrendingSection />
        </div>
        
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg md:text-xl font-bold text-white">Top Cryptocurrencies</h2>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">24h</span>
            </div>
          </div>
          <div className="bg-galaxy-card-bg rounded-md border border-galaxy-secondary/30 overflow-hidden">
            <div className="overflow-x-auto">
              <CryptoTable />
            </div>
          </div>
        </div>
      </main>
      <footer className="py-4 border-t border-galaxy-secondary/30">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>CryptoExchange © {new Date().getFullYear()} | Real-time cryptocurrency market data</p>
          <p className="mt-1">Data provided by CoinGecko API</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
