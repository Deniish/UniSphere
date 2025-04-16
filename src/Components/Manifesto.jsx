import React, { useRef, useEffect, useState } from 'react';
import '../Styles/Manifesto.css';
import Footer from './Footer';

const Manifesto = () => {
  const containerRef = useRef(null);
  const toggleRef = useRef(null);
  const [darkMode, setDarkMode] = useState(true); // Dark mode by default
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    let scrollTimeout;
    const container = containerRef.current;
    let lastScrollTop = container.scrollTop;

    const handleScroll = () => {
      container.classList.add('scrolling');
      if (scrollTimeout) clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        container.classList.remove('scrolling');
      }, 2000);
    
      const currentScrollTop = container.scrollTop;
      if (toggleRef.current) {
        if (currentScrollTop > lastScrollTop) {
          toggleRef.current.classList.add('hide-toggle');
        } else {
          toggleRef.current.classList.remove('hide-toggle');
        }
      }
      lastScrollTop = currentScrollTop <= 0 ? 0 : currentScrollTop;
    };

    container.addEventListener('scroll', handleScroll);
    return () => {
      container.removeEventListener('scroll', handleScroll);
      if (scrollTimeout) clearTimeout(scrollTimeout);
    };
  }, []);

  // IntersectionObserver to toggle fade effect with hysteresis based on visibility
  useEffect(() => {
    const sections = containerRef.current.querySelectorAll('.manifesto-section');
    const observerOptions = { threshold: [0, 0.2, 0.4] };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.intersectionRatio > 0.4) {
          entry.target.classList.add('visible');
        } else if (entry.intersectionRatio < 0.2) {
          entry.target.classList.remove('visible');
        }
      });
    }, observerOptions);

    sections.forEach(section => observer.observe(section));
    return () => {
      sections.forEach(section => observer.unobserve(section));
    };
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };

  // Scroll the container to the next section when the indicator is clicked
  const scrollToNextSection = () => {
    const sections = containerRef.current.querySelectorAll('.manifesto-section');
    if (sections.length > 1) {
      // Scroll smoothly to the second section (index 1)
      sections[1].scrollIntoView({ behavior: 'smooth' });
    }
  };
  const scrollToTop = () => {
    containerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
  };
  // Voice and text-to-speech functions are unchanged
  const loadVoices = () => {
    return new Promise((resolve) => {
      let voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        resolve(voices);
      } else {
        window.speechSynthesis.onvoiceschanged = () => {
          voices = window.speechSynthesis.getVoices();
          resolve(voices);
        };
      }
    });
  };

  const speakSentence = (sentence, voice) => {
    return new Promise((resolve) => {
      const utterance = new SpeechSynthesisUtterance(sentence);
      if (voice) {
        utterance.voice = voice;
      }
      utterance.pitch = 1.2;
      utterance.rate = 0.85;
      utterance.volume = 1;
      utterance.onend = resolve;
      window.speechSynthesis.speak(utterance);
    });
  };

  const speakText = async () => {
    const container = containerRef.current;
    const containerRect = container.getBoundingClientRect();
    const sections = container.querySelectorAll('.manifesto-section');
    let visibleText = '';

    sections.forEach(section => {
      const rect = section.getBoundingClientRect();
      if (rect.top < containerRect.bottom && rect.bottom > containerRect.top) {
        visibleText += section.textContent + ' ';
      }
    });
    visibleText = visibleText.trim();
    if (!visibleText) return;

    let sentences = visibleText.split(/(?<=[.?!])\s+/);
    if (!sentences || sentences.length === 0) {
      sentences = [visibleText];
    }

    const voices = await loadVoices();
    let femaleVoice = voices.find(voice => voice.name.toLowerCase().includes('female'));
    if (!femaleVoice && voices.length > 0) {
      femaleVoice = voices.find(voice => voice.lang === 'en-US') || voices[0];
    }

    for (let sentence of sentences) {
      if (!sentence.trim()) continue;
      await speakSentence(sentence, femaleVoice);
      await new Promise(resolve => setTimeout(resolve, 300));
    }
    setIsSpeaking(false);
  };

  const handleVoiceMode = async () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);
      await speakText();
    }
  };

  return (
    <div
      className={`manifesto-container ${darkMode ? 'dark-mode' : 'light-mode'}`}
      ref={containerRef}
    >
      {/* Dark/Light Mode Toggle Container fixed at the top center */}
      <div className="toggle-container" ref={toggleRef}>
        <input
          type="checkbox"
          id="theme-toggle"
          checked={darkMode}
          onChange={toggleDarkMode}
          className="toggle-input"
        />
        <label htmlFor="theme-toggle" className="toggle-switch">
          <span className="toggle-icon sun"><img src="/Icons/sun3.png" alt="Light" /></span>
          <span className="toggle-icon moon"><img src="/Icons/moon2.png" alt="Dark" /></span>
          <span className="toggle-slider" />
        </label>
      </div>

      {/* Voice Mode Button Container fixed at the bottom right */}
      <div className="voice-button-container">
        <button className="voice-button my-element" onClick={handleVoiceMode}>
          {isSpeaking ? (
            <img src="/Icons/vc-start.png" alt="Voice Mode" />
          ) : (
            <img src="/Icons/vc-stop.png" alt="Stop Voice" />
          )}
        </button>
      </div>

      {/* Section 1: Welcome */}
      <section className="manifesto-section">
        <h1 className="manifesto-heading">
          You're now entering to <span className="man-txt">UniSphere</span>
        </h1>
        <p className="manifesto-text">Scroll down to discover our manifesto!</p>
        {/* Add onClick event to the scroll indicator */}
        <div className="scroll-indicator" onClick={scrollToNextSection}>
          <div className="breathing-box">
            <img src="/Icons/Down.png" alt="Down key" className='down-arrow-icon'/>
          </div>
        </div>
      </section>

      {/* Section 2: Manifesto Introduction */}
      <section className="manifesto-section">
        <h2 className="manifesto-heading">Introduction</h2>
        <p className="manifesto-text">
          At UniSphere, we merge the power of advanced AI with human passion to curate recommendations that transcend the ordinary. Our platform is dedicated to movies, series, animes, and books—each suggestion designed to spark excitement and inspire new adventures.
        </p>
        <p className="manifesto-text">
          Every recommendation is not just a choice, but a doorway to an immersive experience.
        </p>
      </section>

      {/* Section 3: Our Manifesto */}
      <section className="manifesto-section">
        <h2 className="manifesto-heading">Our Manifesto</h2>
        <ul className="manifesto-list">
          <li>
            <strong>⚪ Innovation:</strong> Harnessing AI to provide dynamic, personalized recommendations.
          </li>
          <li>
            <strong>⚪ Community:</strong> Building a vibrant ecosystem where every voice matters.
          </li>
          <li>
            <strong>⚪ Diversity:</strong> Celebrating a wide spectrum of genres and narratives.
          </li>
          <li>
            <strong>⚪ Passion:</strong> Driven by our love for movies, series, animes, and books, we ignite inspiration and spark meaningful conversations.
          </li>
          <li>
            <strong>⚪ Exploration:</strong> Encouraging you to step outside the familiar and discover hidden gems.
          </li>
        </ul>
        <p className="manifesto-text">
          UniSphere isn’t just an AI recommendation engine—it’s your gateway to unforgettable experiences.
        </p>
      </section>

      {/* Section 4: Our Vision & Commitment */}
      <section className="manifesto-section">
        <h2 className="manifesto-heading">Our Vision & Commitment</h2>
        <p className="manifesto-text">
          We envision a world where everyone can access the best in entertainment and literature with just a click. Our commitment is to continuously refine our AI to understand your unique tastes and provide recommendations that truly resonate with you.
        </p>
        <p className="manifesto-text">
          We stand for transparency, ethical AI practices, and constant innovation to meet the needs of our diverse community.
        </p>
      </section>

      {/* Section 5: Manifesto Conclusion */}
      <section className="manifesto-section">
        <h2 className="manifesto-heading">Conclusion</h2>
        <p className="manifesto-text">
          Join us on a journey where every scroll brings you closer to a new adventure. Dive into UniSphere, explore the unknown, and let your next amazing experience begin.
        </p>
        <p className="manifesto-text" style={{ fontStyle: 'italic' }}>
          Scroll up to revisit our vision anytime.
        </p>
        <div className="scroll-indicator-up" onClick={scrollToTop}>
          <div className="breathing-box">
            <img src="/Icons/up-arrow.png" alt="Down key" className='up-arrow-icon'/>
          </div>
        </div>
      </section>

      <section className="manifesto-section">
        <h1 className="manifesto-heading">Let's Begin The Journey Of Entertainment!</h1>
        <div className="signup-container-2">
          <a className="signup-button" href="/signup">
            <span className="default-text">Sign Up</span>
            <span className="hover-text">Join Now</span>
          </a>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Manifesto;
