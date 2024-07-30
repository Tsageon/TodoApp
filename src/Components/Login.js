import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const validateInputs = () => {
    if (!formData.email || !/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(formData.email)) return 'Invalid email address.';
    if (!formData.password) return 'Password is needed.';
    return '';
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationError = validateInputs();
    if (validationError) {
      setError(validationError);
      return;
    }
  
    try {
      const response = await axios.post('http://localhost:3001/login', {
        email: formData.email,
        password: formData.password
      }, {
        withCredentials: true
      });
      console.log('Login response:', response.data);
  
      if (response.data.authenticated) {
        setSuccessMessage('Login successful! Redirecting to the home page...');
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000); 
      } else {
        setError('Invalid email or password.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('An error occurred while logging in. Please try again.');
    }
  };

  return (
    <div className="login">
      <form onSubmit={handleSubmit} className="form">
        <p id="heading">Login</p>
        <div className="field">
          <svg className="input-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M13.106 7.222c0-2.967-2.249-5.032-5.482-5.032-3.35 0-5.646 2.318-5.646 5.702 0 3.493 2.235 5.708 5.762 5.708.862 0 1.689-.123 2.304-.335v-.862c-.43.199-1.354.328-2.29.328-2.926 0-4.813-1.88-4.813-4.798 0-2.844 1.921-4.881 4.594-4.881 2.735 0 4.608 1.688 4.608 4.156 0 1.682-.554 2.769-1.416 2.769-.492 0-.772-.28-.772-.76V5.206H8.923v.834h-.11c-.266-.595-.881-.964-1.6-.964-1.4 0-2.378 1.162-2.378 2.823 0 1.737.957 2.906 2.379 2.906.8 0 1.415-.39 1.709-1.087h.11c.081.67.703 1.148 1.503 1.148 1.572 0 2.57-1.415 2.57-3.643zm-7.177.704c0-1.197.54-1.907 1.456-1.907.93 0 1.524.738 1.524 1.907S8.308 9.84 7.371 9.84c-.895 0-1.442-.725-1.442-1.914z"></path>
          </svg>
          <input autoComplete="off"
            placeholder="Email" className="input-field" type="text" name="email" value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}/>
        </div>
        <div className="field">
          <svg className="input-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M8 1a2 2 0 00-2 2v2H3.5A1.5 1.5 0 002 6.5v7A1.5 1.5 0 003.5 15h9a1.5 1.5 0 001.5-1.5v-7A1.5 1.5 0 0012.5 5H10V3a2 2 0 00-2-2zm-1 2a1 1 0 012 0v2H7V3zm-4 3h10v7H3V6z"></path>
          </svg>
          <input placeholder="Password" className="input-field"
            type="password" name="password" value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}/>
        </div>
        {error && <p className="error">{error}</p>}
        {successMessage && <p className="success">{successMessage}</p>}
        <div className="btn">
          <button className="button1" type="submit">
            <span>Login</span>
            <div className="bg-animation"></div>
          </button>
          <button className="button2">Sign Up</button>
        </div>
        <p className="signin">Don't have an account?<Link to="/register">Register</Link></p>
      </form>
    </div>
  );
}

export default Login;