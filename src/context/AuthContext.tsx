// src/context/AuthContext.tsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../../types/user';
import { api } from '../lib/api';

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  login: (username: string, email: string, password: string) => Promise<{ error?: string }>;
  signUp: (username: string, email: string, password: string) => Promise<{ error?: string }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  isAuthenticated: () => boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on app start
  useEffect(() => {
    const loadUser = async () => {
      try {
        const sessionToken = await AsyncStorage.getItem('sessionToken');
        if (sessionToken) {
          try {
            // Validate the token and get user data
            const userData = await api.get('/api/auth/mobile/validate-session');
            setUser(userData.data.user);
          } catch (error) {
            console.error('Session validation failed:', error);
            await AsyncStorage.removeItem('sessionToken');
          }
        }
      } catch (error) {
        console.error('Failed to restore session:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (username: string, email: string, password: string) => {
    try {
      const response = await api.post('/api/auth/mobile/login', { 
        username, 
        email, 
        password 
      });
      
      if (response.data.error) {
        return { error: response.data.error };
      }
      
      await AsyncStorage.setItem('sessionToken', response.data.sessionToken);
      setUser(response.data.user);
      return {};
    } catch (error: any) {
      console.error('Login error:', error);
      const errorMessage = error.response?.data?.error || 'Something went wrong. Please try again.';
      return { error: errorMessage };
    }
  };

  const signUp = async (username: string, email: string, password: string) => {
    try {
      const response = await api.post('/api/auth/mobile/signup', { 
        username, 
        email, 
        password 
      });
      
      if (response.data.error) {
        return { error: response.data.error };
      }
      
      await AsyncStorage.setItem('sessionToken', response.data.sessionToken);
      setUser(response.data.user);
      return {};
    } catch (error: any) {
      console.error('Signup error:', error);
      const errorMessage = error.response?.data?.error || 'Something went wrong. Please try again.';
      return { error: errorMessage };
    }
  };

  const logout = async () => {
    try {
      await api.post('/api/auth/mobile/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      await AsyncStorage.removeItem('sessionToken');
      setUser(null);
    }
  };

  const refreshUser = async () => {
    try {
      const userData = await api.get('/api/auth/mobile/me');
      setUser(userData.data.user);
    } catch (error) {
      console.error('Failed to refresh user:', error);
    }
  };

  const isAuthenticated = () => {
    return !!user;
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isLoading, 
      login, 
      signUp, 
      logout, 
      refreshUser,
      isAuthenticated 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};