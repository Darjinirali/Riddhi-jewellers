import { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';

import {
  EMICalculator,
  GiftFinderQuiz,
  HowItWorks,
  AwardsCertifications,
  JewelleryCareGuide,
  FAQSection,
  NewArrivalsMarquee,
  FestivalCalendar,
  BlogPreview,
  VirtualTryOnTeaser,
  DeliveryInfo,
  GoldInvestment,
  ExitIntentPopup,
  BeforeAfterSection,
} from './HomeExtra';

/* ════════════════════════════════════════════════════════════
   VIDEO DATA
   ════════════════════════════════════════════════════════════ */
const pinterestVideos = [
  { src: '/videos/bridal1.mp4', label: 'Bridal Collection',   tag: 'Wedding',       height: '420px' },
  { src: '/videos/bridal2.mp4', label: 'Gold bangles',        tag: 'Luxury',        height: '290px' },
  { src: '/videos/bridal3.mp4', label: 'Modern Jewellery',    tag: 'Traditional',   height: '350px' },
  { src: '/videos/bridal4.mp4', label: 'Necklace Collection', tag: 'Statement',     height: '270px' },
  { src: '/videos/bridal5.mp4', label: 'Diamond Jewellary',   tag: 'Contemporary',  height: '370px' },
  { src: '/videos/bridal6.mp4', label: 'Engagement Rings',    tag: 'Engagement',    height: '310px' },
];

const craftVideos = [
  { src: '/videos/bridal7.mp4', tag: 'Gold Casting',    title: '' },
  { src: '/videos/bridal5.mp4', tag: 'Diamond Setting', title: '' },
  { src: '/videos/bridal2.mp4', tag: 'Finishing',       title: '' },
];

/* ════════════════════════════════════════════════════════════
   SCROLL REVEAL HOOK — FIXED
   ════════════════════════════════════════════════════════════ */
function useScrollReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Already visible on mount (above fold)? Reveal immediately.
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight) {
      el.classList.add('revealed');
      return;
    }

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('revealed');
          obs.unobserve(el);
        }
      },
      {
        threshold: 0,       // sirf 1px dikhte hi trigger
        rootMargin: '0px',  // no negative margin
      }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

/* Convenience wrapper */
function Reveal({ children, delay = 0, style = {}, className = '', tag: Tag = 'div' }) {
  const ref = useScrollReveal();
  return (
    <Tag
      ref={ref}
      className={`scroll-reveal${className ? ' ' + className : ''}`}
      style={{ '--reveal-delay': `${delay}ms`, ...style }}
    >
      {children}
    </Tag>
  );
}

/* ════════════════════════════════════════════════════════════
   AUTOPLAY HOOK
   ════════════════════════════════════════════════════════════ */
function useAutoplay(ref) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.muted = true;
    el.playsInline = true;
    const tryPlay = () => { el.play().catch(() => {}); };
    tryPlay();
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.muted = true; el.play().catch(() => {}); } else { el.pause(); } },
      { threshold: 0.1 }
    );
    obs.observe(el);
    document.addEventListener('click', tryPlay, { once: true });
    document.addEventListener('touchstart', tryPlay, { once: true });
    return () => { obs.disconnect(); document.removeEventListener('click', tryPlay); document.removeEventListener('touchstart', tryPlay); };
  }, [ref]);
}

/* ════════════════════════════════════════════════════════════
   PINTEREST VIDEO ITEM
   ════════════════════════════════════════════════════════════ */
function PinVideoItem({ src, label, tag, height, delay = 0 }) {
  const videoRef = useRef(null);
  const [muted, setMuted] = useState(true);
  const revealRef = useScrollReveal();
  useAutoplay(videoRef);

  const toggleMute = () => {
    const newVal = !muted;
    if (videoRef.current) { videoRef.current.muted = newVal; videoRef.current.play().catch(() => {}); }
    setMuted(newVal);
  };

  return (
    <div
      ref={revealRef}
      className="scroll-reveal"
      style={{ '--reveal-delay': `${delay}ms`, breakInside: 'avoid', marginBottom: '14px' }}
    >
      <div style={{
        position: 'relative', borderRadius: '16px',
        overflow: 'hidden', border: '1px solid rgba(196,154,60,0.22)',
        background: '#0d0a05', height,
      }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg, #6b4e1f, #d4af57, #6b4e1f)', zIndex: 4 }} />
        <video ref={videoRef} src={src} muted autoPlay loop playsInline preload="auto"
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        <button onClick={toggleMute} style={{
          position: 'absolute', top: 12, right: 12, zIndex: 5,
          width: '36px', height: '36px', borderRadius: '50%',
          background: 'rgba(12,8,3,0.72)', backdropFilter: 'blur(8px)',
          border: '1px solid rgba(196,154,60,0.35)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', fontSize: '0.8rem', color: '#d4af57', transition: 'background 0.25s ease',
        }} title={muted ? 'Sound On' : 'Mute'}>
          {muted ? '🔇' : '🔊'}
        </button>
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          padding: '52px 18px 18px',
          background: 'linear-gradient(to top, rgba(12,8,3,0.9) 0%, transparent 100%)',
          pointerEvents: 'none',
        }}>
          <span style={{ fontFamily: 'var(--sans)', fontSize: '0.55rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#d4af57', display: 'block', marginBottom: '4px' }}>{tag}</span>
          <span style={{ fontFamily: 'var(--serif)', fontSize: '1rem', color: '#fff', fontWeight: 400 }}>{label}</span>
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   CRAFT PANEL
   ════════════════════════════════════════════════════════════ */
function CraftPanel({ src, tag, title, isLast }) {
  const videoRef = useRef(null);
  const [muted, setMuted] = useState(true);
  const [hovered, setHovered] = useState(false);
  useAutoplay(videoRef);

  const toggleMute = (e) => {
    e.stopPropagation();
    const newVal = !muted;
    if (videoRef.current) { videoRef.current.muted = newVal; videoRef.current.play().catch(() => {}); }
    setMuted(newVal);
  };

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        flex: hovered ? 3.2 : 1, position: 'relative', overflow: 'hidden',
        transition: 'flex 0.6s cubic-bezier(0.16,1,0.3,1)', minWidth: '56px',
        borderRight: isLast ? 'none' : '1px solid rgba(196,154,60,0.12)',
      }}
    >
      <video ref={videoRef} src={src} muted autoPlay loop playsInline preload="auto"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
      <button onClick={toggleMute} style={{
        position: 'absolute', top: 12, right: 12, zIndex: 5,
        width: '30px', height: '30px', borderRadius: '50%',
        background: 'rgba(12,8,3,0.65)', backdropFilter: 'blur(6px)',
        border: '1px solid rgba(196,154,60,0.3)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', fontSize: '0.68rem', color: '#d4af57',
        opacity: hovered ? 1 : 0, transition: 'opacity 0.3s ease',
      }}>
        {muted ? '🔇' : '🔊'}
      </button>
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%,-50%) rotate(-90deg)',
        whiteSpace: 'nowrap', fontFamily: 'var(--sans)', fontSize: '0.55rem',
        letterSpacing: '0.26em', textTransform: 'uppercase', color: 'rgba(212,175,87,0.8)',
        opacity: hovered ? 0 : 1, transition: 'opacity 0.3s ease',
        pointerEvents: 'none', zIndex: 3,
      }}>{title}</div>
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to top, rgba(12,8,3,0.92) 0%, rgba(12,8,3,0.18) 60%, transparent 100%)',
        display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '28px 22px',
      }}>
        <div style={{
          opacity: hovered ? 1 : 0,
          transform: hovered ? 'translateY(0)' : 'translateY(14px)',
          transition: 'all 0.4s cubic-bezier(0.16,1,0.3,1)',
        }}>
          <span style={{ fontFamily: 'var(--sans)', fontSize: '0.55rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#d4af57', display: 'block', marginBottom: '6px' }}>{tag}</span>
          <h3 style={{ fontFamily: 'var(--serif)', fontSize: '1.4rem', color: '#fff', fontWeight: 400, lineHeight: 1.2 }}>{title}</h3>
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   STYLES — scroll reveal FIXED
   ════════════════════════════════════════════════════════════ */
const mobileStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600&family=DM+Sans:wght@300;400;500&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --gold-1: #6b4e1f; --gold-2: #9a7234; --gold-3: #c49a3c; --gold-4: #d4af57;
    --gold-5: #e8cc85; --gold-6: #f5e9c8; --gold-7: #fdf8ee;
    --cream-0: #fffef9; --cream-1: #fdf8f0; --cream-2: #f8f0e3; --cream-3: #f0e6d3; --cream-4: #e5d5bc;
    --ink-1: #120e08; --ink-2: #2e2518; --ink-3: #5a4a35; --ink-4: #8c7a62; --ink-5: #b8a898; --ink-6: #d4c8b8;
    --serif: 'Playfair Display', Georgia, serif;
    --sans: 'DM Sans', system-ui, sans-serif;
    --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
    --radius-sm: 3px; --radius-md: 8px; --radius-lg: 16px;
    --shadow-xs: 0 1px 3px rgba(18,14,8,0.06);
    --shadow-md: 0 8px 32px rgba(18,14,8,0.1), 0 2px 8px rgba(18,14,8,0.06);
    --shadow-lg: 0 24px 64px rgba(18,14,8,0.12), 0 8px 24px rgba(18,14,8,0.08);
    --shadow-gold: 0 8px 40px rgba(154,114,52,0.22);
    --border: 1px solid rgba(196,154,60,0.18);
  }
  html { scroll-behavior: smooth; }
  body { font-family: var(--sans); background: var(--cream-0); color: var(--ink-2); -webkit-font-smoothing: antialiased; }

  /* ── SCROLL REVEAL — FIXED ── */
  .scroll-reveal {
    opacity: 0;
    transform: translateY(32px);
    transition:
      opacity 0.65s cubic-bezier(0.16, 1, 0.3, 1) var(--reveal-delay, 0ms),
      transform 0.65s cubic-bezier(0.16, 1, 0.3, 1) var(--reveal-delay, 0ms);
  }
  .scroll-reveal.revealed {
    opacity: 1;
    transform: translateY(0);
  }
  /* Stagger children inside a revealed parent */
  .reveal-children > * {
    opacity: 0;
    transform: translateY(28px);
    transition:
      opacity 0.55s cubic-bezier(0.16, 1, 0.3, 1),
      transform 0.55s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .reveal-children.revealed > *:nth-child(1) { opacity:1; transform:none; transition-delay: 0ms; }
  .reveal-children.revealed > *:nth-child(2) { opacity:1; transform:none; transition-delay: 90ms; }
  .reveal-children.revealed > *:nth-child(3) { opacity:1; transform:none; transition-delay: 180ms; }
  .reveal-children.revealed > *:nth-child(4) { opacity:1; transform:none; transition-delay: 270ms; }
  .reveal-children.revealed > *:nth-child(5) { opacity:1; transform:none; transition-delay: 360ms; }
  .reveal-children.revealed > *:nth-child(6) { opacity:1; transform:none; transition-delay: 450ms; }
  .reveal-children.revealed > *:nth-child(7) { opacity:1; transform:none; transition-delay: 540ms; }
  .reveal-children.revealed > *:nth-child(8) { opacity:1; transform:none; transition-delay: 630ms; }
  .reveal-children.revealed > *:nth-child(n+9) { opacity:1; transform:none; transition-delay: 720ms; }

  /* ── rest of original styles ── */
  .hero-section { position: relative; width: 100%; min-height: 100vh; display: flex; flex-direction: column; justify-content: space-between; overflow: hidden; }
  @media (max-width: 768px) {
    .hero-section { min-height: 100svh !important; }
    .hero-cnt { padding: 100px 5% 0 !important; }
    .hero-h1 { font-size: clamp(2rem, 7vw, 3rem) !important; margin-bottom: 16px !important; line-height: 1.08 !important; }
    .hero-sub { font-size: 0.82rem !important; margin-bottom: 32px !important; }
    .hero-btns { flex-direction: column !important; align-items: flex-start !important; gap: 10px !important; }
    .hero-stats { gap: 20px !important; padding: 0 5% 12px !important; }
    .stat-num { font-size: 1.8rem !important; }
    .stat-block { padding-left: 14px !important; }
    .hero-dots { padding: 0 5% 28px !important; }
    .hero-sep { margin: 0 5% !important; margin-bottom: 16px !important; }
    .scroll-hint { display: none !important; }
  }
  @media (max-width: 480px) { .hero-h1 { font-size: clamp(1.8rem, 6.5vw, 2.6rem) !important; } .hero-cnt { padding: 88px 5% 0 !important; } }
  .sh { text-align: center; margin-bottom: 72px; }
  .sh-eyebrow { display: inline-flex; align-items: center; gap: 12px; font-family: var(--sans); font-size: 0.6rem; font-weight: 500; letter-spacing: 0.38em; text-transform: uppercase; color: var(--gold-3); margin-bottom: 18px; }
  .sh-eyebrow::before, .sh-eyebrow::after { content: ''; display: block; width: 48px; height: 1px; background: linear-gradient(90deg, transparent, var(--gold-3), transparent); opacity: 0.8; }
  .sh-title { font-family: var(--serif); font-size: clamp(2.2rem, 5.5vw, 3.6rem); font-weight: 400; line-height: 1.15; color: var(--ink-1); letter-spacing: -0.025em; }
  .sh-title em { color: var(--gold-2); font-style: italic; }
  .btn { display: inline-flex; align-items: center; gap: 8px; font-family: var(--sans); font-size: 0.7rem; font-weight: 500; letter-spacing: 0.14em; text-transform: uppercase; text-decoration: none; padding: 15px 36px; border-radius: var(--radius-sm); transition: all 0.35s var(--ease-out); cursor: pointer; border: 1px solid transparent; white-space: nowrap; position: relative; overflow: hidden; }
  .btn-gold { background: linear-gradient(135deg, var(--gold-1) 0%, var(--gold-3) 60%, var(--gold-4) 100%); color: #fff; box-shadow: 0 4px 20px rgba(154,114,52,0.3); }
  .btn-gold:hover { background: linear-gradient(135deg, var(--gold-2) 0%, var(--gold-4) 60%, var(--gold-5) 100%); box-shadow: 0 8px 32px rgba(154,114,52,0.42); transform: translateY(-2px); }
  .btn-ghost { background: transparent; border-color: rgba(255,255,255,0.4); color: #fff; backdrop-filter: blur(6px); }
  .btn-ghost:hover { background: rgba(255,255,255,0.1); border-color: rgba(255,255,255,0.75); transform: translateY(-2px); }
  .btn-outline { background: transparent; border-color: var(--gold-3); color: var(--gold-2); }
  .btn-outline:hover { background: var(--gold-7); box-shadow: var(--shadow-gold); transform: translateY(-2px); }
  .dot { width: 5px; height: 5px; border-radius: 50%; background: rgba(255,255,255,0.3); border: none; cursor: pointer; padding: 0; transition: all 0.4s var(--ease-out); }
  .dot.active { width: 22px; border-radius: 3px; background: var(--gold-4); }
  .occ-pill { display: inline-flex; align-items: center; gap: 10px; padding: 12px 22px; border: var(--border); border-radius: 100px; background: var(--cream-0); cursor: pointer; transition: all 0.35s var(--ease-out); font-family: var(--sans); font-size: 0.82rem; color: var(--ink-3); font-weight: 400; }
  .occ-pill:hover, .occ-pill.active { background: var(--gold-7); border-color: var(--gold-3); color: var(--gold-2); box-shadow: 0 4px 16px rgba(154,114,52,0.2); }
  .occ-icon { width: 34px; height: 34px; border-radius: 50%; background: linear-gradient(135deg, var(--gold-6), var(--cream-3)); border: 1px solid rgba(196,154,60,0.2); display: flex; align-items: center; justify-content: center; font-size: 1rem; flex-shrink: 0; }
  .coll-card { border-radius: var(--radius-lg); overflow: hidden; position: relative; cursor: pointer; border: var(--border); }
  .coll-card img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 0.8s var(--ease-out); }
  .coll-card:hover img { transform: scale(1.07); }
  .coll-card:hover { box-shadow: var(--shadow-lg); }
  .coll-card .coll-info { position: absolute; inset: 0; background: linear-gradient(to top, rgba(12,8,3,0.9) 0%, rgba(12,8,3,0.15) 55%, transparent 100%); display: flex; flex-direction: column; justify-content: flex-end; padding: 32px; }
  .coll-tag { display: inline-block; padding: 5px 14px; background: rgba(196,154,60,0.2); border: 1px solid rgba(196,154,60,0.35); border-radius: 100px; font-family: var(--sans); font-size: 0.6rem; letter-spacing: 0.15em; text-transform: uppercase; color: var(--gold-5); margin-bottom: 10px; width: fit-content; }
  .occ-badge { display: inline-block; padding: 3px 10px; background: rgba(212,175,87,0.25); border: 1px solid rgba(212,175,87,0.4); border-radius: 100px; font-size: 0.58rem; letter-spacing: 0.12em; text-transform: uppercase; color: var(--gold-5); font-family: var(--sans); margin-right: 6px; margin-bottom: 4px; }
  .filter-count { text-align: center; margin-bottom: 32px; font-family: var(--sans); font-size: 0.78rem; color: var(--ink-4); }
  .filter-count strong { color: var(--gold-2); font-weight: 500; }
  .review-c { background: var(--cream-0); border: var(--border); border-radius: var(--radius-lg); padding: 40px 36px; transition: all 0.4s var(--ease-out); }
  .review-c:hover { border-color: rgba(196,154,60,0.4); box-shadow: var(--shadow-md); transform: translateY(-5px); }
  .why-c { background: rgba(253,248,238,0.75); border: var(--border); border-radius: var(--radius-lg); padding: 44px 36px; transition: all 0.4s var(--ease-out); position: relative; overflow: hidden; }
  .why-c::after { content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 2px; background: linear-gradient(90deg, var(--gold-2), var(--gold-4), var(--gold-2)); transform: scaleX(0); transform-origin: left; transition: transform 0.5s var(--ease-out); }
  .why-c:hover::after { transform: scaleX(1); }
  .why-c:hover { border-color: rgba(196,154,60,0.4); box-shadow: var(--shadow-md); transform: translateY(-5px); }
  .why-icon-box { width: 60px; height: 60px; background: linear-gradient(135deg, var(--gold-7), var(--cream-3)); border: var(--border); border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; font-size: 1.6rem; margin-bottom: 28px; }
  .trust-it { display: flex; align-items: center; gap: 8px; font-family: var(--sans); font-size: 0.75rem; color: var(--ink-4); padding: 0 16px; border-right: 1px solid rgba(196,154,60,0.15); white-space: nowrap; }
  .trust-it:last-child { border-right: none; }
  .rate-badge { display: inline-flex; align-items: center; gap: 6px; padding: 3px 10px; background: linear-gradient(135deg, var(--gold-1), var(--gold-2)); color: #fff; font-size: 0.58rem; font-weight: 600; letter-spacing: 0.18em; text-transform: uppercase; border-radius: 2px; font-family: var(--sans); }
  .rate-badge::before { content: ''; width: 5px; height: 5px; border-radius: 50%; background: #4eff91; animation: pulse 1.5s infinite; }
  @keyframes pulse { 0% { box-shadow: 0 0 0 0 rgba(78,255,145,0.5); } 70% { box-shadow: 0 0 0 5px rgba(78,255,145,0); } 100% { box-shadow: 0 0 0 0 rgba(78,255,145,0); } }
  .photo-c { border-radius: var(--radius-md); overflow: hidden; position: relative; aspect-ratio: 1; border: var(--border); cursor: pointer; }
  .photo-c img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 0.7s var(--ease-out); }
  .photo-c:hover img { transform: scale(1.08); }
  .photo-overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(12,8,3,0.8), transparent); display: flex; align-items: flex-end; padding: 16px; opacity: 0; transition: opacity 0.4s ease; }
  .photo-c:hover .photo-overlay { opacity: 1; }
  .nl-input { flex: 1; padding: 16px 22px; background: var(--cream-0); border: 1px solid rgba(196,154,60,0.28); border-right: none; color: var(--ink-2); font-size: 0.88rem; font-family: var(--sans); outline: none; }
  .nl-input::placeholder { color: var(--ink-5); }
  .nl-input:focus { border-color: var(--gold-3); }
  .nl-btn { padding: 16px 30px; background: linear-gradient(135deg, var(--gold-1), var(--gold-3)); color: #fff; border: none; font-family: var(--sans); font-size: 0.68rem; font-weight: 500; letter-spacing: 0.15em; text-transform: uppercase; cursor: pointer; transition: all 0.35s var(--ease-out); }
  .nl-btn:hover { background: linear-gradient(135deg, var(--gold-2), var(--gold-4)); }
  @keyframes scrollDrop { 0% { transform: translateY(0); opacity: 1; } 80% { transform: translateY(18px); opacity: 0; } 81% { transform: translateY(0); opacity: 0; } 100% { opacity: 1; } }
  .scroll-line { width: 1px; height: 48px; background: linear-gradient(to bottom, var(--gold-4), transparent); animation: scrollDrop 2.2s ease-in-out infinite; }
  @keyframes fadeUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
  .fu { animation: fadeUp 0.9s var(--ease-out) both; }
  .fu1 { animation-delay: 0.08s; } .fu2 { animation-delay: 0.2s; } .fu3 { animation-delay: 0.32s; }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
  .coll-card-anim { animation: fadeIn 0.4s var(--ease-out) both; }
  .sep { width: 100%; height: 1px; background: linear-gradient(90deg, transparent, rgba(196,154,60,0.25), transparent); }
  .store-item { display: flex; gap: 16px; align-items: flex-start; padding: 18px 0; border-bottom: 1px solid rgba(196,154,60,0.1); }
  .store-item:last-of-type { border-bottom: none; }
  .store-icon { width: 38px; height: 38px; border-radius: var(--radius-md); background: var(--gold-7); border: var(--border); display: flex; align-items: center; justify-content: center; font-size: 1rem; flex-shrink: 0; }
  .press-logo { text-align: center; padding: 12px 20px; border: 1px solid rgba(196,154,60,0.12); border-radius: var(--radius-md); transition: all 0.4s ease; cursor: default; opacity: 0.5; }
  .press-logo:hover { opacity: 1; border-color: rgba(196,154,60,0.3); background: var(--gold-7); }
  .stat-block { border-left: 1px solid rgba(212,175,87,0.25); padding-left: 24px; }
  .stat-num { font-family: var(--serif); font-size: clamp(2.4rem, 5vw, 3.2rem); color: var(--gold-4); font-weight: 400; line-height: 1; display: block; margin-bottom: 5px; }
  .stat-lbl { font-family: var(--sans); color: rgba(255,255,255,0.45); font-size: 0.65rem; letter-spacing: 0.12em; text-transform: uppercase; }
  .grain-overlay::after { content: ''; position: absolute; inset: 0; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E"); pointer-events: none; z-index: 3; mix-blend-mode: overlay; }
  .pin-grid { columns: 3; column-gap: 14px; max-width: 1280px; margin: 0 auto; }
  @media (max-width: 900px) { .pin-grid { columns: 2; } }
  @media (max-width: 540px) { .pin-grid { columns: 1; } }
  .craft-strip-wrap { display: flex; max-width: 1280px; margin: 0 auto; border-radius: 16px; overflow: hidden; border: 1px solid rgba(196,154,60,0.2); box-shadow: 0 24px 64px rgba(18,14,8,0.12); height: 480px; }
  @media (max-width: 768px) { .craft-strip-wrap { flex-direction: column; height: auto; } }
  @media (max-width: 900px) { .about-grid { grid-template-columns: 1fr !important; gap: 48px !important; } .store-grid { grid-template-columns: 1fr !important; gap: 40px !important; } .why-grid { grid-template-columns: 1fr !important; } .about-badge { bottom: 12px !important; right: 12px !important; } }
  @media (max-width: 680px) { .trust-strip { overflow-x: auto; flex-wrap: nowrap !important; justify-content: flex-start !important; padding: 0 5% !important; } .occ-wrap { max-width: 100% !important; } .cta-row { flex-direction: column !important; align-items: center; } .sh-title { font-size: 1.85rem !important; } .nl-wrap { flex-direction: column !important; } .nl-input { border-right: 1px solid rgba(196,154,60,0.28) !important; } }
  @media (max-width: 480px) { .reviews-g { grid-template-columns: 1fr !important; } .featured-g { grid-template-columns: 1fr !important; } .coll-g { grid-template-columns: 1fr !important; } .photo-g { grid-template-columns: repeat(2, 1fr) !important; } }
`;

/* ════════════════════════════════════════════════════════════
   HOME
   ════════════════════════════════════════════════════════════ */
export default function Home() {
  const [collections, setCollections] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [goldRate] = useState({ k22: '7,350', k18: '6,010' });
  const [selectedOccasion, setSelectedOccasion] = useState(null);
  const [slide, setSlide] = useState(0);
  const collectionRef = useRef(null);
  const navigate = useNavigate();

  const heroImages = [
    "https://s3.ap-south-1.amazonaws.com/awsimages.imagesbazaar.com/900x600/21574/300-SM1122731.jpg",
    "https://images.jdmagicbox.com/quickquotes/images_main/timeless-antique-gold-necklace-2220011947-0psdm8bx.jpg",
    "https://cdn.shopify.com/s/files/1/0555/4995/2315/files/Perfect_Gold_Earring_2.png?v=1756148308",
    "https://kaijewel.in/cdn/shop/products/NLCS394_ccd6aad6-28a4-49e7-9505-48941ae25fc9.jpg?v=1752320227&width=1920",
  ];

  useEffect(() => {
    const t = setInterval(() => setSlide(p => (p + 1) % heroImages.length), 5000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    axios.get('/api/collections').then(r => {
      if (Array.isArray(r.data)) setCollections(r.data);
      else if (r.data?.collections) setCollections(r.data.collections);
      else if (r.data?.data) setCollections(r.data.data);
      else setCollections([]);
    }).catch(() => {});
    axios.get('/api/products?featured=true&limit=4').then(r => setFeatured(Array.isArray(r.data.products) ? r.data.products : [])).catch(() => {});
  }, []);

  const displayCollections = collections.length > 0
    ? collections.map(col => { const demo = demoCollections.find(d => d.slug === col.slug); return demo ? { ...col, occasions: col.occasions ?? demo.occasions } : col; })
    : demoCollections;

  const filteredCollections = selectedOccasion
    ? displayCollections.filter(col => col.occasions?.includes(selectedOccasion))
    : displayCollections;

  const handleOccasionClick = (slug) => {
    setSelectedOccasion(prev => prev === slug ? null : slug);
    setTimeout(() => collectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
  };

  return (
    <div style={{ background: 'var(--cream-0)' }}>
      <style>{mobileStyles}</style>
      <ExitIntentPopup />
      <NewArrivalsMarquee />

      {/* ══ HERO — no reveal (already visible) ══ */}
      <section className="grain-overlay hero-section">
        {heroImages.map((img, i) => (
          <img key={i} src={img} alt="" aria-hidden="true" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 1, opacity: slide === i ? 1 : 0, transition: 'opacity 2s ease-in-out', pointerEvents: 'none' }} />
        ))}
        <div style={{ position: 'absolute', inset: 0, zIndex: 2, background: 'linear-gradient(to right, rgba(12,8,3,0.82) 0%, rgba(12,8,3,0.42) 55%, rgba(12,8,3,0.18) 100%), linear-gradient(to top, rgba(12,8,3,0.65) 0%, transparent 48%)' }} />
        <div style={{ position: 'absolute', top: 0, left: '4.5%', zIndex: 3, width: '1px', height: '100%', background: 'linear-gradient(to bottom, transparent 5%, rgba(196,154,60,0.2) 30%, rgba(196,154,60,0.2) 70%, transparent 95%)' }} />

        <div className="hero-cnt" style={{ position: 'relative', zIndex: 4, padding: '148px 6.5% 0', maxWidth: '860px' }}>
          <div className="fu" style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
            <div style={{ width: '28px', height: '1px', background: 'var(--gold-4)' }} />
            <span style={{ fontFamily: 'var(--sans)', color: 'var(--gold-5)', fontSize: '0.6rem', letterSpacing: '0.36em', textTransform: 'uppercase' }}>Est. 1995 · Handcrafted Excellence · Ahmedabad</span>
          </div>
          <h1 className="fu fu1 hero-h1" style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(3.2rem, 8.5vw, 6.8rem)', lineHeight: 1.02, fontWeight: 400, color: '#fff', marginBottom: '28px', letterSpacing: '-0.03em' }}>
            Where Diamonds<br />
            <em style={{ fontStyle: 'italic', fontWeight: 500, background: 'linear-gradient(135deg, #d4af57 0%, #e8cc85 45%, #c49a3c 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Meet Destiny</em>
          </h1>
          <p className="fu fu2 hero-sub" style={{ fontFamily: 'var(--sans)', color: 'rgba(255,255,255,0.52)', fontSize: '0.95rem', lineHeight: 1.9, maxWidth: '420px', marginBottom: '52px', fontWeight: 300 }}>
            Discover exquisite craftsmanship in every piece.<br />Treasures that last generations.
          </p>
          <div className="hero-btns fu fu3" style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <Link to="/collections" className="btn btn-gold">Explore Collections</Link>
            <Link to="/contact" className="btn btn-ghost">Book Consultation</Link>
          </div>
        </div>

        <div style={{ position: 'absolute', bottom: '130px', left: '50%', transform: 'translateX(-50%)', zIndex: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }} className="scroll-hint">
          <span style={{ color: 'rgba(255,255,255,0.28)', fontSize: '0.48rem', letterSpacing: '0.3em', fontFamily: 'var(--sans)' }}>SCROLL</span>
          <div className="scroll-line" />
        </div>

        <div style={{ position: 'relative', zIndex: 4 }}>
          <div className="hero-sep" style={{ height: '1px', background: 'linear-gradient(90deg, rgba(196,154,60,0.5), rgba(196,154,60,0.08))', margin: '0 6.5%', marginBottom: '32px' }} />
          <div className="hero-stats" style={{ display: 'flex', gap: '48px', padding: '0 6.5% 20px', flexWrap: 'wrap' }}>
            {[['2000+', 'Happy Clients'], ['500+', 'Unique Designs'], ['29+', 'Years of Trust']].map(([n, l]) => (
              <div key={l} className="stat-block"><span className="stat-num">{n}</span><span className="stat-lbl">{l}</span></div>
            ))}
          </div>
          <div className="hero-dots" style={{ display: 'flex', gap: '7px', padding: '0 6.5% 52px', alignItems: 'center' }}>
            {heroImages.map((_, i) => <button key={i} className={`dot${slide === i ? ' active' : ''}`} onClick={() => setSlide(i)} />)}
          </div>
        </div>
      </section>

      {/* ══ TRUST STRIP ══ */}
      <Reveal>
        <section style={{ background: 'var(--cream-0)', borderBottom: '1px solid rgba(196,154,60,0.12)', padding: '18px 0', overflow: 'hidden' }}>
          <div className="trust-strip" style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }}>
            {[['🔒','SSL Secured Payments'],['🏅','BIS Hallmark Certified'],['🚚','Insured Shipping'],['↩️','7-Day Easy Returns'],['⭐','29+ Years Trusted']].map(([icon, text]) => (
              <div key={text} className="trust-it"><span style={{ fontSize: '0.9rem' }}>{icon}</span><span>{text}</span></div>
            ))}
          </div>
        </section>
      </Reveal>

      {/* ══ GOLD RATE ══ */}
      <Reveal delay={100}>
        <section style={{ background: 'var(--cream-1)', borderBottom: '1px solid rgba(196,154,60,0.12)', padding: '14px 6%' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div className="rate-badge">LIVE</div>
              <span style={{ color: 'var(--ink-4)', fontSize: '0.78rem', fontFamily: 'var(--sans)' }}>Today's Gold Rate — Ahmedabad</span>
            </div>
            <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
              {[['22K Gold / gram', `₹${goldRate.k22}`], ['18K Gold / gram', `₹${goldRate.k18}`]].map(([label, rate]) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ color: 'var(--ink-5)', fontSize: '0.72rem', fontFamily: 'var(--sans)' }}>{label}</span>
                  <span style={{ color: 'var(--gold-2)', fontFamily: 'var(--serif)', fontSize: '1.3rem', fontWeight: 500 }}>{rate}</span>
                </div>
              ))}
            </div>
            <span style={{ color: 'var(--ink-6)', fontSize: '0.67rem', fontFamily: 'var(--sans)', fontStyle: 'italic' }}>*Indicative. Contact store for exact price.</span>
          </div>
        </section>
      </Reveal>

      <Reveal><HowItWorks /></Reveal>

      {/* ══ PINTEREST VIDEO GALLERY ══ */}
      <section style={{ background: 'var(--cream-0)', padding: '96px 6%' }}>
        <Reveal>
          <div className="sh">
            <p className="sh-eyebrow">Watch & Explore</p>
            <h2 className="sh-title">Our <em>Collections</em> in Motion</h2>
            <p style={{ color: 'var(--ink-4)', fontSize: '0.85rem', fontFamily: 'var(--sans)', marginTop: '14px', fontWeight: 300 }}>
              🔇 Tap the corner to control sound
            </p>
          </div>
        </Reveal>
        <div className="pin-grid">
          {pinterestVideos.map((v, i) => <PinVideoItem key={i} {...v} delay={i * 80} />)}
        </div>
      </section>

      <div className="sep" />

      {/* ══ SHOP BY OCCASION ══ */}
      <section style={{ background: 'var(--cream-1)', padding: '88px 6%' }}>
        <Reveal>
          <div className="sh" style={{ marginBottom: '48px' }}>
            <p className="sh-eyebrow">Find Your Perfect Piece</p>
            <h2 className="sh-title">Shop by <em>Occasion</em></h2>
            {selectedOccasion && <p style={{ marginTop: '16px', color: 'var(--ink-4)', fontSize: '0.8rem', fontFamily: 'var(--sans)' }}>Neeche dekho — <strong style={{ color: 'var(--gold-2)' }}>{occasions.find(o => o.slug === selectedOccasion)?.label}</strong> ke liye best collections! 👇</p>}
          </div>
        </Reveal>
        <Reveal delay={120}>
          <div className="occ-wrap" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '12px', maxWidth: '780px', margin: '0 auto' }}>
            {occasions.map(({ icon, label, slug }) => (
              <div key={label} className={`occ-pill${selectedOccasion === slug ? ' active' : ''}`} onClick={() => handleOccasionClick(slug)}>
                <div className="occ-icon">{icon}</div>{label}
                {selectedOccasion === slug && <span style={{ fontSize: '0.7rem', marginLeft: '2px' }}>✓</span>}
              </div>
            ))}
          </div>
          {selectedOccasion && <div style={{ textAlign: 'center', marginTop: '20px' }}><button onClick={() => setSelectedOccasion(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink-4)', fontSize: '0.78rem', fontFamily: 'var(--sans)', textDecoration: 'underline' }}>✕ Remove filter</button></div>}
        </Reveal>
      </section>

      <div className="sep" />

      {/* ══ COLLECTIONS ══ */}
      <section ref={collectionRef} style={{ background: 'var(--cream-2)', padding: '96px 6%' }}>
        <Reveal>
          <div className="sh">
            <p className="sh-eyebrow">{selectedOccasion ? `${occasions.find(o => o.slug === selectedOccasion)?.label} Collections` : 'Our Specialties'}</p>
            <h2 className="sh-title">{selectedOccasion ? <>{occasions.find(o => o.slug === selectedOccasion)?.icon} <em>{occasions.find(o => o.slug === selectedOccasion)?.label}</em> ke liye Best</> : <>Crafted for Your<br /><em>Special Moments</em></>}</h2>
          </div>
        </Reveal>
        {selectedOccasion && <p className="filter-count"><strong>{filteredCollections.length}</strong> collections found for <strong>{occasions.find(o => o.slug === selectedOccasion)?.label}</strong></p>}
        {filteredCollections.length === 0 ? (
          <Reveal>
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <p style={{ fontSize: '3rem', marginBottom: '16px' }}>🔍</p>
              <p style={{ fontFamily: 'var(--serif)', fontSize: '1.3rem', color: 'var(--ink-2)', marginBottom: '28px' }}>Koi collection nahi mili</p>
              <button onClick={() => setSelectedOccasion(null)} className="btn btn-outline">Sab Collections Dekho →</button>
            </div>
          </Reveal>
        ) : (
          <div className="coll-g" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: '18px', maxWidth: '1280px', margin: '0 auto' }}>
            {filteredCollections.map((col, i) => (
              <Reveal key={col._id || i} delay={i * 70}>
                <div className="coll-card coll-card-anim" onClick={() => navigate(`/collections/${col.slug}`)} style={{ height: i === 0 ? '480px' : '380px' }}>
                  <img src={col.image} alt={col.name} />
                  <div className="coll-info">
                    {selectedOccasion && col.occasions && <div style={{ marginBottom: '8px' }}>{col.occasions.map(occ => { const o = occasions.find(x => x.slug === occ); return o ? <span key={occ} className="occ-badge">{o.icon} {o.label}</span> : null; })}</div>}
                    <div className="coll-tag">Collection</div>
                    <h3 style={{ fontFamily: 'var(--serif)', fontSize: '1.7rem', fontWeight: 400, color: '#fff', marginBottom: '6px' }}>{col.name}</h3>
                    <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.78rem', marginBottom: '18px', fontFamily: 'var(--sans)', lineHeight: 1.6 }}>{col.description}</p>
                    <span style={{ color: 'var(--gold-5)', fontSize: '0.65rem', letterSpacing: '0.18em', fontFamily: 'var(--sans)', textTransform: 'uppercase', fontWeight: 500 }}>Explore →</span>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        )}
        {selectedOccasion && filteredCollections.length > 0 && (
          <Reveal delay={200}>
            <div style={{ textAlign: 'center', marginTop: '48px' }}><button onClick={() => setSelectedOccasion(null)} className="btn btn-outline">← Sab Collections Dekho</button></div>
          </Reveal>
        )}
      </section>

      {/* ══ FEATURED PRODUCTS ══ */}
      {featured.length > 0 && (
        <section style={{ background: 'var(--cream-1)', padding: '96px 6%' }}>
          <Reveal><div className="sh"><p className="sh-eyebrow">Hand Picked</p><h2 className="sh-title">Featured <em>Pieces</em></h2></div></Reveal>
          <div className="featured-g" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(265px, 1fr))', gap: '24px', maxWidth: '1280px', margin: '0 auto' }}>
            {featured.map((p, i) => (
              <Reveal key={p._id} delay={i * 80}><ProductCard product={p} /></Reveal>
            ))}
          </div>
          <Reveal delay={200}><div style={{ textAlign: 'center', marginTop: '56px' }}><Link to="/collections" className="btn btn-outline">View All Collections →</Link></div></Reveal>
        </section>
      )}

      <Reveal><GiftFinderQuiz /></Reveal>

      {/* ══ ABOUT ══ */}
      <section style={{ background: 'var(--cream-0)', padding: '96px 6%' }}>
        <div className="about-grid" style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'center' }}>
          <Reveal>
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', top: '-20px', left: '-20px', right: '20px', bottom: '20px', border: '1px solid rgba(196,154,60,0.22)', borderRadius: 'var(--radius-lg)', pointerEvents: 'none' }} />
              <img src="https://www.karpagamjewellers.com/wp-content/uploads/2024/05/Traditional-Gold-Jewellery-Collections.jpg" alt="Craft" style={{ width: '100%', borderRadius: 'var(--radius-lg)', objectFit: 'cover', height: '460px', display: 'block' }} />
              <div className="about-badge" style={{ position: 'absolute', bottom: '-28px', right: '-28px', background: 'linear-gradient(135deg, var(--gold-1), var(--gold-2))', color: '#fff', padding: '30px 26px', borderRadius: 'var(--radius-lg)', textAlign: 'center', boxShadow: 'var(--shadow-gold)' }}>
                <span style={{ fontFamily: 'var(--serif)', fontSize: '2.8rem', fontWeight: 400, display: 'block', lineHeight: 1, color: 'var(--gold-5)' }}>29</span>
                <span style={{ fontFamily: 'var(--sans)', fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', opacity: 0.75, marginTop: '4px', display: 'block' }}>Years of Trust</span>
              </div>
            </div>
          </Reveal>
          <Reveal delay={150}>
            <div style={{ paddingTop: '16px' }}>
              <p className="sh-eyebrow" style={{ justifyContent: 'flex-start' }}>Our Story</p>
              <h2 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(2rem, 3.8vw, 3rem)', fontWeight: 400, lineHeight: 1.18, marginBottom: '28px', color: 'var(--ink-1)' }}>
                Crafting Memories,<br /><em style={{ color: 'var(--gold-2)', fontStyle: 'italic' }}>One Jewel at a Time</em>
              </h2>
              <p style={{ color: 'var(--ink-3)', lineHeight: 1.95, marginBottom: '44px', fontSize: '0.93rem', fontFamily: 'var(--sans)', fontWeight: 300, borderLeft: '2px solid var(--gold-4)', paddingLeft: '20px' }}>
                Riddhi Jewellers has been a beacon of trust for over two decades. Our master craftsmen combine traditional techniques with contemporary designs to create pieces that tell your story.
              </p>
              <Link to="/about" className="btn btn-gold">Read Our Story →</Link>
            </div>
          </Reveal>
        </div>
      </section>

      <Reveal><BeforeAfterSection /></Reveal>

      {/* ══ WHY CHOOSE US ══ */}
      <section style={{ background: 'var(--cream-2)', padding: '96px 6%' }}>
        <Reveal><div className="sh"><p className="sh-eyebrow">Why Choose Us</p><h2 className="sh-title">Crafted with <em>Love & Trust</em></h2></div></Reveal>
        <div className="why-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(265px, 1fr))', gap: '18px', maxWidth: '1280px', margin: '0 auto' }}>
          {[
            { icon: '🏅', title: 'BIS Hallmarked Gold', desc: 'Every piece is certified and hallmarked, ensuring you get only the purest gold and genuine gemstones.' },
            { icon: '💍', title: 'Custom Jewellery', desc: 'Design your dream jewellery from scratch. Our artisans bring your vision to life with precision and care.' },
            { icon: '🔧', title: 'Lifetime Service', desc: 'Free polishing, cleaning, and repair for all jewellery purchased from us, for life.' },
            { icon: '👥', title: 'Personal Consultation', desc: 'Book a one-on-one session with our experts to create your perfect custom piece.' },
          ].map(({ icon, title, desc }, i) => (
            <Reveal key={title} delay={i * 90}>
              <div className="why-c">
                <div className="why-icon-box">{icon}</div>
                <h3 style={{ fontFamily: 'var(--serif)', fontSize: '1.3rem', fontWeight: 500, color: 'var(--ink-1)', marginBottom: '14px' }}>{title}</h3>
                <p style={{ color: 'var(--ink-3)', lineHeight: 1.85, fontSize: '0.87rem', fontFamily: 'var(--sans)', fontWeight: 300 }}>{desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <Reveal><AwardsCertifications /></Reveal>

      {/* ══ REVIEWS ══ */}
      <section style={{ background: 'var(--cream-1)', padding: '96px 6%' }}>
        <Reveal><div className="sh"><p className="sh-eyebrow">Real Stories</p><h2 className="sh-title">What Our Clients <em>Say</em></h2></div></Reveal>
        <div className="reviews-g" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))', gap: '20px', maxWidth: '1280px', margin: '0 auto' }}>
          {reviews.map((r, i) => (
            <Reveal key={i} delay={i * 80}>
              <div className="review-c">
                <div style={{ color: 'var(--gold-3)', fontSize: '0.8rem', marginBottom: '24px', letterSpacing: '3px' }}>{'★'.repeat(r.stars)}<span style={{ color: 'var(--cream-4)' }}>{'★'.repeat(5 - r.stars)}</span></div>
                <p style={{ color: 'var(--ink-3)', lineHeight: 1.88, fontSize: '0.87rem', marginBottom: '30px', fontFamily: 'var(--sans)', fontWeight: 300, fontStyle: 'italic' }}>"{r.text}"</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', paddingTop: '20px', borderTop: '1px solid rgba(196,154,60,0.12)' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--gold-7), var(--cream-3))', border: 'var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--serif)', fontSize: '1.15rem', color: 'var(--gold-2)', fontWeight: 600 }}>{r.name[0]}</div>
                  <div>
                    <strong style={{ display: 'block', fontSize: '0.84rem', color: 'var(--ink-1)', fontFamily: 'var(--sans)', fontWeight: 500, marginBottom: '2px' }}>{r.name}</strong>
                    <span style={{ color: 'var(--ink-5)', fontSize: '0.7rem', fontFamily: 'var(--sans)' }}>{r.occasion}</span>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal delay={200}><div style={{ textAlign: 'center', marginTop: '56px' }}><a href="https://g.page/r/YOUR_GOOGLE_REVIEW_LINK" target="_blank" rel="noreferrer" className="btn btn-outline">⭐ Leave a Review on Google →</a></div></Reveal>
      </section>

      <Reveal><FestivalCalendar /></Reveal>
      <Reveal><EMICalculator /></Reveal>
      <Reveal><GoldInvestment /></Reveal>

      {/* ══ BRIDAL STORIES — craft accordion strip ══ */}
      <section style={{ background: 'var(--cream-2)', padding: '96px 6%' }}>
        <Reveal>
          <div className="sh">
            <p className="sh-eyebrow">BRIDAL STORIES</p>
            <h2 className="sh-title">Watch Our <em>Brides Shine</em></h2>
            <p style={{ color: 'var(--ink-4)', fontSize: '0.85rem', fontFamily: 'var(--sans)', marginTop: '14px', fontWeight: 300 }}>Discover real brides adorned in timeless craftsmanship</p>
          </div>
        </Reveal>
        <Reveal delay={100}>
          <div className="craft-strip-wrap">
            {craftVideos.map((v, i) => <CraftPanel key={i} {...v} isLast={i === craftVideos.length - 1} />)}
          </div>
        </Reveal>
      </section>

      {/* ══ CUSTOMER PHOTOS ══ */}
      <section style={{ background: 'var(--cream-1)', padding: '96px 6%' }}>
        <Reveal><div className="sh"><p className="sh-eyebrow">As Seen on Our Brides</p><h2 className="sh-title">Real Moments, <em>Real Joy</em></h2></div></Reveal>
        <div className="photo-g" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(195px, 1fr))', gap: '10px', maxWidth: '1280px', margin: '0 auto' }}>
          {customerPhotos.map((photo, i) => (
            <Reveal key={i} delay={i * 60}>
              <div className="photo-c"><img src={photo.image} alt={photo.caption} /><div className="photo-overlay"><p style={{ color: '#fff', fontSize: '0.72rem', margin: 0, fontFamily: 'var(--sans)' }}>{photo.caption}</p></div></div>
            </Reveal>
          ))}
        </div>
        <Reveal delay={200}><div style={{ textAlign: 'center', marginTop: '40px' }}><a href="https://instagram.com/riddhijewellers916" target="_blank" rel="noreferrer" className="btn btn-outline">📸 Follow on Instagram →</a></div></Reveal>
      </section>

      <Reveal><JewelleryCareGuide /></Reveal>
      <Reveal><BlogPreview /></Reveal>
      <Reveal><VirtualTryOnTeaser /></Reveal>
      <Reveal><DeliveryInfo /></Reveal>

      {/* ══ BOOK APPOINTMENT ══ */}
      <Reveal>
        <section style={{ background: 'var(--cream-0)', padding: '96px 6%', textAlign: 'center', borderTop: '1px solid rgba(196,154,60,0.12)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '700px', height: '700px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(196,154,60,0.055) 0%, transparent 65%)', pointerEvents: 'none' }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div className="sh" style={{ marginBottom: '28px' }}><p className="sh-eyebrow">Personalized Experience</p><h2 className="sh-title">Book a Private <em>Consultation</em></h2></div>
            <p style={{ color: 'var(--ink-3)', fontSize: '0.92rem', lineHeight: 1.95, maxWidth: '500px', margin: '0 auto 52px', fontFamily: 'var(--sans)', fontWeight: 300 }}>Our jewellery experts will guide you, help design custom pieces, and ensure the perfect fit for every occasion.</p>
            <div className="cta-row" style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/contact" className="btn btn-gold">Book Appointment →</Link>
              <a href="tel:+919104261433" className="btn btn-outline">📞 Call Us Now</a>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '64px', marginTop: '80px', flexWrap: 'wrap' }}>
              {[['Mon – Sat','10:00 AM – 8:00 PM'],['Sunday','11:00 AM – 6:00 PM'],['Location','Ahmedabad, Gujarat']].map(([label, value]) => (
                <div key={label} style={{ textAlign: 'center' }}>
                  <p style={{ color: 'var(--ink-5)', fontSize: '0.6rem', letterSpacing: '0.24em', textTransform: 'uppercase', marginBottom: '8px', fontFamily: 'var(--sans)' }}>{label}</p>
                  <p style={{ color: 'var(--gold-2)', fontFamily: 'var(--serif)', fontSize: '1.05rem', fontWeight: 400 }}>{value}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </Reveal>

      {/* ══ STORE LOCATOR ══ */}
      <section style={{ background: 'var(--cream-2)', padding: '96px 6%' }}>
        <div className="store-grid" style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'center' }}>
          <Reveal>
            <div>
              <p className="sh-eyebrow" style={{ justifyContent: 'flex-start' }}>Visit Us</p>
              <h2 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(1.9rem, 3.8vw, 2.8rem)', fontWeight: 400, marginBottom: '40px', color: 'var(--ink-1)' }}>Find Our <em style={{ color: 'var(--gold-2)', fontStyle: 'italic' }}>Showroom</em></h2>
              {[{icon:'📍',label:'Address',value:'16, Vrundavan Residency Rd, nr. Mahrshi Sandipni, Vasant Vihar 2, Nava Naroda, Ahmedabad, Gujarat 382330'},{icon:'📞',label:'Phone',value:'+91 9104261433'},{icon:'✉️',label:'Email',value:'info@riddhijewellers.com'},{icon:'🕙',label:'Hours',value:'Mon–Sat: 10AM–8PM  |  Sun: 11AM–6PM'}].map(({icon,label,value}) => (
                <div key={label} className="store-item"><div className="store-icon">{icon}</div><div><strong style={{ fontSize: '0.6rem', color: 'var(--ink-5)', display: 'block', marginBottom: '3px', textTransform: 'uppercase', letterSpacing: '0.18em', fontFamily: 'var(--sans)', fontWeight: 500 }}>{label}</strong><span style={{ fontSize: '0.88rem', color: 'var(--ink-2)', fontFamily: 'var(--sans)', fontWeight: 300, lineHeight: 1.65 }}>{value}</span></div></div>
              ))}
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '28px' }}>
                <a href="https://maps.app.goo.gl/ZoYvxqYimHYyWjke6" target="_blank" rel="noreferrer" className="btn btn-gold">Get Directions →</a>
                <a href="https://wa.me/919104261433" target="_blank" rel="noreferrer" className="btn btn-outline">WhatsApp Us</a>
              </div>
            </div>
          </Reveal>
          <Reveal delay={150}>
            <div style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: 'var(--border)', boxShadow: 'var(--shadow-md)', position: 'relative' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', zIndex: 1, background: 'linear-gradient(90deg, var(--gold-1), var(--gold-4), var(--gold-1))' }} />
              <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3671.9!2d72.5714!3d23.0225!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1%3A0x0!2z!5e0!3m2!1sen!2sin!4v1234567890" width="100%" height="430" style={{ border: 0, display: 'block' }} allowFullScreen loading="lazy" title="Riddhi Jewellers" />
            </div>
          </Reveal>
        </div>
      </section>

      <Reveal><FAQSection /></Reveal>
      <Reveal><NewsletterStrip /></Reveal>

      {/* ══ PRESS ══ */}
      <Reveal>
        <section style={{ background: 'var(--cream-1)', padding: '56px 6%', borderBottom: '1px solid rgba(196,154,60,0.12)' }}>
          <p style={{ textAlign: 'center', color: 'var(--ink-5)', fontSize: '0.58rem', letterSpacing: '0.35em', textTransform: 'uppercase', marginBottom: '36px', fontFamily: 'var(--sans)' }}>Certified By & Featured In</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap', maxWidth: '900px', margin: '0 auto' }}>
            {pressLogos.map(({ name, note }) => (
              <div key={name} className="press-logo">
                <div style={{ color: 'var(--gold-2)', fontFamily: 'var(--serif)', fontSize: '1rem', fontWeight: 500 }}>{name}</div>
                {note && <div style={{ color: 'var(--ink-5)', fontSize: '0.62rem', marginTop: '3px', fontFamily: 'var(--sans)' }}>{note}</div>}
              </div>
            ))}
          </div>
        </section>
      </Reveal>
    </div>
  );
}

/* ══ NEWSLETTER ══ */
function NewsletterStrip() {
  const [value, setValue] = useState('');
  const [submitted, setSubmitted] = useState(false);
  return (
    <section style={{ background: 'linear-gradient(160deg, #0a0703 0%, #1a1208 50%, #0d0a05 100%)', padding: '88px 6%', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 40px, rgba(196,154,60,0.03) 40px, rgba(196,154,60,0.03) 41px)', pointerEvents: 'none' }} />
      <div style={{ position: 'relative', zIndex: 1 }}>
        <p style={{ fontFamily: 'var(--sans)', color: 'var(--gold-4)', fontSize: '0.58rem', letterSpacing: '0.38em', textTransform: 'uppercase', marginBottom: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
          <span style={{ display: 'block', width: '30px', height: '1px', background: 'var(--gold-4)', opacity: 0.5 }} />Exclusive Offers<span style={{ display: 'block', width: '30px', height: '1px', background: 'var(--gold-4)', opacity: 0.5 }} />
        </p>
        <h2 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(1.9rem, 4vw, 2.6rem)', fontWeight: 400, color: '#fff', marginBottom: '12px' }}>Festival Offers & <em style={{ color: 'var(--gold-4)', fontStyle: 'italic' }}>New Arrivals</em></h2>
        <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.85rem', marginBottom: '44px', fontFamily: 'var(--sans)', fontWeight: 300 }}>Join 2000+ happy families. No spam — only special deals.</p>
        {submitted ? <p style={{ color: 'var(--gold-4)', fontFamily: 'var(--serif)', fontSize: '1.1rem' }}>🎉 Thank you! We'll be in touch soon.</p> : (
          <div className="nl-wrap" style={{ display: 'flex', maxWidth: '460px', margin: '0 auto', boxShadow: '0 8px 40px rgba(0,0,0,0.4)', borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
            <input type="email" placeholder="Your email address" value={value} onChange={e => setValue(e.target.value)} className="nl-input" />
            <button className="nl-btn" onClick={() => value.trim() && setSubmitted(true)}>Subscribe</button>
          </div>
        )}
      </div>
    </section>
  );
}

/* ══ STATIC DATA ══ */
const demoCollections = [
  { _id:'1', name:'Bridal Jewellery', description:'Complete bridal sets — necklace, bangles, maang tikka, earrings aur zyada', image:'https://www.sneharateria.com/cdn/shop/articles/theweddingcorp_1200x1200.png?v=1676527615', slug:'bridal-jewellery', occasions:['wedding','engagement'] },
  { _id:'2', name:'Bangles', description:'Traditional aur modern gold bangles — har occasion ke liye', image:'https://images.jdmagicbox.com/quickquotes/images_main/-wpb08nw7.jpg', slug:'bangles', occasions:['wedding','anniversary','birthday','gift'] },
  { _id:'3', name:'Modern Wear', description:'Contemporary designs — everyday glamour ke liye', image:'https://www.giva.co/cdn/shop/articles/1_407_-min.jpg?v=1758624615', slug:'modern-wear', occasions:['birthday','graduation','gift'] },
  { _id:'4', name:'Silver Collections', description:'Pure silver jewellery — elegant aur affordable', image:'https://www.karpagamjewellers.com/wp-content/uploads/2024/05/Traditional-Gold-Jewellery-Collections.jpg', slug:'silver-collections', occasions:['birthday','graduation','gift'] },
  { _id:'5', name:"Kid's Collection", description:'Adorable jewellery specially designed for children', image:'https://priyaasi.com/cdn/shop/files/JS-PR-10391-1_grande.jpg?v=1704893163', slug:'kids-collection', occasions:['birthday','gift'] },
  { _id:'6', name:'Pendant', description:'Delicate pendants — dil se diya hua gift', image:'https://cdn.shopify.com/s/files/1/0555/4995/2315/files/Perfect_Gold_Earring_2.png?v=1756148308', slug:'pendant', occasions:['engagement','birthday','anniversary','graduation','gift'] },
  { _id:'7', name:'Diamond Magics', description:'GIA certified diamonds — premium luxury collection', image:'https://s3.ap-south-1.amazonaws.com/awsimages.imagesbazaar.com/900x600/21574/300-SM1122731.jpg', slug:'diamond-magics', occasions:['engagement','anniversary','wedding','gift'] },
  { _id:'8', name:'Rings', description:'Gold aur diamond rings — engagement se anniversary tak', image:'https://kaijewel.in/cdn/shop/products/NLCS394_ccd6aad6-28a4-49e7-9505-48941ae25fc9.jpg?v=1752320227&width=1920', slug:'rings', occasions:['engagement','wedding','anniversary','birthday'] },
  { _id:'9', name:'Earings', description:'Stunning earrings — simple studs se grand jhumkas tak', image:'https://www.sneharateria.com/cdn/shop/articles/theweddingcorp_1200x1200.png?v=1676527615', slug:'earings', occasions:['birthday','anniversary','graduation','gift','wedding'] },
  { _id:'10', name:'MangalSutras', description:'Traditional aur modern mangalsutras — shaadi ka pavitra tuhfa', image:'https://images.jdmagicbox.com/quickquotes/images_main/-wpb08nw7.jpg', slug:'mangalsutras', occasions:['wedding','anniversary'] },
  { _id:'11', name:"Men's Collection", description:'Chains, bracelets aur rings — men ke liye stylish jewellery', image:'https://www.giva.co/cdn/shop/articles/1_407_-min.jpg?v=1758624615', slug:'mens-collection', occasions:['wedding','birthday','anniversary','graduation','gift'] },
  { _id:'12', name:'Necklaces', description:'Statement necklaces — temple se contemporary tak', image:'https://www.karpagamjewellers.com/wp-content/uploads/2024/05/Traditional-Gold-Jewellery-Collections.jpg', slug:'necklaces', occasions:['wedding','engagement','anniversary','birthday','gift'] },
];
const occasions = [
  { icon:'💒', label:'Wedding',     slug:'wedding'     },
  { icon:'💍', label:'Engagement',  slug:'engagement'  },
  { icon:'🎂', label:'Birthday',    slug:'birthday'    },
  { icon:'❤️', label:'Anniversary', slug:'anniversary' },
  { icon:'🎓', label:'Graduation',  slug:'graduation'  },
  { icon:'🎁', label:'Gift',        slug:'gift'        },
];
const reviews = [
  { name:'Priya Mehta',   stars:5, occasion:'Bridal Jewellery, 2023', text:'Riddhi Jewellers ne meri shaadi ke liye jo bridal set banaya, woh bilkul mere sapno jaisa tha. Quality aur service dono exceptional hain!' },
  { name:'Ankit Shah',    stars:5, occasion:'Anniversary Gift',        text:'Anniversary pe wife ke liye diamond necklace liya. Hallmark certification se full trust mila. Highly recommend!' },
  { name:'Deepa Verma',   stars:5, occasion:'Custom Ring, 2024',       text:'Custom engagement ring itna easy tha design karna! Team ne exact vision samjha aur beautiful piece deliver kiya.' },
  { name:'Rohan Joshi',   stars:5, occasion:'Gold Bangles',            text:'29 saal purana brand, aur trust dikhta hai. Pure 22K gold, proper weight, BIS hallmark — no compromise.' },
  { name:'Kavya Patel',   stars:5, occasion:'Bridal Set, 2024',        text:'Ek hi jagah sab mila — necklace, bangles, earrings, maang tikka. Sab perfect tha. Shukriya Riddhi Jewellers!' },
  { name:'Manish Desai',  stars:5, occasion:'Solitaire Ring',          text:'Staff bahut helpful, koi pressure nahi. GIA certified diamond clearly explain kiya. Confident feel hua.' },
];
const customerPhotos = [
  { image:'https://www.sneharateria.com/cdn/shop/articles/theweddingcorp_1200x1200.png?v=1676527615', caption:'Bridal look — Riya K.' },
  { image:'https://priyaasi.com/cdn/shop/files/JS-PR-10391-1_grande.jpg?v=1704893163',               caption:'Diamond set — Meera S.' },
  { image:'https://images.jdmagicbox.com/quickquotes/images_main/-wpb08nw7.jpg',                     caption:'Gold heritage — Pooja V.' },
  { image:'https://www.karpagamjewellers.com/wp-content/uploads/2024/05/Traditional-Gold-Jewellery-Collections.jpg', caption:'Traditional gold — Ananya M.' },
  { image:'https://www.giva.co/cdn/shop/articles/1_407_-min.jpg?v=1758624615',                       caption:'Contemporary — Sakshi R.' },
  { image:'https://www.sneharateria.com/cdn/shop/articles/theweddingcorp_1200x1200.png?v=1676527615', caption:'Anniversary gift — Neha D.' },
];
const pressLogos = [
  { name:'BIS Hallmark',    note:'Certified'       },
  { name:'GIA Certified',   note:'Diamonds'        },
  { name:'Gujarat Samachar',note:'Featured'        },
  { name:'Divya Bhaskar',   note:'Featured'        },
  { name:'Times of India',  note:'Ahmedabad Ed.'   },
  { name:'India Today',     note:'Jewellery Special'},
];