
import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  username: string;
  provider?: string;
  photoUrl?: string;
  accessToken?: string;
  refreshToken?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, username: string, password: string) => Promise<boolean>;
  loginWithGoogle: () => Promise<boolean>;
  loginWithGitHub: () => Promise<boolean>;
  logout: () => void;
  refreshSession: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Mock OAuth provider URLs (in a real app, these would be actual OAuth provider endpoints)
const MOCK_OAUTH_PROVIDERS = {
  GOOGLE_AUTH_URL: '/oauth/google',
  GITHUB_AUTH_URL: '/oauth/github',
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for saved user in localStorage on mount
    const savedUser = localStorage.getItem('user');
    const tokenExpiryTime = localStorage.getItem('tokenExpiryTime');
    
    if (savedUser) {
      // Check if token is expired
      if (tokenExpiryTime && new Date().getTime() > parseInt(tokenExpiryTime, 10)) {
        // Token expired, attempt refresh or clear session
        console.log("Session expired, attempting to refresh...");
        refreshSession().catch(() => {
          // If refresh fails, clear the session
          logout();
        });
      } else {
        setUser(JSON.parse(savedUser));
      }
    }
    setIsLoading(false);
  }, []);

  // Secure password hashing simulation (in a real app, this would be done on the server)
  const mockHashPassword = (password: string): string => {
    // This is just a simulation! In a real app, NEVER hash passwords on the client side
    return btoa(`${password}_hashed_${new Date().getTime()}`);
  };

  // Generate mock tokens (in a real app, these would come from your auth server)
  const generateMockTokens = () => {
    return {
      accessToken: `access_${new Date().getTime()}_${Math.random().toString(36).substring(7)}`,
      refreshToken: `refresh_${new Date().getTime()}_${Math.random().toString(36).substring(7)}`,
      expiresIn: 3600 // 1 hour in seconds
    };
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Simulate secure API call with HTTPS
      console.log("Securely transmitting credentials over HTTPS...");
      
      // In a real app, this would be an actual API call to your auth server
      return new Promise((resolve) => {
        setTimeout(() => {
          // Mock login - in real app would validate against backend with proper password hashing
          if (email.includes('@') && password.length >= 6) {
            const hashedPassword = mockHashPassword(password);
            console.log("Password securely hashed:", hashedPassword);
            
            // Generate tokens (simulating OAuth2 flow)
            const tokens = generateMockTokens();
            const expiryTime = new Date().getTime() + (tokens.expiresIn * 1000);
            
            const newUser = {
              id: `user-${Date.now()}`,
              email,
              username: email.split('@')[0],
              provider: 'email',
              accessToken: tokens.accessToken,
              refreshToken: tokens.refreshToken
            };
            
            setUser(newUser);
            localStorage.setItem('user', JSON.stringify(newUser));
            localStorage.setItem('tokenExpiryTime', expiryTime.toString());
            
            setIsLoading(false);
            resolve(true);
          } else {
            console.log("Authentication failed: Invalid credentials");
            setIsLoading(false);
            resolve(false);
          }
        }, 800);
      });
    } catch (error) {
      console.error("Authentication error:", error);
      setIsLoading(false);
      return false;
    }
  };

  const signup = async (email: string, username: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Simulate secure API call
      console.log("Securely creating account...");
      
      return new Promise((resolve) => {
        setTimeout(() => {
          // Mock signup - in real app would create user in backend with proper validation
          if (email.includes('@') && username.length >= 3 && password.length >= 6) {
            const hashedPassword = mockHashPassword(password);
            console.log("Password securely hashed for new account:", hashedPassword);
            
            // Generate tokens (simulating OAuth2 flow)
            const tokens = generateMockTokens();
            const expiryTime = new Date().getTime() + (tokens.expiresIn * 1000);
            
            const newUser = {
              id: `user-${Date.now()}`,
              email,
              username,
              provider: 'email',
              accessToken: tokens.accessToken,
              refreshToken: tokens.refreshToken
            };
            
            setUser(newUser);
            localStorage.setItem('user', JSON.stringify(newUser));
            localStorage.setItem('tokenExpiryTime', expiryTime.toString());
            
            setIsLoading(false);
            resolve(true);
          } else {
            console.log("Account creation failed: Invalid information");
            setIsLoading(false);
            resolve(false);
          }
        }, 800);
      });
    } catch (error) {
      console.error("Account creation error:", error);
      setIsLoading(false);
      return false;
    }
  };

  const loginWithGoogle = async (): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // This would normally open the OAuth popup window
      console.log("Opening OAuth window for Google...");
      console.log("Redirecting to:", MOCK_OAUTH_PROVIDERS.GOOGLE_AUTH_URL);
      
      // Simulate the OAuth flow
      return new Promise((resolve) => {
        setTimeout(() => {
          // Simulate user granting permissions in Google OAuth
          const userEmail = prompt("Enter your Google email to simulate connection:", "yourname@gmail.com");
          
          if (userEmail && userEmail.includes('@')) {
            // Extract username from email for display
            const username = userEmail.split('@')[0];
            
            // Generate tokens (simulating OAuth2 flow)
            const tokens = generateMockTokens();
            const expiryTime = new Date().getTime() + (tokens.expiresIn * 1000);
            
            // Create user object with secure tokens
            const googleUser = {
              id: `google-${Date.now()}`,
              email: userEmail,
              username: username,
              provider: 'google',
              photoUrl: `https://ui-avatars.com/api/?name=${username}&background=random&color=fff`,
              accessToken: tokens.accessToken,
              refreshToken: tokens.refreshToken
            };
            
            setUser(googleUser);
            localStorage.setItem('user', JSON.stringify(googleUser));
            localStorage.setItem('tokenExpiryTime', expiryTime.toString());
            
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

  const loginWithGitHub = async (): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // This would normally open the OAuth popup window
      console.log("Opening OAuth window for GitHub...");
      console.log("Redirecting to:", MOCK_OAUTH_PROVIDERS.GITHUB_AUTH_URL);
      
      // Simulate the OAuth flow
      return new Promise((resolve) => {
        setTimeout(() => {
          // Simulate user granting permissions in GitHub OAuth
          const username = prompt("Enter your GitHub username to simulate connection:", "github-user");
          
          if (username && username.length > 2) {
            // Generate a mock email based on username
            const userEmail = `${username}@github.com`;
            
            // Generate tokens (simulating OAuth2 flow)
            const tokens = generateMockTokens();
            const expiryTime = new Date().getTime() + (tokens.expiresIn * 1000);
            
            // Create user object with secure tokens
            const githubUser = {
              id: `github-${Date.now()}`,
              email: userEmail,
              username: username,
              provider: 'github',
              photoUrl: `https://ui-avatars.com/api/?name=${username}&background=random&color=fff`,
              accessToken: tokens.accessToken,
              refreshToken: tokens.refreshToken
            };
            
            setUser(githubUser);
            localStorage.setItem('user', JSON.stringify(githubUser));
            localStorage.setItem('tokenExpiryTime', expiryTime.toString());
            
            setIsLoading(false);
            resolve(true);
          } else {
            console.log("GitHub authentication canceled or invalid username");
            setIsLoading(false);
            resolve(false);
          }
        }, 1000);
      });
    } catch (error) {
      console.error("GitHub authentication error:", error);
      setIsLoading(false);
      return false;
    }
  };

  const refreshSession = async (): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // In a real app, this would call your token refresh endpoint with the refresh token
      console.log("Attempting to refresh authentication token...");
      
      return new Promise((resolve) => {
        setTimeout(() => {
          const savedUser = localStorage.getItem('user');
          
          if (savedUser) {
            const userObj = JSON.parse(savedUser);
            
            if (userObj.refreshToken) {
              // Generate new tokens (simulating token refresh flow)
              const tokens = generateMockTokens();
              const expiryTime = new Date().getTime() + (tokens.expiresIn * 1000);
              
              // Update user with new tokens
              const refreshedUser = {
                ...userObj,
                accessToken: tokens.accessToken,
                refreshToken: tokens.refreshToken
              };
              
              setUser(refreshedUser);
              localStorage.setItem('user', JSON.stringify(refreshedUser));
              localStorage.setItem('tokenExpiryTime', expiryTime.toString());
              
              console.log("Token successfully refreshed");
              setIsLoading(false);
              resolve(true);
            } else {
              console.log("No refresh token available");
              setIsLoading(false);
              resolve(false);
            }
          } else {
            console.log("No user session to refresh");
            setIsLoading(false);
            resolve(false);
          }
        }, 800);
      });
    } catch (error) {
      console.error("Token refresh error:", error);
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    // Clear user data and tokens
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('tokenExpiryTime');
    console.log("User securely logged out, all tokens invalidated");
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isLoading, 
      login, 
      signup, 
      loginWithGoogle,
      loginWithGitHub,
      logout,
      refreshSession
    }}>
      {children}
    </AuthContext.Provider>
  );
};
