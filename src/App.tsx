import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import ModernLogin from './components/ModernLogin';
import Dashboard from './pages/Dashboard';

const App: React.FC = () => {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600 text-lg">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route 
                        path="/login" 
                        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <ModernLogin />} 
                    />
                    <Route 
                        path="/dashboard" 
                        element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" replace />} 
                    />
                    <Route 
                        path="/" 
                        element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />} 
                    />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
