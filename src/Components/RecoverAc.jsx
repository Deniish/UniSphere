import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import { toast, ToastContainer } from 'react-toastify';
import VideoBackground from './VideoBg';
import emailjs from 'emailjs-com'; // Import EmailJS
import 'react-toastify/dist/ReactToastify.css';
import '../Styles/Login.css'; // Reusing the same CSS as the Login page

const ForgotPassword = () => {
  const navigate = useNavigate();

  // Stage states:
  //  - emailVerified: true after email is verified and recovery code sent
  //  - resetStage: true after recovery code is verified, so we show new password fields
  const [email, setEmail] = useState('');
  const [recoveryCode, setRecoveryCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [emailVerified, setEmailVerified] = useState(false);
  const [resetStage, setResetStage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Refs for input fields
  const emailRef = useRef(null);
  const recoveryCodeRef = useRef(null);
  const newPasswordRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Input change handlers
  const handleEmailChange = (e) => setEmail(e.target.value);
  const handleRecoveryCodeChange = (e) => setRecoveryCode(e.target.value);
  const handleNewPasswordChange = (e) => setNewPassword(e.target.value);
  const handleConfirmPasswordChange = (e) => setConfirmPassword(e.target.value);

  // Helper to generate an 11-digit recovery code
  const generateRecoveryCode = () => {
    let code = '';
    for (let i = 0; i < 11; i++) {
      code += Math.floor(Math.random() * 10);
    }
    return code;
  };

  // Handler for verifying the email and sending the recovery code via EmailJS
  const handleVerifyEmail = async (e) => {
    e.preventDefault();
    if (loading) return; // prevent multiple clicks

    if (!email.trim()) {
      toast.error('Please enter your email.');
      return;
    }

    try {
      // Instead of getting the user from localStorage,
      // call your backend endpoint to fetch the user by email.
      const response = await fetch(`http://localhost:8000/user?email=${encodeURIComponent(email.trim())}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        toast.error('No user found. Please sign up first.');
        return;
      }
      
      // The API returns the user object in JSON format
      const user = await response.json();
      
      if (!user || !user.email) {
        toast.error('Invalid email. Please enter a registered email.');
        return;
      }
      
      // Generate an 11-digit recovery code
      const code = generateRecoveryCode();

      // Optionally, store the recovery code locally for later verification.
      // (For a production system, you might store this in your database instead.)
      localStorage.setItem('recoveryCode', code);

      // Prepare template parameters for the user recovery email
      const userTemplateParams = {
        to_email: email.trim(),
        code,
        message: `<p>Hello ${user.username},</p>
                  <p>We received a request to recover your account 🌟. Please use the following 11-digit recovery code to reset your password: 👾</p>
                  <p style="margin: 0; padding: 0;">
                    <a href="#" style="text-decoration: none; color: inherit;">
                      <span style="font-size: 24px; font-weight: bold;">${code}</span>
                    </a>
                  </p>
                  <p>If you did not request this, please ignore this email or contact our support team 🤗.</p>
                  <p>Best regards,<br/>UniSphere<br/>support@unisphere-help.com</p>`
      };

      // Prepare template parameters for the admin notification email
      const adminTemplateParams = {
        user_email: email.trim(),
        requested_at: new Date().toLocaleString(),
        message: 'A recovery request has been submitted. Please verify the user and send the recovery instructions. Best Regards. 🙏'
      };

      setLoading(true);
      // Replace these placeholders with your actual EmailJS credentials
      const serviceID = 'service_dlufdf5';
      const userRecoveryTemplateID = 'template_cs5z9j5';
      const adminNotificationTemplateID = 'template_e23drfl';
      const userID = 'kE4rEeyhMUl0m4n9p';

      // Send the email to the user with the recovery code
      await emailjs.send(serviceID, userRecoveryTemplateID, userTemplateParams, userID);

      // Send the notification email to admin/support
      await emailjs.send(serviceID, adminNotificationTemplateID, adminTemplateParams, userID);

      toast.success('Email verified! Recovery code sent to your email.');
      setEmailVerified(true);

      // Optionally, move focus to the recovery code input
      setTimeout(() => {
        if (recoveryCodeRef.current) {
          recoveryCodeRef.current.focus();
        }
      }, 300);
    } catch (error) {
      console.error(error);
      toast.error('Failed to send recovery code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handler for verifying the recovery code
  const handleVerifyRecoveryCode = async (e) => {
    e.preventDefault();
    if (loading) return; // prevent multiple clicks

    if (!recoveryCode.trim()) {
      toast.error('Please enter the recovery code.');
      return;
    }

    const storedCode = localStorage.getItem('recoveryCode');

    if (recoveryCode.trim() !== storedCode) {
      toast.error('Invalid recovery code. Please check your email and try again.');
      return;
    }

    toast.success('Recovery code verified! Create a new secure password.');
    setResetStage(true);

    setTimeout(() => {
      if (newPasswordRef.current) {
        newPasswordRef.current.focus();
      }
    }, 300);
  };

  // Handler for setting the new password with validation and redirection
  const handleSetNewPassword = async (e) => {
    e.preventDefault();
    if (loading) return;
  
    if (!newPassword.trim() || !confirmPassword.trim()) {
      toast.error('Please fill in both password fields.');
      return;
    }
    
    if (newPassword.length < 7) {
      toast.error('Password must be at least 7 characters long.');
      return;
    }
  
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }
  
    try {
      setLoading(true);
      // Call the backend endpoint to update the password in MongoDB
      const response = await fetch('http://localhost:8000/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, newPassword })
      });
  
      const result = await response.json();
  
      if (!response.ok) {
        toast.error(result.message || 'Password reset failed.');
        return;
      }
  
      toast.success('Password updated successfully! Redirecting to login...');
  
      // Reset states and remove the stored recovery code
      setEmail('');
      setRecoveryCode('');
      setNewPassword('');
      setConfirmPassword('');
      setEmailVerified(false);
      setResetStage(false);
      localStorage.removeItem('recoveryCode');
  
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      console.error('Password reset error:', error);
      toast.error('An error occurred during password reset.');
    } finally {
      setLoading(false);
    }
  };
  

  // Centralized submit handler that calls the correct function based on the stage
  const handleSubmit = (e) => {
    if (!emailVerified && !resetStage) {
      handleVerifyEmail(e);
    } else if (emailVerified && !resetStage) {
      handleVerifyRecoveryCode(e);
    } else if (resetStage) {
      handleSetNewPassword(e);
    }
  };

  return (
    <div className="login-page grain-effect">
      <VideoBackground />
      <h1 className='logo-login'>UniSphere <img src="/Icons/icon2.png" alt="UniSphere Logo" className="unisphere-logo-login"/></h1>
      <div className="border" />
      <div className="login-container">
        <ToastContainer 
          className="custom-toast-container"
          toastClassName="custom-toast"
          position="top-center"
          autoClose={3000}
          hideProgressBar={false}
          closeOnClick
          pauseOnFocusLoss
          draggable
          pauseOnHover
          style={{ zIndex: 9999 }}
        />
        <form onSubmit={handleSubmit} className="login-form" autoComplete="off">
          {/* Dummy fields to help prevent browser autofill */}
          <input type="text" name="dummy-email" style={{ display: 'none' }} autoComplete="off" />
          <input type="password" name="dummy-code" style={{ display: 'none' }} autoComplete="off" />

          <h1 className="recover-h1">Let's Recover Your Account!</h1>  
          <h2>Forgot Password</h2>
          <p className="link-signup">
            Or <Link to="/login">Back to Login</Link>
          </p>
          
          {/* Stage 1: Email Input */}
          {(!emailVerified && !resetStage) && (
            <div className="login-form-group">
              <input
                type="email"
                name="email"
                ref={emailRef}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder=" "
                required
              />
              <label htmlFor="email">Email</label>
            </div>
          )}

          {/* Stage 2: Recovery Code Input */}
          {(emailVerified && !resetStage) && (
            <div className="login-form-group">
              <input
                type="text"
                name="recoveryCode"
                ref={recoveryCodeRef}
                value={recoveryCode}
                onChange={(e) => setRecoveryCode(e.target.value)}
                placeholder=" "
                required
              />
              <label htmlFor="recoveryCode">Recovery Code</label>
            </div>
          )}

          {/* Stage 3: New Password and Confirm Password */}
          {resetStage && (
            <>
              <div className="login-form-group">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="newPassword"
                  ref={newPasswordRef}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder=" "
                  required
                />
                <label htmlFor="newPassword">New Password</label>
                <button
                  type="button"
                  className="toggle-password-login"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? '🙈' : '🐵'}
                </button>
              </div>
              <div className="login-form-group">
                <input
                  type="password"
                  name="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder=" "
                  required
                />
                <label htmlFor="confirmPassword">Confirm Password</label>
              </div>
            </>
          )}

          <button
            type="submit"
            className="login-btn"
            disabled={loading}
            style={{ cursor: loading ? 'not-allowed' : 'pointer' }}
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
                  height: '50px'
                }}
              />
            ) : (
              !emailVerified && !resetStage ? 'Verify Email' :
              (emailVerified && !resetStage) ? 'Verify Code' : 'Set New Password'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
