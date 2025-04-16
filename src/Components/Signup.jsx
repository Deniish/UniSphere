import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../Styles/Signup.css';
import AnimatedBackground from './AnimatedBackground';
import emailjs from 'emailjs-com';

const Signup = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: '',
    birthdate: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showEmailError, setShowEmailError] = useState(false);
  const [showPasswordError, setShowPasswordError] = useState(false);
  const [showUsernameError, setShowUsernameError] = useState(false);
  const [showBirthdateError, setShowBirthdateError] = useState(false);
  const [disableRocketPointer, setDisableRocketPointer] = useState(false);
  const [hideRocket, setHideRocket] = useState(false);
  const [isMusicOn, setIsMusicOn] = useState(false);

  const audioRef = useRef(new Audio('/music/background.mp3'));

  const rocketButtonStyle = {
    cursor: disableRocketPointer ? 'not-allowed' : 'pointer',
    pointerEvents: disableRocketPointer ? 'none' : 'auto',
  };

  const rocketContainerRef = useRef(null);
  const navigate = useNavigate();

  // Refs for Step 1
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  // Refs for Step 2
  const usernameRef = useRef(null);
  const birthdateRef = useRef(null);

  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.body.classList.add('signup-page');
    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.classList.remove('signup-page');
    };
  }, []);

  // Throttle scroll events for the rocket container.
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (rocketContainerRef.current) {
            rocketContainerRef.current.style.transform = `translateY(${window.scrollY}px)`;
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    if (rocketContainerRef.current) {
      rocketContainerRef.current.style.transition = 'transform 0.3s ease-out';
    }

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    audio.loop = true;
    if (isMusicOn) {
      audio.play().catch((err) => console.error("Playback failed:", err));
    } else {
      audio.pause();
    }
  }, [isMusicOn]);

  // Validation functions
  const isEmailValid = (email) =>
    email.trim().includes('@') && email.trim().endsWith('.com');

  const isPasswordValid = (password) => password.trim().length >= 7;

  const isUsernameValid = (username) => {
    const regex = /^[a-zA-Z0-9_]+$/;
    return regex.test(username.trim());
  };

  const isBirthdateValid = (birthdate) => {
    if (!birthdate) return false;
    const birthYear = new Date(birthdate).getFullYear();
    const currentYear = new Date().getFullYear();
    return birthYear >= 1950 && birthYear < currentYear;
  };

  // Step validations
  const isStep1Valid = isEmailValid(formData.email) && isPasswordValid(formData.password);
  const isStep2Valid = isUsernameValid(formData.username) && isBirthdateValid(formData.birthdate);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    if (name === 'email') {
      setShowEmailError(false);
      setTimeout(() => setShowEmailError(!isEmailValid(value)), 2000);
    }

    if (name === 'password') {
      setShowPasswordError(false);
      setTimeout(() => setShowPasswordError(!isPasswordValid(value)), 1500);
    }

    if (name === 'username') {
      setShowUsernameError(false);
      setTimeout(() => setShowUsernameError(!isUsernameValid(value)), 1500);
    }

    if (name === 'birthdate') {
      setShowBirthdateError(false);
      setTimeout(() => setShowBirthdateError(!isBirthdateValid(value)), 1500);
    }
  };
//mongoDB storage 

  // Step 1 form submission (email & password)
  // Checks for duplicate email before proceeding to Step 2.
  const handleStep1Submit = (e) => {
    e.preventDefault();
    const existingUsersStr = localStorage.getItem('users');
    const existingUsers = existingUsersStr ? JSON.parse(existingUsersStr) : [];

    if (existingUsers.some(user => user.email === formData.email)) {
      toast.error("Email Account is already registered", {
        className: 'custom-toast'
      });
      return;
    }

    if (isStep1Valid) {
      setDisableRocketPointer(true);
      setHideRocket(false);
      const profileContainer = document.querySelector('.profile-container');
      if (profileContainer) {
        const targetPosition = profileContainer.offsetTop;
        smoothScrollTo(targetPosition, 9000);
        profileContainer.scrollIntoView({ behavior: 'smooth' });
        setTimeout(() => setHideRocket(true), 6500);
        setTimeout(() => setDisableRocketPointer(false), 9000);
      }
    }
  };

  // Step 2 form submission (complete profile)
  // const handleSubmit = (e) => {
  //   e.preventDefault();

  //   console.log('Form submitted:', formData);
  //   const existingUsersStr = localStorage.getItem('users');
  //   const existingUsers = existingUsersStr ? JSON.parse(existingUsersStr) : [];
    
    // Add the new user and update the users array in localStorage.
    // existingUsers.push(formData);
    // localStorage.setItem('users', JSON.stringify(existingUsers));
    // localStorage.setItem('user', JSON.stringify(formData)); //check this later
    // Use EmailJS to send a signup confirmation email.
    // ... inside your Signup component

