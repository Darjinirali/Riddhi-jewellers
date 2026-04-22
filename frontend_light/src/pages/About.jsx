import { Link } from 'react-router-dom';

/* ══════════════════════════════════════════════════════
   ABOUT PAGE — Premium Light Editorial Redesign
   Riddhi Jewellers · Cormorant Garamond + Jost + Cinzel
   Ivory × Gold · Art Deco Luxury · Light Theme
══════════════════════════════════════════════════════ */

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&family=Jost:wght@200;300;400;500&family=Cinzel:wght@400;500;600&display=swap');

  :root {
    --g1: #2a1a08; --g2: #4a2e0e; --g3: #7a4f1a;
    --g4: #a8722a; --g5: #c9943e; --g6: #e0b96a;
    --g7: #f0d49a; --g8: #faf0d8; --g9: #fdf8ef;
    --iv0: #fffef9; --iv1: #fdf8ef; --iv2: #f8f0e0; --iv3: #f0e4c8;
    --ink1: #0d0a04; --ink2: #1e1810; --ink3: #3c3020;
    --ink4: #6b5840; --ink5: #9e8870; --ink6: #c8b8a0;
    --serif: 'Cormorant Garamond', Georgia, serif;
    --sans: 'Jost', system-ui, sans-serif;
    --display: 'Cinzel', 'Times New Roman', serif;
    --ease1: cubic-bezier(0.16, 1, 0.3, 1);
    --ease3: cubic-bezier(0.34, 1.56, 0.64, 1);
    --b1: 1px solid rgba(168,114,42,0.15);
    --b2: 1px solid rgba(168,114,42,0.3);
    --b3: 1px solid rgba(168,114,42,0.5);
    --shg: 0 8px 48px rgba(168,114,42,0.18);
    --shg2: 0 4px 24px rgba(168,114,42,0.14);
    --sh2: 0 8px 40px rgba(13,10,4,0.1);
    --sh3: 0 24px 80px rgba(13,10,4,0.14);
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(32px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  @keyframes shimmer {
    0%   { background-position: -200% center; }
    100% { background-position: 200% center; }
  }
  @keyframes scaleIn {
    from { opacity: 0; transform: scale(0.96); }
    to   { opacity: 1; transform: scale(1); }
  }
  @keyframes lineGrow {
    from { width: 0; }
    to   { width: 80px; }
  }

  .fu  { animation: fadeUp 1s var(--ease1) both; }
  .fi  { animation: fadeIn 0.8s ease both; }
  .fu1 { animation-delay: 0.1s; }
  .fu2 { animation-delay: 0.22s; }
  .fu3 { animation-delay: 0.36s; }
  .fu4 { animation-delay: 0.5s; }

  /* ── HERO ── */
  .ab-hero {
    position: relative;
    height: 100vh;
    min-height: 680px;
    max-height: 860px;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .ab-hero-img {
    position: absolute; inset: 0;
    background-image: url(https://s3.ap-south-1.amazonaws.com/awsimages.imagesbazaar.com/900x600/21574/300-SM1122731.jpg);
    background-size: cover;
    background-position: center top;
    /* Clear, bright, saturated — no darkness */
    filter: saturate(1.1) brightness(0.92) contrast(1.04);
    transform: scale(1.02);
    transition: transform 12s ease-out;
  }
  .ab-hero:hover .ab-hero-img { transform: scale(1.06); }

  /* Very subtle vignette only at edges — keeps centre bright */
  .ab-hero-grad {
    position: absolute; inset: 0;
    background:
      radial-gradient(ellipse at center, transparent 35%, rgba(13,10,4,0.28) 100%),
      linear-gradient(to bottom, rgba(13,10,4,0.15) 0%, transparent 25%, transparent 60%, rgba(13,10,4,0.55) 100%);
  }

  /* Art deco frame corners */
  .ab-dc { position: absolute; width: 64px; height: 64px; pointer-events: none; z-index: 4; }
  .ab-dc-tl { top: 32px; left: 32px; border-top: 1px solid rgba(201,148,62,0.5); border-left: 1px solid rgba(201,148,62,0.5); }
  .ab-dc-tr { top: 32px; right: 32px; border-top: 1px solid rgba(201,148,62,0.5); border-right: 1px solid rgba(201,148,62,0.5); }
  .ab-dc-bl { bottom: 32px; left: 32px; border-bottom: 1px solid rgba(201,148,62,0.5); border-left: 1px solid rgba(201,148,62,0.5); }
  .ab-dc-br { bottom: 32px; right: 32px; border-bottom: 1px solid rgba(201,148,62,0.5); border-right: 1px solid rgba(201,148,62,0.5); }

  .ab-hero-cnt {
    position: relative; z-index: 5;
    text-align: center;
    padding: 0 5%;
    display: flex; flex-direction: column; align-items: center;
  }

  /* ── DIVIDER ── */
  .gold-divider {
    display: flex; align-items: center; gap: 16px;
    margin: 0 auto;
  }
  .gold-divider span {
    display: block; flex: 1; height: 1px;
    background: linear-gradient(90deg, transparent, var(--g5));
  }
  .gold-divider span:last-child {
    background: linear-gradient(90deg, var(--g5), transparent);
  }
  .gold-divider i {
    width: 6px; height: 6px; border-radius: 50%;
    background: var(--g5); flex-shrink: 0;
  }

  /* ── SECTION EYEBROW ── */
  .eyebrow {
    display: inline-flex; align-items: center; gap: 14px;
    font-family: var(--display);
    font-size: 0.52rem; font-weight: 400;
    letter-spacing: 0.44em; text-transform: uppercase;
    color: var(--g4);
    margin-bottom: 20px;
  }
  .eyebrow::before, .eyebrow::after {
    content: ''; display: block;
    width: 32px; height: 1px;
    background: linear-gradient(90deg, transparent, var(--g5));
  }
  .eyebrow::after { background: linear-gradient(90deg, var(--g5), transparent); }

  /* ── STORY SECTION ── */
  .story-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 72px;
    align-items: center;
    max-width: 1200px;
    margin: 0 auto;
    padding: 120px 6%;
  }

  /* Image side */
  .story-img-wrap {
    position: relative;
  }
  .story-img-frame {
    position: absolute;
    top: -16px; left: -16px; right: 16px; bottom: 16px;
    border: 1px solid rgba(168,114,42,0.2);
    border-radius: 20px;
    pointer-events: none; z-index: 0;
  }
  .story-img {
    width: 100%; height: 480px;
    object-fit: cover;
    border-radius: 16px;
    display: block;
    position: relative; z-index: 1;
    box-shadow: var(--sh3);
    transition: transform 0.7s var(--ease1);
  }
  .story-img-wrap:hover .story-img { transform: scale(1.02); }
  .story-badge {
    position: absolute;
    bottom: -24px; right: -24px;
    z-index: 2;
    background: linear-gradient(135deg, var(--g2), var(--g4));
    color: var(--g8);
    padding: 24px 28px;
    border-radius: 16px;
    text-align: center;
    box-shadow: var(--shg);
    border: 1px solid rgba(240,212,154,0.2);
  }

  /* ── VALUE CHIPS ── */
  .value-chip {
    display: flex; align-items: center; gap: 14px;
    padding: 16px 20px;
    background: var(--iv1);
    border: var(--b1);
    border-radius: 14px;
    transition: all 0.4s var(--ease1);
  }
  .value-chip:hover {
    border-color: var(--g5);
    box-shadow: var(--shg2);
    transform: translateY(-3px);
    background: var(--iv0);
  }
  .value-icon {
    width: 44px; height: 44px; flex-shrink: 0;
    border-radius: 12px;
    background: linear-gradient(135deg, var(--g7), var(--g8));
    border: var(--b2);
    display: flex; align-items: center; justify-content: center;
    font-size: 1.1rem;
  }

  /* ── STATS SECTION ── */
  .stats-section {
    background: linear-gradient(160deg, var(--g1) 0%, var(--g2) 50%, var(--g1) 100%);
    padding: 80px 6%;
    position: relative; overflow: hidden;
  }
  .stats-section::before {
    content: '';
    position: absolute; inset: 0;
    background-image: radial-gradient(circle, rgba(240,212,154,0.06) 1px, transparent 1px);
    background-size: 28px 28px;
    pointer-events: none;
  }
  .stat-card {
    text-align: center;
    padding: 32px 20px;
    border-right: 1px solid rgba(201,148,62,0.12);
    transition: background 0.3s ease;
  }
  .stat-card:last-child { border-right: none; }
  .stat-card:hover { background: rgba(201,148,62,0.06); }

  /* ── VALUES SECTION ── */
  .values-section {
    padding: 100px 6%;
    background: var(--iv0);
    max-width: 1200px;
    margin: 0 auto;
  }
  .value-big-card {
    background: var(--iv1);
    border: var(--b1);
    border-radius: 20px;
    padding: 40px 36px;
    transition: all 0.5s var(--ease1);
    position: relative; overflow: hidden;
  }
  .value-big-card::before {
    content: '';
    position: absolute; top: 0; left: 0; right: 0;
    height: 2px;
    background: linear-gradient(90deg, transparent, var(--g5), transparent);
    opacity: 0; transition: opacity 0.4s ease;
  }
  .value-big-card:hover {
    border-color: rgba(168,114,42,0.35);
    box-shadow: var(--sh3);
    transform: translateY(-6px);
    background: var(--iv0);
  }
  .value-big-card:hover::before { opacity: 1; }
  .value-big-icon {
    width: 56px; height: 56px;
    border-radius: 16px;
    background: linear-gradient(135deg, var(--g7), var(--g8));
    border: var(--b2);
    display: flex; align-items: center; justify-content: center;
    font-size: 1.4rem;
    margin-bottom: 20px;
  }

  /* ── CTA SECTION ── */
  .cta-section {
    background: var(--iv1);
    padding: 100px 6%;
    text-align: center;
    border-top: var(--b1);
    position: relative; overflow: hidden;
  }
  .cta-section::before {
    content: '';
    position: absolute; top: 50%; left: 50%;
    transform: translate(-50%, -50%);
    width: 700px; height: 700px; border-radius: 50%;
    background: radial-gradient(circle, rgba(201,148,62,0.06) 0%, transparent 65%);
    pointer-events: none;
  }
  .btn-gold {
    display: inline-flex; align-items: center; gap: 10px;
    font-family: var(--display); font-size: 0.58rem;
    font-weight: 400; letter-spacing: 0.22em; text-transform: uppercase;
    text-decoration: none; padding: 16px 44px; border-radius: 2px;
    background: linear-gradient(135deg, var(--g3), var(--g5));
    color: var(--iv0);
    box-shadow: 0 4px 24px rgba(168,114,42,0.28);
    transition: all 0.4s var(--ease1);
    border: none; cursor: pointer;
  }
  .btn-gold:hover {
    box-shadow: 0 8px 40px rgba(168,114,42,0.42);
    transform: translateY(-2px);
  }
  .btn-outline {
    display: inline-flex; align-items: center; gap: 10px;
    font-family: var(--display); font-size: 0.58rem;
    font-weight: 400; letter-spacing: 0.22em; text-transform: uppercase;
    text-decoration: none; padding: 16px 44px; border-radius: 2px;
    background: transparent; color: var(--g3);
    border: var(--b3);
    transition: all 0.4s var(--ease1);
    cursor: pointer;
  }
  .btn-outline:hover {
    background: rgba(168,114,42,0.07);
    border-color: var(--g4);
    transform: translateY(-2px);
  }

  /* ── TIMELINE ── */
  .timeline-dot {
    width: 12px; height: 12px; border-radius: 50%;
    background: var(--g5); flex-shrink: 0;
    box-shadow: 0 0 0 4px rgba(201,148,62,0.15);
    margin-top: 5px;
  }

  /* ── RESPONSIVE ── */
  @media (max-width: 768px) {
    .story-grid { grid-template-columns: 1fr; gap: 48px; padding: 80px 5%; }
    .story-badge { bottom: -16px; right: -8px; padding: 18px 22px; }
    .values-grid { grid-template-columns: 1fr 1fr !important; }
  }
  @media (max-width: 500px) {
    .values-grid { grid-template-columns: 1fr !important; }
    .stats-grid { grid-template-columns: 1fr 1fr !important; }
  }
`;

export default function About() {
  return (
    <div style={{ background: 'var(--iv0)', minHeight: '100vh', fontFamily: 'var(--sans)', WebkitFontSmoothing: 'antialiased' }}>
      <style>{styles}</style>

      {/* ═══════════════════════════════════════
          HERO — Full image, crisp, light overlay
      ═══════════════════════════════════════ */}
      <div className="ab-hero" style={{ paddingTop: '70px' }}>
        <div className="ab-hero-img" />
        <div className="ab-hero-grad" />
        <div className="ab-dc ab-dc-tl" />
        <div className="ab-dc ab-dc-tr" />
        <div className="ab-dc ab-dc-bl" />
        <div className="ab-dc ab-dc-br" />

        <div className="ab-hero-cnt">
          {/* Eyebrow */}
          <div className="fu" style={{ marginBottom: '24px' }}>
            <div className="gold-divider" style={{ width: '260px' }}>
              <span />
              <span style={{
                fontFamily: 'var(--display)', color: 'rgba(240,212,154,0.9)',
                fontSize: '0.5rem', letterSpacing: '0.42em', textTransform: 'uppercase',
                whiteSpace: 'nowrap', fontStyle: 'normal',
              }}>Our Story · Est. 1995</span>
              <i />
              <span />
            </div>
          </div>

          <h1 className="fu fu1" style={{
            fontFamily: 'var(--serif)',
            fontSize: 'clamp(2.8rem, 7vw, 5.5rem)',
            fontWeight: 300, lineHeight: 1.05,
            color: '#fff',
            letterSpacing: '-0.01em',
            marginBottom: '10px',
            textShadow: '0 2px 32px rgba(0,0,0,0.3)',
          }}>
            Crafting Memories,
          </h1>
          <h1 className="fu fu2" style={{
            fontFamily: 'var(--serif)',
            fontSize: 'clamp(2.8rem, 7vw, 5.5rem)',
            fontWeight: 300, lineHeight: 1.05,
            letterSpacing: '-0.01em',
            marginBottom: '36px',
            background: 'linear-gradient(90deg, var(--g5) 0%, var(--g7) 40%, var(--g5) 65%, var(--g7) 85%, var(--g5) 100%)',
            backgroundSize: '200% auto',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            animation: 'shimmer 5s linear infinite',
          }}>
            One Jewel at a Time
          </h1>

          <p className="fu fu3" style={{
            color: 'rgba(255,255,255,0.7)',
            fontSize: '0.95rem', lineHeight: 1.9,
            maxWidth: '440px',
            fontFamily: 'var(--sans)', fontWeight: 200, letterSpacing: '0.05em',
            marginBottom: '44px',
            textShadow: '0 1px 8px rgba(0,0,0,0.2)',
          }}>
            Three decades of trust, tradition, and timeless craftsmanship — crafted for the ones you love most.
          </p>

          {/* Scroll hint */}
          <div className="fu fu4" style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
          }}>
            <div style={{
              width: '1px', height: '48px',
              background: 'linear-gradient(to bottom, rgba(201,148,62,0.7), transparent)',
            }} />
            <span style={{
              fontFamily: 'var(--display)', fontSize: '0.44rem',
              letterSpacing: '0.3em', textTransform: 'uppercase',
              color: 'rgba(201,148,62,0.6)',
            }}>Scroll</span>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════
          STORY SECTION
      ═══════════════════════════════════════ */}
      <div style={{ background: 'var(--iv0)' }}>
        <div className="story-grid">
          {/* Left — Image */}
          <div className="story-img-wrap fi">
            <div className="story-img-frame" />
            <img
              className="story-img"
              src="https://i.pinimg.com/1200x/8c/e9/01/8ce901930dd44a47f568504f7e824ba1.jpg"
              alt="Riddhi Jewellers craftsmanship"
            />
            {/* Badge */}
            <div className="story-badge">
              <div style={{
                fontFamily: 'var(--serif)',
                fontSize: '3rem', fontWeight: 300,
                color: 'var(--g7)', lineHeight: 1,
              }}>29</div>
              <div style={{
                fontFamily: 'var(--display)', fontSize: '0.46rem',
                letterSpacing: '0.22em', textTransform: 'uppercase',
                color: 'rgba(240,212,154,0.55)', marginTop: '6px',
              }}>Years of</div>
              <div style={{
                fontFamily: 'var(--display)', fontSize: '0.5rem',
                letterSpacing: '0.18em', textTransform: 'uppercase',
                color: 'var(--g7)',
              }}>Craft</div>
            </div>
          </div>

          {/* Right — Text */}
          <div>
            <p className="eyebrow fu">Our Story</p>
            <h2 className="fu fu1" style={{
              fontFamily: 'var(--serif)',
              fontSize: 'clamp(2rem, 3.5vw, 3rem)',
              fontWeight: 300, color: 'var(--ink1)',
              lineHeight: 1.15, letterSpacing: '-0.01em',
              marginBottom: '24px',
            }}>
              Crafting Memories,{' '}
              <em style={{ color: 'var(--g4)', fontStyle: 'italic', fontWeight: 400 }}>
                One Jewel at a Time
              </em>
            </h2>

            {/* Decorative line */}
            <div style={{
              width: '56px', height: '2px', marginBottom: '28px',
              background: 'linear-gradient(90deg, var(--g4), var(--g6))',
              borderRadius: '2px',
            }} />

            <p className="fu fu2" style={{
              color: 'var(--ink4)', lineHeight: 1.95,
              marginBottom: '18px', fontSize: '0.95rem',
              fontFamily: 'var(--sans)', fontWeight: 300,
            }}>
              Since 1995, Riddhi Jewellers has been a beacon of trust and craftsmanship in Jamnagar. Our master artisans weave together generations of technique with contemporary sensibility.
            </p>
            <p className="fu fu2" style={{
              color: 'var(--ink5)', lineHeight: 1.95,
              marginBottom: '40px', fontSize: '0.92rem',
              fontFamily: 'var(--sans)', fontWeight: 300,
            }}>
              Every piece we create carries a story — of the hands that shaped it, the traditions that inspired it, and the moments it will witness for generations to come.
            </p>

            {/* Value chips */}
            <div className="fu fu3" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {[
                ['🛡️', 'Certified Quality', 'BIS Hallmarked Gold & Silver'],
                ['⭐', 'Trusted Legacy', '2000+ Happy Families Since 1995'],
                ['💎', 'Master Craftsmanship', 'Handcrafted by Expert Artisans'],
              ].map(([icon, title, sub]) => (
                <div key={title} className="value-chip">
                  <div className="value-icon">{icon}</div>
                  <div>
                    <div style={{
                      fontFamily: 'var(--display)', fontSize: '0.6rem',
                      letterSpacing: '0.14em', textTransform: 'uppercase',
                      color: 'var(--ink2)', fontWeight: 400, marginBottom: '3px',
                    }}>{title}</div>
                    <div style={{
                      fontFamily: 'var(--sans)', fontSize: '0.8rem',
                      color: 'var(--ink5)', fontWeight: 300,
                    }}>{sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════
          STATS ROW
      ═══════════════════════════════════════ */}
      <div className="stats-section">
        {/* Art deco side lines */}
        <div style={{
          position: 'absolute', top: 0, left: '5%',
          width: '1px', height: '100%',
          background: 'linear-gradient(to bottom, transparent, rgba(201,148,62,0.15), transparent)',
        }} />
        <div style={{
          position: 'absolute', top: 0, right: '5%',
          width: '1px', height: '100%',
          background: 'linear-gradient(to bottom, transparent, rgba(201,148,62,0.15), transparent)',
        }} />

        <div style={{ marginBottom: '16px', textAlign: 'center' }}>
          <p style={{
            fontFamily: 'var(--display)', color: 'rgba(201,148,62,0.5)',
            fontSize: '0.5rem', letterSpacing: '0.4em', textTransform: 'uppercase',
            marginBottom: '8px',
          }}>In Numbers</p>
          <div style={{
            width: '40px', height: '1px', margin: '0 auto',
            background: 'linear-gradient(90deg, transparent, var(--g5), transparent)',
          }} />
        </div>

        <div
          className="stats-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            maxWidth: '900px', margin: '0 auto',
          }}
        >
          {[
            ['2000+', 'Happy Clients'],
            ['500+', 'Unique Designs'],
            ['29+', 'Years Experience'],
            ['100%', 'BIS Certified'],
          ].map(([num, label]) => (
            <div key={label} className="stat-card">
              <div style={{
                fontFamily: 'var(--serif)',
                fontSize: 'clamp(2rem, 4vw, 2.8rem)',
                fontWeight: 300, color: 'var(--g7)',
                lineHeight: 1, marginBottom: '8px',
              }}>{num}</div>
              <div style={{
                fontFamily: 'var(--display)', fontSize: '0.48rem',
                letterSpacing: '0.2em', textTransform: 'uppercase',
                color: 'rgba(240,212,154,0.38)',
              }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ═══════════════════════════════════════
          VALUES / WHY US
      ═══════════════════════════════════════ */}
      <section style={{ padding: '100px 6%', background: 'var(--iv0)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <p className="eyebrow" style={{ justifyContent: 'center' }}>Why Choose Us</p>
            <h2 style={{
              fontFamily: 'var(--serif)',
              fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)',
              fontWeight: 300, color: 'var(--ink1)',
              letterSpacing: '-0.01em', lineHeight: 1.15,
            }}>
              The Riddhi{' '}
              <em style={{ color: 'var(--g4)', fontStyle: 'italic', fontWeight: 400 }}>Promise</em>
            </h2>
          </div>

          <div
            className="values-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '22px',
            }}
          >
            {[
              ['✦', 'Hallmarked Purity', 'Every piece of gold and silver is BIS hallmarked, ensuring certified purity and lasting value.'],
              ['◈', 'Master Artisans', 'Skilled craftsmen with decades of experience craft each ornament with meticulous attention to detail.'],
              ['◇', 'Timeless Designs', 'From classic traditional to bold contemporary — our design library spans every taste and occasion.'],
              ['❋', 'Trust & Transparency', 'Honest pricing, transparent making charges, and a legacy of integrity since 1995.'],
            ].map(([icon, title, desc]) => (
              <div key={title} className="value-big-card">
                <div className="value-big-icon">
                  <span style={{
                    fontFamily: 'var(--serif)', fontSize: '1.4rem',
                    color: 'var(--g4)', lineHeight: 1,
                  }}>{icon}</span>
                </div>
                <h3 style={{
                  fontFamily: 'var(--display)', fontSize: '0.65rem',
                  letterSpacing: '0.16em', textTransform: 'uppercase',
                  color: 'var(--ink1)', fontWeight: 400,
                  marginBottom: '12px',
                }}>{title}</h3>
                <p style={{
                  fontFamily: 'var(--sans)', fontSize: '0.88rem',
                  color: 'var(--ink4)', lineHeight: 1.85,
                  fontWeight: 300,
                }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          CTA
      ═══════════════════════════════════════ */}
      <section className="cta-section">
        {/* Art deco corners */}
        {[
          { top: '28px', left: '28px', borderTop: 'var(--b2)', borderLeft: 'var(--b2)' },
          { top: '28px', right: '28px', borderTop: 'var(--b2)', borderRight: 'var(--b2)' },
          { bottom: '28px', left: '28px', borderBottom: 'var(--b2)', borderLeft: 'var(--b2)' },
          { bottom: '28px', right: '28px', borderBottom: 'var(--b2)', borderRight: 'var(--b2)' },
        ].map((s, i) => (
          <div key={i} style={{ position: 'absolute', width: '52px', height: '52px', pointerEvents: 'none', ...s }} />
        ))}

        <div style={{ position: 'relative', zIndex: 1 }}>
          <p className="eyebrow" style={{ justifyContent: 'center' }}>Begin Your Journey</p>
          <h2 style={{
            fontFamily: 'var(--serif)',
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            fontWeight: 300, color: 'var(--ink1)',
            marginBottom: '18px', letterSpacing: '-0.01em', lineHeight: 1.1,
          }}>
            Ready to Find Your{' '}
            <em style={{ color: 'var(--g4)', fontStyle: 'italic', fontWeight: 400 }}>Perfect Piece?</em>
          </h2>
          <p style={{
            color: 'var(--ink5)', fontSize: '0.92rem', lineHeight: 1.9,
            maxWidth: '420px', margin: '0 auto 52px',
            fontFamily: 'var(--sans)', fontWeight: 300, letterSpacing: '0.03em',
          }}>
            Visit our showroom or explore our collections online. Our team is here to help you find exactly what you're looking for.
          </p>
          <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/collections" className="btn-gold">Explore Collections →</Link>
            <Link to="/contact" className="btn-outline">Contact Us</Link>
          </div>
        </div>
      </section>

    </div>
  );
}