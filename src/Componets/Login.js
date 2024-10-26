import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './authContext'
import './Login.css';


function Login() {
  const [successMessage, setSuccessMessage] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const { login } = useAuth();
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const validateInputs = () => {
    if (!formData.email || !/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(formData.email)) return 'Invalid email address.';
    if (!formData.password) return 'Password is needed.';
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errorMsg = validateInputs();
    if (errorMsg) {
      setError(errorMsg);
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Login failed');
      } else {
        localStorage.setItem('token', data.token); 
        login(data.token);

        alert('Welcome!');
        setFormData({
          email: '',
          password: ''
        });
        setSuccessMessage('Login Successful.');
        setError('');
        navigate('/'); 
      }
    } catch (err) {
      console.error('Network error:', err);
      setError('Network error, Time to relax.');
    }
  };


  return (
    <div className="login">
      <form onSubmit={handleSubmit} className="form">
        <h1 className="title" id="heading">Login</h1>
        <p className="message">Sign-in and use the list.</p>
        {successMessage && <p className="success"><em>{successMessage}</em></p>}
        <div className="field">
          <input required="" placeholder="" autoComplete="off"
            className="input input-field" type="text" name="email"
            value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
          <span>Email</span>
        </div>
        <div className="field">
          <input required="" placeholder="" className="input input-field"
            type="password" name="password"
            value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
          <span>Password</span>
        </div>
        {error && <p className="error-message">{error}</p>}
        <div className="btn">
          <button type="submit" className="submit button1">
            <span className="text">Login</span>
          </button>
          <p className="sign-up">
            <em>Register here!</em><Link to="/register" className="button2">Sign Up</Link>
          </p>
        </div>
      </form>
    </div>
  );
}

export default Login;