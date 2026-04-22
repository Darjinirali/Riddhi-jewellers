import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Footer() {
  const [collections, setCollections] = useState([]);

  useEffect(() => {
    axios.get('/api/collections').then(r => setCollections(r.data)).catch(() => {});
  }, []);

  return (
    <footer style={{ 
      background: '#faf8f5',
      color: '#222', 
      padding: '80px 5% 40px',
      borderTop: '1px solid #e8dcc8'
    }}>
      
      <div style={{ 
        maxWidth: '1280px', 
        margin: '0 auto',
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',   // ← Sirf yeh line change ki hai
        gap: '50px',
        alignItems: 'start'
      }}>
        
        {/* Brand */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <span style={{ color: '#b8860b', fontSize: '1.5rem' }}>✦</span>
            <span style={{ fontFamily: 'Bodoni Moda', fontSize: '1.45rem', color: '#222' }}>
              Riddhi Jewellers
            </span>
          </div>
          <p style={{ color: '#666', lineHeight: 1.7, fontSize: '0.92rem' }}>
            Crafting memories since 1995. Your trusted partner for exquisite jewelry in Ahmedabad.
          </p>

          {/* Trust badges under brand name */}
          <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {[
              { icon: '🏅', text: 'BIS Hallmark Certified' },
              { icon: '🔒', text: 'Secure Online Payments' },
              { icon: '🚚', text: 'Insured Delivery' },
            ].map(({ icon, text }) => (
              <div key={text} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: '#777' }}>
                <span>{icon}</span><span>{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Collections - Auto Fetch */}
        <div>
          <h4 style={{ 
            color: '#b8860b', 
            marginBottom: '18px', 
            fontSize: '0.9rem', 
            letterSpacing: '2px', 
            textTransform: 'uppercase',
            fontWeight: 600
          }}>
            Collections
          </h4>
          <ul style={{ 
            listStyle: 'none', 
            padding: 0, 
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '12px 24px'
          }}>
            {collections.map(col => (
              <li key={col._id}>
                <Link
                  to={`/collections/${col.slug}`}
                  style={{ color: '#555', fontSize: '0.9rem', textDecoration: 'none' }}
                  onMouseEnter={e => e.target.style.color = '#b8860b'}
                  onMouseLeave={e => e.target.style.color = '#444'}
                >
                  {col.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Quick Links */}
        <div>
          <h4 style={{ 
            color: '#b8860b', 
            marginBottom: '18px', 
            fontSize: '0.9rem', 
            letterSpacing: '2px', 
            textTransform: 'uppercase',
            fontWeight: 600
          }}>
            Quick Links
          </h4>
          <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[['/', 'Home'], ['/about', 'About Us'], ['/contact', 'Contact'], ['/login', 'Login']].map(([path, label]) => (
              <li key={path}>
                <Link
                  to={path}
                  style={{ color: '#555', fontSize: '0.9rem', textDecoration: 'none' }}
                  onMouseEnter={e => e.target.style.color = '#b8860b'}
                  onMouseLeave={e => e.target.style.color = '#444'}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div style={{
          background: 'var(--card-bg)',
          padding: '32px 28px',
          borderRadius: '16px',
          boxShadow: '0 8px 25px rgba(0,0,0,0.08)',
          border: '1px solid #f0e6d2'
        }}>
          <h4 style={{ 
            color: '#b8860b', 
            marginBottom: '20px', 
            fontSize: '1rem', 
            letterSpacing: '2px', 
            textTransform: 'uppercase',
            fontWeight: 600
          }}>
            Contact
          </h4>
          <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>

            {/* Address - Google Maps */}
            <li style={{ fontSize: '0.92rem', lineHeight: 1.5 }}>
              <a
                href="https://maps.app.goo.gl/KRknGxrGmKMuxPtp9"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#444', textDecoration: 'none', display: 'flex', alignItems: 'flex-start', gap: '6px' }}
                onMouseEnter={e => e.currentTarget.style.color = '#b8860b'}
                onMouseLeave={e => e.currentTarget.style.color = '#333'}
              >
                <span>📍</span>
                <span>
                  Ahmedabad, Gujarat, India
                  <span style={{ display: 'block', fontSize: '0.78rem', color: '#b8860b', marginTop: '2px' }}>
                    View on Map →
                  </span>
                </span>
              </a>
            </li>

            {/* Phone */}
            <li style={{ fontSize: '0.92rem', lineHeight: 1.5 }}>
              <a
                href="tel:+919104261433"
                style={{ color: '#444', textDecoration: 'none' }}
                onMouseEnter={e => e.currentTarget.style.color = '#b8860b'}
                onMouseLeave={e => e.currentTarget.style.color = '#333'}
              >
                📞 +91 91042 61433
              </a>
            </li>

            {/* WhatsApp */}
            <li style={{ fontSize: '0.92rem', lineHeight: 1.5 }}>
              <a
                href="https://wa.me/919104261433?text=Hi%2C%20I%20have%20a%20query%20about%20your%20jewellery."
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#25D366', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 500 }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#25D366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                WhatsApp Us
              </a>
            </li>

            {/* Email */}
            <li style={{ fontSize: '0.92rem', lineHeight: 1.5 }}>
              <a
                href="mailto:info@riddhijewellers.com"
                style={{ color: '#444', textDecoration: 'none' }}
                onMouseEnter={e => e.currentTarget.style.color = '#b8860b'}
                onMouseLeave={e => e.currentTarget.style.color = '#333'}
              >
                ✉️ info@riddhijewellers.com
              </a>
            </li>

            {/* Timing */}
            <li style={{ color: '#444', fontSize: '0.92rem', lineHeight: 1.5 }}>
              🕒 Mon–Sat: 10AM–8PM
            </li>

          </ul>
        </div>

      </div>

      {/* Bottom Bar */}
      <div style={{ 
        maxWidth: '1280px',
        margin: '70px auto 0',
        paddingTop: '30px',
        borderTop: '1px solid #e0d4b8',
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        flexWrap: 'wrap',
        gap: '15px',
        color: '#888',
        fontSize: '0.85rem'
      }}>
        <p>© 2024 Riddhi Jewellers. All rights reserved.</p>

        {/* Payment icons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          {['UPI', 'Visa', 'Mastercard', 'NetBanking', 'EMI'].map(method => (
            <span key={method} style={{
              background: '#f0e6d2', color: '#666', fontSize: '0.72rem',
              padding: '3px 10px', borderRadius: '4px', fontWeight: 600, letterSpacing: '0.5px'
            }}>
              {method}
            </span>
          ))}
        </div>

        <p>Made with ❤️ in India</p>
      </div>
    </footer>
  );
}