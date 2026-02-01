import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { User, AuthState } from '../../models';
import { authService } from '../../services';

interface AuthContextType extends AuthState {
  signIn: (email: string, password: string) => Promise<boolean>;
  signUp: (email: string, password: string, name: string) => Promise<boolean>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_ERROR'; payload: string | null };

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: action.payload !== null,
        isLoading: false,
      };
    case 'SET_ERROR':
      return { ...state, isLoading: false };
    default:
      return state;
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    checkCurrentUser();
  }, []);

  const checkCurrentUser = async () => {
    try {
      const response = await authService.getCurrentUser();
      if (response.success) {
        dispatch({ type: 'SET_USER', payload: response.data });
      } else {
        dispatch({ type: 'SET_USER', payload: null });
      }
    } catch (error) {
      dispatch({ type: 'SET_USER', payload: null });
    }
  };

  const signIn = async (email: string, password: string): Promise<boolean> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const response = await authService.signIn({ email, password });
      if (response.success) {
        dispatch({ type: 'SET_USER', payload: response.data });
        return true;
      } else {
        dispatch({ type: 'SET_ERROR', payload: response.message || 'Sign in failed' });
        return false;
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Network error' });
      return false;
    }
  };

  const signUp = async (email: string, password: string, name: string): Promise<boolean> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const response = await authService.signUp({ email, password, name });
      if (response.success) {
        dispatch({ type: 'SET_USER', payload: response.data });
        return true;
      } else {
        dispatch({ type: 'SET_ERROR', payload: response.message || 'Sign up failed' });
        return false;
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Network error' });
      return false;
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      await authService.signOut();
      dispatch({ type: 'SET_USER', payload: null });
    } catch (error) {
      // Still sign out locally even if API call fails
      dispatch({ type: 'SET_USER', payload: null });
    }
  };

  const value: AuthContextType = {
    ...state,
    signIn,
    signUp,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};