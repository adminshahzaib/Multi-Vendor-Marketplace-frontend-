// src/pages/Login.jsx
import { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('customer'); // 'customer' or 'vendor'
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    try {
      setError('');
      // Call REAL API login with email and password
      const userData = await login(email, password);

      // Backend returns role - use it for routing
      if (redirectTo) {
        navigate(redirectTo);
      } else if (userData.role === 'vendor') {
        navigate('/vendor/dashboard');
      } else if (userData.role === 'customer') {
        navigate('/account');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
      console.error('Login error:', err);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50/50">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-slate-900">Welcome Back</h2>
          <p className="text-xs text-gray-500">Sign in to manage your orders or merchant portal</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-xs font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          {/* Account Role Selector Toggle */}
          <div>
            <label className="block font-bold text-gray-700 mb-2">I am logging in as a:</label>
            <div className="grid grid-cols-2 gap-2 bg-gray-50 p-1 rounded-xl border border-gray-200">
              <button
                type="button"
                onClick={() => setRole('customer')}
                className={`py-2 rounded-lg font-bold transition ${
                  role === 'customer'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-500 hover:text-slate-900'
                }`}
              >
                Customer
              </button>
              <button
                type="button"
                onClick={() => setRole('vendor')}
                className={`py-2 rounded-lg font-bold transition ${
                  role === 'vendor'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-500 hover:text-slate-900'
                }`}
              >
                Vendor
              </button>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-1">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@example.com"
              className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-slate-900 hover:bg-blue-600 text-white font-bold py-3 rounded-xl transition shadow-sm"
          >
            Sign In
          </button>
        </form>

        <div className="text-center text-xs text-gray-500 pt-2 border-t border-gray-100">
          Don't have an account?{' '}
          <Link to="/register" className="font-bold text-blue-600 hover:underline">
            Register now
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Login;