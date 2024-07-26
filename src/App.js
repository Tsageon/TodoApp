import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom'; 
import Register from './Components/Register';
import Login from './Components/Login'; 
import Home from './Components/Home'; 
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <nav>
          <ul>
            <li>
              <NavLink to="/register" activeClassName="active">Register</NavLink>
              <NavLink to="/login" activeClassName="active">Login</NavLink>
              <NavLink to="/" exact activeClassName="active">Home</NavLink>
            </li>
          </ul>
        </nav>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Home />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;