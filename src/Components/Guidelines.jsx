import React, { useState } from 'react';
import '../Home/Help.css';

const Terms = () => {
  const [theme, setTheme] = useState('light');
  const toggleTheme = () => setTheme(t => (t === 'light' ? 'dark' : 'light'));

  return (
    <div className={`help-page ${theme}`}>
      <button className="theme-toggle" onClick={toggleTheme}>
        {theme === 'light' ? '☀️ Light Mode' : '🌙 Dark Mode'}
      </button>
      <h1>📜 Terms & Community Guidelines</h1>
       {/* Marquee‐style scrolling text */}
        <div className="marquee-help">
            <div className="marquee-help__inner">
            <span>
                🎬📺📚 Your all-in-one hub for Movies, Series, Anime, Books & 🤖 AI Recommendations.🎬📺📚
            </span>
            <span>
                🎬📺📚 Your all-in-one hub for Movies, Series, Anime, Books & 🤖 AI Recommendations.🎬📺📚
            </span>
            </div>
        </div>
      
      <section className="help-section">
      <h2>1. Acceptance of Terms</h2>
        <p>
          By using UniSphere, you agree to these Terms and our Privacy Policy. If you do not agree, please do not use the platform.
        </p>
      </section>

      <section className="help-section">
      <h2>2. User Conduct</h2>
        <ul>
          <li>✅ Respect others and engage positively with the community.</li>
          <li>🚫 Do not post or share any offensive, illegal, or copyrighted content.</li>
          <li>🔒 Keep your login credentials confidential and secure.</li>
        </ul>
      </section>

      <section className="help-section">
      <h2>3. AI Chatbot Usage</h2>
        <p>
          Our AI assistant provides recommendations and support. While helpful, it may occasionally provide incorrect or unexpected responses. Use discretion and report any issues to us.
        </p>
      </section>

      <section className="help-section">
      <h2>4. Account & Data</h2>
        <ul>
          <li>You can create and manage an account using your email and password.</li>
          <li>All your preferences (Favorites, Watchlist, Continue Watching) are stored securely.</li>
          <li>You can delete your account at any time via settings.</li>
        </ul>
      </section>

      <section className="help-section">
      <h2>5. Content Disclaimer</h2>
        <p>
          All media content (movies, series, anime, books) is fetched via trusted third-party APIs. We do not host or distribute any copyrighted content.
          Our platform is strictly for discovery, tracking, and recommendation purposes.
        </p>
      </section>

      <section className="help-section">
      <h2>6. Piracy & Copyright</h2>
        <ul>
          <li>🛑 UniSphere does not promote, link to, or support piracy in any form.</li>
          <li>📚 All referenced content is provided for informational and recommendation purposes only.</li>
          <li>🎬 We encourage users to watch or read through legal and licensed platforms only.</li>
          <li>⚠️ Any attempt to upload or share pirated material on UniSphere will result in permanent suspension of the account.</li>
        </ul>
      </section>

      <section className="help-section">
      <h2>7. Prohibited Actions</h2>
        <ul>
          <li>⛔ Attempting to hack, exploit, or misuse UniSphere in any way.</li>
          <li>⛔ Spamming, scraping, or using bots to overload the platform.</li>
          <li>⛔ Sharing harmful links, malware, or illegal content.</li>
        </ul>
      </section>

      <section className="help-section">
      <h2>8. Modifications</h2>
        <p>
          We reserve the right to update these Terms & Guidelines at any time. Users will be notified of significant changes.
        </p>
      </section>
      <p className="help-footer">
        Still need help? Reach out to our support team at{' '}
        <a href="mailto:support@unisphere.app">support@unisphere.app</a>.
      </p>
    </div>
  );
};

export default Terms;
