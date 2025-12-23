import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authApi, SwudbUser } from '../api/auth';

const STORAGE_KEY_CREDENTIALS = '@swudb/remembered_credentials';

interface StoredCredentials {
  username: string;
  password: string;
}

interface AuthContextType {
  user: SwudbUser | null;
  isLoading: boolean;
  isLoggedIn: boolean;
  login: (username: string, password: string, rememberMe: boolean) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  getStoredCredentials: () => Promise<StoredCredentials | null>;
  clearStoredCredentials: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SwudbUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    checkExistingSession();
  }, []);

  const checkExistingSession = async () => {
    try {
      // Try to get current user (session might still be valid)
      const currentUser = await authApi.getUser();
      if (currentUser) {
        setUser(currentUser);
      }
    } catch (error) {
      // No valid session
    } finally {
      setIsLoading(false);
    }
  };

  const login = useCallback(async (username: string, password: string, rememberMe: boolean) => {
    setIsLoading(true);
    try {
      const result = await authApi.login(username, password);
      
      if (result.success && result.user) {
        setUser(result.user);
        
        // Store credentials if "Remember me" is checked
        if (rememberMe) {
          await AsyncStorage.setItem(
            STORAGE_KEY_CREDENTIALS,
            JSON.stringify({ username, password })
          );
        } else {
          // Clear any previously stored credentials
          await AsyncStorage.removeItem(STORAGE_KEY_CREDENTIALS);
        }
        
        return { success: true };
      }
      
      return { success: false, error: result.error };
    } catch (error) {
      return { success: false, error: 'An unexpected error occurred' };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await authApi.logout();
      setUser(null);
      // Note: We don't clear stored credentials on logout
      // User can manually clear them or uncheck "Remember me" next time
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getStoredCredentials = useCallback(async (): Promise<StoredCredentials | null> => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY_CREDENTIALS);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      // Error reading storage
    }
    return null;
  }, []);

  const clearStoredCredentials = useCallback(async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY_CREDENTIALS);
    } catch (error) {
      // Error clearing storage
    }
  }, []);

  const value: AuthContextType = {
    user,
    isLoading,
    isLoggedIn: !!user,
    login,
    logout,
    getStoredCredentials,
    clearStoredCredentials,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}







