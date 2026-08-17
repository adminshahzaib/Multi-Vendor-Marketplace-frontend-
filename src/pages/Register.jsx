// src/pages/Register.jsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [role, setRole] = useState('customer'); // 'customer' or 'vendor'
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    storeName: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.name || !formData.email || !formData.password) {
      setError('All fields are required');
      return;
    }

    if (role === 'vendor' && !formData.storeName) {
      setError('Store name is required for vendors');
      return;
    }

    setLoading(true);
    try {
      // Call real API registration
      const userData = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: role,
        storeName: role === 'vendor' ? formData.storeName : '',
      });

      // Redirect based on role from API response
      if (userData.role === 'vendor') {
        navigate('/vendor/dashboard');
      } else if (userData.role === 'customer') {
        navigate('/account');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
      console.error('Registration error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50/50">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6">
        
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-slate-900">Create an Account</h2>
          <p className="text-xs text-gray-500">Join our marketplace community today</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-xs font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          {/* Account Type Selection */}
          <div>
            <label className="block font-bold text-gray-700 mb-2">I want to register as a:</label>
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
                Vendor Store
              </button>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="Alex Johnson"
              className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Conditional Vendor Store Input */}
          {role === 'vendor' && (
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Store / Business Name</label>
              <input
                type="text"
                name="storeName"
                required
                value={formData.storeName}
                onChange={handleChange}
                placeholder="Apex Gadgets Co."
                className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

          <div>
            <label className="block font-semibold text-gray-700 mb-1">Email Address</label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="alex@example.com"
              className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-1">Password</label>
            <input
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-3 rounded-xl transition shadow-sm"
          >
            {loading ? 'Creating Account...' : `Create ${role === 'vendor' ? 'Vendor' : 'Customer'} Account`}
          </button>
        </form>

        <div className="text-center text-xs text-gray-500 pt-2 border-t border-gray-100">
          Already registered?{' '}
          <Link to="/login" className="font-bold text-blue-600 hover:underline">
            Sign In
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Register;