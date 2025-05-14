
import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  username: string;
  provider?: string;
  photoUrl?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, username: string, password: string) => Promise<boolean>;
  loginWithGoogle: () => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for saved user in localStorage on mount
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call delay
    setIsLoading(true);
    return new Promise((resolve) => {
      setTimeout(() => {
        // Mock login - in real app would validate against backend
        // For demo, just check if email contains "@" and password length
        if (email.includes('@') && password.length >= 6) {
          const newUser = {
            id: `user-${Date.now()}`,
            email,
            username: email.split('@')[0],
            provider: 'email'
          };
          setUser(newUser);
          localStorage.setItem('user', JSON.stringify(newUser));
          setIsLoading(false);
          resolve(true);
        } else {
          setIsLoading(false);
          resolve(false);
        }
      }, 800);
    });
  };

  const signup = async (email: string, username: string, password: string): Promise<boolean> => {
    // Simulate API call delay
    setIsLoading(true);
    return new Promise((resolve) => {
      setTimeout(() => {
        // Mock signup - in real app would create user in backend
        if (email.includes('@') && username.length >= 3 && password.length >= 6) {
          const newUser = {
            id: `user-${Date.now()}`,
            email,
            username,
            provider: 'email'
          };
          setUser(newUser);
          localStorage.setItem('user', JSON.stringify(newUser));
          setIsLoading(false);
          resolve(true);
        } else {
          setIsLoading(false);
          resolve(false);
        }
      }, 800);
    });
  };

  const loginWithGoogle = async (): Promise<boolean> => {
    // Since we can't integrate with the actual Google OAuth API in this mock environment,
    // we'll simulate a more realistic Google login flow
    setIsLoading(true);
    
    try {
      // This would be where we'd trigger the Google OAuth popup
      console.log("Opening Google authentication window...");
      
      // Mock a successful Google authentication response
      // In a real implementation, we would get this data from Google's OAuth response
      return new Promise((resolve) => {
        // Simulating the OAuth popup and waiting for user interaction
        setTimeout(() => {
          // Get user's email input to simulate actual account connection
          const userEmail = prompt("Enter your Google email to simulate connection:", "yourname@gmail.com");
          
          if (userEmail && userEmail.includes('@')) {
            // Extract username from email for display
            const username = userEmail.split('@')[0];
            const googleUserId = `google-${Date.now()}`;
            
            // Create user object with accurate information
            const googleUser = {
              id: googleUserId,
              email: userEmail,
              username: username,
              provider: 'google',
              photoUrl: `https://ui-avatars.com/api/?name=${username}&background=random&color=fff` // Generate avatar based on name
            };
            
            setUser(googleUser);
            localStorage.setItem('user', JSON.stringify(googleUser));
            setIsLoading(false);
            resolve(true);
          } else {
            console.log("Google authentication canceled or invalid email");
            setIsLoading(false);
            resolve(false);
          }
        }, 1000);
      });
    } catch (error) {
      console.error("Google authentication error:", error);
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
