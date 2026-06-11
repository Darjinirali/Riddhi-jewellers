import { useState } from 'react';

/* ══════════════════════════════════════════════════════
   CONTACT PAGE — Premium Light Editorial Redesign (Mobile Fixed)
   Riddhi Jewellers · Ivory × Gold · Art Deco Luxury
══════════════════════════════════════════════════════ */

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Jost:wght@200;300;400;500&family=Cinzel:wght@400;500&display=swap');

  :root {
    --g1: #2a1a08; --g2: #4a2e0e; --g3: #7a4f1a;
    --g4: #a8722a; --g5: #c9943e; --g6: #e0b96a;
    --g7: #f0d49a; --g8: #faf0d8; --g9: #fdf8ef;
    --iv0: #fffef9; --iv1: #fdf8ef; --iv2: #f8f0e0;
    --ink1: #0d0a04; --ink2: #1e1810; --ink3: #3c3020;
    --ink4: #6b5840; --ink5: #9e8870; --ink6: #c8b8a0;
    --serif: 'Cormorant Garamond', Georgia, serif;
    --sans: 'Jost', system-ui, sans-serif;
    --display: 'Cinzel', 'Times New Roman', serif;
    --ease1: cubic-bezier(0.16, 1, 0.3, 1);
    --b1: 1px solid rgba(168,114,42,0.15);
    --b2: 1px solid rgba(168,114,42,0.3);
    --b3: 1px solid rgba(168,114,42,0.5);
    --shg: 0 8px 48px rgba(168,114,42,0.18);
    --shg2: 0 4px 24px rgba(168,114,42,0.14);
    --sh3: 0 24px 80px rgba(13,10,4,0.12);
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(28px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes shimmer {
    0%   { background-position: -200% center; }
    100% { background-position: 200% center; }
  }

  .fu  { animation: fadeUp 0.9s var(--ease1) both; }
  .fu1 { animation-delay: 0.1s; }
  .fu2 { animation-delay: 0.22s; }
  .fu3 { animation-delay: 0.34s; }

  /* ── HERO SECTION (Mobile Background Fixed) ── */
  .ct-hero {
    position: relative;
    height: 100vh;
    min-height: 580px;
    max-height: 920px;
    overflow: hidden;
    display: flex;
    align-items: flex-end;
    justify-content: flex-start;
  }

  .ct-hero-img {
    position: absolute;
    inset: 0;
    background-image: url('https://indinoor.in/cdn/shop/articles/Punjabi_Jadau_Jewellery_7647f773-cf87-43d8-88be-0cfbfb189831-7796640.jpg?v=1768221962');
    background-size: cover;
    background-position: center 30%;
    background-repeat: no-repeat;
    background-attachment: scroll;
    -webkit-background-size: cover;
    filter: saturate(1.05) brightness(0.88) contrast(1.03);
    transition: transform 14s ease-out;
  }

  /* Mobile Background Fix */
  @media (max-width: 768px) {
    .ct-hero {
      height: 92vh;
      min-height: 520px;
    }
    .ct-hero-img {
      background-position: 50% 35%;   /* Best position for jewellery */
    }
  }

  .ct-hero:hover .ct-hero-img { 
    transform: scale(1.04); 
  }

  .ct-hero-grad {
    position: absolute; 
    inset: 0;
    background:
      linear-gradient(to top, rgba(13,10,4,0.92) 0%, rgba(13,10,4,0.48) 42%, rgba(13,10,4,0.08) 100%),
      linear-gradient(100deg, rgba(13,10,4,0.35) 0%, transparent 65%);
  }

  /* Art Deco Corners */
  .ct-dc { 
    position: absolute; 
    width: 56px; 
    height: 56px; 
    pointer-events: none; 
    z-index: 4; 
  }
  .ct-dc-tl { top: 28px; left: 28px; border-top: 1px solid rgba(201,148,62,0.45); border-left: 1px solid rgba(201,148,62,0.45); }
  .ct-dc-tr { top: 28px; right: 28px; border-top: 1px solid rgba(201,148,62,0.45); border-right: 1px solid rgba(201,148,62,0.45); }

  @media (max-width: 600px) {
    .ct-dc { width: 38px; height: 38px; }
    .ct-dc-tl { top: 18px; left: 18px; }
    .ct-dc-tr { top: 18px; right: 18px; }
  }

  .ct-hero-cnt {
    position: relative; 
    z-index: 5;
    padding: 0 7% 72px;
    max-width: 780px;
    width: 100%;
  }

  @media (max-width: 600px) {
    .ct-hero-cnt { padding: 0 6% 52px; }
  }

  /* ── EYEBROW ── */
  .eyebrow {
    display: inline-flex; 
    align-items: center; 
    gap: 14px;
    font-family: var(--display);
    font-size: 0.52rem; 
    font-weight: 400;
    letter-spacing: 0.44em; 
    text-transform: uppercase;
    color: var(--g4); 
    margin-bottom: 18px;
  }
  .eyebrow::before, .eyebrow::after {
    content: ''; 
    display: block; 
    width: 32px; 
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--g5));
  }
  .eyebrow::after { background: linear-gradient(90deg, var(--g5), transparent); }
  .eyebrow-light { color: var(--g6) !important; }
  .eyebrow-light::before { background: linear-gradient(90deg, transparent, var(--g6)); }
  .eyebrow-light::after  { background: linear-gradient(90deg, var(--g6), transparent); }

  /* ── INFO CARD ── */
  .info-card {
    background: var(--iv0);
    border: var(--b1);
    border-radius: 18px;
    padding: 22px;
    display: flex; 
    align-items: flex-start; 
    gap: 16px;
    transition: all 0.4s var(--ease1);
  }
  .info-card:hover {
    border-color: rgba(168,114,42,0.4);
    box-shadow: var(--shg2);
    transform: translateY(-4px);
    background: var(--iv1);
  }

  .info-icon {
    width: 46px; 
    height: 46px; 
    flex-shrink: 0;
    border-radius: 13px;
    background: linear-gradient(135deg, var(--g7), var(--g8));
    border: var(--b2);
    display: flex; 
    align-items: center; 
    justify-content: center;
    font-size: 1.1rem;
  }

  /* ── FORM STYLES ── */
  .ct-label {
    display: block;
    font-family: var(--display);
    font-size: 0.5rem; 
    font-weight: 400;
    letter-spacing: 0.2em; 
    text-transform: uppercase;
    color: var(--ink4); 
    margin-bottom: 9px;
  }

  .ct-input {
    width: 100%;
    background: var(--iv1);
    border: var(--b1);
    border-radius: 10px;
    padding: 13px 16px;
    color: var(--ink1);
    font-size: 0.9rem;
    font-family: var(--sans);
    font-weight: 300;
    outline: none;
    transition: all 0.3s ease;
  }
  .ct-input:focus {
    border-color: var(--g5);
    background: var(--iv0);
    box-shadow: 0 0 0 3px rgba(201,148,62,0.08);
  }

  .ct-btn {
    width: 100%;
    padding: 16px;
    background: linear-gradient(135deg, var(--g3), var(--g5));
    color: var(--iv0);
    border: none;
    border-radius: 10px;
    font-family: var(--display);
    font-size: 0.6rem;
    font-weight: 400;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    cursor: pointer;
    transition: all 0.4s var(--ease1);
    box-shadow: 0 4px 24px rgba(168,114,42,0.25);
  }
  .ct-btn:hover:not(:disabled) {
    box-shadow: 0 8px 40px rgba(168,114,42,0.4);
    transform: translateY(-2px);
  }

  .wa-btn {
    display: flex; 
    align-items: center; 
    justify-content: center; 
    gap: 10px;
    width: 100%; 
    padding: 14px;
    background: transparent;
    color: var(--g3);
    border: var(--b3);
    border-radius: 10px;
    font-family: var(--display);
    font-size: 0.58rem; 
    font-weight: 400;
    letter-spacing: 0.18em; 
    text-transform: uppercase;
    text-decoration: none;
    transition: all 0.4s var(--ease1);
  }
  .wa-btn:hover {
    background: rgba(168,114,42,0.07);
    border-color: var(--g4);
  }

  .form-card {
    background: var(--iv0);
    border: var(--b1);
    border-radius: 24px;
    padding: 40px 36px;
    box-shadow: var(--sh3);
    position: relative; 
    overflow: hidden;
  }
  .form-card::before {
    content: '';
    position: absolute; 
    top: 0; left: 0; right: 0; 
    height: 2px;
    background: linear-gradient(90deg, transparent, var(--g5), transparent);
  }

  /* ── RESPONSIVE ── */
  @media (max-width: 900px) {
    .ct-main-grid { grid-template-columns: 1fr !important; gap: 48px; }
  }

  @media (max-width: 600px) {
    .form-card { padding: 32px 24px; }
    .info-card { padding: 18px; }
  }
