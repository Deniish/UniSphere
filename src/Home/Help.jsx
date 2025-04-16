import React, { useState } from 'react';
import like from '../ImgUser/like.png';
import save from '../ImgUser/add-list.png';
import './Help.css';

const HelpPage = () => {
  const [theme, setTheme] = useState('light');
  const toggleTheme = () => setTheme(t => (t === 'light' ? 'dark' : 'light'));

  return (
    <div className={`help-page ${theme}`}>
      <button className="theme-toggle" onClick={toggleTheme}>
        {theme === 'light' ? '☀️ Light Mode' : '🌙 Dark Mode'}
      </button>
      <h1>UniSphere Help &amp; Support</h1>
       {/* Marquee‐style scrolling text */}
        <div className="marquee-help">
            <div className="marquee-help__inner">
            <span>
                🛠️ Need assistance? Check out UniSphere’s Help &amp; Support for tips on searching titles, managing your favorites &amp; watchlist, resuming playback, using our AI chatbot, and account settings. 🛠️
            </span>
            <span>
                🛠️ Need assistance? Check out UniSphere’s Help &amp; Support for tips on searching titles, managing your favorites &amp; watchlist, resuming playback, using our AI chatbot, and account settings. 🛠️
            </span>
            </div>
        </div>
      
      <section className="help-section">
        <h2>🔍 Powerful Search</h2>
        <p>Use the search bar at the top to quickly find any movie, series, anime, or book:</p>
        <div className="search-demo">
          <input
            type="text"
            placeholder="Search for your Taste..."
            disabled
          />
        </div>
        <ul>
          <li>Start typing and suggestions will appear instantly.</li>
          <li>Press <code>Enter</code> to view full search results.</li>
          <li>Filter by type (Movie, Series, Anime, Book) using the tabs above results.</li>
        </ul>
      </section>

      <section className="help-section">
        <h2>💬 AI Recommendation Chatbot</h2>
        <p>Our built‑in AI chatbot can answer your questions and suggest titles based on your preferences.</p>
        <ul>
          <li>Click the chat icon in the bottom right corner to open the AI assistant.</li>
          <li>Ask things like “Recommend me a thriller movie” or “Show me top anime from 2020”.</li>
          <li>Your chat history is stored so you can revisit previous recommendations.</li>
        </ul>
      </section>

      <section className="help-section">
        <h2>⭐ Favorites &amp; 📃 Watchlist</h2>
        <p>Keep track of what you love and what you plan to watch next.</p>
        <ul>
          <li>
            Click the{' '}
            <img src={like} alt="Favorite" className="icon-img" />
            to add/remove from <strong>Favorites</strong>.
          </li>
          <li>
            Click the{' '}
            <img src={save} alt="Watchlist" className="icon-img" />
            to add/remove from your <strong>Watchlist</strong>.
          </li>
          <li>All your Favorites and Watchlist items are saved to your profile.</li>
        </ul>
      </section>

      <section className="help-section">
        <h2>▶️ Continue Watching</h2>
        <p>Resume where you left off in any movie or series.</p>
        <ul>
          <li>We automatically track your progress as you watch.</li>
          <li>Visit the “Continue Watching” section in your profile to pick up again.</li>
        </ul>
      </section>

      <section className="help-section">
        <h2>👤 Account &amp; Authentication</h2>
        <ul>
          <li><strong>Sign Up / Login:</strong> Use your email and password to create or access your account.</li>
          <li><strong>Access Token:</strong> When logged in, your session token is active. Logging out clears it.</li>
          <li><strong>Delete Account:</strong> Go to Settings &gt; Account &gt; Delete Account to remove all your data.</li>
        </ul>
      </section>

      <section className="help-section">
        <h2>🏠 Navigation</h2>
        <ul>
          <li>Use the top menu to jump between Home, Search, Favorites, Watchlist, and Chatbot.</li>
          <li>Click the UniSphere logo to always return to the home page.</li>
        </ul>
      </section>
         {/* ←– New button group */}
      <div className="footer-nav-buttons">
        <button onClick={() => window.location.href = '/about'}>About Us</button>
        <button onClick={() => window.location.href = '/contact'}>Contact Us</button>
        <button onClick={() => window.location.href = '/terms'}>User Guidelines</button>
        <button onClick={() => window.location.href = '/privacy'}>User Privacy</button>
      </div>
      <p className="help-footer">
        Still need help? Reach out to our support team at{' '}
        <a href="mailto:support@unisphere.app">support@unisphere.app</a>.
      </p>
    </div>
  );
};

export default HelpPage;
