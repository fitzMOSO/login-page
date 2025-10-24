import React, { useState, useEffect } from 'react';
import { Github, Facebook, Linkedin, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { LoginCredentials, SignupCredentials, FormErrors } from '../types/auth';

/**
 * ModernLogin - A modern, animated login/signup component
 * Features sliding panel animation between Sign In and Sign Up forms
 * Based on AsmrProg design with clean two-panel layout
 */
const ModernLogin: React.FC = () => {
    const [isSignUp, setIsSignUp] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState<LoginCredentials & SignupCredentials>({
        name: '',
        email: '',
        password: ''
    });
    const [formErrors, setFormErrors] = useState<FormErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { login, signup, isLoading, error, clearError } = useAuth();

    /**
     * Handles form submission
     * @param {string} type - Form type ('signin' or 'signup')
     */
    const handleSubmit = async (type: 'signin' | 'signup') => {
        setIsSubmitting(true);
        setFormErrors({});
        clearError();

        try {
            if (type === 'signin') {
                const { name, ...loginData } = formData;
                const result = await login(loginData);
                if (result.success) {
                    console.log('Login successful!');
                } else if (result.errors) {
                    setFormErrors(result.errors);
                }
            } else {
                const result = await signup(formData);
                if (result.success) {
                    console.log('Signup successful!');
                } else if (result.errors) {
                    setFormErrors(result.errors);
                }
            }
        } catch (err) {
            console.error('Form submission error:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    /**
     * Updates form data state
     * @param {string} field - Field name to update
     * @param {string} value - New value
     */
    const handleInputChange = (field: keyof typeof formData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // Clear error for this field when user starts typing
        if (formErrors[field as keyof FormErrors]) {
            setFormErrors(prev => ({ ...prev, [field]: undefined }));
        }
    };

    /**
     * Toggles between Sign In and Sign Up modes
     */
    const toggleMode = () => {
        setIsSignUp(!isSignUp);
        setFormData({ name: '', email: '', password: '' });
        setFormErrors({});
        clearError();
    };

    /**
     * Handles social authentication
     * @param {string} provider - Social provider name
     */
    const handleSocialAuth = (provider: string) => {
        console.log(`${provider} authentication clicked`);
    };

    /**
     * Handles forgot password
     */
    const handleForgotPassword = () => {
        console.log('Forgot password clicked');
    };

    // Clear errors when switching modes
    useEffect(() => {
        setFormErrors({});
        clearError();
    }, [isSignUp, clearError]);

    // Reset form state when component mounts (after logout)
    useEffect(() => {
        setFormData({ name: '', email: '', password: '' });
        setFormErrors({});
        setIsSignUp(false);
        clearError();
    }, [clearError]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4">
            <div className="relative w-full max-w-4xl h-[600px] bg-white rounded-3xl shadow-2xl overflow-hidden">
                
                {/* Error Message */}
                {error && (
                    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50">
                        <div className="flex items-center gap-2 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg shadow-lg">
                            <AlertCircle className="w-5 h-5" />
                            <span className="text-sm font-medium">{error}</span>
                        </div>
                    </div>
                )}


                {/* Sign Up Form Container */}
                <div
                    className={`absolute top-0 w-1/2 h-full transition-all duration-700 ease-in-out ${
                        isSignUp
                            ? 'left-0 opacity-100 z-50 pointer-events-auto'
                            : 'left-1/2 opacity-0 z-10 pointer-events-none'
                    }`}
                >
                    <div className="flex items-center justify-center h-full px-12 py-8 bg-white">
                        <div className="w-full max-w-sm">
                            <h1 className="text-4xl font-bold text-gray-800 mb-8">Create Account</h1>

                            <div className="flex gap-3 mb-6">
                                <button
                                    type="button"
                                    onClick={() => handleSocialAuth('google')}
                                    className="flex-1 p-3 border border-gray-300 rounded-lg hover:border-indigo-400 hover:bg-indigo-50 transition-all"
                                    aria-label="Sign up with Google"
                                >
                                    <svg className="w-5 h-5 mx-auto" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                    </svg>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleSocialAuth('facebook')}
                                    className="flex-1 p-3 border border-gray-300 rounded-lg hover:border-indigo-400 hover:bg-indigo-50 transition-all"
                                    aria-label="Sign up with Facebook"
                                >
                                    <Facebook className="w-5 h-5 mx-auto text-blue-600" />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleSocialAuth('github')}
                                    className="flex-1 p-3 border border-gray-300 rounded-lg hover:border-indigo-400 hover:bg-indigo-50 transition-all"
                                    aria-label="Sign up with GitHub"
                                >
                                    <Github className="w-5 h-5 mx-auto text-gray-800" />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleSocialAuth('linkedin')}
                                    className="flex-1 p-3 border border-gray-300 rounded-lg hover:border-indigo-400 hover:bg-indigo-50 transition-all"
                                    aria-label="Sign up with LinkedIn"
                                >
                                    <Linkedin className="w-5 h-5 mx-auto text-blue-700" />
                                </button>
                            </div>

                            <p className="text-sm text-gray-500 text-center mb-6">or use your email for registration</p>

                            <div className="space-y-4">
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Name"
                                        value={formData.name}
                                        onChange={(e) => handleInputChange('name', e.target.value)}
                                        className={`w-full px-4 py-3 bg-gray-100 border-none rounded-lg focus:bg-gray-200 focus:outline-none transition-colors text-gray-800 placeholder-gray-500 ${
                                            formErrors.name ? 'ring-2 ring-red-500' : ''
                                        }`}
                                    />
                                    {formErrors.name && (
                                        <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                            <AlertCircle className="w-3 h-3" />
                                            {formErrors.name}
                                        </p>
                                    )}
                                </div>

                                <div className="relative">
                                    <input
                                        type="email"
                                        placeholder="Email"
                                        value={formData.email}
                                        onChange={(e) => handleInputChange('email', e.target.value)}
                                        className={`w-full px-4 py-3 bg-gray-100 border-none rounded-lg focus:bg-gray-200 focus:outline-none transition-colors text-gray-800 placeholder-gray-500 ${
                                            formErrors.email ? 'ring-2 ring-red-500' : ''
                                        }`}
                                    />
                                    {formErrors.email && (
                                        <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                            <AlertCircle className="w-3 h-3" />
                                            {formErrors.email}
                                        </p>
                                    )}
                                </div>

                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="Password"
                                        value={formData.password}
                                        onChange={(e) => handleInputChange('password', e.target.value)}
                                        className={`w-full px-4 py-3 bg-gray-100 border-none rounded-lg focus:bg-gray-200 focus:outline-none transition-colors text-gray-800 placeholder-gray-500 pr-12 ${
                                            formErrors.password ? 'ring-2 ring-red-500' : ''
                                        }`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                    {formErrors.password && (
                                        <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                            <AlertCircle className="w-3 h-3" />
                                            {formErrors.password}
                                        </p>
                                    )}
                                </div>

                                <button
                                    onClick={() => handleSubmit('signup')}
                                    disabled={isLoading || isSubmitting}
                                    className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transform hover:scale-[1.02] transition-all uppercase tracking-wide disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                                >
                                    {isLoading || isSubmitting ? (
                                        <div className="flex items-center justify-center gap-2">
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            Signing Up...
                                        </div>
                                    ) : (
                                        'Sign Up'
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sign In Form Container */}
                <div
                    className={`absolute top-0 w-1/2 h-full transition-all duration-700 ease-in-out ${
                        isSignUp
                            ? 'left-1/2 opacity-0 z-10 pointer-events-none'
                            : 'left-0 opacity-100 z-50 pointer-events-auto'
                    }`}
                >
                    <div className="flex items-center justify-center h-full px-12 py-8 bg-white">
                        <div className="w-full max-w-sm">
                            <h1 className="text-4xl font-bold text-gray-800 mb-8">Sign In</h1>

                            <div className="flex gap-3 mb-6">
                                <button
                                    type="button"
                                    onClick={() => handleSocialAuth('google')}
                                    className="flex-1 p-3 border border-gray-300 rounded-lg hover:border-indigo-400 hover:bg-indigo-50 transition-all"
                                    aria-label="Sign in with Google"
                                >
                                    <svg className="w-5 h-5 mx-auto" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                    </svg>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleSocialAuth('facebook')}
                                    className="flex-1 p-3 border border-gray-300 rounded-lg hover:border-indigo-400 hover:bg-indigo-50 transition-all"
                                    aria-label="Sign in with Facebook"
                                >
                                    <Facebook className="w-5 h-5 mx-auto text-blue-600" />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleSocialAuth('github')}
                                    className="flex-1 p-3 border border-gray-300 rounded-lg hover:border-indigo-400 hover:bg-indigo-50 transition-all"
                                    aria-label="Sign in with GitHub"
                                >
                                    <Github className="w-5 h-5 mx-auto text-gray-800" />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleSocialAuth('linkedin')}
                                    className="flex-1 p-3 border border-gray-300 rounded-lg hover:border-indigo-400 hover:bg-indigo-50 transition-all"
                                    aria-label="Sign in with LinkedIn"
                                >
                                    <Linkedin className="w-5 h-5 mx-auto text-blue-700" />
                                </button>
                            </div>

                            <p className="text-sm text-gray-500 text-center mb-6">or use your email password</p>

                            <div className="space-y-4">
                                <div className="relative">
                                    <input
                                        type="email"
                                        placeholder="Email"
                                        value={formData.email}
                                        onChange={(e) => handleInputChange('email', e.target.value)}
                                        className={`w-full px-4 py-3 bg-gray-100 border-none rounded-lg focus:bg-gray-200 focus:outline-none transition-colors text-gray-800 placeholder-gray-500 ${
                                            formErrors.email ? 'ring-2 ring-red-500' : ''
                                        }`}
                                    />
                                    {formErrors.email && (
                                        <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                            <AlertCircle className="w-3 h-3" />
                                            {formErrors.email}
                                        </p>
                                    )}
                                </div>

                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="Password"
                                        value={formData.password}
                                        onChange={(e) => handleInputChange('password', e.target.value)}
                                        className={`w-full px-4 py-3 bg-gray-100 border-none rounded-lg focus:bg-gray-200 focus:outline-none transition-colors text-gray-800 placeholder-gray-500 pr-12 ${
                                            formErrors.password ? 'ring-2 ring-red-500' : ''
                                        }`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                    {formErrors.password && (
                                        <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                            <AlertCircle className="w-3 h-3" />
                                            {formErrors.password}
                                        </p>
                                    )}
                                </div>

                                <button 
                                    onClick={handleForgotPassword}
                                    className="text-sm text-gray-600 hover:text-indigo-600 transition-colors"
                                >
                                    Forget Your Password?
                                </button>

                                <button
                                    onClick={() => handleSubmit('signin')}
                                    disabled={isLoading || isSubmitting}
                                    className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transform hover:scale-[1.02] transition-all uppercase tracking-wide disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                                >
                                    {isLoading || isSubmitting ? (
                                        <div className="flex items-center justify-center gap-2">
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            Signing In...
                                        </div>
                                    ) : (
                                        'Sign In'
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Overlay Panel - Sliding Animation */}
                <div
                    className={`absolute top-0 right-0 w-1/2 h-full overflow-hidden transition-transform duration-700 ease-in-out z-30 ${
                        isSignUp ? '-translate-x-full' : 'translate-x-0'
                    }`}
                >
                    
                    {/* Overlay Content */}
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-600 via-indigo-500 to-purple-600 text-white px-12 rounded-tl-3xl rounded-bl-3xl">
                        <div className="text-center max-w-md" key={isSignUp ? 'signup' : 'signin'}>
                            
                            {isSignUp ? (
                                <>
                                    <h2 className="text-5xl font-bold mb-4">Welcome Back!</h2>
                                    <p className="text-lg mb-8 leading-relaxed opacity-95">
                                        To keep connected with us please login with your personal info
                                    </p>
                                    <button
                                        onClick={toggleMode}
                                        className="px-12 py-3 border-2 border-white rounded-lg font-semibold hover:bg-white hover:text-indigo-600 transition-all transform hover:scale-105 uppercase tracking-wide"
                                    >
                                        Sign In
                                    </button>
                                </>
                            ) : (
                                <>
                                    <h2 className="text-5xl font-bold mb-4">Hello, Friend!</h2>
                                    <p className="text-lg mb-8 leading-relaxed opacity-95">
                                        Register with your personal details to use all of site features
                                    </p>
                                    <button
                                        onClick={toggleMode}
                                        className="px-12 py-3 border-2 border-white rounded-lg font-semibold hover:bg-white hover:text-indigo-600 transition-all transform hover:scale-105 uppercase tracking-wide"
                                    >
                                        Sign Up
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ModernLogin;