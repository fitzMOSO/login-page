import { FormErrors, LoginCredentials, SignupCredentials } from '../types/auth';

export const validateEmail = (email: string): string | null => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email.trim()) {
    return 'Email is required';
  }
  if (!emailRegex.test(email)) {
    return 'Please enter a valid email address';
  }
  return null;
};

export const validatePassword = (password: string): string | null => {
  if (!password.trim()) {
    return 'Password is required';
  }
  if (password.length < 6) {
    return 'Password must be at least 6 characters long';
  }
  return null;
};

export const validateName = (name: string): string | null => {
  if (!name.trim()) {
    return 'Name is required';
  }
  if (name.trim().length < 2) {
    return 'Name must be at least 2 characters long';
  }
  return null;
};

export const validateLoginForm = (credentials: LoginCredentials): FormErrors => {
  const errors: FormErrors = {};
  
  const emailError = validateEmail(credentials.email);
  if (emailError) errors.email = emailError;
  
  const passwordError = validatePassword(credentials.password);
  if (passwordError) errors.password = passwordError;
  
  return errors;
};

export const validateSignupForm = (credentials: SignupCredentials): FormErrors => {
  const errors: FormErrors = {};
  
  const nameError = validateName(credentials.name);
  if (nameError) errors.name = nameError;
  
  const emailError = validateEmail(credentials.email);
  if (emailError) errors.email = emailError;
  
  const passwordError = validatePassword(credentials.password);
  if (passwordError) errors.password = passwordError;
  
  return errors;
};
