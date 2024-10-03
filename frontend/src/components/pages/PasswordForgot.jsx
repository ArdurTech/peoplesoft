import React, { useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/PasswordResetPage.css';

const PasswordReset = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [step, setStep] = useState('request'); // 'request' or 'verify'
  const [message, setMessage] = useState('');
  const [showHeaderFooter, setShowHeaderFooter] = useState(true); // New state variable
  const history = useHistory();

  const handleRequestOtp = async () => {
    try {
      const response = await axios.post('/api/password/forgot', { email });
      if (response.data.success) {
        toast.success('OTP sent to your email!');
        setStep('verify'); // Move to OTP verification step
      } else {
        toast.error(response.data.message || 'Failed to send OTP.');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send OTP. Please try again.');
    }
  };

  const handleVerifyOtp = async () => {
    try {
      const response = await axios.post('/api/password/verify', { email, otp, newPassword });
      if (response.data.success) {
        toast.success('Password reset successful!');
        setShowHeaderFooter(false); // Hide header and footer
        setStep('redirect'); // Change step to show login button
      } else {
        toast.error(response.data.message || 'Failed to reset password.');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to reset password. Please try again.');
    }
  };

  const handleRedirectToLogin = () => {
    history.push('/login-page'); // Redirect to login page
  };

  return (
    <>
      {showHeaderFooter && <Header />} {/* Conditionally render Header */}
      <div className="password-page">
        <div className="password-reset-container">
          <h2>Password Reset</h2>
          {step === 'request' ? (
            <div>
              <h6>Enter Your Email Address To Reset Password</h6>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
              />
              <button onClick={handleRequestOtp}>Request OTP</button>
            </div>
          ) : step === 'verify' ? (
            <div>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter OTP"
              />
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
              />
              <button onClick={handleVerifyOtp}>Verify OTP and Reset Password</button>
            </div>
          ) : (
            <div className='log'>
              <p>{message}</p>
              <button onClick={handleRedirectToLogin}>Login</button>
            </div>
          )}
        </div>
      </div>
      {showHeaderFooter && <Footer />} {/* Conditionally render Footer */}
      <ToastContainer />
    </>
  );
};

const Header = () => (
  <header>
    {/* Your header content */}
  </header>
);

const Footer = () => (
  <footer className="footer">
    <div className="footer-content">
      <span>Contact us: 98765432112</span>
      <span>Email Address: info@ardurtechnology.com</span>
      <span>Address:Shivane ,Shivkamal Prestige ,pune-411023</span>
    </div>
  </footer>
);

export default PasswordReset;
