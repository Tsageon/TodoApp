import React, { useState, useEffect } from 'react';
import { useAuth } from './authContext'; 
import { useNavigate } from 'react-router-dom';
import Loader from './loader';
import Swal from 'sweetalert2';
import '../Componets/Profile.css';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const { logout } = useAuth(); 
  const navigate = useNavigate(); 
  
  const handleLogout = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will be logged out.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, log me out!',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        logout(); 
        localStorage.removeItem('token');
        Swal.fire({
          icon: 'success',
          title: 'Logged out successfully',
        }).then(() => navigate('/login'));
      }
    });
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        Swal.fire({
          icon: 'error',
          title: 'No Token Found',
          text: 'You need to log in to access this page.',
        }).then(() => navigate('/login'));
        return;
      }

      try {
        const response = await fetch('http://localhost:3001/profile', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok || !data.user) {
          Swal.fire({
            icon: 'error',
            title: 'Error Fetching Data',
            text: data.error || 'User data not found. Redirecting to login...',
          }).then(() => navigate('/login'));
        } else {
          setUser(data.user);
        }
      } catch (err) {
        console.error('Network error:', err);
        Swal.fire({
          icon: 'error',
          title: 'Network Error',
          text: 'Could not fetch profile data. Please check your internet connection.',
        }).then(() => navigate('/login'));
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
     <Loader />
      )}
    </div>
  );
};

export default Profile;