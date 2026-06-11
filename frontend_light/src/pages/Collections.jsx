import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400;1,500&family=Jost:wght@200;300;400;500&family=Cinzel:wght@400;500&display=swap');

  :root {
    --g1: #2a1a08; --g2: #4a2e0e; --g3: #7a4f1a;
    --g4: #a8722a; --g5: #c9943e; --g6: #e0b96a;
    --g7: #f0d49a; --g8: #faf0d8;
    --m1: #04030a; --m2: #0a080f; --m3: #100d18;
    --iv0: #fffef9; --iv1: #fdf8ef; --iv2: #f8f0e0; --iv3: #f0e4c8;
    --ink1: #0d0a04; --ink2: #1e1810; --ink3: #3c3020;
    --ink4: #6b5840; --ink5: #9e8870; --ink6: #c8b8a0;
    --serif: 'Cormorant Garamond', Georgia, serif;
    --sans: 'Jost', system-ui, sans-serif;
    --display: 'Cinzel', 'Times New Roman', serif;
    --ease1: cubic-bezier(0.16, 1, 0.3, 1);
    --ease3: cubic-bezier(0.34, 1.56, 0.64, 1);
    --r3: 12px; --r4: 20px; --r5: 32px;
    --b1: 1px solid rgba(192,148,62,0.15);
    --b2: 1px solid rgba(192,148,62,0.3);
    --sh3: 0 24px 80px rgba(4,3,10,0.22);
    --shg: 0 8px 48px rgba(168,114,42,0.28);
    --shg2: 0 4px 24px rgba(168,114,42,0.16);
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: var(--sans); background: var(--iv0); color: var(--ink2); -webkit-font-smoothing: antialiased; }
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: var(--m1); }
  ::-webkit-scrollbar-thumb { background: var(--g4); border-radius: 3px; }

  @keyframes fadeUp { from { opacity: 0; transform: translateY(36px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes shimmer { 0% { background-position: -200% center; } 100% { background-position: 200% center; } }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  @keyframes scan { 0% { transform: translateX(-100%) skewX(-12deg); } 100% { transform: translateX(500%) skewX(-12deg); } }
  @keyframes spin { to { transform: rotate(360deg); } }

  .fu  { animation: fadeUp 0.9s var(--ease1) both; }
  .fi  { animation: fadeIn 0.7s ease both; }
  .fu1 { animation-delay: 0.08s; }
  .fu2 { animation-delay: 0.18s; }
  .fu3 { animation-delay: 0.28s; }
  .fu4 { animation-delay: 0.42s; }

  .coll-hero {
    position: relative;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    overflow: hidden;
  }
  .hero-img {
    position: absolute; inset: 0;
    background-image: url('https://indinoor.in/cdn/shop/articles/Bridal_cd7bf867-48e8-42de-bbba-490b905dcd83.jpg?v=1768221965');
    background-size: cover;
    background-position: center 30%;
    filter: saturate(1.05) brightness(0.90) contrast(1.08);
    transition: transform 12s ease-out;
  }
  .coll-hero:hover .hero-img { transform: scale(1.03); }

  .hero-grad {
    position: absolute; inset: 0;
    background:
      linear-gradient(to top, rgba(4,3,10,0.97) 0%, rgba(4,3,10,0.7) 30%, rgba(4,3,10,0.25) 60%, rgba(4,3,10,0.05) 100%),
      linear-gradient(105deg, rgba(4,3,10,0.3) 0%, transparent 55%);
  }
  .hero-vline {
    position: absolute; top: 0; left: 6%; width: 1px; height: 100%;
    background: linear-gradient(to bottom, transparent 5%, rgba(192,148,62,0.2) 30%, rgba(192,148,62,0.2) 70%, transparent 95%);
    z-index: 2;
  }
  .hero-vline2 {
    position: absolute; top: 0; left: calc(6% + 9px); width: 1px; height: 100%;
    background: linear-gradient(to bottom, transparent 15%, rgba(192,148,62,0.07) 35%, rgba(192,148,62,0.07) 65%, transparent 85%);
    z-index: 2;
  }
  .dc { position: absolute; width: 52px; height: 52px; pointer-events: none; z-index: 3; }
  .dc-tl { top: 28px; left: 28px; border-top: 1px solid rgba(192,148,62,0.35); border-left: 1px solid rgba(192,148,62,0.35); }
  .dc-tr { top: 28px; right: 28px; border-top: 1px solid rgba(192,148,62,0.35); border-right: 1px solid rgba(192,148,62,0.35); }

  .hero-cnt { position: relative; z-index: 4; padding: 0 7% 0; max-width: 100%; }

  .grain::after {
    content: ''; position: absolute; inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
    pointer-events: none; z-index: 5; mix-blend-mode: overlay;
  }

  .hero-stats {
    position: relative; z-index: 4;
    display: flex; align-items: stretch;
    border-top: 1px solid rgba(192,148,62,0.2);
    margin-top: 52px;
  }
  .hero-stat-cell {
    flex: 1; padding: 28px 0; text-align: center;
    border-right: 1px solid rgba(192,148,62,0.1);
    transition: background 0.3s ease;
  }
  .hero-stat-cell:last-child { border-right: none; }
  .hero-stat-cell:hover { background: rgba(192,148,62,0.05); }

  .filter-pill {
    display: inline-flex; align-items: center; gap: 7px;
    padding: 9px 22px; border: var(--b1); border-radius: 100px;
    background: var(--iv0); cursor: pointer; transition: all 0.35s var(--ease1);
    font-family: var(--display); font-size: 0.55rem; font-weight: 400;
    letter-spacing: 0.16em; text-transform: uppercase; color: var(--ink4);
    white-space: nowrap; position: relative; overflow: hidden;
  }
  .filter-pill::before { content: ''; position: absolute; inset: 0; background: linear-gradient(135deg, rgba(192,148,62,0.08), transparent); opacity: 0; transition: opacity 0.35s ease; }
  .filter-pill:hover::before { opacity: 1; }
  .filter-pill:hover { border-color: var(--g5); color: var(--g3); transform: translateY(-2px); box-shadow: var(--shg2); }
  .filter-pill.active { background: linear-gradient(135deg, var(--g3), var(--g5)); border-color: transparent; color: var(--iv0); box-shadow: var(--shg2); }
  .filter-pill.active::before { opacity: 0; }

  .col-card { border-radius: var(--r4); overflow: hidden; cursor: pointer; border: var(--b1); background: var(--iv0); transition: all 0.5s var(--ease1); position: relative; }
  .col-card:hover { border-color: rgba(192,148,62,0.4); box-shadow: var(--sh3); transform: translateY(-8px); }
  .col-img-wrap { overflow: hidden; position: relative; }
  .col-img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 0.9s var(--ease1), filter 0.5s ease; filter: saturate(0.85) brightness(0.97); }
  .col-card:hover .col-img { transform: scale(1.09); filter: saturate(1.05) brightness(1.02); }
  .col-img-overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(4,3,10,0.65) 0%, transparent 55%); opacity: 0; transition: opacity 0.5s ease; display: flex; align-items: flex-end; padding: 24px; }
  .col-card:hover .col-img-overlay { opacity: 1; }
  .col-tag { display: inline-flex; align-items: center; gap: 7px; padding: 5px 14px; background: rgba(192,148,62,0.12); border: 1px solid rgba(192,148,62,0.3); border-radius: 100px; font-family: var(--display); font-size: 0.48rem; letter-spacing: 0.2em; text-transform: uppercase; color: var(--g6); backdrop-filter: blur(8px); }
  .col-tag::before { content: ''; width: 4px; height: 4px; border-radius: 50%; background: var(--g6); flex-shrink: 0; }
  .col-body { padding: 28px 28px 24px; position: relative; }
  .col-body::before { content: ''; position: absolute; top: 0; left: 28px; right: 28px; height: 1px; background: linear-gradient(90deg, transparent, rgba(192,148,62,0.18), transparent); }
  .col-arrow { width: 36px; height: 36px; border-radius: 50%; border: var(--b2); display: flex; align-items: center; justify-content: center; color: var(--g4); font-size: 0.9rem; transition: all 0.4s var(--ease3); flex-shrink: 0; background: var(--g8); }
  .col-card:hover .col-arrow { background: linear-gradient(135deg, var(--g3), var(--g5)); border-color: transparent; color: #fff; transform: translateX(4px) rotate(-45deg); box-shadow: var(--shg2); }
  .col-count { display: inline-flex; align-items: center; gap: 5px; padding: 4px 12px; background: var(--iv2); border: var(--b1); border-radius: 100px; font-family: var(--sans); font-size: 0.68rem; color: var(--ink5); font-weight: 300; }

  .loader { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 50vh; gap: 24px; }
  .loader-ring { width: 56px; height: 56px; border-radius: 50%; border: 1px solid rgba(192,148,62,0.15); border-top-color: var(--g5); animation: spin 1.1s linear infinite; }
  .empty { text-align: center; padding: 80px 20px; }

  .sh-label { display: inline-flex; align-items: center; gap: 14px; font-family: var(--display); font-size: 0.54rem; font-weight: 400; letter-spacing: 0.46em; text-transform: uppercase; color: var(--g5); margin-bottom: 18px; }
  .sh-label::before, .sh-label::after { content: ''; display: block; width: 36px; height: 1px; background: linear-gradient(90deg, transparent, var(--g5)); }
  .sh-label::after { background: linear-gradient(90deg, var(--g5), transparent); }

  .view-btn { width: 36px; height: 36px; border-radius: var(--r3); border: var(--b1); background: var(--iv0); display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.3s ease; color: var(--ink5); font-size: 0.9rem; }
  .view-btn.active, .view-btn:hover { border-color: var(--g5); background: var(--g8); color: var(--g4); }

  .search-wrap { position: relative; flex: 1; max-width: 360px; }
  .search-input { width: 100%; padding: 11px 18px 11px 42px; background: var(--iv0); border: var(--b1); border-radius: 100px; font-family: var(--sans); font-size: 0.82rem; font-weight: 300; color: var(--ink2); outline: none; transition: all 0.35s ease; letter-spacing: 0.03em; }
  .search-input:focus { border-color: var(--g5); box-shadow: 0 0 0 3px rgba(192,148,62,0.08); }
  .search-input::placeholder { color: var(--ink6); }
  .search-icon { position: absolute; left: 16px; top: 50%; transform: translateY(-50%); color: var(--ink5); font-size: 0.85rem; pointer-events: none; }

  .feat-label { position: absolute; top: 18px; right: 18px; padding: 6px 16px; background: linear-gradient(135deg, var(--g3), var(--g5)); color: var(--iv0); font-family: var(--display); font-size: 0.48rem; letter-spacing: 0.2em; text-transform: uppercase; border-radius: 100px; box-shadow: var(--shg2); z-index: 2; }

  @media (max-width: 768px) {
    .hero-cnt { padding: 0 6% 0 !important; }
    .hero-stats { flex-wrap: wrap; }
    .hero-stat-cell { flex: 50%; border-bottom: 1px solid rgba(192,148,62,0.1); }
    .filter-strip { overflow-x: auto; flex-wrap: nowrap !important; padding: 0 6% !important; -webkit-overflow-scrolling: touch; }
    .filter-strip::-webkit-scrollbar { display: none; }
    .toolbar { flex-wrap: wrap !important; gap: 14px !important; }
  }
  @media (max-width: 500px) {
    .col-grid-3 { grid-template-columns: 1fr !important; }
    .col-grid-2 { grid-template-columns: 1fr !important; }
  }
`;

const filterOptions = ['All', 'Bridal', 'Diamond', 'Gold', 'Silver', 'Contemporary', 'Antique'];

// API response se product count extract karne ka helper
function extractCount(res, collectionId) {
  const d = res.data;
  // Common API response formats handle karo
  if (typeof d?.total === 'number') return d.total;
  if (typeof d?.count === 'number') return d.count;
  if (typeof d?.totalProducts === 'number') return d.totalProducts;
  if (typeof d?.pagination?.total === 'number') return d.pagination.total;
  if (Array.isArray(d?.products)) return d.products.length;
  if (Array.isArray(d)) return d.length;
  return 0;
}

export default function Collections() {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading]         = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [gridView, setGridView]       = useState(3);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('/api/collections')
      .then(async (r) => {
        const data = r.data;
        console.log('RAW API DATA:', data); // debug
        let cols = [];
        if (Array.isArray(data)) cols = data;
        else if (data?.collections) cols = data.collections;
        else if (data?.data) cols = data.data;
        else { setCollections(demoCollections); setLoading(false); return; }

        if (cols.length === 0) { setCollections(demoCollections); setLoading(false); return; }

        // Har collection ke liye product count fetch karo
        const withCounts = await Promise.all(
          cols.map(async (col) => {
            // Agar API ne already productCount diya hai toh use karo
            if (col.productCount != null) return col;

            try {
              // collection ID ya slug dono try karo
              const res = await axios.get(
                `/api/products?collection=${col._id || col.slug}&limit=1`
              );
              return { ...col, productCount: extractCount(res, col._id) };
            } catch {
              // Fallback: bina limit ke try karo
              try {
                const res2 = await axios.get(`/api/products?collectionId=${col._id}`);
                return { ...col, productCount: extractCount(res2, col._id) };
              } catch {
                return { ...col, productCount: 0 };
              }
            }
          })
        );

        setCollections(withCounts);
      })
      .catch(() => setCollections(demoCollections))
      .finally(() => setLoading(false));
  }, []);

  const filtered = collections.filter(col => {
    const matchFilter = activeFilter === 'All' ||
      col.name?.toLowerCase().includes(activeFilter.toLowerCase()) ||
      col.category?.toLowerCase().includes(activeFilter.toLowerCase());
    const matchSearch = !searchQuery ||
      col.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      col.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchFilter && matchSearch;
  });

  // Total products count — sab collections ka sum
  const totalProducts = collections.reduce((sum, col) => sum + (col.productCount || 0), 0);

  return (
    <div style={{ paddingTop: '0px', minHeight: '100vh', background: 'var(--iv0)' }}>
      <style>{styles}</style>

      {/* ══ HERO ══ */}
      <div className="coll-hero grain">
        <div className="hero-img" />
        <div className="hero-grad" />
        <div className="hero-vline" />
        <div className="hero-vline2" />
        <div className="dc dc-tl" />
        <div className="dc dc-tr" />

        <div style={{ position: 'absolute', inset: 0, zIndex: 3, overflow: 'hidden', pointerEvents: 'none' }}>
          <div style={{
            position: 'absolute', top: 0, left: 0, width: '30%', height: '100%',
            background: 'linear-gradient(90deg, transparent, rgba(192,148,62,0.03), transparent)',
            animation: 'scan 8s ease-in-out infinite',
          }} />
        </div>

        <div className="hero-cnt">
          <div className="fu" style={{ display: 'flex', alignItems: 'center', gap: '18px', marginBottom: '28px' }}>
            <div style={{ width: '32px', height: '1px', background: 'var(--g5)' }} />
            <span style={{ fontFamily: 'var(--display)', color: 'var(--g6)', fontSize: '0.52rem', letterSpacing: '0.44em', textTransform: 'uppercase' }}>
              Riddhi Jewellers · Est. 1995
            </span>
            <div style={{ width: '32px', height: '1px', background: 'var(--g5)' }} />
          </div>

          <h1 className="fu fu1" style={{
            fontFamily: 'var(--serif)', fontSize: 'clamp(3rem, 7.5vw, 6rem)',
            fontWeight: 300, lineHeight: 0.98, color: '#fff',
            letterSpacing: '-0.02em', marginBottom: '8px',
          }}>Our</h1>

          <h1 className="fu fu2" style={{
            fontFamily: 'var(--serif)', fontSize: 'clamp(3rem, 7.5vw, 6rem)',
            fontWeight: 300, lineHeight: 0.98, letterSpacing: '-0.02em', marginBottom: '32px',
            background: 'linear-gradient(90deg, var(--g4) 0%, var(--g7) 35%, var(--g4) 55%, var(--g7) 75%, var(--g4) 100%)',
            backgroundSize: '200% auto',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            animation: 'shimmer 4s linear infinite',
          }}>Collections</h1>

          <p className="fu fu3" style={{
            color: 'rgba(255,255,255,0.45)', fontSize: '0.9rem', lineHeight: 2,
            maxWidth: '400px', fontFamily: 'var(--sans)', fontWeight: 200, letterSpacing: '0.05em',
          }}>
            Each collection tells a story of craftsmanship,<br />tradition, and timeless beauty.
          </p>
        </div>

        {/* Stats strip — dynamic data */}
        <div className="hero-stats fu fu4">
          {[
            [collections.length > 0 ? `${collections.length}+` : '4+', 'Collections'],
            [totalProducts > 0 ? `${totalProducts}+` : '500+', 'Unique Designs'],
            ['100%', 'BIS Hallmarked'],
            ['29+', 'Years of Craft'],
          ].map(([num, label]) => (
            <div key={label} className="hero-stat-cell">
              <div style={{
                fontFamily: 'var(--serif)', fontSize: 'clamp(1.6rem, 3vw, 2.2rem)',
                fontWeight: 300, color: 'var(--g7)', lineHeight: 1, marginBottom: '5px',
              }}>{num}</div>
              <div style={{
                fontFamily: 'var(--display)', fontSize: '0.5rem',
                letterSpacing: '0.2em', textTransform: 'uppercase',
                color: 'rgba(240,212,154,0.45)',
              }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ══ FILTER & SEARCH BAR ══ */}
      <div style={{
        background: 'var(--iv1)', borderBottom: '1px solid rgba(192,148,62,0.1)',
        padding: '24px 7%', position: 'sticky', top: '70px', zIndex: 10,
        backdropFilter: 'blur(12px)',
      }}>
        <div className="filter-strip" style={{ display: 'flex', gap: '8px', marginBottom: '18px', flexWrap: 'wrap' }}>
          {filterOptions.map(f => (
            <button key={f} className={`filter-pill${activeFilter === f ? ' active' : ''}`} onClick={() => setActiveFilter(f)}>
              {f}
            </button>
          ))}
        </div>
        <div className="toolbar" style={{ display: 'flex', alignItems: 'center', gap: '20px', justifyContent: 'space-between' }}>
          <div className="search-wrap">
            <span className="search-icon">🔍</span>
            <input
              className="search-input" type="text"
              placeholder="Search collections..."
              value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontFamily: 'var(--display)', fontSize: '0.52rem', letterSpacing: '0.18em', color: 'var(--ink5)', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
              {loading ? '—' : `${filtered.length} ${filtered.length === 1 ? 'Collection' : 'Collections'}`}
            </span>
            <div style={{ display: 'flex', gap: '6px' }}>
              <button className={`view-btn${gridView === 3 ? ' active' : ''}`} onClick={() => setGridView(3)}>⊞</button>
              <button className={`view-btn${gridView === 2 ? ' active' : ''}`} onClick={() => setGridView(2)}>▤</button>
            </div>
          </div>
        </div>
      </div>

      {/* ══ COLLECTIONS GRID ══ */}
      <section style={{ padding: '80px 7% 120px', background: 'var(--iv0)' }}>
        <div style={{ marginBottom: '56px' }}>
          <p className="sh-label">Handpicked for You</p>
          <h2 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', fontWeight: 300, color: 'var(--ink1)', letterSpacing: '-0.01em', lineHeight: 1.15 }}>
            Discover Our <em style={{ color: 'var(--g4)', fontStyle: 'italic', fontWeight: 400 }}>Signature</em> Collections
          </h2>
        </div>

        {loading ? (
          <div className="loader">
            <div className="loader-ring" />
            <p style={{ fontFamily: 'var(--display)', fontSize: '0.55rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--ink5)' }}>Loading Collections…</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty">
            <div style={{ fontSize: '3rem', marginBottom: '20px' }}>💎</div>
            <h3 style={{ fontFamily: 'var(--serif)', fontSize: '1.8rem', fontWeight: 300, color: 'var(--ink2)', marginBottom: '12px' }}>No Collections Found</h3>
            <p style={{ color: 'var(--ink5)', fontFamily: 'var(--sans)', fontWeight: 300 }}>Try adjusting your filter or search term.</p>
          </div>
        ) : (
          <div className={`col-grid-${gridView}`} style={{
            display: 'grid',
            gridTemplateColumns: `repeat(auto-fill, minmax(${gridView === 2 ? '360px' : '295px'}, 1fr))`,
            gap: gridView === 2 ? '28px' : '22px',
            maxWidth: '1400px',
          }}>
            {filtered.map((col, i) => (
              <CollectionCard
                key={col._id || i}
                col={col}
                index={i}
                gridView={gridView}
                onClick={() => navigate(`/collections/${col.slug}`)}
              />
            ))}
          </div>
        )}
      </section>

      <CtaBanner />
    </div>
  );
}

function CollectionCard({ col, index, gridView, onClick }) {
  const imgHeight = gridView === 2
    ? (index === 0 ? '420px' : '380px')
    : (index === 0 ? '380px' : '300px');

  const count = col.productCount ?? 0;

  return (
    <div className="col-card" onClick={onClick} style={{ animation: `fadeUp 0.8s cubic-bezier(0.16,1,0.3,1) ${index * 0.08}s both` }}>
      {index === 0 && <div className="feat-label">✦ Featured</div>}
      <div className="col-img-wrap" style={{ height: imgHeight }}>
        <img className="col-img" src={col.image} alt={col.name} loading="lazy" />
        <div className="col-img-overlay"><div className="col-tag">Collection</div></div>
      </div>
      <div className="col-body">
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', marginBottom: '14px' }}>
          <h3 style={{
            fontFamily: 'var(--serif)',
            fontSize: gridView === 2 ? '1.8rem' : '1.5rem',
            fontWeight: 300, color: 'var(--ink1)', lineHeight: 1.1,
            letterSpacing: '0.01em', flex: 1,
          }}>{col.name}</h3>
          <div className="col-arrow">→</div>
        </div>
        <p style={{ color: 'var(--ink4)', fontSize: '0.84rem', lineHeight: 1.8, marginBottom: '20px', fontFamily: 'var(--sans)', fontWeight: 300 }}>
          {col.description}
        </p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '16px', borderTop: '1px solid rgba(192,148,62,0.1)' }}>
          <div className="col-count">
            <span>💎</span>
            <span>{count} {count === 1 ? 'piece' : 'pieces'}</span>
          </div>
          <span style={{ fontFamily: 'var(--display)', fontSize: '0.5rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--g4)', fontWeight: 400 }}>
            View All →
          </span>
        </div>
      </div>
    </div>
  );
}

function CtaBanner() {
  return (
    <section style={{ background: 'linear-gradient(160deg, var(--m1) 0%, var(--m2) 60%, var(--m3) 100%)', padding: '88px 7%', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, opacity: 0.035, backgroundImage: `radial-gradient(circle, var(--g6) 1px, transparent 1px)`, backgroundSize: '26px 26px', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '600px', height: '600px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(192,148,62,0.07) 0%, transparent 65%)', pointerEvents: 'none' }} />
      {[
        { top: '28px', left: '28px', borderTop: '1px solid rgba(192,148,62,0.3)', borderLeft: '1px solid rgba(192,148,62,0.3)' },
        { top: '28px', right: '28px', borderTop: '1px solid rgba(192,148,62,0.3)', borderRight: '1px solid rgba(192,148,62,0.3)' },
        { bottom: '28px', left: '28px', borderBottom: '1px solid rgba(192,148,62,0.3)', borderLeft: '1px solid rgba(192,148,62,0.3)' },
        { bottom: '28px', right: '28px', borderBottom: '1px solid rgba(192,148,62,0.3)', borderRight: '1px solid rgba(192,148,62,0.3)' },
      ].map((s, i) => <div key={i} style={{ position: 'absolute', width: '48px', height: '48px', pointerEvents: 'none', ...s }} />)}

      <div style={{ position: 'relative', zIndex: 1 }}>
        <p style={{ fontFamily: 'var(--display)', color: 'var(--g5)', fontSize: '0.52rem', letterSpacing: '0.44em', textTransform: 'uppercase', marginBottom: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '14px' }}>
          <span style={{ display: 'block', width: '32px', height: '1px', background: 'var(--g5)', opacity: 0.5 }} />
          Custom Jewellery
          <span style={{ display: 'block', width: '32px', height: '1px', background: 'var(--g5)', opacity: 0.5 }} />
        </p>
        <h2 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(2rem, 4.5vw, 3rem)', fontWeight: 300, color: '#fff', marginBottom: '16px', letterSpacing: '-0.01em', lineHeight: 1.1 }}>
          Can't Find What You're <em style={{ color: 'var(--g6)', fontStyle: 'italic', fontWeight: 400 }}>Looking For?</em>
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.38)', fontSize: '0.88rem', lineHeight: 2, maxWidth: '460px', margin: '0 auto 52px', fontFamily: 'var(--sans)', fontWeight: 200, letterSpacing: '0.04em' }}>
          Our master artisans can craft a completely bespoke piece — your design, your story, your jewel.
        </p>
        <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="/contact"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', fontFamily: 'var(--display)', fontSize: '0.58rem', fontWeight: 400, letterSpacing: '0.22em', textTransform: 'uppercase', textDecoration: 'none', padding: '16px 40px', borderRadius: '2px', background: 'linear-gradient(135deg, var(--g3), var(--g5))', color: 'var(--iv0)', boxShadow: '0 4px 24px rgba(168,114,42,0.25)', transition: 'all 0.4s cubic-bezier(0.16,1,0.3,1)' }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 40px rgba(168,114,42,0.4)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 4px 24px rgba(168,114,42,0.25)'; e.currentTarget.style.transform = 'none'; }}>
            Book Consultation →
          </a>
          <a href="https://wa.me/919104261433" target="_blank" rel="noreferrer"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', fontFamily: 'var(--display)', fontSize: '0.58rem', fontWeight: 400, letterSpacing: '0.22em', textTransform: 'uppercase', textDecoration: 'none', padding: '16px 40px', borderRadius: '2px', background: 'transparent', color: 'var(--g6)', border: '1px solid rgba(192,148,62,0.3)', transition: 'all 0.4s cubic-bezier(0.16,1,0.3,1)' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(192,148,62,0.08)'; e.currentTarget.style.borderColor = 'rgba(192,148,62,0.55)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(192,148,62,0.3)'; e.currentTarget.style.transform = 'none'; }}>
            💬 WhatsApp Us
          </a>
        </div>
      </div>
    </section>
  );
}

const demoCollections = [
  { _id: '1', name: 'Bridal Elegance', description: 'Exquisite bridal sets featuring traditional designs with modern elegance, crafted for your most special day.', image: 'https://www.sneharateria.com/cdn/shop/articles/theweddingcorp_1200x1200.png?v=1676527615', slug: 'bridal-elegance', productCount: 48 },
  { _id: '2', name: 'Diamond Luxury', description: 'Certified diamond jewellery crafted to sparkle for a lifetime, with GIA-graded stones for every occasion.', image: 'https://priyaasi.com/cdn/shop/files/JS-PR-10391-1_grande.jpg?v=1704893163', slug: 'diamond-luxury', productCount: 32 },
  { _id: '3', name: 'Gold Heritage', description: 'Pure 22K and 18K gold ornaments rooted in tradition, hallmarked and crafted to last generations.', image: 'https://images.jdmagicbox.com/quickquotes/images_main/-wpb08nw7.jpg', slug: 'gold-heritage', productCount: 65 },
  { _id: '4', name: 'Contemporary Style', description: 'Modern designs for the fashion-forward — bold, minimal, and effortlessly wearable every day.', image: 'https://www.giva.co/cdn/shop/articles/1_407_-min.jpg?v=1758624615', slug: 'contemporary-style', productCount: 27 },
];