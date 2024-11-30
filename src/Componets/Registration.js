import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import Loader from './loader';
import './Registration.css';

function Registration() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstname: '',
    lastname: ''
  });
  const [error] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [successMessage] = useState('');

  const validateInputs = () => {
    if (!formData.firstname) return 'First name is needed.';
    if (!formData.lastname) return 'Last name is needed.';
    if (!formData.email || !/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(formData.email)) return 'Invalid email format.';
    if (!formData.password) return 'Password is needed.';
    if (formData.password !== formData.confirmPassword) return 'Passwords don\'t match.';
    return '';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationError = validateInputs();
    if (validationError) {
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: validationError,
      });
      return;
    }
  
    setLoading(true);
  
    const data = {
      firstname: formData.firstname,
      lastname: formData.lastname,
      email: formData.email,
      password: formData.password,
      confirmPassword: formData.confirmPassword
    };
  
    try {
      const response = await fetch('http://localhost:3001/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        Swal.fire({
          icon: 'error',
          title: 'Registration Failed',
          text: errorData.errors?.map(err => err.msg).join(', ') || 'Unknown error',
        });
      } else {
        const result = await response.json();
        console.log('Registration successful:', result);
        Swal.fire({
          icon: 'success',
          title: 'Registration Successful',
          text: 'You have registered successfully! Redirecting to login...',
        }).then(() => {
          navigate('/login');
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Network Error',
        text: error.message,
      });
    } finally {
      setLoading(false);
    }
  };  
  
  return (
    <div className="Registration">
    <form onSubmit={handleSubmit} className="Form">
      <h1 className="title">Register</h1>
      <p className="message">Signup now and get to use the list.</p>
      {successMessage && <p className="success"><em>{successMessage}</em></p>}
      
      <div className="field flex">
        <label>
          <input 
            className="input" 
            type="text" 
            name="firstname"
            placeholder='First Name'
            value={formData.firstname}
            onChange={handleChange}
            required 
            aria-label="First Name" 
            aria-required="true"
          />
        </label>
  
        <label>  
          <input 
            className="input" 
            type="text"
            name="lastname"
            placeholder='Last Name'
            value={formData.lastname} 
            onChange={handleChange}
            required 
            aria-label="Last Name" 
            aria-required="true"
          />
        </label>
      </div>
  
      <div className="field">
        <label>
          <input 
            className="input" 
            type="email"
            name="email"
            placeholder='Email'
            value={formData.email} 
            onChange={handleChange}
            required 
            aria-label="Email" 
            aria-required="true"
          />
        </label>
      </div>
  
      <div className="field">
        <label>
          <input
            className="input"
            type="password"
            name="password"
            placeholder='Password'
            value={formData.password}
            onChange={handleChange}
            required
            aria-label="Password"
            aria-required="true"
          />
        </label>
      </div>
  
      <div className="field">
        <label>
          <input
            className="input"
            type="password"
            name="confirmPassword"
            placeholder='Confirm Password'
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            aria-label="Confirm Password"
            aria-required="true"
          />
        </label>
      </div>
  
      {error && <p className="error"><em>{error}</em></p>}
      {loading && <p className="loading"><Loader /></p>}
      
      <button type="submit" className="submit" disabled={loading}>
        {loading ? <Loader /> : <em>Submit</em>}
      </button>
      
      <p className="signin">
        <em>Already have an account?</em><Link to="/login"><em>Signin</em></Link>
      </p>
    </form>
  </div>
  
   
  );
}

export default Registration;