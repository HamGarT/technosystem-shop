import { useState } from 'react';
import axios from 'axios';
import OTPVerificationPage from './OTPVerificationPage';

export default function LoginPage() {
  const [step, setStep] = useState('login'); // login or verify
  const [userId, setUserId] = useState(null);
  const [verifyMethod, setVerifyMethod] = useState(null);
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await axios.post('http://localhost:8000/api/login', {
        email: formData.email || null,
        phone: formData.phone || null,
        password: formData.password,
      });

      localStorage.setItem('auth_token', response.data.auth_token);
      setMessage('✅ ' + response.data.message);
      setMessageType('success');

      // Redirect to dashboard
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 1000);
    } catch (error) {
      if (error.response?.status === 403) {
        // Not verified
        setUserId(error.response.data.user_id);
        setVerifyMethod(error.response.data.verify_method);
        setStep('verify');
        setMessage(error.response.data.message);
      } else {
        setMessage(error.response?.data?.message || 'Login failed');
        setMessageType('error');
      }
    } finally {
      setLoading(false);
    }
  };

  if (step === 'verify') {
    return (
      <OTPVerificationPage
        userId={userId}
        email={formData.email}
        phone={formData.phone}
        defaultMethod={verifyMethod}
      />
    );
  }

  return (
    <div className="login-container">
      <h2>Login</h2>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email or Phone</label>
          <input
            type="text"
            placeholder="Enter email or phone number"
            value={formData.email || formData.phone}
            onChange={(e) => {
              const value = e.target.value;
              if (value.includes('@')) {
                setFormData({ ...formData, email: value, phone: '' });
              } else {
                setFormData({ ...formData, phone: value, email: '' });
              }
            }}
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      {message && (
        <p className={`message ${messageType}`}>{message}</p>
      )}
    </div>
  );
}