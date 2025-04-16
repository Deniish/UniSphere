import React, { useState } from 'react';
import '../Home/Help.css';

const AboutUs = () => {
  const [theme, setTheme] = useState('light');
  const toggleTheme = () => setTheme(t => (t === 'light' ? 'dark' : 'light'));

  return (
    <div className={`help-page ${theme}`}>
      <button className="theme-toggle" onClick={toggleTheme}>
        {theme === 'light' ? '☀️ Light Mode' : '🌙 Dark Mode'}
      </button>
      <h1>About UniSphere</h1>
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
      <h2>🌐 Our Mission</h2>
        <p>
          At UniSphere, we strive to bring entertainment lovers together on a single platform powered by intelligent recommendations.
          Whether you're into thrillers, rom-coms, manga, or mystery novels — UniSphere learns what you love and helps you discover more.
        </p>
      </section>

      <section className="help-section">
      <h2>💡 What We Offer</h2>
        <ul>
          <li>🎬 Watch Movies, Series, Anime, and read Books — all in one place</li>
          <li>🤖 Personalized AI chatbot to answer your queries and recommend content</li>
          <li>🔍 Advanced Search to explore titles by genre, year, rating & more</li>
          <li>⭐ Save to Favorites and 📃 manage your Watchlist</li>
          <li>⏯️ Continue Watching where you left off</li>
        </ul>
      </section>

      <section className="help-section">
      <h2>🚀 Vision</h2>
        <p>
          To revolutionize the way people experience digital entertainment through intuitive technology and emotional intelligence.
        </p>
      </section>

      <section className="help-section">
      <h2>👥 Our Team</h2>
        <p>
          UniSphere was built by passionate developers, designers, and storytellers who believe in creating meaningful connections between people and stories.
        </p>
      </section>

      <section className="help-section">
      <p>
          Have questions or ideas? Reach out to us anytime at <a href="mailto:support@unisphere.app">vibes@unisphere.app</a>.
        </p>
        <p>
          Thank you for choosing UniSphere 💙
        </p>
      </section>

      <p className="help-footer">
        Still need help? Reach out to our support team at{' '}
        <a href="mailto:support@unisphere.app">support@unisphere.app</a>.
      </p>
    </div>
  );
};

export default AboutUs;
