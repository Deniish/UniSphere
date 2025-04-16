import React, { useState } from 'react';
import '../Home/Help.css';


const Privacy = () => {
  const [theme, setTheme] = useState('light');
  const toggleTheme = () => setTheme(t => (t === 'light' ? 'dark' : 'light'));

  return (
    <div className={`help-page ${theme}`}>
      <button className="theme-toggle" onClick={toggleTheme}>
        {theme === 'light' ? '☀️ Light Mode' : '🌙 Dark Mode'}
      </button>
      <h1>🔐 UniSphere Privacy Policy</h1>
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
      <h2>1. Introduction</h2>
        <p>
          At UniSphere, your privacy is our priority. This page explains how we collect, use, and protect your information while you're using our platform.
        </p>
      </section>

      <section className="help-section">
      <h2>2. What We Collect</h2>
        <ul>
          <li>📧 Email address and password (for login and account creation)</li>
          <li>🎬 Favorites, Watchlist, Continue Watching data</li>
          <li>🔍 Search history and chatbot interaction history</li>
          <li>📱 Device/browser data (used for analytics and improvements)</li>
        </ul>
      </section>

      <section className="help-section">
      <h2>3. How We Use Your Data</h2>
        <ul>
          <li>✅ To personalize your experience and provide recommendations</li>
          <li>✅ To maintain your Favorites, Watchlist, and Continue Watching</li>
          <li>✅ To enhance our AI recommendations and support system</li>
          <li>✅ To improve UniSphere’s performance and security</li>
        </ul>
      </section>

      <section className="help-section">
      <h2>4. Data Protection</h2>
        <ul>
          <li>🔒 Your data is encrypted and securely stored in our database.</li>
          <li>🚫 We do not sell, rent, or share your personal data with third parties.</li>
          <li>🛡️ Access to your data is restricted and used only for improving your UniSphere experience.</li>
        </ul>
      </section>

      <section className="help-section">
      <h2>5. Your Controls</h2>
        <ul>
          <li>📝 You can update or delete your account at any time from the Settings page.</li>
          <li>🙅 You can opt out of AI chatbot history or search tracking in your profile preferences.</li>
          <li>🗑️ Deleting your account permanently removes all your data from our system.</li>
        </ul>
      </section>

      <section className="help-section">
      <h2>6. Cookies & Analytics</h2>
        <p>
          We use cookies to improve your browsing experience and track usage analytics. These cookies are anonymous and never contain personal information.
        </p>
      </section>

      <section className="help-section">
      <h2>7. Third-Party Content</h2>
        <p>
          UniSphere uses third-party APIs for media content (movies, books, etc.). We do not store or distribute any copyrighted media directly.
        </p>
      </section>

      <section className="help-section">
      <h2>8. Changes to Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. Major changes will be communicated through the app or via email.
        </p>
      </section>
      <p className="help-footer">
        Still need help? Reach out to our support team at{' '}
        <a href="mailto:support@unisphere.app">support@unisphere.app</a>.
      </p>
    </div>
  );
};

export default Privacy;
