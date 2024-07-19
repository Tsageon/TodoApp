import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'; 
import { AuthProvider } from './Componets/Authentication'; 
import Register from './Componets/Registration'; 
import Login from './Componets/Login'; 
import Home from './Componets/Home'; 
import { useAuth } from './Componets/Authentication';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <nav>
            <ul>
              <li className='Links'>
                <Link to="/register">Register</Link>
                <Link to="/login">Login</Link>
                <Link to="/">Home</Link>
              </li>
            </ul>
          </nav>
          <Routes>
            <Route path="/register" element={<Register />}/>
            <Route path="/login" element={<Login />}/>
            <Route path="/" element={<ProtectedRoute component={Home} />}/>
          </Routes>
        </div>
      </Router>
    </AuthProvider>         
  );
}

const ProtectedRoute = ({ component: Component, ...rest }) => {
  const { isLoggedIn } = useAuth();

  return isLoggedIn ? <Component {...rest} /> : <Login />;
};

export default App;