const handleSubmit = async (e) => {
  e.preventDefault();

  console.log('Form submitted:', formData);

  try {
    // Call the signup endpoint of your backend API
    const response = await fetch('http://localhost:8000/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      // If response status is not ok, show error toast
      toast.error(data.message || 'Signup failed');
      return;
    }
    
    // Signup success
    toast.success('Signup Successful! Please log in.');
    
    // Optionally, clear form data, redirect, or further actions
    setTimeout(() => {
      navigate('/login', { state: { signupSuccess: true } });
    }, 1000);
    
  } catch (error) {
    console.error('Signup error:', error);
    toast.error('An error occurred during signup.');
  }

    const serviceID = 'service_2xidk19';
    const templateID = 'template_9vrdvkb';
    const userID = '6bGLK_Yoygotpx77d';

    const templateParams = {
      to_email: formData.email,
      username: formData.username,
      message: `
      <p>Hey ${formData.username}! 👋👽</p>
      <p>
        Welcome to <strong>UniSphere</strong> – <strong>A smarter way to Watch it, Feel it, Love it, and Share it.</strong>
        We're excited to have you on board! Our AI-driven platform curates the best in movies, series, anime, and books just for you. 🍿📚✨🛸
      </p>
      <h2>What to Expect:</h2>
      <ul>
        <li><strong>Tailored Recommendations:</strong> Discover hidden gems and trending hits powered by AI. 🤖💡</li>
        <li><strong>Seamless Experience:</strong> Enjoy a smooth, smart way to find your next favorite watch or read. 🎥📖🌌</li>
      </ul>
      <p>
        If you have any questions or need assistance, our team is here to help. Dive in, explore, and start your adventure with UniSphere today! 🛸
      </p>
      <a>Get Started🤞</a>
      <p>Cheers,<br>The UniSphere Team 🚀💫</p>
      `
    };

    emailjs.send(serviceID, templateID, templateParams, userID)
      .then(
        (response) => {
          if (!toast.isActive('signup-toast')) {
            toast.success('Signup Successful! Please log in.', { toastId: 'signup-toast' });
          }
          console.log('Signup confirmation email sent successfully!', response.status, response.text);
        },
        (error) => {
          console.error('Failed to send signup confirmation email:', error);
        }
      );

    setTimeout(() => {
      navigate('/login', { state: { signupSuccess: true } });
    }, 1000);
  };

  const smoothScrollTo = (targetPosition, duration) => {
    const start = window.scrollY;
    const distance = targetPosition - start;
    let startTime = null;

    const easeInOutCubic = (t) =>
      t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

    const animation = (currentTime) => {
      if (startTime === null) startTime = currentTime;
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      window.scrollTo(0, start + distance * easeInOutCubic(progress));
      if (elapsed < duration) {
        requestAnimationFrame(animation);
      }
    };

    requestAnimationFrame(animation);
  };

  const toggleMusic = () => {
    setIsMusicOn((prev) => !prev);
  };

  const handleKeyDown = (e, nextRef) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (nextRef && nextRef.current) {
        nextRef.current.focus();
      }
    }
  };

  const handleBackToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <div className="signup-body">
        <AnimatedBackground />
        {/* Step 1 Container */}
        <div className="signup-container">
          <div className="signup-step">
            <h1>
              Welcome to UniSphere &nbsp; 
              <img src="/Icons/icon5.png" alt="UniSphere Logo" className="unisphere-logo-signup"/>
            </h1>
            <p>Sign up to get started 🪐</p>
            <h5 className="text-signup-or">Or</h5>
            <Link to="/login">
              <span className="redirect-login">Already Have An Account?</span>
            </Link>
            <br />
            <form autoComplete="off" onSubmit={handleStep1Submit}>
              <div className="form-group">
                <input
                  type="email"
                  id="email"
                  placeholder=" "
                  name="email"
                  ref={emailRef}
                  value={formData.email}
                  onChange={handleChange}
                  onKeyDown={(e) => handleKeyDown(e, passwordRef)}
                  autoComplete="off"
                  required
                />
                <label htmlFor="email">Email</label>
                {showEmailError && (
                  <span className="error-message">
                    Email must contain "@" and end with ".com"
                  </span>
                )}
              </div>
              <div className="form-group password-field">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  placeholder=" "
                  name="password"
                  ref={passwordRef}
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="off"
                  required
                />
                <label htmlFor="password">Password</label>
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? '🙈' : '🐵'}
                </button>
                {showPasswordError && (
                  <span className="error-message">
                    Password must be at least 7 characters long
                  </span>
                )}
              </div>
              <button
                type="submit"
                className={`button-signup ${!isStep1Valid ? 'disabled-btn' : 'proceed-btn'}`}
                disabled={!isStep1Valid}
                style={rocketButtonStyle}
              >
                <div ref={rocketContainerRef}>
                  {!hideRocket && (
                    <span className={`btn-rocket rocket-animation ${disableRocketPointer ? 'disabled-pointer' : ''}`}>
                      🚀
                    </span>
                  )}
                </div>
              </button>
            </form>
          </div>
        </div>

        {/* Spacer Sections */}
        <section className="sec">
          <img src="/backgrounds/Astro.jpeg" alt="background 1" className="sec-image1" />
          <img src="/backgrounds/Astro1.jpeg" alt="background 2" className="sec-image2" />
          <img src="/backgrounds/Astro2.jpeg" alt="background 3" className="sec-image3" />
          <img src="/backgrounds/Astro3.jpeg" alt="background 4" className="sec-image4" />
          <img src="/backgrounds/Astro4.jpeg" alt="background 5" className="sec-image5" />
        </section>

        <div className="spacer"></div>
        {/* Step 2 Container */}
        <div className="profile-container container-down">
          <div className="signup-step">
            <button type="button" data-hover="Back To Top" className="back-button" onClick={handleBackToTop}></button>
            <h1>Complete Your Profile</h1>
            <p>Almost there! Fill in the details below.</p>
            {formData.email && isEmailValid(formData.email) && (
              <div className="email-display-box">
                {formData.email}
              </div>
            )}
            <br />
            <form onSubmit={handleSubmit} autoComplete="off">
              <div className="form-group">
                <input
                  type="text"
                  id="username"
                  placeholder=" "
                  name="username"
                  ref={usernameRef}
                  autoComplete="username"
                  value={formData.username}
                  onChange={handleChange}
                  onKeyDown={(e) => handleKeyDown(e, birthdateRef)}
                  required
                  disabled={!isStep1Valid}
                />
                <label htmlFor="username">Username</label>
                {showUsernameError && (
                  <span className="error-message">
                    Invalid Username.
                  </span>
                )}
              </div>
              <div className="form-group">
                <input
                  type="date"
                  id="birthdate"
                  placeholder=" "
                  name="birthdate"
                  ref={birthdateRef}
                  value={formData.birthdate}
                  onChange={handleChange}
                  required
                  disabled={!isStep1Valid}
                />
                <label htmlFor="birthdate">Birthdate</label>
                {showBirthdateError && (
                  <span className="error-message">
                    Invalid Birthdate.
                  </span>
                )}
              </div>
              <button
                type="submit"
                disabled={!isStep2Valid}
                className={`button-signup ${!isStep1Valid ? 'disabled-btn' : ''}`}
              >
                <span className="btn-rocket-down">🚀</span>
                <span className="rocket-landing">🌑</span>
              </button>
            </form>
          </div>
        </div>

        {/* Music Toggle Button */}
        <button className="music-toggle-button" onClick={toggleMusic}>
          {isMusicOn ? (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 9.75L19.5 12m0 0l2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-6l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z" />
            </svg>
          )}
        </button>

        {/* ToastContainer for notifications */}
        <ToastContainer
          className="toast-signup"
          position="top-center"
          autoClose={1000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          pauseOnFocusLoss
          draggable
          pauseOnHover
          style={{ zIndex: 9999 }}
        />
      </div>
    </>
  );
};

export default Signup;
