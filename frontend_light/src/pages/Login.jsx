import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post('/api/auth/login', form);
      login(data.user, data.token);
      toast.success(`Welcome back, ${data.user.name}!`);
      navigate(data.user.role === 'admin' ? '/admin' : '/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <Link to="/" className="logo-link">
          <span>✦</span> Riddhi Jewellers
        </Link>
        <h2>Welcome Back</h2>
        <p className="subtitle">Sign in to your account</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email Address</label>
            <div style={{ position: 'relative' }}>
              <FiMail size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#666' }} />
              <input type="email" placeholder="your@email.com" value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                style={{ paddingLeft: '40px' }} required />
            </div>
          </div>
          <div className="form-group">
            <label>Password</label>
            <div style={{ position: 'relative' }}>
              <FiLock size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#666' }} />
              <input type={showPass ? 'text' : 'password'} placeholder="Enter password" value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                style={{ paddingLeft: '40px', paddingRight: '40px' }} required />
              <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#666', cursor: 'pointer' }}>
                {showPass ? <FiEyeOff size={16} /> : <FiEye size={16} />}
              </button>
            </div>
          </div>
          <div style={{ textAlign: 'right', marginBottom: '24px', marginTop: '-10px' }}>
            <Link to="/forgot-password" style={{ color: '#b8860b', fontSize: '0.82rem' }}>Forgot password?</Link>
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '14px' }} disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="auth-footer">
          Don't have an account? <Link to="/register">Create one</Link>
        </div>
      </div>
    </div>
  );
}
