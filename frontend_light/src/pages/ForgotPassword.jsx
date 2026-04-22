import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FiMail } from 'react-icons/fi';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('/api/auth/forgot-password', { email });
      toast.success('OTP sent to your email!');
      navigate('/verify-otp', { state: { email, type: 'forgot' } });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error sending OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <Link to="/" className="logo-link"><span>✦</span> Riddhi Jewellers</Link>
        <div style={{ textAlign: 'center', fontSize: '3rem', marginBottom: '16px' }}>🔐</div>
        <h2>Forgot Password?</h2>
        <p className="subtitle">Enter your email and we'll send you an OTP to reset your password.</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email Address</label>
            <div style={{ position: 'relative' }}>
              <FiMail size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#666' }} />
              <input type="email" placeholder="your@email.com" value={email} onChange={e => setEmail(e.target.value)} style={{ paddingLeft: '40px' }} required />
            </div>
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '14px' }} disabled={loading}>
            {loading ? 'Sending OTP...' : 'Send OTP →'}
          </button>
        </form>

        <div className="auth-footer">
          Remember your password? <Link to="/login">Sign in</Link>
        </div>
      </div>
    </div>
  );
}
