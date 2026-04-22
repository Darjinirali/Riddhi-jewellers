import { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

export function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const fmt = (n) => '₹' + Number(n).toLocaleString('en-IN');
  const statusColors = { placed: '#3b82f6', processing: '#f59e0b', shipped: '#8b5cf6', delivered: '#22c55e', cancelled: '#ef4444' };

  useEffect(() => {
    axios.get('/api/orders/admin/all').then(r => setOrders(r.data)).finally(() => setLoading(false));
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`/api/orders/admin/${id}/status`, { status });
      setOrders(prev => prev.map(o => o._id === id ? { ...o, orderStatus: status } : o));
      toast.success('Status updated');
    } catch { toast.error('Update failed'); }
  };

  return (
    <div style={{ padding: '40px' }}>
      <h1 style={{ fontFamily: 'Bodoni Moda', fontSize: '2rem', marginBottom: '32px' }}>All Orders</h1>
      {loading ? <div className="spinner" /> : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {orders.map(o => (
            <div key={o._id} style={{ background: 'var(--card-bg)', border: '1.5px solid #e8d9c0', borderRadius: '16px', padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <p style={{ color: '#b8860b', fontFamily: 'monospace', fontSize: '0.85rem' }}>#{o._id.slice(-10).toUpperCase()}</p>
                  <p style={{ color: '#777', fontSize: '0.82rem', marginTop: '2px' }}>{o.user?.name} • {o.user?.email}</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                  <span style={{ fontWeight: 700, color: '#b8860b' }}>{fmt(o.totalAmount)}</span>
                  <span style={{ color: '#777', fontSize: '0.8rem' }}>{o.paymentMethod === 'cod' ? 'COD' : 'Online'}</span>
                  <select value={o.orderStatus} onChange={e => updateStatus(o._id, e.target.value)}
                    style={{ background: '#e8d9c0', border: `1px solid ${statusColors[o.orderStatus] || '#333'}`, borderRadius: '20px', color: statusColors[o.orderStatus] || '#888', padding: '6px 14px', fontSize: '0.8rem', cursor: 'pointer', outline: 'none', fontWeight: 600 }}>
                    {['placed', 'processing', 'shipped', 'delivered', 'cancelled'].map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                  </select>
                  <span style={{ color: '#888', fontSize: '0.78rem' }}>{new Date(o.createdAt).toLocaleDateString('en-IN')}</span>
                </div>
              </div>
              <div style={{ marginTop: '14px', paddingTop: '14px', borderTop: '1px solid #e8d9c0', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {o.items.map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#f5efe6', borderRadius: '8px', padding: '6px 12px', fontSize: '0.78rem', color: '#777' }}>
                    <img src={item.image || 'https://via.placeholder.com/32'} alt="" style={{ width: '28px', height: '28px', borderRadius: '4px', objectFit: 'cover' }} />
                    {item.name} × {item.quantity}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/admin/users').then(r => setUsers(r.data)).finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!confirm('Delete this user?')) return;
    try { await axios.delete(`/api/admin/users/${id}`); setUsers(prev => prev.filter(u => u._id !== id)); toast.success('User deleted'); }
    catch { toast.error('Delete failed'); }
  };

  return (
    <div style={{ padding: '40px' }}>
      <h1 style={{ fontFamily: 'Bodoni Moda', fontSize: '2rem', marginBottom: '32px' }}>Users</h1>
      {loading ? <div className="spinner" /> : (
        <div style={{ background: 'var(--card-bg)', border: '1.5px solid #e8d9c0', borderRadius: '16px', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ background: '#f5efe6' }}>
                {['Name', 'Email', 'Phone', 'Joined', 'Verified', 'Actions'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '14px 16px', color: '#666', fontWeight: 500, fontSize: '0.8rem' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u._id} style={{ borderTop: '1px solid #e8d9c0' }}>
                  <td style={{ padding: '14px 16px', fontWeight: 500 }}>{u.name}</td>
                  <td style={{ padding: '14px 16px', color: '#777' }}>{u.email}</td>
                  <td style={{ padding: '14px 16px', color: '#777' }}>{u.phone || '—'}</td>
                  <td style={{ padding: '14px 16px', color: '#888', fontSize: '0.8rem' }}>{new Date(u.createdAt).toLocaleDateString('en-IN')}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{ color: u.isVerified ? '#22c55e' : '#f59e0b', fontSize: '0.8rem' }}>{u.isVerified ? '✓ Verified' : '⏳ Pending'}</span>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <button onClick={() => handleDelete(u._id)} style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444', padding: '6px 14px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.8rem' }}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
