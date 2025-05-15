
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Wallet, UserPlus, ArrowLeft, Github, Shield } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

const signupSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  username: z.string().min(3, { message: "Username must be at least 3 characters" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
    .regex(/[0-9]/, { message: "Password must contain at least one number" }),
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});

type SignupFormValues = z.infer<typeof signupSchema>;

const Signup: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isGitHubLoading, setIsGitHubLoading] = useState(false);
  const { signup, loginWithGoogle, loginWithGitHub } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      username: "",
      password: "",
      confirmPassword: ""
    }
  });

  const handleSubmit = async (values: SignupFormValues) => {
    setIsSubmitting(true);

    try {
      const success = await signup(values.email, values.username, values.password);
      
      if (success) {
        toast({
          title: "Account created",
          description: "Welcome to CryptoGalaxyView!",
          variant: "default",
        });
        navigate('/');
      } else {
        toast({
          title: "Signup failed",
          description: "Please check your information and try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "An error occurred",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleGoogleSignup = async () => {
    setIsGoogleLoading(true);
    
    try {
      const success = await loginWithGoogle();
      
      if (success) {
        toast({
          title: "Google signup successful",
          description: "Welcome to CryptoGalaxyView!",
          variant: "default",
        });
        navigate('/');
      } else {
        toast({
          title: "Google signup failed",
          description: "Could not authenticate with Google. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "An error occurred",
        description: "Could not complete Google authentication. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleGitHubSignup = async () => {
    setIsGitHubLoading(true);
    
    try {
      const success = await loginWithGitHub();
      
      if (success) {
        toast({
          title: "GitHub signup successful",
          description: "Welcome to CryptoGalaxyView!",
          variant: "default",
        });
        navigate('/');
      } else {
        toast({
          title: "GitHub signup failed",
          description: "Could not authenticate with GitHub. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "An error occurred",
        description: "Could not complete GitHub authentication. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsGitHubLoading(false);
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-galaxy-bg p-4">
      <div className="w-full max-w-md mb-4">
        <Button 
          variant="ghost" 
          onClick={handleGoBack}
          className="flex items-center text-galaxy-accent hover:text-galaxy-accent/90"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
      </div>
      
      <Link to="/" className="flex items-center mb-6 md:mb-8 space-x-2">
        <Wallet className="w-6 h-6 md:w-8 md:h-8 text-galaxy-accent" />
        <span className="text-lg md:text-xl font-bold bg-gradient-to-r from-galaxy-accent to-galaxy-positive bg-clip-text text-transparent">
          CryptoGalaxyView
        </span>
      </Link>

      <Card className="w-full max-w-md bg-galaxy-card-bg border-galaxy-secondary">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Sign Up</CardTitle>
          <CardDescription className="text-center">
            Create your account to access all features
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert className="bg-galaxy-accent/10 border-galaxy-accent/20">
            <Shield className="h-4 w-4 text-galaxy-accent" />
            <AlertDescription className="text-xs text-galaxy-accent">
              We use industry-standard security protocols to protect your account
            </AlertDescription>
          </Alert>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="name@example.com"
                        {...field}
                        className="bg-galaxy-bg border-galaxy-secondary"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="johndoe"
                        {...field}
                        className="bg-galaxy-bg border-galaxy-secondary"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        {...field}
                        className="bg-galaxy-bg border-galaxy-secondary"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        {...field}
                        className="bg-galaxy-bg border-galaxy-secondary"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button
                type="submit"
                className="w-full bg-galaxy-accent hover:bg-galaxy-accent/90 text-galaxy-bg"
                disabled={isSubmitting}
              >
                <UserPlus className="mr-2 h-4 w-4" />
                {isSubmitting ? 'Creating account...' : 'Create account'}
              </Button>
            </form>
          </Form>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-galaxy-card-bg px-2 text-xs text-muted-foreground">
                OR CONTINUE WITH
              </span>
            </div>
          </div>
          
          <div className="flex flex-col space-y-2">
            <Button 
              type="button" 
              variant="outline" 
              className="w-full border-galaxy-secondary" 
              onClick={handleGoogleSignup}
              disabled={isGoogleLoading}
            >
              <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
                <path d="M1 1h22v22H1z" fill="none" />
              </svg>
              {isGoogleLoading ? "Connecting..." : "Continue with Google"}
            </Button>
            
            <Button 
              type="button" 
              variant="outline" 
              className="w-full border-galaxy-secondary" 
              onClick={handleGitHubSignup}
              disabled={isGitHubLoading}
            >
              <Github className="mr-2 h-4 w-4" />
              {isGitHubLoading ? "Connecting..." : "Continue with GitHub"}
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link to="/login" className="text-galaxy-accent hover:underline">
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Signup;