`;

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [status, setStatus] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.message) {
      alert('Name, email aur message fill karo');
      return;
    }
    setStatus('sending');
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setStatus('sent');
        setForm({ name: '', email: '', phone: '', message: '' });
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  return (
    <div style={{ 
      background: 'var(--iv0)', 
      minHeight: '100vh', 
      fontFamily: 'var(--sans)', 
      WebkitFontSmoothing: 'antialiased', 
      overflowX: 'hidden' 
    }}>
      <style>{styles}</style>

      {/* HERO */}
      <div className="ct-hero" style={{ paddingTop: '70px' }}>
        <div className="ct-hero-img" />
        <div className="ct-hero-grad" />
        <div className="ct-dc ct-dc-tl" />
        <div className="ct-dc ct-dc-tr" />

        <div className="ct-hero-cnt">
          <div className="fu" style={{ marginBottom: '22px' }}>
            <p className="eyebrow eyebrow-light">Get In Touch</p>
          </div>

          <h1 className="fu fu1" style={{
            fontFamily: 'var(--serif)',
            fontSize: 'clamp(2.4rem, 7.5vw, 5rem)',
            fontWeight: 300, 
            lineHeight: 1.05,
            color: '#fff', 
            letterSpacing: '-0.01em',
            marginBottom: '10px',
            textShadow: '0 2px 24px rgba(0,0,0,0.35)',
          }}>
            We'd Love to
          </h1>

          <h1 className="fu fu2" style={{
            fontFamily: 'var(--serif)',
            fontSize: 'clamp(2.4rem, 7.5vw, 5rem)',
            fontWeight: 300, 
            lineHeight: 1.05,
            letterSpacing: '-0.01em', 
            marginBottom: '28px',
            background: 'linear-gradient(90deg, var(--g5) 0%, var(--g7) 40%, var(--g5) 65%, var(--g7) 85%, var(--g5) 100%)',
            backgroundSize: '200% auto',
            WebkitBackgroundClip: 'text', 
            WebkitTextFillColor: 'transparent', 
            backgroundClip: 'text',
            animation: 'shimmer 5s linear infinite',
          }}>
            Hear From You
          </h1>

          <p className="fu fu3" style={{
            color: 'rgba(255,255,255,0.65)',
            fontSize: '0.92rem', 
            lineHeight: 1.85,
            maxWidth: '380px',
            fontFamily: 'var(--sans)', 
            fontWeight: 200, 
            letterSpacing: '0.04em',
            textShadow: '0 1px 8px rgba(0,0,0,0.2)',
          }}>
            Visit our showroom or send us a message — our team is always ready to help you find your perfect jewel.
          </p>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <section style={{ padding: '88px 7% 100px', background: 'var(--iv0)' }}>

        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <p className="eyebrow fu" style={{ justifyContent: 'center' }}>Riddhi Jewellers</p>
          <h2 className="fu fu1" style={{
            fontFamily: 'var(--serif)',
            fontSize: 'clamp(1.8rem, 4vw, 2.6rem)',
            fontWeight: 300, 
            color: 'var(--ink1)',
            letterSpacing: '-0.01em', 
            lineHeight: 1.15,
          }}>
            Reach Out, We're{' '}
            <em style={{ color: 'var(--g4)', fontStyle: 'italic', fontWeight: 400 }}>Here For You</em>
          </h2>
        </div>

        <div
          className="ct-main-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1.4fr',
            gap: '40px',
            maxWidth: '1160px',
            margin: '0 auto',
            alignItems: 'start',
          }}
        >

          {/* LEFT: Info Cards */}
          <div className="fu fi" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

            <div style={{ marginBottom: '8px' }}>
              <p style={{ fontFamily: 'var(--display)', fontSize: '0.5rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--ink5)' }}>
                Store Information
              </p>
              <div style={{ width: '32px', height: '1px', marginTop: '8px', background: 'linear-gradient(90deg, var(--g5), transparent)' }} />
            </div>

            {[
              { icon: '📍', title: 'Address', lines: ['Ahmedabad, Gujarat, India'] },
              { icon: '📞', title: 'Phone', lines: ['+91 91042 61433'] },
              { icon: '✉️', title: 'Email', lines: ['info@riddhijewellers.com'] },
              { icon: '🕐', title: 'Store Hours', lines: ['Mon – Sat: 10:00 AM – 8:00 PM', 'Sunday: Closed'] },
            ].map(({ icon, title, lines }) => (
              <div key={title} className="info-card">
                <div className="info-icon">{icon}</div>
                <div>
                  <p style={{ fontFamily: 'var(--display)', fontSize: '0.5rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--g4)', marginBottom: '6px' }}>
                    {title}
                  </p>
                  {lines.map(line => (
                    <p key={line} style={{ fontFamily: 'var(--sans)', fontSize: '0.88rem', color: 'var(--ink4)', lineHeight: 1.7, fontWeight: 300 }}>
                      {line}
                    </p>
                  ))}
                </div>
              </div>
            ))}

            <a href="https://wa.me/919104261433" target="_blank" rel="noreferrer" className="wa-btn" style={{ marginTop: '8px' }}>
              <span style={{ fontSize: '1.1rem' }}>💬</span>
              Chat on WhatsApp
            </a>

            {/* Quote Box */}
            <div style={{
              marginTop: '12px',
              padding: '22px 24px',
              background: 'linear-gradient(135deg, var(--g1), var(--g2))',
              borderRadius: '16px',
              border: '1px solid rgba(201,148,62,0.2)',
              position: 'relative',
            }}>
              <div style={{ position: 'absolute', top: '-20px', right: '-10px', fontFamily: 'var(--serif)', fontSize: '6rem', color: 'rgba(201,148,62,0.08)', lineHeight: 1 }}>"</div>
              <p style={{ fontFamily: 'var(--serif)', fontSize: '1.05rem', fontStyle: 'italic', color: 'var(--g7)', lineHeight: 1.75, fontWeight: 300 }}>
                Every jewel tells a story. Let us help you write yours.
              </p>
              <div style={{ marginTop: '14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '24px', height: '1px', background: 'var(--g5)' }} />
                <span style={{ fontFamily: 'var(--display)', fontSize: '0.46rem', letterSpacing: '0.24em', textTransform: 'uppercase', color: 'rgba(201,148,62,0.55)' }}>
                  Riddhi Jewellers
                </span>
              </div>
            </div>
          </div>

          {/* RIGHT: Form */}
          <div className="form-card fu fu2">
            <div style={{ marginBottom: '32px' }}>
              <p className="eyebrow" style={{ justifyContent: 'flex-start' }}>Send a Message</p>
              <h3 style={{ fontFamily: 'var(--serif)', fontSize: '2rem', fontWeight: 300, color: 'var(--ink1)', lineHeight: 1.15 }}>
                How Can We{' '}
                <em style={{ color: 'var(--g4)', fontStyle: 'italic', fontWeight: 400 }}>Help You?</em>
              </h3>
              <p style={{ color: 'var(--ink5)', fontSize: '0.85rem', fontFamily: 'var(--sans)', fontWeight: 300, marginTop: '8px', lineHeight: 1.7 }}>
                We'll get back to you within 24 hours.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label className="ct-label">Your Name</label>
                  <input className="ct-input" type="text" name="name" value={form.name} onChange={handleChange} placeholder="Nirali Darji" />
                </div>
                <div>
                  <label className="ct-label">Email Address</label>
                  <input className="ct-input" type="email" name="email" value={form.email} onChange={handleChange} placeholder="nirali@example.com" />
                </div>
              </div>

              <div>
                <label className="ct-label">Phone Number</label>
                <input className="ct-input" type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="+91 91042 61433" />
              </div>

              <div>
                <label className="ct-label">Topic</label>
                <select className="ct-input" style={{ appearance: 'none', cursor: 'pointer' }} defaultValue="">
                  <option value="" disabled>Select a topic...</option>
                  <option>Bridal Jewellery Enquiry</option>
                  <option>Custom / Bespoke Design</option>
                  <option>Gold / Diamond Pricing</option>
                  <option>Repair & Restoration</option>
                  <option>General Enquiry</option>
                </select>
              </div>

              <div>
                <label className="ct-label">Message</label>
                <textarea
                  className="ct-input"
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  rows={5}
                  placeholder="Tell us what you're looking for..."
                  style={{ resize: 'vertical' }}
                />
              </div>

              {status === 'sent' && (
                <div style={{ background: 'rgba(22,163,74,0.06)', border: '1px solid rgba(22,163,74,0.25)', borderRadius: '10px', padding: '14px 16px', color: '#15803d', textAlign: 'center', fontSize: '0.88rem' }}>
                  ✅ Message bhej diya! Hum jald sampark karenge.
                </div>
              )}
              {status === 'error' && (
                <div style={{ background: 'rgba(220,38,38,0.05)', border: '1px solid rgba(220,38,38,0.2)', borderRadius: '10px', padding: '14px 16px', color: '#dc2626', textAlign: 'center', fontSize: '0.88rem' }}>
                  ❌ Kuch error aaya. Dobara try karo.
                </div>
              )}

              <button className="ct-btn" onClick={handleSubmit} disabled={status === 'sending'}>
                {status === 'sending' ? '⏳ Sending...' : 'Send Message →'}
              </button>

              <p style={{ textAlign: 'center', color: 'var(--ink6)', fontSize: '0.75rem', fontWeight: 300 }}>
                🔒 Your information is safe with us. We never share your details.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}