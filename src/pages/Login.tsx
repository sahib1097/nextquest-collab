
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Lock, LogIn } from "lucide-react";
import { toast } from "sonner";
import { isAuthenticated, updateLastActivity } from "@/utils/authUtils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { API } from '@/config';

const Login = () => {
  // Login state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  
  // Signup state
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupConfirm, setSignupConfirm] = useState("");
  const [signupName, setSignupName] = useState("");
  const [isSignupLoading, setIsSignupLoading] = useState(false);
  
  // General state
  const [checkingAuth, setCheckingAuth] = useState(true);
  const navigate = useNavigate();

  // Check for existing valid authentication on component mount
  useEffect(() => {
    if (isAuthenticated()) {
      // If already authenticated, update activity timestamp and redirect
      updateLastActivity();
      navigate("/admin/dashboard");
    }
    setCheckingAuth(false);
  }, [navigate]);


  useEffect(() => {
    fetch(`${API}/api/auth/me`, {
      credentials: 'include'
    })
      .then(res => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(user => {
        updateLastActivity();       // you can still bump a timestamp in your utils
        navigate('/admin/dashboard');
      })
      .catch(() => {
        setCheckingAuth(false);
      });
  }, [navigate]);

  // const handleLogin = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setIsLoginLoading(true);
    
  //   // Mock login with test user credentials
  //   setTimeout(() => {
  //     setIsLoginLoading(false);
  //     if (loginEmail && loginPassword) {
  //       // For demo purposes, check for test user or allow any credentials
  //       if ((loginEmail === "test@test.com" && loginPassword === "test") || true) {
  //         toast.success("Login successful");
          
  //         // Store user info in local storage to maintain session
  //         localStorage.setItem("fluxUser", JSON.stringify({
  //           email: loginEmail,
  //           isAuthenticated: true,
  //           name: loginEmail === "test@test.com" ? "Test User" : "Demo User",
  //           lastLogin: new Date().toISOString(),
  //         }));

  //         // Only set up default user level if it doesn't already exist
  //         const userLevel = localStorage.getItem("fluxUserLevel");
  //         if (!userLevel) {
  //           const defaultUserLevel = {
  //             userId: "current-user",
  //             username: loginEmail === "test@test.com" ? "Test User" : "Demo User",
  //             xp: 0,
  //             level: 1,
  //             nextLevelXp: 100,
  //           };
  //           localStorage.setItem("fluxUserLevel", JSON.stringify(defaultUserLevel));
  //         }
          
  //         // Update last activity timestamp for session tracking
  //         updateLastActivity();
          
  //         navigate("/admin/dashboard");
  //       } else {
  //         toast.error("Invalid credentials");
  //       }
  //     } else {
  //       toast.error("Please enter both email and password");
  //     }
  //   }, 800);
  // };
  
  // const handleSignup = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setIsSignupLoading(true);
    
  //   // Validate form
  //   if (!signupEmail || !signupPassword || !signupConfirm || !signupName) {
  //     toast.error("Please fill out all fields");
  //     setIsSignupLoading(false);
  //     return;
  //   }
    
  //   if (signupPassword !== signupConfirm) {
  //     toast.error("Passwords don't match");
  //     setIsSignupLoading(false);
  //     return;
  //   }
    
  //   // Mock signup
  //   setTimeout(() => {
  //     setIsSignupLoading(false);
  //     toast.success("Account created successfully");
      
  //     // Store user in local storage (for demo)
  //     localStorage.setItem("fluxUser", JSON.stringify({
  //       email: signupEmail,
  //       name: signupName,
  //       isAuthenticated: true,
  //       lastLogin: new Date().toISOString(),
  //     }));
      
  //     // Only set up default user level if it doesn't already exist
  //     const userLevel = localStorage.getItem("fluxUserLevel");
  //     if (!userLevel) {
  //       const defaultUserLevel = {
  //         userId: "current-user",
  //         username: signupName,
  //         xp: 0,
  //         level: 1,
  //         nextLevelXp: 100,
  //       };
  //       localStorage.setItem("fluxUserLevel", JSON.stringify(defaultUserLevel));
  //     }
      
  //     // Update last activity timestamp
  //     updateLastActivity();
      
  //     navigate("/admin/dashboard");
  //   }, 1000);
  // };


  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoginLoading(true);
  
    try {
      const res = await fetch(`${API}/api/auth/login`, {
        method:      'POST',
        headers:     { 'Content-Type': 'application/json' },
        credentials: 'include',
        body:        JSON.stringify({ email: loginEmail, password: loginPassword }),
      });
  
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Login failed');
      }
  
      // 1) Extract user from backend
      const user = await res.json(); // { name, email }
  
      // 2) Persist fluxUser in localStorage (template logic)
      localStorage.setItem(
        'fluxUser',
        JSON.stringify({
          email:           user.email,
          isAuthenticated: true,
          name:            user.name,
          lastLogin:       new Date().toISOString(),
        })
      );
  
      // 3) Ensure fluxUserLevel exists
      if (!localStorage.getItem('fluxUserLevel')) {
        localStorage.setItem(
          'fluxUserLevel',
          JSON.stringify({
            userId:      'current-user',
            username:    user.name,
            xp:          0,
            level:       1,
            nextLevelXp: 100,
          })
        );
      }
  
      // 4) Bump your activity timestamp
      updateLastActivity();
  
      toast.success(`Welcome back, ${user.name}!`);
      navigate('/admin/dashboard');
  
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsLoginLoading(false);
    }
  };
  
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSignupLoading(true);
  
    // template validation logic
    if (!signupName || !signupEmail || !signupPassword || !signupConfirm) {
      toast.error('Please fill out all fields');
      setIsSignupLoading(false);
      return;
    }
    if (signupPassword !== signupConfirm) {
      toast.error("Passwords don't match");
      setIsSignupLoading(false);
      return;
    }
  
    try {
      const res = await fetch(`${API}/api/auth/signup`, {
        method:      'POST',
        headers:     { 'Content-Type': 'application/json' },
        credentials: 'include',
        body:        JSON.stringify({
          name:     signupName,
          email:    signupEmail,
          password: signupPassword,
        }),
      });
  
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Signup failed');
      }
  
      // 1) Get newly created user
      const user = await res.json(); // { name, email }
  
      // 2) Persist fluxUser in localStorage
      localStorage.setItem(
        'fluxUser',
        JSON.stringify({
          email:           user.email,
          isAuthenticated: true,
          name:            user.name,
          lastLogin:       new Date().toISOString(),
        })
      );
  
      // 3) Ensure fluxUserLevel exists
      if (!localStorage.getItem('fluxUserLevel')) {
        localStorage.setItem(
          'fluxUserLevel',
          JSON.stringify({
            userId:      'current-user',
            username:    user.name,
            xp:          0,
            level:       1,
            nextLevelXp: 100,
          })
        );
      }
  
      // 4) Bump activity
      updateLastActivity();
  
      toast.success(`Account created: ${user.name}`);
      navigate('/admin/dashboard');
  
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsSignupLoading(false);
    }
  };






  
  const handleGoogleAuth = () => {
    // Store demo user info when using Google login
    localStorage.setItem("fluxUser", JSON.stringify({
      email: "google@example.com",
      isAuthenticated: true,
      name: "Google User",
    }));
    
    // Only set up default user level if it doesn't already exist
    const userLevel = localStorage.getItem("fluxUserLevel");
    if (!userLevel) {
      const defaultUserLevel = {
        userId: "current-user",
        username: "Google User",
        xp: 0,
        level: 1,
        nextLevelXp: 100,
      };
      localStorage.setItem("fluxUserLevel", JSON.stringify(defaultUserLevel));
    }
    
    // Update last activity timestamp
    updateLastActivity();
    
    toast.success("Google sign-in successful");
    navigate("/admin/dashboard");
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-blue-900">
        <div className="text-white">Checking authentication...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-blue-900 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <img 
              src="/lovable-uploads/f44da06d-430c-4883-a4c2-fc7c23f90541.png" 
              alt="Next Quest Logo" 
              className="mx-auto h-12 w-auto"
            />
          </Link>
          <p className="text-gray-300 mt-2">Begin your quest</p>
        </div>
        
        <Card className="shadow-lg border-0 bg-gray-900/70 backdrop-blur-sm border-gray-800">
          <CardHeader>
            <CardTitle className="text-2xl text-white">Welcome</CardTitle>
            <CardDescription className="text-gray-300">
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
              
              {/* Login Tab */}
              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-gray-200">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        className="pl-10 bg-gray-800 border-gray-700 text-white"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        disabled={isLoginLoading}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password" className="text-gray-200">Password</Label>
                      <Link to="/forgot-password" className="text-sm text-blue-400 hover:underline">
                        Forgot password?
                      </Link>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        className="pl-10 bg-gray-800 border-gray-700 text-white"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        disabled={isLoginLoading}
                      />
                    </div>
                  </div>
                  
                  <div className="pt-2">
                    <Button 
                      type="submit" 
                      className="w-full bg-blue-600 hover:bg-blue-700"
                      disabled={isLoginLoading}
                    >
                      {isLoginLoading ? (
                        <span className="flex items-center">
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Signing in...
                        </span>
                      ) : (
                        <span className="flex items-center">
                          <LogIn className="mr-2 h-4 w-4" />
                          Sign in
                        </span>
                      )}
                    </Button>
                  </div>
                  
                  <div className="relative my-4">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-gray-700"></span>
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-gray-900 px-2 text-gray-400">Or continue with</span>
                    </div>
                  </div>
                  
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="w-full border-gray-700 text-gray-300 hover:bg-gray-800"
                    onClick={handleGoogleAuth}
                    disabled={isLoginLoading}
                  >
                    <svg viewBox="0 0 24 24" className="mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    </svg>
                    Google
                  </Button>
                </form>
              </TabsContent>
              
              {/* Signup Tab */}
              <TabsContent value="signup">
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name" className="text-gray-200">Full Name</Label>
                    <Input
                      id="signup-name"
                      type="text"
                      placeholder="Your Name"
                      className="bg-gray-800 border-gray-700 text-white"
                      value={signupName}
                      onChange={(e) => setSignupName(e.target.value)}
                      disabled={isSignupLoading}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="signup-email" className="text-gray-200">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="you@example.com"
                      className="bg-gray-800 border-gray-700 text-white"
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      disabled={isSignupLoading}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="signup-password" className="text-gray-200">Password</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="••••••••"
                      className="bg-gray-800 border-gray-700 text-white"
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      disabled={isSignupLoading}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="signup-confirm" className="text-gray-200">Confirm Password</Label>
                    <Input
                      id="signup-confirm"
                      type="password"
                      placeholder="••••••••"
                      className="bg-gray-800 border-gray-700 text-white"
                      value={signupConfirm}
                      onChange={(e) => setSignupConfirm(e.target.value)}
                      disabled={isSignupLoading}
                    />
                  </div>
                  
                  <div className="pt-2">
                    <Button 
                      type="submit" 
                      className="w-full bg-blue-600 hover:bg-blue-700"
                      disabled={isSignupLoading}
                    >
                      {isSignupLoading ? (
                        <span className="flex items-center">
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Creating account...
                        </span>
                      ) : (
                        <span>Create Account</span>
                      )}
                    </Button>
                  </div>
                  
                  <div className="relative my-4">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-gray-700"></span>
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-gray-900 px-2 text-gray-400">Or continue with</span>
                    </div>
                  </div>
                  
                  {/* <Button 
                    type="button" 
                    variant="outline" 
                    className="w-full border-gray-700 text-gray-300 hover:bg-gray-800"
                    onClick={handleGoogleAuth}
                    disabled={isSignupLoading}
                  >
                    <svg viewBox="0 0 24 24" className="mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    </svg>
                    Google
                  </Button> */}
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
          
          <CardFooter className="flex justify-center">
            <p className="text-sm text-gray-400">
              By using Next Quest, you agree to our{" "}
              <Link to="/terms" className="text-blue-400 hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link to="/privacy" className="text-blue-400 hover:underline">
                Privacy Policy
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Login;
