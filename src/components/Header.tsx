
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Wallet, TrendingUp, LogIn, LogOut, User, Menu, ChartLine } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import CurrencyToggle from './CurrencyToggle';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    navigate('/');
  };

  const NavLinks = () => (
    <ul className="flex items-center space-x-1">
      <li>
        <Button
          variant={location.pathname === "/" ? "default" : "ghost"}
          size="sm"
          className={location.pathname === "/" ? "bg-transparent border-b-2 border-galaxy-primary text-white rounded-none" : "text-gray-300 hover:text-white"}
          asChild
        >
          <Link to="/">Market</Link>
        </Button>
      </li>
      <li>
        <Button
          variant={location.pathname === "/trending" ? "default" : "ghost"}
          size="sm"
          className={location.pathname === "/trending" ? "bg-transparent border-b-2 border-galaxy-primary text-white rounded-none" : "text-gray-300 hover:text-white"}
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
              variant={location.pathname === "/wallet" ? "default" : "ghost"}
              size="sm"
              className={location.pathname === "/wallet" ? "bg-transparent border-b-2 border-galaxy-primary text-white rounded-none" : "text-gray-300 hover:text-white"}
              asChild
            >
              <Link to="/wallet">
                {!isMobile && <Wallet className="mr-2 h-4 w-4" />}
                Wallet
              </Link>
            </Button>
          </li>
          <li className="ml-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8 border-2 border-galaxy-primary">
                    <AvatarFallback className="bg-galaxy-secondary text-white">
                      {user.username?.charAt(0).toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-galaxy-card-bg border border-galaxy-secondary/30" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.username}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-galaxy-secondary/30" />
                <DropdownMenuItem onClick={handleLogout} className="text-galaxy-negative cursor-pointer hover:bg-galaxy-secondary/30">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </li>
        </>
      ) : (
        <>
          <li>
            <Button
              variant="outline"
              size="sm"
              className="border-galaxy-primary/70 text-galaxy-primary hover:bg-galaxy-primary/10"
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
              className="bg-galaxy-primary text-black hover:bg-galaxy-primary/90"
              asChild
            >
              <Link to="/signup">
                {!isMobile && <User className="mr-2 h-4 w-4" />}
                Sign Up
              </Link>
            </Button>
          </li>
        </>
      )}
    </ul>
  );

  return (
    <header className="bg-galaxy-bg border-b border-galaxy-secondary/30 py-3 sticky top-0 z-20">
      <div className="container mx-auto px-4">
        <div className="flex flex-row items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <ChartLine className="h-6 w-6 text-galaxy-primary" />
              <span className="font-bold text-lg text-white">
                <span className="text-galaxy-primary">Crypto</span>Exchange
              </span>
            </Link>
          </div>
          
          <div className="flex items-center gap-4">
            <CurrencyToggle />
            
            {/* Desktop Navigation */}
            <nav className="hidden md:block">
              <NavLinks />
            </nav>
            
            {/* Mobile Navigation */}
            <div className="md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-white">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="bg-galaxy-card-bg border-galaxy-secondary/30">
                  <div className="flex flex-col h-full">
                    <div className="flex-1 py-8">
                      <div className="flex flex-col space-y-4">
                        <NavLinks />
                      </div>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
