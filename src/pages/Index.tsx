
import React from 'react';
import Header from '@/components/Header';
import GlobalStats from '@/components/GlobalStats';
import CryptoTable from '@/components/CryptoTable';
import TrendingSection from '@/components/TrendingSection';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-galaxy-accent to-galaxy-positive bg-clip-text text-transparent animate-slide-up">
          Cryptocurrency Market
        </h1>
        
        <GlobalStats />
        <TrendingSection />
        
        <div className="mb-6 animate-slide-up">
          <h2 className="text-xl font-bold mb-4">Top Cryptocurrencies</h2>
          <CryptoTable />
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

export default Index;
