import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function OTPVerificationPage({
  userId,
  email,
  phone,
  defaultMethod,
}) {
  const navigate = useNavigate();
  const [otp, setOtp] = useState('');
  const [method, setMethod] = useState(defaultMethod); // 'email' or 'phone'
  const [showMethodSelector, setShowMethodSelector] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [attemptsLeft, setAttemptsLeft] = useState(5);
  const [canResend, setCanResend] = useState(false);
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer(timer - 1), 1000);
      return () => clearInterval(interval);
    } else if (timer === 0 && !canResend) {
      setCanResend(true);
    }
  }, [timer, canResend]);

  const getContactDisplay = () => {
    if (method === 'email') {
      return email ? maskEmail(email) : 'your email';
    } else {
      return phone ? maskPhone(phone) : 'your phone';
    }
  };

  const maskEmail = (email) => {
    const [local, domain] = email.split('@');
    return local.substring(0, 2) + '***' + local.slice(-1) + '@' + domain;
  };

  const maskPhone = (phone) => {
    return '***' + phone.slice(-4);
  };

  const handleVerify = async (e) => {
    e.preventDefault();

    if (otp.length !== 6) {
      setMessage('Please enter a 6-digit code');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await axios.post('http://localhost:8000/api/verify-otp', {
        user_id: userId,
        code: otp,
        type: method,
      });

      localStorage.setItem('auth_token', response.data.auth_token);
      setMessage('✅ ' + response.data.message + ' Redirecting...');

      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (error) {
      const attempts = error.response?.data?.attempts_left;
      if (attempts !== undefined) {
        setAttemptsLeft(attempts);
      }
      setMessage('❌ ' + (error.response?.data?.message || 'Verification failed'));
    } finally {
      setLoading(false);
    }
  };

  const handleChangeMethod = async (newMethod) => {
    // Check if method is available
    if (newMethod === 'email' && !email) {
      setMessage('No email on file');
      return;
    }
    if (newMethod === 'phone' && !phone) {
      setMessage('No phone number on file');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await axios.post(
        'http://localhost:8000/api/select-verify-method',
        {
          user_id: userId,
          method: newMethod,
        }
      );

      setMethod(newMethod);
      setOtp('');
      setAttemptsLeft(5);
      setCanResend(false);
      setTimer(60);
      setShowMethodSelector(false);
      setMessage('✅ ' + response.data.message);
    } catch (error) {
      setMessage('❌ ' + (error.response?.data?.message || 'Failed to change method'));
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setLoading(true);
    setMessage('');
    setCanResend(false);
    setTimer(60);

    try {
      const response = await axios.post('http://localhost:8000/api/resend-otp', {
        user_id: userId,
        type: method,
      });

      setMessage('✅ ' + response.data.message);
      setOtp('');
      setAttemptsLeft(5);
    } catch (error) {
      setMessage('❌ ' + (error.response?.data?.message || 'Failed to resend'));
      setCanResend(true);
      setTimer(0);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="otp-verification-container">
      <h2>Verify Your Account</h2>
      <p>
        We sent a 6-digit code to <strong>{getContactDisplay()}</strong>
      </p>

      {!showMethodSelector ? (
        <>
          <form onSubmit={handleVerify}>
            <input
              type="text"
              maxLength="6"
              placeholder="000000"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              required
              className="otp-input"
              disabled={loading}
              autoComplete="off"
            />
            <button type="submit" disabled={loading || otp.length !== 6}>
              {loading ? 'Verifying...' : 'Verify Code'}
            </button>
          </form>

          {message && (
            <p className={message.includes('✅') ? 'success' : 'error'}>
              {message}
            </p>
          )}

          <p className="attempts-info">Attempts left: {attemptsLeft}</p>

          <div className="resend-section">
            {canResend ? (
              <button
                onClick={handleResend}
                disabled={loading}
                className="resend-btn"
              >
                Resend Code
              </button>
            ) : (
              <p>Resend code in {timer}s</p>
            )}
          </div>

          {/* Show method switcher if both email and phone exist */}
          {email && phone && (
            <button
              type="button"
              onClick={() => setShowMethodSelector(true)}
              className="switch-method-btn"
            >
              Use {method === 'email' ? 'Phone Number' : 'Email'} Instead
            </button>
          )}
        </>
      ) : (
        <div className="method-selector">
          <h3>Choose Verification Method</h3>

          {email && (
            <button
              onClick={() => handleChangeMethod('email')}
              disabled={loading}
              className={`method-btn ${method === 'email' ? 'active' : ''}`}
            >
              📧 Email ({maskEmail(email)})
            </button>
          )}

          {phone && (
            <button
              onClick={() => handleChangeMethod('phone')}
              disabled={loading}
              className={`method-btn ${method === 'phone' ? 'active' : ''}`}
            >
              📱 Phone ({maskPhone(phone)})
            </button>
          )}

          {message && (
            <p className={message.includes('✅') ? 'success' : 'error'}>
              {message}
            </p>
          )}

          <button
            onClick={() => setShowMethodSelector(false)}
            className="back-btn"
          >
            Back
          </button>
        </div>
      )}
    </div>
  );
}