
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Wallet, TrendingUp, LogIn, LogOut, UserCircle2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import CurrencyToggle from './CurrencyToggle';
import { useIsMobile } from '@/hooks/use-mobile';

const Header: React.FC = () => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  };

  return (
    <header className="bg-galaxy-secondary py-4 shadow-md">
      <div className="container mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center">
          <Link to="/" className="flex items-center space-x-2">
            <Wallet className="h-6 w-6 text-galaxy-accent" />
            <span className="font-bold text-lg bg-gradient-to-r from-galaxy-accent to-galaxy-positive bg-clip-text text-transparent">
              CryptoGalaxyView
            </span>
          </Link>
        </div>
        
        <div className="flex items-center gap-2">
          <CurrencyToggle />
        </div>

        <nav>
          <ul className="flex items-center space-x-2">
            <li>
              <Button
                variant={location.pathname === "/" ? "default" : "outline"}
                size="sm"
                asChild
              >
                <Link to="/">Market</Link>
              </Button>
            </li>
            <li>
              <Button
                variant={location.pathname === "/trending" ? "default" : "outline"}
                size="sm"
                asChild
              >
                <Link to="/trending">
                  {!isMobile && <TrendingUp className="mr-2 h-4 w-4" />}
                  Trending
                </Link>
              </Button>
            </li>
            {user ? (
              <>
                <li>
                  <Button
                    variant={location.pathname === "/wallet" ? "default" : "outline"}
                    size="sm"
                    asChild
                  >
                    <Link to="/wallet">
                      {!isMobile && <Wallet className="mr-2 h-4 w-4" />}
                      Wallet
                    </Link>
                  </Button>
                </li>
                <li className="ml-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm hidden md:inline-block">
                      {user?.email}
                    </span>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="text-galaxy-accent"
                      onClick={handleLogout}
                    >
                      <LogOut className="h-5 w-5" />
                    </Button>
                  </div>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-galaxy-accent text-galaxy-accent"
                    asChild
                  >
                    <Link to="/login">
                      {!isMobile && <LogIn className="mr-2 h-4 w-4" />}
                      Login
                    </Link>
                  </Button>
                </li>
                <li>
                  <Button
                    variant="default"
                    size="sm"
                    className="bg-galaxy-accent hover:bg-galaxy-accent/90"
                    asChild
                  >
                    <Link to="/signup">
                      {!isMobile && <UserCircle2 className="mr-2 h-4 w-4" />}
                      Sign Up
                    </Link>
                  </Button>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
