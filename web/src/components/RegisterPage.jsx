import { useState } from 'react';
import axios from 'axios';
import OTPVerificationPage from './OTPVerificationPage';

export default function RegisterPage() {
  const [step, setStep] = useState('register'); // register or verify
  const [userId, setUserId] = useState(null);
  const [verifyMethod, setVerifyMethod] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    password_confirmation: '',
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

    // Validate at least email or phone
    if (!formData.email && !formData.phone) {
      setMessage('Please provide either email or phone number');
      setMessageType('error');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post('http://localhost:8000/api/register', {
        name: formData.name,
        email: formData.email || null,
        phone: formData.phone || null,
        password: formData.password,
        password_confirmation: formData.password_confirmation,
      });

      setUserId(response.data.user.id);
      setVerifyMethod(response.data.verify_method);
      setStep('verify');
      setMessage(response.data.message);
      setMessageType('success');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Registration failed');
      setMessageType('error');
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
    <div className="register-container">
      <h2>Create Account</h2>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Full Name *</label>
          <input
            type="text"
            name="name"
            placeholder="John Doe"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Email (optional if phone provided)</label>
          <input
            type="email"
            name="email"
            placeholder="john@example.com"
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Phone Number (optional if email provided)</label>
          <input
            type="tel"
            name="phone"
            placeholder="+1 (555) 000-0000"
            value={formData.phone}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Password *</label>
          <input
            type="password"
            name="password"
            placeholder="Min 8 characters"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Confirm Password *</label>
          <input
            type="password"
            name="password_confirmation"
            placeholder="Confirm Password"
            value={formData.password_confirmation}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? 'Creating Account...' : 'Register'}
        </button>
      </form>

      {message && (
        <p className={`message ${messageType}`}>{message}</p>
      )}

      <p className="hint">
        * Email or phone number is required for account verification
      </p>
    </div>
  );
}