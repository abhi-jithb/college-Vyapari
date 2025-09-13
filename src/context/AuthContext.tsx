import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User } from '../types';
import { AuthService } from '../services/authService';
import { UserService } from '../services/userService';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (userData: Omit<User, 'id'> & { password: string }) => Promise<boolean>;
  signInWithGoogle: () => Promise<{ success: boolean; needsCollegeInfo: boolean }>;
  completeGoogleSignIn: (college: string, department?: string, year?: string) => Promise<boolean>;
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

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen to authentication state changes
    const unsubscribe = AuthService.onAuthStateChanged((user) => {
      console.log('AuthContext: Auth state changed:', user);
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Listen to real-time user profile updates
  useEffect(() => {
    if (user?.id) {
      console.log('AuthContext: Setting up real-time user profile listener for:', user.id);
      const unsubscribe = UserService.subscribeToUserProfile(user.id, (updatedUser) => {
        if (updatedUser) {
          console.log('AuthContext: Real-time user profile update received:', updatedUser);
          setUser(updatedUser);
        }
      });

      return () => {
        console.log('AuthContext: Unsubscribing from user profile updates');
        unsubscribe();
      };
    }
  }, [user?.id]);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      await AuthService.signIn(email, password);
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const signup = async (userData: Omit<User, 'id'> & { password: string }): Promise<boolean> => {
    try {
      await AuthService.signUp(userData.email, userData.password, userData);
      return true;
    } catch (error) {
      console.error('Signup error:', error);
      return false;
    }
  };

  const signInWithGoogle = async (): Promise<{ success: boolean; needsCollegeInfo: boolean }> => {
    try {
      console.log('AuthContext: Starting Google sign-in...');
      const result = await AuthService.signInWithGoogle();
      console.log('AuthContext: Google sign-in result:', result);
      
      if (result.user) {
        console.log('AuthContext: Setting user in context:', result.user);
        setUser(result.user);
        return { success: true, needsCollegeInfo: false };
      } else {
        console.log('AuthContext: User needs college info');
        return { success: true, needsCollegeInfo: true };
      }
    } catch (error) {
      console.error('AuthContext: Google sign-in error:', error);
      return { success: false, needsCollegeInfo: false };
    }
  };

  const completeGoogleSignIn = async (college: string, department?: string, year?: string): Promise<boolean> => {
    try {
      const user = await AuthService.completeGoogleSignIn(college, department, year);
      setUser(user);
      return true;
    } catch (error) {
      console.error('Error completing Google sign-in:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      await AuthService.signOut();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, login, signup, signInWithGoogle, completeGoogleSignIn, logout }}>
      {children}
    </AuthContext.Provider>
  );
};