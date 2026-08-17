// src/pages/Dashboard.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';

const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await API.get('/users/dashboard');
        setUserData(res.data.user);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load profile');
      }
    };

    fetchDashboard();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (error) {
    return (
      <div class="dashboard-card">
        <div class="error-badge">{error}</div>
        <button onClick={handleLogout} class="btn btn-primary">Back to Login</button>
      </div>
    );
  }

  if (!userData) {
    return (
      <div class="dashboard-card" style={{ textAlign: 'center' }}>
        <p style={{ color: 'var(--text-muted)' }}>Loading your dashboard...</p>
      </div>
    );
  }

  const initial = userData.name ? userData.name.charAt(0).toUpperCase() : 'U';

  return (
    <div class="dashboard-card">
      <div class="profile-header">
        {userData.avatar ? (
          <img src={userData.avatar} alt="Profile" class="avatar-img" />
        ) : (
          <div class="avatar-placeholder">{initial}</div>
        )}
        <div class="profile-info">
          <h3>{userData.name}</h3>
          <p>{userData.email}</p>
        </div>
      </div>

      <div class="data-grid">
        <div class="data-item">
          <span>Account ID</span>
          <p>{userData._id.substring(0, 10)}...</p>
        </div>
        <div class="data-item">
          <span>Auth Status</span>
          <p style={{ color: '#16a34a' }}>Active (JWT Verified)</p>
        </div>
        <div class="data-item">
          <span>Member Since</span>
          <p>{new Date(userData.createdAt).toLocaleDateString()}</p>
        </div>
        <div class="data-item">
          <span>Auth Method</span>
          <p>{userData.googleId ? 'Google OAuth' : 'Local Password'}</p>
        </div>
      </div>

      <button onClick={handleLogout} class="btn btn-google" style={{ color: '#ef4444', borderColor: '#fca5a5' }}>
        Sign Out
      </button>
    </div>
  );
};

export default Dashboard;