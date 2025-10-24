import { useState, useCallback, useEffect } from 'react';
import Swal from 'sweetalert2';
import { AuthState, LoginCredentials, SignupCredentials } from '../types/auth';
import { validateLoginForm, validateSignupForm } from '../utils/validation';

// API base URL
const API_BASE_URL = 'http://localhost:5000/api';

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true, // Start with loading true to check localStorage
    error: null
  });

  // Restore authentication state from localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const userId = localStorage.getItem('userId');
    
    if (token && userId) {
      // Get user from API
      fetch(`${API_BASE_URL}/auth/user/${userId}`)
        .then(response => response.json())
        .then(data => {
          if (data.success && data.user) {
            setAuthState({
              user: data.user,
              isAuthenticated: true,
              isLoading: false,
              error: null
            });
          } else {
            // User not found, clear auth
            localStorage.removeItem('authToken');
            localStorage.removeItem('userId');
            setAuthState(prev => ({ ...prev, isLoading: false }));
          }
        })
        .catch(() => {
          // Error getting user, clear auth
          localStorage.removeItem('authToken');
          localStorage.removeItem('userId');
          setAuthState(prev => ({ ...prev, isLoading: false }));
        });
    } else {
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    const validationErrors = validateLoginForm(credentials);
    if (Object.keys(validationErrors).length > 0) {
      // Show validation errors with SweetAlert
      const errorMessages = Object.values(validationErrors).join('\n');
      await Swal.fire({
        title: 'Validation Error',
        text: errorMessages,
        icon: 'error',
        confirmButtonColor: '#6366f1',
        background: '#ffffff',
        customClass: {
          popup: 'rounded-2xl',
          title: 'text-gray-800',
          htmlContainer: 'text-gray-600'
        }
      });
      setAuthState(prev => ({ ...prev, error: 'Please fix the form errors' }));
      return { success: false, errors: validationErrors };
    }

    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });
      
      const result = await response.json();
      
      if (result.success && result.user) {
        // Store token and user ID in localStorage
        if (result.token) {
          localStorage.setItem('authToken', result.token);
          localStorage.setItem('userId', result.user.id);
        }
        
        // Set authentication state
        setAuthState({
          user: result.user,
          isAuthenticated: true,
          isLoading: false,
          error: null
        });
        
        // Show success message (non-blocking)
        Swal.fire({
          title: 'Welcome Back!',
          text: `Hello ${result.user.name}! You have successfully logged in.`,
          icon: 'success',
          confirmButtonColor: '#6366f1',
          background: '#ffffff',
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false
        });
        
        return { success: true };
      } else {
        setAuthState(prev => ({
          ...prev,
          isLoading: false,
          error: result.error || 'Login failed'
        }));
        
        // Show error message
        await Swal.fire({
          title: 'Login Failed',
          text: result.error || 'Invalid email or password',
          icon: 'error',
          confirmButtonColor: '#6366f1',
          background: '#ffffff',
        });
        
        return { success: false, error: result.error };
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage
      }));
      
      // Show error message
      await Swal.fire({
        title: 'Error',
        text: errorMessage,
        icon: 'error',
        confirmButtonColor: '#6366f1',
        background: '#ffffff',
        customClass: {
          popup: 'rounded-2xl',
          title: 'text-gray-800',
          htmlContainer: 'text-gray-600'
        }
      });
      
      return { success: false, error: errorMessage };
    }
  }, []);

  const signup = useCallback(async (credentials: SignupCredentials) => {
    const validationErrors = validateSignupForm(credentials);
    if (Object.keys(validationErrors).length > 0) {
      // Show validation errors with SweetAlert
      const errorMessages = Object.values(validationErrors).join('\n');
      await Swal.fire({
        title: 'Validation Error',
        text: errorMessages,
        icon: 'error',
        confirmButtonColor: '#6366f1',
        background: '#ffffff',
        customClass: {
          popup: 'rounded-2xl',
          title: 'text-gray-800',
          htmlContainer: 'text-gray-600'
        }
      });
      setAuthState(prev => ({ ...prev, error: 'Please fix the form errors' }));
      return { success: false, errors: validationErrors };
    }

    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });
      
      const result = await response.json();
      
      if (result.success && result.user) {
        // Don't set authentication state for signup
        // Just show success message and let user sign in
        setAuthState(prev => ({
          ...prev,
          isLoading: false,
          error: null
        }));
        
        // Show success message (non-blocking)
        Swal.fire({
          title: 'Account Created!',
          text: `Hello ${result.user.name}! Your account has been created successfully. Please sign in to continue.`,
          icon: 'success',
          confirmButtonColor: '#6366f1',
          background: '#ffffff',
          timer: 2500,
          timerProgressBar: true,
          showConfirmButton: false
        });
        
        return { success: true };
      } else {
        setAuthState(prev => ({
          ...prev,
          isLoading: false,
          error: result.error || 'Signup failed'
        }));
        
        // Show error message
        await Swal.fire({
          title: 'Signup Failed',
          text: result.error || 'Unable to create account',
          icon: 'error',
          confirmButtonColor: '#6366f1',
          background: '#ffffff',
        });
        
        return { success: false, error: result.error };
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage
      }));
      
      // Show error message
      await Swal.fire({
        title: 'Error',
        text: errorMessage,
        icon: 'error',
        confirmButtonColor: '#6366f1',
        background: '#ffffff',
        customClass: {
          popup: 'rounded-2xl',
          title: 'text-gray-800',
          htmlContainer: 'text-gray-600'
        }
      });
      
      return { success: false, error: errorMessage };
    }
  }, []);

  const logout = useCallback(async () => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'You will be logged out of your account.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#6366f1',
      cancelButtonColor: '#ef4444',
      confirmButtonText: 'Yes, logout',
      cancelButtonText: 'Cancel',
      background: '#ffffff'
    });

    if (result.isConfirmed) {
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null
      });
      localStorage.removeItem('authToken');
      localStorage.removeItem('userId');
      
      // Show logout confirmation
      await Swal.fire({
        title: 'Logged Out',
        text: 'You have been successfully logged out.',
        icon: 'success',
        confirmButtonColor: '#6366f1',
        background: '#ffffff'
      });
    }
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
