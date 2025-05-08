
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Wallet, TrendingUp, LogIn, UserPlus, LogOut, User } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from '@/contexts/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from '@/hooks/use-toast';

const Header: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out",
      description: "You have been logged out successfully.",
    });
    navigate('/');
  };

  const getUserInitials = () => {
    if (!user) return "?";
    if (user.username) {
      return user.username.substring(0, 2).toUpperCase();
    }
    return user.email.substring(0, 2).toUpperCase();
  };
  
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

          {user ? (
            <div className="flex items-center gap-2">
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

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Avatar className="h-8 w-8 bg-galaxy-accent text-galaxy-bg">
                      <AvatarFallback>{getUserInitials()}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-galaxy-card-bg border-galaxy-secondary">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer" onClick={() => navigate('/profile')}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer" onClick={() => navigate('/wallet')}>
                    <Wallet className="mr-2 h-4 w-4" />
                    <span>Wallet</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer text-red-500 focus:text-red-500" onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="border-galaxy-accent text-galaxy-accent hover:bg-galaxy-accent hover:text-galaxy-bg"
                >
                  <LogIn className="mr-2 h-4 w-4" />
                  Login
                </Button>
              </Link>

              <Link to="/signup" className="hidden sm:block">
                <Button 
                  size="sm" 
                  className="bg-galaxy-accent text-galaxy-bg hover:bg-galaxy-accent/90"
                >
                  <UserPlus className="mr-2 h-4 w-4" />
                  Sign Up
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
