import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';

const AuthForm: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();
  
  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setError(null);
  };
  
  const validateForm = () => {
    if (!email) {
      setError('Email is required');
      return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return false;
    }
    
    if (!password) {
      setError('Password is required');
      return false;
    }
    
    if (!isLogin && password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    
    return true;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        
        if (error) {
          setError(error.message);
        } else {
          navigate('/');
        }
      } else {
        const { error } = await signUp(email, password);
        
        if (error) {
          setError(error.message);
        } else {
          // Show success message or automatically log in
          setIsLogin(true);
          setError('Account created successfully! You can now log in.');
        }
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="bg-gray-900 rounded-lg shadow-lg p-8 w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold mb-2">
          {isLogin ? 'Sign In' : 'Create Account'}
        </h1>
        <p className="text-gray-400">
          {isLogin 
            ? 'Welcome back to 1M Streaming Platform' 
            : 'Join 1M Streaming today'}
        </p>
      </div>
      
      {error && (
        <div className="bg-red-500 bg-opacity-10 border border-red-500 text-red-500 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
            Email
          </label>
          <div className="relative">
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-gray-800 text-white w-full px-4 py-3 pl-10 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#03A9F4] focus:border-transparent"
              placeholder="name@example.com"
            />
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          </div>
        </div>
        
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-gray-800 text-white w-full px-4 py-3 pl-10 pr-10 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#03A9F4] focus:border-transparent"
              placeholder={isLogin ? '••••••••' : 'Create password'}
            />
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
            >
              {showPassword ? (
                <EyeOff size={18} />
              ) : (
                <Eye size={18} />
              )}
            </button>
          </div>
        </div>
        
        {isLogin && (
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 text-[#03A9F4] focus:ring-[#03A9F4] border-gray-700 rounded bg-gray-800"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-300">
                Remember me
              </label>
            </div>
            
            <div className="text-sm">
              <a href="#" className="text-[#03A9F4] hover:text-[#29B6F6]">
                Forgot password?
              </a>
            </div>
          </div>
        )}
        
        <div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#03A9F4] hover:bg-[#29B6F6] text-white font-medium py-3 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#03A9F4] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {isLogin ? 'Signing in...' : 'Creating account...'}
              </span>
            ) : (
              <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
            )}
          </button>
        </div>
      </form>
      
      <div className="mt-6 text-center">
        <p className="text-gray-400">
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <button
            type="button"
            onClick={toggleAuthMode}
            className="ml-1 text-[#03A9F4] hover:text-[#29B6F6] font-medium"
          >
            {isLogin ? 'Sign up' : 'Sign in'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthForm;