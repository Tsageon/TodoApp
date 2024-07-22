import React, { useState } from 'react';
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

  const validateInputs = () => {
    if (!formData.firstname) return 'First name is needed.';
    if (!formData.lastname) return 'Last name is needed.';
    if (!formData.username) return 'Username is needed.';
    if (!formData.email || !/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(formData.email)) return 'Invalid email format.';
    if (!formData.password) return 'Password is needed.';
    if (formData.password !== formData.confirmPassword) return 'Passwords aren\'t matching.';
    return '';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errorMsg = validateInputs();
    if (errorMsg) {
      setError(errorMsg);
      return;
    }

    alert('Yay Welcome!');
    setFormData({
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      firstname: '',
      lastname: ''
    });
    setError('');
  };

  return (
    <div className="Registration">
      <form onSubmit={handleSubmit} className="form">
        <p className="title"><h1>Register</h1></p>
        <p className="message">Signup now and get to use the list.</p>
        <div className="flex">
          <label>
            <input
              className="input"
              type="text"
              placeholder=""
              value={formData.firstname}
              onChange={(e) => setFormData({ ...formData, firstname: e.target.value })}
              required
              aria-label="First Name"/>
            <span>Firstname</span>
          </label>
          <label>
            <input
              className="input"
              type="text"
              placeholder=""
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
            type="text"
            placeholder=""
            value={formData.username}
            onChange={(e) => setFormData({...formData, username: e.target.value })}
            required
            aria-label="Username"
          />
          <span>Username</span>
        </label>
        <label>
          <input
            className="input"
            type="email"
            placeholder=""
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value })}
            required
            aria-label="Email"
          />
          <span>Email</span>
        </label>
        <label>
          <input
            className="input"
            type="password"
            placeholder=""
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
            placeholder=""
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