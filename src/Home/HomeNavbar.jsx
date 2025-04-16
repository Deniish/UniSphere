import React, { useState, useRef, useEffect } from 'react';
import './HomeNavbar.css';
import { FaSearch } from 'react-icons/fa';

const HomeNavbar = ({
  searchTerm,
  setSearchTerm,
  onSearch,
  searchSubmitted,
  handleClearSearch,
  scrollToSection,
  onReccome // New prop for chatbot queries
}) => {
  const [showSearch, setShowSearch] = useState(false);
  const [showReccome, setShowReccome] = useState(false);
  const [reccomeTerm, setReccomeTerm] = useState("");
  const navRef = useRef(null);

  // Toggle search input. When opening one, close the other.
  const toggleSearch = () => {
    setShowSearch(!showSearch);
    if (showReccome) setShowReccome(false);
  };

  // Toggle reccome input; keep it in its original position.
  const toggleReccome = () => {
    setShowReccome(!showReccome);
    if (showSearch) setShowSearch(false);
  };

  // Trigger search when Enter is pressed in the search input.
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && searchTerm.trim() !== "") {
      onSearch();
    }
  };

  // Trigger reccome (chatbot) action when Enter is pressed in the reccome input.
  const handleReccomeKeyDown = (e) => {
    if (e.key === 'Enter' && reccomeTerm.trim() !== "") {
      // Call the onReccome function passed as prop
      if (onReccome) {
        onReccome(reccomeTerm);
      }
      setReccomeTerm("");
      setShowReccome(true);
    }
  };

  // Close inputs when clicking outside.
  const handleClickOutside = (event) => {
    if (navRef.current && !navRef.current.contains(event.target)) {
      setShowSearch(false);
      setShowReccome(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="home-navbar" ref={navRef}>
      <div
        className={`navbar-search ${showSearch ? 'active' : ''}`}
        onClick={toggleSearch}
      >
        <FaSearch />
      </div>
      {showSearch && (
        <div className="navbar-searchbar">
          <input
            type="text"
            placeholder="Search for your Taste..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>
      )}
      <ul className="home-navbar-links">
        <li>
          <a onClick={() => scrollToSection("movies")} href="#movies">
            <span className="default-text">Movies</span>
            <span className="hover-text">Movies</span>
          </a>
        </li>
        <li>
          <a onClick={() => scrollToSection("series")} href="#series">
            <span className="default-text">Series</span>
            <span className="hover-text">Series</span>
          </a>
        </li>
        <li>
          <a onClick={() => scrollToSection("anime")} href="#anime">
            <span className="default-text">Animes</span>
            <span className="hover-text">Animes</span>
          </a>
        </li>
        <li>
          <a onClick={() => scrollToSection("books")} href="#books">
            <span className="default-text">Books</span>
            <span className="hover-text">Books</span>
          </a>
        </li>
        <li className="navbar-icon-li">
          {/* Reccome icon now toggles an input for chatbot queries */}
          <div className="navbar-reccome">
            <img 
              src="/Icons/bot2.png" 
              alt="Reccome" 
              className={`navbar-icon ${showReccome ? 'active-2' : ''}`}
              onClick={toggleReccome}
            />
            {showReccome && (
              <div className="navbar-reccome-input">
                <input
                  type="text"
                  placeholder="What are you in mood for?"
                  value={reccomeTerm}
                  onChange={(e) => setReccomeTerm(e.target.value)}
                  onKeyDown={handleReccomeKeyDown}
                />
              </div>
            )}
          </div>
        </li>
      </ul>
    </nav>
  );
};

export default HomeNavbar;
