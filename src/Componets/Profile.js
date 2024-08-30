import React, { useState, useEffect } from 'react';
import { useAuth } from './authContext'; 
import { useNavigate } from 'react-router-dom';
import '../Componets/Profile.css';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const { logout } = useAuth(); 
  const navigate = useNavigate(); 

  const handleLogout = () => {
    logout(); 
    localStorage.removeItem('token');
    navigate('/login');
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No token found');
        navigate('/login')
        return;
      }

      try {
        const response = await fetch('http://localhost:3001/profile', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}` 
          }
        });

        const data = await response.json();

        if (!response.ok) {
          setError(data.error || 'Error fetching user data');
        } else {
          setUser(data.user);
        }
      } catch (err) {
        console.error('Network error:', err);
        setError('Network error');
      }
    };

    fetchUserData();
  }, [navigate]);

  return (
    <div className="profile-container">
      <h1>Profile</h1>
      {error && <p className="error">{error}</p>}
      {user ? (
        <div className="profile-info">
          <p><strong>First Name:</strong> {user.firstname}</p>
          <p><strong>Last Name:</strong> {user.lastname}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <button onClick={handleLogout} className="logout-button">Logout</button>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Profile;