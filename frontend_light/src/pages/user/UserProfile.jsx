import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { FiUser, FiPhone, FiMapPin, FiSave } from 'react-icons/fi';

export default function UserProfile() {
  const { user, fetchUser } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: {
      street: user?.address?.street || '',
      city: user?.address?.city || '',
      state: user?.address?.state || '',
      pincode: user?.address?.pincode || '',
    },
  });
  const [loading, setLoading] = useState(false);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const setAddr = (k) => (e) => setForm({ ...form, address: { ...form.address, [k]: e.target.value } });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.put('/api/auth/update-profile', form);
      await fetchUser();
      toast.success('Profile updated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ paddingTop: '70px', minHeight: '100vh', background: '#fdf9f4' }}>
      <div style={{ maxWidth: '700px', margin: '0 auto', padding: '40px 5%' }}>
        <h1 style={{ fontFamily: 'Bodoni Moda', fontSize: '2rem', marginBottom: '32px' }}>My Profile</h1>

        {/* Avatar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '40px', padding: '24px', background: 'var(--card-bg)', border: '1.5px solid #e8d9c0', borderRadius: '16px' }}>
          <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'rgba(184,134,11,0.1)', border: '2px solid rgba(184,134,11,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FiUser size={28} color="#d4af37" />
          </div>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 600 }}>{user?.name}</h3>
            <p style={{ color: '#777', fontSize: '0.88rem', marginTop: '4px' }}>{user?.email}</p>
            <span style={{ background: 'rgba(184,134,11,0.1)', color: '#b8860b', border: '1px solid rgba(184,134,11,0.3)', padding: '3px 10px', borderRadius: '20px', fontSize: '0.72rem', fontWeight: 600, marginTop: '6px', display: 'inline-block' }}>
              ✦ Member
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ background: 'var(--card-bg)', border: '1.5px solid #e8d9c0', borderRadius: '16px', padding: '28px', marginBottom: '24px' }}>
            <h3 style={{ color: '#b8860b', fontSize: '0.85rem', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FiUser size={14} /> Personal Info
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group"><label>Full Name</label><input type="text" value={form.name} onChange={set('name')} /></div>
              <div className="form-group"><label>Phone Number</label><input type="tel" value={form.phone} onChange={set('phone')} /></div>
            </div>
          </div>

          <div style={{ background: 'var(--card-bg)', border: '1.5px solid #e8d9c0', borderRadius: '16px', padding: '28px', marginBottom: '24px' }}>
            <h3 style={{ color: '#b8860b', fontSize: '0.85rem', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FiMapPin size={14} /> Saved Address
            </h3>
            <div className="form-group"><label>Street Address</label><input type="text" value={form.address.street} onChange={setAddr('street')} placeholder="House no., Street, Area" /></div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
              <div className="form-group"><label>City</label><input type="text" value={form.address.city} onChange={setAddr('city')} /></div>
              <div className="form-group"><label>State</label><input type="text" value={form.address.state} onChange={setAddr('state')} /></div>
              <div className="form-group"><label>Pincode</label><input type="text" value={form.address.pincode} onChange={setAddr('pincode')} /></div>
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ padding: '13px 32px', display: 'flex', alignItems: 'center', gap: '8px' }} disabled={loading}>
            <FiSave size={16} /> {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
}
