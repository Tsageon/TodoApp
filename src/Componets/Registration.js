import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; 
import './Registration.css';

function Registration() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    firstname: '',
    lastname: ''
  });
  const [error, setError] = useState('');

  useEffect(() => {
    setError('');
  }, [formData]);

  const validateInputs = () => {
    if (!formData.firstname) return 'First name is needed.';
    if (!formData.lastname) return 'Last name is needed.';
    if (!formData.username) return 'Username is needed.';
    if (!formData.email || !/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(formData.email)) return 'Invalid email format.';
    if (!formData.password) return 'Password is needed.';
    if (formData.password !== formData.confirmPassword) return 'Passwords aren\'t matching.';
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
      const response = await fetch('http://localhost:3001/register', {  // Ensure this URL matches your server
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
  
      if (!response.ok) {
        const { error } = await response.json();
        setError(error);
        return;
      }
  
      alert('Registration successful!');
      setFormData({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        firstname: '',
        lastname: ''
      });
      setError('');
    } catch (err) {
      setError('Wehlele');
    }
  };
  
  return (
    <div className="Registration">
      <form onSubmit={handleSubmit} className="form">
        <h1 className="title">Register</h1>
        <p className="message">Signup now and get to use the list.</p>
        <div className="flex">
          <label>
            <input
              className="input"
              type="text"
              value={formData.firstname}
              onChange={(e) => setFormData({ ...formData, firstname: e.target.value })}
              required
              aria-label="First Name"
            />
            <span>Firstname</span>
          </label>
          <label>
            <input
              className="input"
              type="text"
              value={formData.lastname}
              onChange={(e) => setFormData({ ...formData, lastname: e.target.value })}
              required
              aria-label="Last Name"
            />
            <span>Lastname</span>
          </label>
        </div>
        <label>
          <input
            className="input"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
            aria-label="Email"
          />
          <span>Email</span>
        </label>
        <label>
          <input
            className="input"
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
            aria-label="Password"
          />
          <span>Password</span>
        </label>
        <label>
          <input
            className="input"
            type="password"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            required
            aria-label="Confirm Password"
          />
          <span>Confirm password</span>
        </label>
        {error && <p className="error">{error}</p>}
        <button type="submit" className="submit">Submit</button>
        <p className="signin">Already have an account? <Link to="/login">Signin</Link></p>
      </form>
    </div>
  );
}

export default Registration;