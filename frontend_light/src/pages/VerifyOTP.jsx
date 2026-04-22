import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function VerifyOTP() {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);
  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const email = location.state?.email || '';
  const type = location.state?.type || 'register'; // 'register' or 'forgot'

  useEffect(() => {
    if (!email) navigate('/register');
    inputRefs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (resendTimer <= 0) return;
    const t = setTimeout(() => setResendTimer(r => r - 1), 1000);
    return () => clearTimeout(t);
  }, [resendTimer]);

  const handleChange = (i, val) => {
    if (!/^\d*$/.test(val)) return;
    const newOtp = [...otp];
    newOtp[i] = val.slice(-1);
    setOtp(newOtp);
    if (val && i < 5) inputRefs.current[i + 1]?.focus();
  };

  const handleKeyDown = (i, e) => {
    if (e.key === 'Backspace' && !otp[i] && i > 0) inputRefs.current[i - 1]?.focus();
  };

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length === 6) {
      setOtp(pasted.split(''));
      inputRefs.current[5]?.focus();
    }
  };

  const handleVerify = async () => {
    const otpStr = otp.join('');
    if (otpStr.length !== 6) { toast.error('Please enter the 6-digit OTP'); return; }
    setLoading(true);
    try {
      if (type === 'register') {
        const { data } = await axios.post('/api/auth/verify-register-otp', { email, otp: otpStr });
        login(data.user, data.token);
        toast.success(data.message);
        navigate('/');
      } else {
        await axios.post('/api/auth/verify-forgot-otp', { email, otp: otpStr });
        toast.success('OTP verified!');
        navigate('/reset-password', { state: { email, otp: otpStr } });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid OTP');
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      if (type === 'register') await axios.post('/api/auth/register', { email });
      else await axios.post('/api/auth/forgot-password', { email });
      toast.success('New OTP sent!');
      setResendTimer(60);
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } catch (err) {
      toast.error('Could not resend OTP');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card" style={{ textAlign: 'center' }}>
        <Link to="/" className="logo-link"><span>✦</span> Riddhi Jewellers</Link>
        <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📩</div>
        <h2>Verify OTP</h2>
        <p className="subtitle">We sent a 6-digit code to<br /><strong style={{ color: '#b8860b' }}>{email}</strong></p>

        <div className="otp-inputs" onPaste={handlePaste}>
          {otp.map((digit, i) => (
            <input key={i} ref={el => inputRefs.current[i] = el} type="text" maxLength={1}
              value={digit} onChange={e => handleChange(i, e.target.value)}
              onKeyDown={e => handleKeyDown(i, e)}
              style={{ caretColor: '#b8860b' }}
            />
          ))}
        </div>

        <button onClick={handleVerify} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '14px', marginBottom: '16px' }} disabled={loading || otp.join('').length !== 6}>
          {loading ? 'Verifying...' : 'Verify OTP'}
        </button>

        <p style={{ color: '#888', fontSize: '0.85rem' }}>
          Didn't receive it?{' '}
          {resendTimer > 0 ? (
            <span style={{ color: '#777' }}>Resend in {resendTimer}s</span>
          ) : (
            <button onClick={handleResend} style={{ background: 'none', border: 'none', color: '#b8860b', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }}>
              Resend OTP
            </button>
          )}
        </p>
      </div>
    </div>
  );
}
