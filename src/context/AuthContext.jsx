import { createContext, useContext, useState, useEffect } from 'react';
import API from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state on app mount - check if token exists
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          // Validate token by fetching user profile
          const { data } = await API.get('/auth/profile');
          setUser(data);
        }
      } catch (error) {
        console.error('Auth initialization error:', error.response?.status);
        // Token is invalid or expired
        localStorage.removeItem('token');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const { data } = await API.post('/auth/login', { email, password });
      
      if (!data.token) {
        throw new Error('No token in response');
      }

      // Store token and user data
      localStorage.setItem('token', data.token);
      setUser(data);
      
      return data;
    } catch (error) {
      console.error('Login failed:', error.message);
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const { data } = await API.post('/auth/register', userData);
      
      if (!data.token) {
        throw new Error('No token in response');
      }

      localStorage.setItem('token', data.token);
      setUser(data);
      
      return data;
    } catch (error) {
      console.error('Register failed:', error.message);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  // Prevent rendering children until auth state is determined
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600">Initializing...</div>
      </div>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        loading,
        isAuthenticated: Boolean(user),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};