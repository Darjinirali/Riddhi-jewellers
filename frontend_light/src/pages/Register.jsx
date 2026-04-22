import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FiUser, FiMail, FiLock, FiPhone, FiEye, FiEyeOff } from 'react-icons/fi';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) { toast.error('Passwords do not match'); return; }
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      await axios.post('/api/auth/register', { name: form.name, email: form.email, phone: form.phone, password: form.password });
      toast.success('OTP sent to your email!');
      navigate('/verify-otp', { state: { email: form.email, type: 'register' } });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  return (
    <div className="auth-page">
      <div className="auth-card" style={{ maxWidth: '500px' }}>
        <Link to="/" className="logo-link"><span>✦</span> Riddhi Jewellers</Link>
        <h2>Create Account</h2>
        <p className="subtitle">Join our exclusive jewellery family</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <div style={{ position: 'relative' }}>
              <FiUser size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#666' }} />
              <input type="text" placeholder="Your full name" value={form.name} onChange={set('name')} style={{ paddingLeft: '40px' }} required />
            </div>
          </div>
          <div className="form-group">
            <label>Email Address</label>
            <div style={{ position: 'relative' }}>
              <FiMail size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#666' }} />
              <input type="email" placeholder="your@email.com" value={form.email} onChange={set('email')} style={{ paddingLeft: '40px' }} required />
            </div>
          </div>
          <div className="form-group">
            <label>Phone Number</label>
            <div style={{ position: 'relative' }}>
              <FiPhone size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#666' }} />
              <input type="tel" placeholder="+91 98765 43210" value={form.phone} onChange={set('phone')} style={{ paddingLeft: '40px' }} />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label>Password</label>
              <div style={{ position: 'relative' }}>
                <FiLock size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#666' }} />
                <input type={showPass ? 'text' : 'password'} placeholder="Min 6 chars" value={form.password} onChange={set('password')} style={{ paddingLeft: '40px', paddingRight: '40px' }} required />
                <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#666', cursor: 'pointer' }}>
                  {showPass ? <FiEyeOff size={14} /> : <FiEye size={14} />}
                </button>
              </div>
            </div>
            <div className="form-group">
              <label>Confirm Password</label>
              <input type="password" placeholder="Repeat password" value={form.confirmPassword} onChange={set('confirmPassword')} required />
            </div>
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '14px', marginTop: '8px' }} disabled={loading}>
            {loading ? 'Sending OTP...' : 'Create Account →'}
          </button>
        </form>

        <div className="auth-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </div>
      </div>
    </div>
  );
}
