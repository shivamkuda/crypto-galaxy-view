
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Wallet, ChartBar, TrendingUp } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Header: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  return (
    <header className="sticky top-0 z-50 w-full bg-galaxy-secondary/95 backdrop-blur supports-[backdrop-filter]:bg-galaxy-secondary/80 border-b border-galaxy-secondary">
      <div className="container flex items-center justify-between h-16 px-4 mx-auto">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center space-x-2">
            <Wallet className="w-8 h-8 text-galaxy-accent" />
            <span className="text-xl font-bold bg-gradient-to-r from-galaxy-accent to-galaxy-positive bg-clip-text text-transparent">
              CryptoGalaxyView
            </span>
          </Link>
        </div>
        
        <div className="hidden md:flex items-center space-x-6">
          <Link 
            to="/" 
            className="text-sm font-medium transition-colors hover:text-galaxy-accent"
          >
            Dashboard
          </Link>
          <Link 
            to="/trending" 
            className="text-sm font-medium transition-colors hover:text-galaxy-accent"
          >
            Trending
          </Link>
          <Link 
            to="/markets" 
            className="text-sm font-medium transition-colors hover:text-galaxy-accent"
          >
            Markets
          </Link>
          <Link 
            to="/wallet" 
            className="text-sm font-medium transition-colors hover:text-galaxy-accent"
          >
            Wallet
          </Link>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="relative w-full max-w-[200px] lg:max-w-[300px]">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="w-full pl-8 bg-galaxy-card-bg border-galaxy-primary"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Link to="/wallet">
            <Button 
              variant="outline" 
              size="sm" 
              className="hidden sm:flex border-galaxy-accent text-galaxy-accent hover:bg-galaxy-accent hover:text-galaxy-bg"
            >
              <Wallet className="mr-2 h-4 w-4" />
              Wallet
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
