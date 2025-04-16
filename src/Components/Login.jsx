import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../Styles/Login.css';
import VideoBackground from './VideoBg';

const Login = () => {
  const [loginData, setLoginData] = useState({
    identifier: '',
    password: '',
  });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Refs for input fields
  const identifierRef = useRef(null);
  const passwordRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (location.state && location.state.signupSuccess) {
      console.log('Signup Successful! Please log in.');
    }
  }, [location]);

  useEffect(() => {
    if (isAuthenticated) {
      setTimeout(() => {
        navigate('/home');
      }, 1000);
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
  };

  const handleKeyDown = (e, ref) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (ref && ref.current) {
        ref.current.focus();
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return; // Prevent multiple submissions
    setLoading(true);

    try {
      // Call your backend login endpoint
      const response = await fetch('http://localhost:8000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          identifier: loginData.identifier,
          password: loginData.password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || 'Invalid credentials. Please try again.');
        setLoginData({ identifier: '', password: '' });
        setLoading(false);
        return;
      }

      // After successful login in your Login component:
      localStorage.setItem('accessToken', data.accessToken);

      // Successful login - set authentication state
      setIsAuthenticated(true);
      // Optionally, store user info in context or local storage if needed:
      // localStorage.setItem('user', JSON.stringify(data.user));
      toast.success('Login Successful! Welcome back!');

      setTimeout(() => {
        navigate('/home');
      }, 1000);

    } catch (error) {
      console.error('Login error:', error);
      toast.error('An error occurred during login.');
      setLoginData({ identifier: '', password: '' });
      setLoading(false);
    }
  };

  return (
    <div className="login-page grain-effect">
      <VideoBackground />
      <h1 className="logo-login">
        UniSphere <img src="/Icons/icon2.png" alt="UniSphere Logo" className="unisphere-logo-login" />
      </h1>
      <div className="border" />
      <div className="login-container">
        <ToastContainer 
          className="custom-toast-container"
          toastClassName="custom-toast"
          position="top-center"
          autoClose={3000}
          hideProgressBar={false}
          closeOnClick
          draggable
          style={{ zIndex: 9999 }}
        />
        {isAuthenticated ? (
          <div className="login-success">
            <h2>Login Successful!</h2>
            <p>Redirecting To Home</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="login-form" autoComplete="off">
            {/* Dummy fields to help prevent browser autofill */}
            <input type="text" name="dummy-username" style={{ display: 'none' }} autoComplete="off" />
            <input type="password" name="dummy-password" style={{ display: 'none' }} autoComplete="off" />
            <h2>Log in</h2>
            <p className="link-signup">
              Or <Link to="/signup">create an account</Link>
            </p>
            <div className="login-form-group">
              <input
                type="text"
                name="identifier"
                ref={identifierRef}
                value={loginData.identifier}
                onChange={handleChange}
                onKeyDown={(e) => handleKeyDown(e, passwordRef)}
                placeholder=" "
                required
              />
              <label htmlFor="identifier">Email or Username</label>
            </div>
            <div className="login-form-group">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                ref={passwordRef}
                value={loginData.password}
                onChange={handleChange}
                onKeyDown={(e) => handleKeyDown(e, null)}
                placeholder=" "
                required
              />
              <label htmlFor="password">Password</label>
              <button
                type="button"
                className="toggle-password-login"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? '🙈' : '🐵'}
              </button>
            </div>
            <button
              type="submit"
              className="login-btn"
              disabled={loading}
              style={{ cursor: loading ? 'not-allowed' : 'pointer' }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
            >
              {loading ? (
                <img
                  src="/Icons/spinner2.svg"
                  alt="Loading..."
                  className="loader-svg"
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '50px',
                    height: '50px',
                  }}
                />
              ) : (
                'Login'
              )}
            </button>
            <p className="forgot-password">
              <Link to="/Recover-Account">Forgot Password?</Link>
            </p>
          </form>
        )}
      </div>
    </div>
  );
};

export default Login;
