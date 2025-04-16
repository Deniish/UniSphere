import React from 'react';
import '../Styles/Footer.css'; // Make sure to create a corresponding CSS file for styling

const Footer = () => {
  return (
    <div className="footer-wrapper footer-grain-effect footer-container">
      {/* -------------Footer------------ */}
      <footer className="manifesto-footer">
        <p className="manifesto-footer-text">© 2025 UniSphere. All rights reserved.</p>
        <div className="logo-slogan-container">
          <img 
            src="/Icons/icon2.png" 
            alt="UniSphere Logo" 
            className="unisphere-logo-footer" 
          />      
          <p className="footer-logo-text">
            Discover Your Universe<br />of Entertainment!
          </p>
        </div>
        <div className="footer-columns">
          <div className="footer-column">
            <h3 className="column-header">USEFUL</h3>
            <a href="/about" className="footer-text"> 
              <span className="default-text">About Us</span>
              <span className="hover-text">About Us</span>
            </a>
            <a href="/contact" className="footer-text">
              <span className="default-text">Contact Us</span>
              <span className="hover-text">Contact Us</span>
            </a>
          </div>
          <div className="footer-column">
            <h3 className="column-header">LEGAL</h3>
            <a href="/privacy" className="footer-text"> 
              <span className="default-text">User Privacy</span>
              <span className="hover-text">User Privacy</span>
            </a>
            <a href="/terms" className="footer-text"> 
              <span className="default-text">User Guidelines</span>
              <span className="hover-text">User Guidelines</span>
            </a>
          </div>
        </div>
        <div>
          <span className="footer-logo">UniSphere</span>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
