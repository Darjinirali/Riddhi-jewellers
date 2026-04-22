import { useEffect, useState } from 'react';
import { Link, useNavigate, Outlet, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { FiGrid, FiPackage, FiShoppingBag, FiUsers, FiLogOut, FiList } from 'react-icons/fi';

export function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const handleLogout = () => { logout(); navigate('/'); };

  const links = [
    { path: '/admin', icon: <FiGrid size={18} />, label: 'Dashboard', exact: true },
    { path: '/admin/collections', icon: <FiList size={18} />, label: 'Collections' },
    { path: '/admin/products', icon: <FiShoppingBag size={18} />, label: 'Products' },
    { path: '/admin/orders', icon: <FiPackage size={18} />, label: 'Orders' },
    { path: '/admin/users', icon: <FiUsers size={18} />, label: 'Users' },
    { path: '/admin/messages', icon: <FiUsers size={18} />, label: 'messages' },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <aside style={{ width: '240px', background: '#fffdf9', borderRight: '1px solid #e8d9c0', display: 'flex', flexDirection: 'column', position: 'fixed', top: 0, bottom: 0, left: 0, zIndex: 100 }}>
        <div style={{ padding: '24px 20px', borderBottom: '1px solid #f0e8d8' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: '#b8860b', fontSize: '1.2rem' }}>✦</span>
            <span style={{ fontFamily: 'Bodoni Moda', color: '#b8860b', fontSize: '1.1rem' }}>Riddhi Admin</span>
          </div>
          <p style={{ color: '#666', fontSize: '0.75rem', marginTop: '6px' }}>{user?.email}</p>
        </div>
        <nav style={{ padding: '16px 12px', flex: 1 }}>
          {links.map(l => {
            const active = l.exact ? location.pathname === l.path : location.pathname.startsWith(l.path) && l.path !== '/admin';
            const exactActive = l.exact && location.pathname === '/admin';
            const isActive = active || exactActive;
            return (
              <Link key={l.path} to={l.path} style={{
                display: 'flex', alignItems: 'center', gap: '12px', padding: '11px 14px',
                borderRadius: '10px', marginBottom: '4px', fontSize: '0.88rem',
                background: isActive ? 'rgba(184,134,11,0.12)' : 'transparent',
                color: isActive ? '#b8860b' : '#777',
                border: isActive ? '1px solid rgba(184,134,11,0.2)' : '1px solid transparent',
                transition: 'all 0.2s', textDecoration: 'none', fontWeight: isActive ? 600 : 400,
              }}>
                {l.icon} {l.label}
              </Link>
            );
          })}
        </nav>
        <div style={{ padding: '16px 12px', borderTop: '1px solid #e8d9c0' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 14px', color: '#777', fontSize: '0.85rem', textDecoration: 'none', marginBottom: '4px' }}>
            ← View Store
          </Link>
          <button onClick={handleLogout} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 14px', background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '0.85rem', borderRadius: '8px' }}>
            <FiLogOut size={16} /> Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main style={{ marginLeft: '240px', flex: 1, background: '#fdf9f4', minHeight: '100vh' }}>
        <Outlet />
      </main>
    </div>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const fmt = (n) => '₹' + Number(n).toLocaleString('en-IN');

  useEffect(() => {
    axios.get('/api/admin/dashboard').then(r => setStats(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ padding: '40px' }}><div className="spinner" /></div>;

  const cards = [
    { label: 'Total Revenue', value: fmt(stats?.totalRevenue || 0), icon: '💰', color: '#b8860b' },
    { label: 'Total Orders', value: stats?.totalOrders || 0, icon: '📦', color: '#8b5cf6' },
    { label: 'Total Products', value: stats?.totalProducts || 0, icon: '💎', color: '#3b82f6' },
    { label: 'Total Users', value: stats?.totalUsers || 0, icon: '👥', color: '#22c55e' },
  ];

  const statusColors = { placed: '#3b82f6', processing: '#f59e0b', shipped: '#8b5cf6', delivered: '#22c55e', cancelled: '#ef4444' };

  return (
    <div style={{ padding: '40px' }}>
      <h1 style={{ fontFamily: 'Bodoni Moda', fontSize: '2rem', marginBottom: '32px' }}>
        Dashboard <span style={{ color: '#b8860b' }}>✦</span>
      </h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px', marginBottom: '40px' }}>
        {cards.map(c => (
          <div key={c.label} style={{ background: 'var(--card-bg)', border: '1.5px solid #e8d9c0', borderRadius: '16px', padding: '24px' }}>
            <div style={{ fontSize: '2rem', marginBottom: '12px' }}>{c.icon}</div>
            <p style={{ color: '#888', fontSize: '0.8rem', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '6px' }}>{c.label}</p>
            <p style={{ fontSize: '1.8rem', fontWeight: 700, color: c.color, fontFamily: 'Bodoni Moda' }}>{c.value}</p>
          </div>
        ))}
      </div>

      <div style={{ background: 'var(--card-bg)', border: '1.5px solid #e8d9c0', borderRadius: '16px', padding: '24px' }}>
        <h3 style={{ marginBottom: '20px', fontSize: '1rem', color: '#b8860b', letterSpacing: '1px' }}>RECENT ORDERS</h3>
        {stats?.recentOrders?.length === 0 ? (
          <p style={{ color: '#666', textAlign: 'center', padding: '40px 0' }}>No orders yet</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #f0e8d8' }}>
                {['Order ID', 'Customer', 'Amount', 'Status', 'Date'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '10px 12px', color: '#666', fontWeight: 500 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {stats?.recentOrders?.map(o => (
                <tr key={o._id} style={{ borderBottom: '1px solid #111' }}>
                  <td style={{ padding: '12px', color: '#b8860b', fontFamily: 'monospace', fontSize: '0.8rem' }}>#{o._id.slice(-8).toUpperCase()}</td>
                  <td style={{ padding: '12px' }}>{o.user?.name || 'Unknown'}</td>
                  <td style={{ padding: '12px', fontWeight: 600 }}>{fmt(o.totalAmount)}</td>
                  <td style={{ padding: '12px' }}>
                    <span style={{ background: `rgba(${o.orderStatus === 'delivered' ? '34,197,94' : o.orderStatus === 'cancelled' ? '239,68,68' : '59,130,246'},0.1)`, color: statusColors[o.orderStatus] || '#888', padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600 }}>
                      {o.orderStatus.charAt(0).toUpperCase() + o.orderStatus.slice(1)}
                    </span>
                  </td>
                  <td style={{ padding: '12px', color: '#888' }}>{new Date(o.createdAt).toLocaleDateString('en-IN')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
