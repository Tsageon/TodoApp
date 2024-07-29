import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Registar.css'; 

function Register() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstname: '',
    lastname: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateInputs = () => {
    if (!formData.firstname) return 'First name is needed.';
    if (!formData.lastname) return 'Last name is needed.';
    if (!formData.email || !/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(formData.email)) return 'Invalid email format.';
    if (!formData.password) return 'Password is needed.';
    if (formData.password !== formData.confirmPassword) return 'Passwords aren\'t matching.';
    return '';
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationError = validateInputs();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError('');

    const data = {
      firstname: formData.firstname,
      lastname: formData.lastname,
      email: formData.email,
      password: formData.password,
      confirmPassword: formData.confirmPassword
    };

    try {
      const response = await axios.post('http://localhost:3001/register', data);
      console.log('Registration successful:', response.data);
      navigate('/login');
    } catch (error) {
      setError('Registration failed: ' + (error.response?.data?.error || 'Unknown error'));
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
            <input
              className="input"
              type="text"
              value={formData.firstname}
              onChange={(e) => setFormData({ ...formData, firstname: e.target.value })}
              required
              aria-label="First Name"
              aria-required="true"
            />
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
              aria-required="true"
            />
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
            aria-required="true"
          />
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
            aria-required="true"
          />
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
            aria-required="true"
          />
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

export default Register;