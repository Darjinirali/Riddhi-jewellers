import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FiLock, FiEye, FiEyeOff } from 'react-icons/fi';

export default function ResetPassword() {
  const [form, setForm] = useState({ newPassword: '', confirmPassword: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || '';
  const otp = location.state?.otp || '';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.newPassword !== form.confirmPassword) { toast.error('Passwords do not match'); return; }
    if (form.newPassword.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      await axios.post('/api/auth/reset-password', { email, otp, newPassword: form.newPassword });
      toast.success('Password reset successful!');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Reset failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <Link to="/" className="logo-link"><span>✦</span> Riddhi Jewellers</Link>
        <div style={{ textAlign: 'center', fontSize: '3rem', marginBottom: '16px' }}>🔑</div>
        <h2>New Password</h2>
        <p className="subtitle">Create a strong new password for your account.</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>New Password</label>
            <div style={{ position: 'relative' }}>
              <FiLock size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#666' }} />
              <input type={showPass ? 'text' : 'password'} placeholder="Minimum 6 characters" value={form.newPassword}
                onChange={e => setForm({ ...form, newPassword: e.target.value })} style={{ paddingLeft: '40px', paddingRight: '40px' }} required />
              <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#666', cursor: 'pointer' }}>
                {showPass ? <FiEyeOff size={16} /> : <FiEye size={16} />}
              </button>
            </div>
          </div>
          <div className="form-group">
            <label>Confirm Password</label>
            <input type="password" placeholder="Repeat new password" value={form.confirmPassword}
              onChange={e => setForm({ ...form, confirmPassword: e.target.value })} required />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '14px' }} disabled={loading}>
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>

        <div className="auth-footer">
          <Link to="/login">← Back to Login</Link>
        </div>
      </div>
    </div>
  );
}
