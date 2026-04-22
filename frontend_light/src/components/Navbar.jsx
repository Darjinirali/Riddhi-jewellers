import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { FiShoppingBag, FiUser, FiMenu, FiX, FiLogOut, FiSettings, FiPackage } from 'react-icons/fi';
import logo from '../assets/logo.png';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);
  const { user, logout } = useAuth();
  const { cartCount, setCartOpen } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  useEffect(() => {
    setMenuOpen(false);
    setDropOpen(false);
  }, [location.pathname]);

  const handleLogout = () => { logout(); navigate('/'); setDropOpen(false); setMenuOpen(false); };

  const navStyle = {
    position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
    background: scrolled || !isHome || menuOpen
      ? 'rgba(255,253,249,0.97)'
      : 'rgba(255,253,249,0.85)',
    borderBottom: scrolled || !isHome ? '1px solid #e8d9c0' : '1px solid transparent',
    backdropFilter: 'blur(20px)',
    transition: 'all 0.3s ease',
    padding: '0 5%',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    height: '80px',
    width: '100%',
    maxWidth: '100vw',
    boxSizing: 'border-box',
    boxShadow: scrolled ? '0 2px 16px rgba(0,0,0,0.06)' : 'none',
  };

  const navLinks = [['/', 'Home'], ['/collections', 'Collections'], ['/about', 'About'], ['/contact', 'Contact']];

  return (
    <>
      <nav style={navStyle}>

        {/* ── LOGO ── */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '4px', textDecoration: 'none', zIndex: 1001 }}>
          <img
            src={logo}
            alt="Riddhi Jewellers"
            style={{
              height: '75px',
              width: 'auto',
              objectFit: 'contain',
              display: 'block',
              flexShrink: 0,
            }}
          />
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', lineHeight: 1, gap: '4px' }}>
            <span style={{
              fontFamily: "'Bodoni Moda', serif",
              fontSize: '1.55rem',
              color: '#1a1a1a',
              fontWeight: 700,
              letterSpacing: '7px',
              textTransform: 'uppercase',
              display: 'block',
            }}>Riddhi</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <div style={{ height: '1px', width: '14px', background: '#b8860b' }} />
              <span style={{
                fontFamily: "'Bodoni Moda', serif",
                fontSize: '0.52rem',
                color: '#b8860b',
                fontWeight: 400,
                letterSpacing: '5px',
                textTransform: 'uppercase',
              }}>Jewellers</span>
              <div style={{ height: '1px', width: '14px', background: '#b8860b' }} />
            </div>
          </div>
        </Link>

        {/* ── DESKTOP NAV LINKS ── */}
        <div className="desktop-nav" style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
          {navLinks.map(([path, label]) => (
            <Link key={path} to={path} style={{
              color: location.pathname === path ? '#b8860b' : '#555',
              fontSize: '0.88rem', fontWeight: location.pathname === path ? 600 : 400, letterSpacing: '0.5px',
              transition: 'color 0.2s', textDecoration: 'none',
            }}
              onMouseEnter={e => e.target.style.color = '#b8860b'}
              onMouseLeave={e => e.target.style.color = location.pathname === path ? '#b8860b' : '#555'}
            >{label}</Link>
          ))}
        </div>

        {/* ── RIGHT ICONS ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', zIndex: 1001 }}>
          <button onClick={() => setCartOpen(true)} style={{
            background: 'none', border: 'none', cursor: 'pointer', color: '#333',
            position: 'relative', padding: '4px',
          }}>
            <FiShoppingBag size={22} />
            {cartCount > 0 && (
              <span style={{
                position: 'absolute', top: '-4px', right: '-6px',
                background: '#b8860b', color: '#fff', borderRadius: '50%',
                width: '18px', height: '18px', fontSize: '0.7rem', fontWeight: 700,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>{cartCount}</span>
            )}
          </button>

          {user ? (
            <div className="desktop-nav" style={{ position: 'relative' }}>
              <button onClick={() => setDropOpen(!dropOpen)} style={{
                background: 'rgba(184,134,11,0.08)', border: '1px solid rgba(184,134,11,0.25)',
                borderRadius: '50%', width: '36px', height: '36px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', color: '#b8860b',
              }}>
                <FiUser size={16} />
              </button>
              {dropOpen && (
                <div style={{
                  position: 'absolute', right: 0, top: '48px',
                  background: '#fff', border: '1px solid #e8d9c0', borderRadius: '12px',
                  minWidth: '200px', padding: '8px 0', zIndex: 1001,
                  boxShadow: '0 16px 40px rgba(0,0,0,0.12)',
                }}>
                  <div style={{ padding: '12px 16px', borderBottom: '1px solid #f0e8d8' }}>
                    <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#1a1a1a' }}>{user.name}</div>
                    <div style={{ fontSize: '0.75rem', color: '#999', marginTop: '2px' }}>{user.email}</div>
                  </div>
                  {user.role === 'admin' ? (
                    <DropItem icon={<FiSettings size={14} />} label="Admin Panel" onClick={() => { navigate('/admin'); setDropOpen(false); }} />
                  ) : (
                    <>
                      <DropItem icon={<FiUser size={14} />} label="My Profile" onClick={() => { navigate('/user/profile'); setDropOpen(false); }} />
                      <DropItem icon={<FiPackage size={14} />} label="My Orders" onClick={() => { navigate('/user/orders'); setDropOpen(false); }} />
                    </>
                  )}
                  <DropItem icon={<FiLogOut size={14} />} label="Logout" onClick={handleLogout} danger />
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="desktop-nav" style={{
              background: '#b8860b', color: '#fff', padding: '8px 20px',
              borderRadius: '20px', fontSize: '0.85rem', fontWeight: 600,
              textDecoration: 'none',
            }}>Login</Link>
          )}

          <button
            className="mobile-menu-btn"
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: '#333', padding: '4px', display: 'none', zIndex: 1001,
            }}
          >
            {menuOpen ? <FiX size={26} /> : <FiMenu size={26} />}
          </button>
        </div>
      </nav>

      {/* Overlay */}
      <div onClick={() => setMenuOpen(false)} style={{
        position: 'fixed', inset: 0, zIndex: 998,
        background: 'rgba(0,0,0,0.35)',
        opacity: menuOpen ? 1 : 0,
        pointerEvents: menuOpen ? 'all' : 'none',
        transition: 'opacity 0.3s',
        display: 'none',
      }} className="mobile-overlay" />

      {/* Slide-in Mobile Panel */}
      <div className="mobile-panel" style={{
        position: 'fixed', top: 0, right: 0, bottom: 0,
        width: '75%', maxWidth: '300px',
        background: '#fff', zIndex: 999,
        transform: menuOpen ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.35s ease',
        display: 'none', flexDirection: 'column',
        paddingTop: '80px',
        borderLeft: '1px solid #e8d9c0',
        overflowY: 'auto',
        boxShadow: '-8px 0 30px rgba(0,0,0,0.1)',
      }}>
        {/* Mobile panel logo */}
        <div style={{ padding: '0 24px 16px', borderBottom: '1px solid #f0e8d8', marginBottom: '8px', display: 'flex', alignItems: 'center' }}>
          <img src={logo} alt="Riddhi Jewellers" style={{ height: '36px', width: 'auto', objectFit: 'contain' }} />
        </div>

        {user && (
          <div style={{ padding: '16px 24px', borderBottom: '1px solid #f0e8d8', marginBottom: '8px' }}>
            <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#1a1a1a' }}>{user.name}</div>
            <div style={{ fontSize: '0.78rem', color: '#999', marginTop: '2px' }}>{user.email}</div>
          </div>
        )}

        {navLinks.map(([path, label]) => (
          <Link key={path} to={path} onClick={() => setMenuOpen(false)} style={{
            padding: '16px 24px',
            color: location.pathname === path ? '#b8860b' : '#444',
            fontSize: '1rem', fontWeight: location.pathname === path ? 600 : 400,
            textDecoration: 'none',
            borderBottom: '1px solid #f5efe6',
            display: 'block',
          }}>{label}</Link>
        ))}

        <div style={{ marginTop: '8px' }}>
          {user ? (
            <>
              {user.role === 'admin' ? (
                <button onClick={() => { navigate('/admin'); setMenuOpen(false); }} style={mobileBtn}>
                  <FiSettings size={16} /> Admin Panel
                </button>
              ) : (
                <>
                  <button onClick={() => { navigate('/user/profile'); setMenuOpen(false); }} style={mobileBtn}>
                    <FiUser size={16} /> My Profile
                  </button>
                  <button onClick={() => { navigate('/user/orders'); setMenuOpen(false); }} style={mobileBtn}>
                    <FiPackage size={16} /> My Orders
                  </button>
                </>
              )}
              <button onClick={handleLogout} style={{ ...mobileBtn, color: '#dc2626' }}>
                <FiLogOut size={16} /> Logout
              </button>
            </>
          ) : (
            <Link to="/login" onClick={() => setMenuOpen(false)} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '16px 24px',
              background: '#b8860b', color: '#fff',
              padding: '14px', borderRadius: '10px',
              fontWeight: 700, fontSize: '0.9rem', textDecoration: 'none',
            }}>Login / Register</Link>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
          .mobile-overlay { display: block !important; }
          .mobile-panel { display: flex !important; }
        }
      `}</style>
    </>
  );
}

const mobileBtn = {
  width: '100%', background: 'none', border: 'none',
  padding: '14px 24px', display: 'flex', alignItems: 'center', gap: '12px',
  color: '#444', cursor: 'pointer', fontSize: '0.92rem',
  borderBottom: '1px solid #f5efe6', textAlign: 'left',
  fontFamily: 'Montserrat, sans-serif',
};

function DropItem({ icon, label, onClick, danger }) {
  return (
    <button onClick={onClick} style={{
      width: '100%', background: 'none', border: 'none', padding: '10px 16px',
      display: 'flex', alignItems: 'center', gap: '10px',
      color: danger ? '#dc2626' : '#444', cursor: 'pointer', fontSize: '0.88rem',
      transition: 'background 0.2s', textAlign: 'left',
    }}
      onMouseEnter={e => e.currentTarget.style.background = '#faf5ea'}
      onMouseLeave={e => e.currentTarget.style.background = 'none'}
    >
      {icon} {label}
    </button>
  );
}