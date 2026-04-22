import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { FiPackage, FiUser, FiClock, FiCheckCircle, FiXCircle, FiTruck } from 'react-icons/fi';

export default function UserOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState('');
  const { user } = useAuth();
  const fmt = (n) => '₹' + Number(n).toLocaleString('en-IN');

  useEffect(() => {
    axios.get('/api/orders/my-orders')
      .then(r => setOrders(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleCancel = async (id) => {
    if (!confirm('Cancel this order?')) return;
    setCancelling(id);
    try {
      await axios.put(`/api/orders/${id}/cancel`, { reason: 'Cancelled by user' });
      setOrders(prev => prev.map(o => o._id === id ? { ...o, orderStatus: 'cancelled' } : o));
    } catch {} finally { setCancelling(''); }
  };

  const statusConfig = {
    placed: { color: '#3b82f6', icon: <FiClock size={14} />, label: 'Order Placed' },
    processing: { color: '#f59e0b', icon: <FiClock size={14} />, label: 'Processing' },
    shipped: { color: '#8b5cf6', icon: <FiTruck size={14} />, label: 'Shipped' },
    delivered: { color: '#22c55e', icon: <FiCheckCircle size={14} />, label: 'Delivered' },
    cancelled: { color: '#ef4444', icon: <FiXCircle size={14} />, label: 'Cancelled' },
  };

  return (
    <div style={{ paddingTop: '70px', minHeight: '100vh', background: '#fdf9f4' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 5%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <h1 style={{ fontFamily: 'Bodoni Moda', fontSize: '2rem' }}>My Orders</h1>
          <Link to="/collections" className="btn btn-outline" style={{ fontSize: '0.85rem', padding: '10px 20px' }}>Shop More →</Link>
        </div>

        {loading ? <div className="spinner" /> : orders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: '#666' }}>
            <FiPackage size={48} style={{ marginBottom: '16px', opacity: 0.3 }} />
            <p style={{ marginBottom: '20px' }}>No orders yet</p>
            <Link to="/collections" className="btn btn-primary">Start Shopping</Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {orders.map(order => {
              const st = statusConfig[order.orderStatus] || statusConfig.placed;
              return (
                <div key={order._id} style={{ background: 'var(--card-bg)', border: '1.5px solid #e8d9c0', borderRadius: '16px', padding: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
                    <div>
                      <p style={{ fontSize: '0.75rem', color: '#888', marginBottom: '4px' }}>ORDER ID</p>
                      <p style={{ fontFamily: 'monospace', fontSize: '0.85rem', color: '#b8860b' }}>#{order._id.slice(-10).toUpperCase()}</p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: `rgba(${st.color.includes('22c55e') ? '34,197,94' : st.color.includes('ef4444') ? '239,68,68' : st.color.includes('3b82f6') ? '59,130,246' : '245,158,11'},0.1)`, color: st.color, padding: '6px 14px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
                      {st.icon} {st.label}
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ color: '#777', fontSize: '0.75rem', marginBottom: '4px' }}>{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                      <p style={{ color: '#b8860b', fontWeight: 700, fontSize: '1.1rem' }}>{fmt(order.totalAmount)}</p>
                    </div>
                  </div>

                  {/* Items preview */}
                  <div style={{ display: 'flex', gap: '10px', marginBottom: '16px', flexWrap: 'wrap' }}>
                    {order.items.slice(0, 4).map((item, idx) => (
                      <div key={idx} style={{ position: 'relative' }}>
                        <img src={item.image || 'https://via.placeholder.com/64'} alt={item.name}
                          style={{ width: '64px', height: '64px', borderRadius: '8px', objectFit: 'cover', border: '1px solid #eadbc8' }} />
                        {item.quantity > 1 && (
                          <span style={{ position: 'absolute', top: '-6px', right: '-6px', background: '#b8860b', color: '#000', borderRadius: '50%', width: '18px', height: '18px', fontSize: '0.65rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {item.quantity}
                          </span>
                        )}
                      </div>
                    ))}
                    {order.items.length > 4 && <div style={{ width: '64px', height: '64px', borderRadius: '8px', background: '#e8d9c0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#777', fontSize: '0.8rem' }}>+{order.items.length - 4}</div>}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', paddingTop: '16px', borderTop: '1px solid #e8d9c0' }}>
                    <div style={{ display: 'flex', gap: '8px', fontSize: '0.8rem' }}>
                      <span style={{ color: order.paymentStatus === 'paid' ? '#22c55e' : '#f59e0b' }}>
                        {order.paymentStatus === 'paid' ? '✓ Paid' : '⏳ Payment Pending'}
                      </span>
                      <span style={{ color: '#555' }}>|</span>
                      <span style={{ color: '#777' }}>{order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}</span>
                    </div>
                    {['placed', 'processing'].includes(order.orderStatus) && (
                      <button onClick={() => handleCancel(order._id)} disabled={cancelling === order._id}
                        style={{ background: 'none', border: '1px solid #ef4444', color: '#ef4444', padding: '6px 16px', borderRadius: '20px', cursor: 'pointer', fontSize: '0.8rem', transition: 'all 0.2s' }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'none'; }}
                      >
                        {cancelling === order._id ? 'Cancelling...' : 'Cancel Order'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
