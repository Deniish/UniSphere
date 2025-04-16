import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Styles/Navbar.css';

const Navbar = ({ darkMode }) => {
  const navbarStyle = {
    backgroundColor: darkMode ? "#1c1c1c" : "#f8f7f3",
    color: darkMode ? "#fff" : "#333",
    transition: "background-color 0.4s, color 0.4s"
  };

  const navigate = useNavigate();
  const [isActive, setIsActive] = useState(false);

  const handleClick = () => {
    setIsActive(true);
    setTimeout(() => {
      setIsActive(false);
    }, 3500);
  };

  const handleLinkClick = (path) => {
    setTimeout(() => {
      navigate(path);
    }, 100);
    window.location.reload();
  };

  // Regular links in light mode: default text is grey and hover text is black.
  const defaultTextStyle = darkMode ? {} : { color: "#616161" };
  const hoverTextStyle = darkMode ? {} : { color: "#1f1f1f" };

  // For the Sign Up button in light mode: dark background with light text.
  const signupStyle = darkMode
    ? {}
    : {
        background: "#1c1c1c",
        color: "#fff",
        border: "none",
         
    };

  const signupDefaultTextStyle = darkMode ? {} : { color: "#fff" };
  const signupHoverTextStyle = darkMode ? {} : { color: "#fff" };

  // For the Log In link: add a black border in light mode.
  const loginStyle = darkMode ? {} : { border: "2px solid rgb(100, 100, 100)", borderRadius: "13px" };

  return (
    <nav style={navbarStyle} className="navbar">
      <div className="navbar-logo">
        <img
          src="/Icons/icon2.png"
          alt="UniSphere Logo"
          className={`unisphere-logo-navbar ${isActive ? 'clickActive' : ''}`}
          onClick={handleClick}
        />
      </div>
      <ul className="navbar-links">
        <li>
          <a onClick={() => handleLinkClick('/manifesto')} href="/manifesto">
            <span className="default-text" style={defaultTextStyle}>Manifesto</span>
            <span className="hover-text" style={hoverTextStyle}>Discover Manifesto</span>
          </a>
        </li>
        <li>
          <a onClick={() => handleLinkClick('/insights')} href="/insights">
            <span className="default-text" style={defaultTextStyle}>Insights</span>
            <span className="hover-text" style={hoverTextStyle}>Sneek a Peek</span>
          </a>
        </li>
        <li>
          <a onClick={() => handleLinkClick('/login')} href="/login" style={loginStyle}>
            <span className="default-text" style={defaultTextStyle}>Log In</span>
            <span className="hover-text" style={hoverTextStyle}>Get<br />Started</span>
          </a>
        </li>
        <li>
          <a onClick={() => handleLinkClick('/signup')} href="/signup" style={signupStyle}>
            <span className="default-text" style={signupDefaultTextStyle}>Sign Up</span>
            <span className="hover-text" style={signupHoverTextStyle}>Join Now</span>
          </a>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
