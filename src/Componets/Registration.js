import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; 
import './Registration.css';

function Registration() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstname: '',
    lastname: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setError('');
  }, [formData]);

  const validateInputs = () => {
    if (!formData.firstname) return 'First name is needed.';
    if (!formData.lastname) return 'Last name is needed.';
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

    setLoading(true);

    try {
      const response = await fetch(`http://localhost:3000/register`, { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.errors ? data.errors.map(err => err.msg).join(', ') : data.error);
      } else {
        alert('Registration successful!');
        setFormData({
          email: '',
          password: '',
          confirmPassword: '',
          firstname: '',
          lastname: ''
        });
        setError('');
      }
    } catch (err) {
      console.error('Network error:', err);
      setError('Network error, please try again later');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="Registration">
      <form onSubmit={handleSubmit} className="form">
        <h1 className="title">Register</h1>
        <p className="message">Signup now and get to use the list.</p>
        <div className="flex">
          <label>
            <input className="input" type="text" value={formData.firstname}
              onChange={(e) => setFormData({ ...formData, firstname: e.target.value })}
              required aria-label="First Name" aria-required="true"/>
            <span><em>Firstname</em></span>
          </label>
          <label>
            <input
              className="input"
              type="text"
              value={formData.lastname}
              onChange={(e) => setFormData({ ...formData, lastname: e.target.value })}
              required
              aria-label="Last Name"
              aria-required="true"/>
            <span><em>Lastname</em></span>
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
            aria-required="true"/>
          <span><em>Email</em></span>
        </label>
        <label>
          <input
            className="input"
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
            aria-label="Password"
            aria-required="true"/>
          <span><em>Password</em></span>
        </label>
        <label>
          <input
            className="input"
            type="password"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            required
            aria-label="Confirm Password"
            aria-required="true"/>
          <span><em>Confirm Password</em></span>
        </label>
        {error && <p className="error"><em>{error}</em></p>}
        {loading && <p className="loading"><em>Submitting...</em></p>}
        <button type="submit" className="submit" disabled={loading}>
          {loading ? <em>Submitting...</em> : <em>Submit</em>}
        </button>
        <p className="signin">
          <em>Already have an account?</em> <Link to="/login"><em>Signin</em></Link>
        </p>
      </form>
    </div>
  );
}

export default Registration;