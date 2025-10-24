import { useState, useCallback } from 'react';
import { User, AuthState, LoginCredentials, SignupCredentials, AuthResponse } from '../types/auth';
import { validateLoginForm, validateSignupForm } from '../utils/validation';

// Mock authentication service - replace with real API calls
const mockAuthService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock validation - in real app, this would be server-side
    if (credentials.email === 'demo@example.com' && credentials.password === 'password123') {
      const user: User = {
        id: '1',
        name: 'Demo User',
        email: credentials.email,
        createdAt: new Date()
      };
      
      return {
        success: true,
        user,
        token: 'mock-jwt-token'
      };
    }
    
    return {
      success: false,
      error: 'Invalid email or password'
    };
  },
  
  async signup(credentials: SignupCredentials): Promise<AuthResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock validation - in real app, this would be server-side
    if (credentials.email === 'demo@example.com') {
      return {
        success: false,
        error: 'Email already exists'
      };
    }
    
    const user: User = {
      id: Date.now().toString(),
      name: credentials.name,
      email: credentials.email,
      createdAt: new Date()
    };
    
    return {
      success: true,
      user,
      token: 'mock-jwt-token'
    };
  }
};

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null
  });

  const login = useCallback(async (credentials: LoginCredentials) => {
    const validationErrors = validateLoginForm(credentials);
    if (Object.keys(validationErrors).length > 0) {
      setAuthState(prev => ({ ...prev, error: 'Please fix the form errors' }));
      return { success: false, errors: validationErrors };
    }

    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const response = await mockAuthService.login(credentials);
      
      if (response.success && response.user) {
        setAuthState({
          user: response.user,
          isAuthenticated: true,
          isLoading: false,
          error: null
        });
        
        // Store token in localStorage
        if (response.token) {
          localStorage.setItem('authToken', response.token);
        }
        
        return { success: true };
      } else {
        setAuthState(prev => ({
          ...prev,
          isLoading: false,
          error: response.error || 'Login failed'
        }));
        return { success: false, error: response.error };
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage
      }));
      return { success: false, error: errorMessage };
    }
  }, []);

  const signup = useCallback(async (credentials: SignupCredentials) => {
    const validationErrors = validateSignupForm(credentials);
    if (Object.keys(validationErrors).length > 0) {
      setAuthState(prev => ({ ...prev, error: 'Please fix the form errors' }));
      return { success: false, errors: validationErrors };
    }

    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const response = await mockAuthService.signup(credentials);
      
      if (response.success && response.user) {
        setAuthState({
          user: response.user,
          isAuthenticated: true,
          isLoading: false,
          error: null
        });
        
        // Store token in localStorage
        if (response.token) {
          localStorage.setItem('authToken', response.token);
        }
        
        return { success: true };
      } else {
        setAuthState(prev => ({
          ...prev,
          isLoading: false,
          error: response.error || 'Signup failed'
        }));
        return { success: false, error: response.error };
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage
      }));
      return { success: false, error: errorMessage };
    }
  }, []);

  const logout = useCallback(() => {
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null
    });
    localStorage.removeItem('authToken');
  }, []);

  const clearError = useCallback(() => {
    setAuthState(prev => ({ ...prev, error: null }));
  }, []);

  return {
    ...authState,
    login,
    signup,
    logout,
    clearError
  };
};
