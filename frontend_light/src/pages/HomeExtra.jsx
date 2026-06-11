import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

/* ════════════════════════════════════════════════════════
   1. EMI CALCULATOR
════════════════════════════════════════════════════════ */
export function EMICalculator() {
  const [price, setPrice] = useState(50000);
  const [months, setMonths] = useState(12);
  const emi = Math.round(price / months);

  return (
    <section style={{ background: '#fdf9f4', padding: '100px 5%' }}>
      <div className="section-header">
        <p className="subtitle">EASY ON YOUR POCKET</p>
        <h2>No-Cost <span className="highlight">EMI Calculator</span></h2>
      </div>
      <div style={{ maxWidth: '680px', margin: '0 auto', background: 'var(--card-bg)', border: '1px solid #eadbc8', borderRadius: '20px', padding: '48px 40px' }}>
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
            <label style={{ color: '#777', fontSize: '0.85rem' }}>Jewellery Price</label>
            <span style={{ color: '#b8860b', fontFamily: 'Bodoni Moda', fontSize: '1.1rem' }}>₹{price.toLocaleString('en-IN')}</span>
          </div>
          <input type="range" min={5000} max={500000} step={1000} value={price}
            onChange={e => setPrice(Number(e.target.value))}
            style={{ width: '100%', accentColor: '#b8860b' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
            <span style={{ color: '#555', fontSize: '0.75rem' }}>₹5,000</span>
            <span style={{ color: '#555', fontSize: '0.75rem' }}>₹5,00,000</span>
          </div>
        </div>

        <div style={{ marginBottom: '40px' }}>
          <label style={{ color: '#777', fontSize: '0.85rem', display: 'block', marginBottom: '16px' }}>Select EMI Tenure</label>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            {[3, 6, 9, 12, 18, 24].map(m => (
              <button key={m} onClick={() => setMonths(m)} style={{
                flex: '1', minWidth: '70px', padding: '12px 8px', borderRadius: '10px', border: '1px solid',
                borderColor: months === m ? '#b8860b' : '#e0d0b8',
                background: months === m ? '#d4af3715' : 'transparent',
                color: months === m ? '#b8860b' : '#666', cursor: 'pointer', fontSize: '0.85rem', transition: 'all 0.2s',
              }}>{m} mo</button>
            ))}
          </div>
        </div>

        <div style={{ background: '#fdf9f4', borderRadius: '14px', padding: '28px', textAlign: 'center', border: '1px solid #d4af3730' }}>
          <p style={{ color: '#777', fontSize: '0.8rem', marginBottom: '8px', letterSpacing: '2px', textTransform: 'uppercase' }}>Monthly Payment</p>
          <h3 style={{ fontFamily: 'Bodoni Moda', fontSize: '3rem', color: '#b8860b', marginBottom: '8px' }}>₹{emi.toLocaleString('en-IN')}</h3>
          <p style={{ color: '#666', fontSize: '0.8rem' }}>for {months} months · Zero interest · No hidden charges</p>
        </div>

        <p style={{ color: '#555', fontSize: '0.75rem', textAlign: 'center', marginTop: '20px' }}>
          *No-cost EMI available on select bank cards. Contact store for details.
        </p>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════
   2. GIFT FINDER QUIZ — UPDATED WITH ALL 12 COLLECTIONS
════════════════════════════════════════════════════════ */

const quizSteps = [
  {
    q: 'Who is this gift for?',
    options: ['Wife / Partner', 'Mother', 'Sister / Friend', 'Daughter', 'Men (Husband/Brother)'],
  },
  {
    q: 'What is the occasion?',
    options: ['Wedding / Engagement', 'Birthday', 'Anniversary', 'Just Because 💛'],
  },
  {
    q: 'What is your budget?',
    options: ['Under ₹10,000', '₹10K – ₹50K', '₹50K – ₹2L', 'Above ₹2L'],
  },
];

const giftMap = {
  // ── WIFE / PARTNER (0) ──────────────────────────────
  '0-0-0': { name: 'Rings',            desc: 'A sweet ring — the perfect start to forever',          slug: 'rings' },
  '0-0-1': { name: 'Bridal Jewellery', desc: 'Complete bridal set for the big day',                  slug: 'bridal-jewellery' },
  '0-0-2': { name: 'Bridal Jewellery', desc: 'Luxurious bridal collection — memories to cherish',    slug: 'bridal-jewellery' },
  '0-0-3': { name: 'Diamond Magics',   desc: 'Unmatched diamond pieces for your queen',              slug: 'diamond-magics' },

  '0-1-0': { name: 'Pendant',          desc: 'A cute pendant — a heartfelt gift from the soul',      slug: 'pendant' },
  '0-1-1': { name: 'Earings',          desc: 'Beautiful earrings — the perfect birthday gift',       slug: 'earings' },
  '0-1-2': { name: 'Necklaces',        desc: 'Elegant necklace — something special for her birthday', slug: 'necklaces' },
  '0-1-3': { name: 'Diamond Magics',   desc: 'Premium diamonds — because she deserves it',           slug: 'diamond-magics' },

  '0-2-0': { name: 'MangalSutras',     desc: 'A new mangalsutra on anniversary — a promise renewed', slug: 'mangalsutras' },
  '0-2-1': { name: 'Bangles',          desc: 'Gold bangles — an anniversary gift she will remember', slug: 'bangles' },
  '0-2-2': { name: 'Necklaces',        desc: 'Statement necklace — happy anniversary, my love',      slug: 'necklaces' },
  '0-2-3': { name: 'Diamond Magics',   desc: 'Diamond collection — every anniversary deserves this', slug: 'diamond-magics' },

  '0-3-0': { name: 'Pendant',          desc: 'Just because — a lovely pendant for no reason at all', slug: 'pendant' },
  '0-3-1': { name: 'Earings',          desc: 'Surprise earrings — just because she smiled today',    slug: 'earings' },
  '0-3-2': { name: 'Modern Wear',      desc: 'Trendy modern jewellery — everyday glam',              slug: 'modern-wear' },
  '0-3-3': { name: 'Diamond Magics',   desc: 'No reason needed for diamonds',                        slug: 'diamond-magics' },

  // ── MOTHER (1) ──────────────────────────────────────
  '1-0-0': { name: 'Silver Collections', desc: 'Elegant silver — a pure and timeless choice for Mom',   slug: 'silver-collections' },
  '1-0-1': { name: 'Bangles',            desc: 'Traditional bangles — an auspicious gift for Mom',      slug: 'bangles' },
  '1-0-2': { name: 'Bangles',            desc: 'Premium gold bangles — for Mom\'s happiness',           slug: 'bangles' },
  '1-0-3': { name: 'Necklaces',          desc: 'Grand necklace — her blessings, your love',            slug: 'necklaces' },

  '1-1-0': { name: 'Silver Collections', desc: 'Silver jewellery — a special birthday gift for Mom',   slug: 'silver-collections' },
  '1-1-1': { name: 'Bangles',            desc: 'Gold bangles — the perfect birthday gift for Mom',     slug: 'bangles' },
  '1-1-2': { name: 'Necklaces',          desc: 'Beautiful necklace — go big on Mom\'s birthday',       slug: 'necklaces' },
  '1-1-3': { name: 'Diamond Magics',     desc: 'Diamonds for Mom — she gave you everything',           slug: 'diamond-magics' },

  '1-2-0': { name: 'Silver Collections', desc: 'Silver set — celebrate Mom & Dad\'s anniversary',      slug: 'silver-collections' },
  '1-2-1': { name: 'Bangles',            desc: 'Classic bangles — anniversary gifting for Mom',        slug: 'bangles' },
  '1-2-2': { name: 'Bangles',            desc: 'Premium bangles — the most beautiful day of the year', slug: 'bangles' },
  '1-2-3': { name: 'Necklaces',          desc: 'Grand necklace — celebrate Mom in style',              slug: 'necklaces' },

  '1-3-0': { name: 'Silver Collections', desc: 'A silver piece — for Mom, just because',              slug: 'silver-collections' },
  '1-3-1': { name: 'Bangles',            desc: 'Bangles — just to make Mom smile',                    slug: 'bangles' },
  '1-3-2': { name: 'Bangles',            desc: 'Beautiful bangles — bring a smile to Mom\'s face',    slug: 'bangles' },
  '1-3-3': { name: 'Necklaces',          desc: 'Stunning necklace — a surprise gift for Mom',         slug: 'necklaces' },

  // ── SISTER / FRIEND (2) ─────────────────────────────
  '2-0-0': { name: 'Silver Collections', desc: 'Trendy silver — perfect for a friend\'s wedding',     slug: 'silver-collections' },
  '2-0-1': { name: 'Earings',            desc: 'Pretty earrings — a wedding gift for your bestie',    slug: 'earings' },
  '2-0-2': { name: 'Bridal Jewellery',   desc: 'Bridal set — something grand for your sister\'s wedding', slug: 'bridal-jewellery' },
  '2-0-3': { name: 'Bridal Jewellery',   desc: 'Complete bridal jewellery — only the best for her',  slug: 'bridal-jewellery' },

  '2-1-0': { name: 'Silver Collections', desc: 'Silver jewellery — a birthday gift for your best friend', slug: 'silver-collections' },
  '2-1-1': { name: 'Earings',            desc: 'Stylish earrings — a birthday surprise for her',     slug: 'earings' },
  '2-1-2': { name: 'Modern Wear',        desc: 'Modern trendy jewellery — a wow gift for your bestie', slug: 'modern-wear' },
  '2-1-3': { name: 'Diamond Magics',     desc: 'Diamonds — your best friend deserves the best',      slug: 'diamond-magics' },

  '2-2-0': { name: 'Silver Collections', desc: 'Silver — a cute anniversary gift for your friend',   slug: 'silver-collections' },
  '2-2-1': { name: 'Earings',            desc: 'Beautiful earrings — celebrate her anniversary',     slug: 'earings' },
  '2-2-2': { name: 'Pendant',            desc: 'Elegant pendant — a memorable anniversary gift',     slug: 'pendant' },
  '2-2-3': { name: 'Necklaces',          desc: 'Premium necklace — an anniversary gift for your sister', slug: 'necklaces' },

  '2-3-0': { name: 'Silver Collections', desc: 'A cute silver piece — a surprise for your bestie',  slug: 'silver-collections' },
  '2-3-1': { name: 'Earings',            desc: 'Fun earrings — just because she is awesome',        slug: 'earings' },
  '2-3-2': { name: 'Modern Wear',        desc: 'Trendy pick — a no-reason gift for your friend',    slug: 'modern-wear' },
  '2-3-3': { name: 'Diamond Magics',     desc: 'Diamonds — because she is your person',            slug: 'diamond-magics' },

  // ── DAUGHTER (3) ────────────────────────────────────
  '3-0-0': { name: "Kid's Collection",  desc: 'Adorable kids jewellery — make her wedding extra special', slug: 'kids-collection' },
  '3-0-1': { name: 'Rings',             desc: 'A sweet ring — for her engagement day',              slug: 'rings' },
  '3-0-2': { name: 'Bridal Jewellery',  desc: 'Bridal set — for the golden day of her wedding',    slug: 'bridal-jewellery' },
  '3-0-3': { name: 'Bridal Jewellery',  desc: 'Complete luxury bridal — only the best for your daughter', slug: 'bridal-jewellery' },

  '3-1-0': { name: "Kid's Collection",  desc: 'Cute kids jewellery — for her little birthday',     slug: 'kids-collection' },
  '3-1-1': { name: "Kid's Collection",  desc: 'Lovely kids collection — celebrate her birthday',   slug: 'kids-collection' },
  '3-1-2': { name: 'Modern Wear',       desc: 'Modern jewellery — a stylish birthday gift for her', slug: 'modern-wear' },
  '3-1-3': { name: 'Diamond Magics',    desc: 'Diamonds — a special birthday surprise for her',    slug: 'diamond-magics' },

  '3-2-0': { name: "Kid's Collection",  desc: 'A sweet gift — for your little one on anniversary', slug: 'kids-collection' },
  '3-2-1': { name: 'Earings',           desc: 'Pretty earrings — an anniversary gift for her',     slug: 'earings' },
  '3-2-2': { name: 'Modern Wear',       desc: 'Modern jewellery — a milestone gift for your daughter', slug: 'modern-wear' },
  '3-2-3': { name: 'Necklaces',         desc: 'Elegant necklace — celebrate her milestone in style', slug: 'necklaces' },

  '3-3-0': { name: "Kid's Collection",  desc: 'A surprise gift — just to make her happy',         slug: 'kids-collection' },
  '3-3-1': { name: 'Pendant',           desc: 'A sweet pendant — a no-reason gift for her',       slug: 'pendant' },
  '3-3-2': { name: 'Modern Wear',       desc: 'Trendy modern — gifted just the way she likes it', slug: 'modern-wear' },
  '3-3-3': { name: 'Diamond Magics',    desc: 'Diamonds — because she always deserves the best',  slug: 'diamond-magics' },

  // ── MEN / HUSBAND / BROTHER (4) ─────────────────────
  '4-0-0': { name: "Men's Collection",  desc: 'Elegant men\'s jewellery — a wedding gift for him',    slug: 'mens-collection' },
  '4-0-1': { name: "Men's Collection",  desc: 'Wedding jewellery for the groom — wear it with pride', slug: 'mens-collection' },
  '4-0-2': { name: "Men's Collection",  desc: 'Premium men\'s jewellery — a special gift for the groom', slug: 'mens-collection' },
  '4-0-3': { name: "Men's Collection",  desc: 'Luxury groom jewellery — all eyes on him',             slug: 'mens-collection' },

  '4-1-0': { name: "Men's Collection",  desc: 'Men\'s bracelet or chain — a bold birthday gift',      slug: 'mens-collection' },
  '4-1-1': { name: "Men's Collection",  desc: 'Stylish men\'s piece — for his birthday',              slug: 'mens-collection' },
  '4-1-2': { name: "Men's Collection",  desc: 'Premium men\'s jewellery — go big for him',            slug: 'mens-collection' },
  '4-1-3': { name: "Men's Collection",  desc: 'Luxury men\'s jewellery — a boss-level birthday gift', slug: 'mens-collection' },

  '4-2-0': { name: "Men's Collection",  desc: 'Men\'s jewellery — an anniversary gift for him',       slug: 'mens-collection' },
  '4-2-1': { name: "Men's Collection",  desc: 'Gold chain or bracelet — anniversary surprise for him', slug: 'mens-collection' },
  '4-2-2': { name: "Men's Collection",  desc: 'Premium men\'s gift — happy anniversary to him',       slug: 'mens-collection' },
  '4-2-3': { name: "Men's Collection",  desc: 'Luxury men\'s piece — because he is special',          slug: 'mens-collection' },

  '4-3-0': { name: "Men's Collection",  desc: 'Men\'s jewellery — a surprise gift for him',           slug: 'mens-collection' },
  '4-3-1': { name: "Men's Collection",  desc: 'Casual men\'s piece — just because he rocks',          slug: 'mens-collection' },
  '4-3-2': { name: "Men's Collection",  desc: 'Modern men\'s jewellery — a style upgrade for him',    slug: 'mens-collection' },
  '4-3-3': { name: "Men's Collection",  desc: 'Premium men\'s gift — no occasion needed',             slug: 'mens-collection' },
};

const defaultResult = { name: 'Our Bestsellers', desc: 'Curated picks just for you', slug: 'bridal-jewellery' };

export function GiftFinderQuiz() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [done, setDone] = useState(false);
  const navigate = useNavigate();

  const pick = (idx) => {
    const next = [...answers, idx];
    if (step < quizSteps.length - 1) {
      setAnswers(next);
      setStep(step + 1);
    } else {
      setAnswers(next);
      setDone(true);
    }
  };

  const reset = () => { setStep(0); setAnswers([]); setDone(false); };

  // Key: recipient-occasion-budget
  const key = `${answers[0]}-${answers[1]}-${answers[2]}`;
  const result = giftMap[key] || defaultResult;

  const collectionIcons = {
    'bridal-jewellery': '👰', 'bangles': '💛', 'modern-wear': '✨',
    'silver-collections': '🥈', 'kids-collection': '🎀', 'pendant': '💎',
    'diamond-magics': '💍', 'rings': '💍', 'earings': '👂',
    'mangalsutras': '🪢', 'mens-collection': '👑', 'necklaces': '📿',
  };

  return (
    <section style={{ background: '#f8f2e8', padding: '100px 5%' }}>
      <div className="section-header">
        <p className="subtitle">FIND THE PERFECT PIECE</p>
        <h2>Gift Finder <span className="highlight">Quiz</span></h2>
      </div>

      <div style={{ maxWidth: '620px', margin: '0 auto', background: 'var(--card-bg)', border: '1px solid #eadbc8', borderRadius: '20px', padding: '48px 40px' }}>
        {!done ? (
          <>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '32px' }}>
              {quizSteps.map((_, i) => (
                <div key={i} style={{ flex: 1, height: '4px', borderRadius: '2px', background: i <= step ? '#b8860b' : '#e0d0b8', transition: 'background 0.3s' }} />
              ))}
            </div>
            <p style={{ color: '#777', fontSize: '0.78rem', letterSpacing: '2px', marginBottom: '12px' }}>STEP {step + 1} OF {quizSteps.length}</p>
            <h3 style={{ fontFamily: 'Bodoni Moda', fontSize: '1.6rem', color: '#1a1a1a', marginBottom: '28px' }}>{quizSteps[step].q}</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {quizSteps[step].options.map((opt, i) => (
                <button key={i} onClick={() => pick(i)} style={{
                  padding: '16px 20px', borderRadius: '12px', border: '1px solid #e8d9c0',
                  background: 'transparent', color: '#555', textAlign: 'left', cursor: 'pointer',
                  fontSize: '0.95rem', transition: 'all 0.2s',
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#b8860b'; e.currentTarget.style.color = '#1a1a1a'; e.currentTarget.style.background = '#d4af3710'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = '#e8d9c0'; e.currentTarget.style.color = '#555'; e.currentTarget.style.background = 'transparent'; }}
                >{opt}</button>
              ))}
            </div>
          </>
        ) : (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '3.5rem', marginBottom: '16px' }}>{collectionIcons[result.slug] || '🎁'}</div>
            <p style={{ color: '#b8860b', fontSize: '0.75rem', letterSpacing: '3px', marginBottom: '12px' }}>PERFECT MATCH FOR YOU</p>
            <h3 style={{ fontFamily: 'Bodoni Moda', fontSize: '2rem', color: '#1a1a1a', marginBottom: '8px' }}>{result.name}</h3>
            <p style={{ color: '#777', marginBottom: '32px', lineHeight: 1.7 }}>{result.desc}</p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button onClick={() => navigate(`/collections/${result.slug}`)} style={{
                padding: '14px 28px', background: '#b8860b', color: '#000', border: 'none',
                borderRadius: '8px', fontWeight: 700, cursor: 'pointer', fontSize: '0.9rem',
              }}>View Collection →</button>
              <button onClick={reset} style={{
                padding: '14px 28px', background: 'transparent', color: '#777', border: '1px solid #e0d0b8',
                borderRadius: '8px', cursor: 'pointer', fontSize: '0.9rem',
              }}>Try Again</button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════
   3. FLASH SALE / COUNTDOWN BANNER
════════════════════════════════════════════════════════ */
function useCountdown(targetDate) {
  const calc = () => {
    const diff = new Date(targetDate) - new Date();
    if (diff <= 0) return { d: 0, h: 0, m: 0, s: 0 };
    return {
      d: Math.floor(diff / 86400000),
      h: Math.floor((diff % 86400000) / 3600000),
      m: Math.floor((diff % 3600000) / 60000),
      s: Math.floor((diff % 60000) / 1000),
    };
  };
  const [t, setT] = useState(calc);
  useEffect(() => { const id = setInterval(() => setT(calc()), 1000); return () => clearInterval(id); }, []);
  return t;
}

export function FlashSaleBanner() {
  const saleEnd = new Date();
  saleEnd.setDate(saleEnd.getDate() + 5);
  saleEnd.setHours(23, 59, 59);
  const { d, h, m, s } = useCountdown(saleEnd);
  const pad = n => String(n).padStart(2, '0');

  return (
    <section style={{ background: 'var(--bg-dark2)', borderTop: '1px solid #e8d9c0', borderBottom: '1px solid #e8d9c0', padding: '40px 5%' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '24px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <span style={{ background: '#b8860b', color: '#000', fontSize: '0.7rem', fontWeight: 800, padding: '4px 12px', borderRadius: '4px', letterSpacing: '1.5px' }}>AKSHAYA TRITIYA SALE</span>
            <span style={{ color: '#b8860b', fontSize: '0.8rem' }}>🔥 Limited Time</span>
          </div>
          <h3 style={{ fontFamily: 'Bodoni Moda', fontSize: '1.6rem', color: '#1a1a1a', marginBottom: '4px' }}>Up to 20% Off on Gold Jewellery</h3>
          <p style={{ color: '#777', fontSize: '0.85rem' }}>Use code: <strong style={{ color: '#b8860b' }}>AKSHAYA20</strong> at billing</p>
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          {[['Days', d], ['Hrs', h], ['Min', m], ['Sec', s]].map(([label, val]) => (
            <div key={label} style={{ textAlign: 'center', background: '#fdf9f4', border: '1px solid #e8d9c0', borderRadius: '10px', padding: '12px 16px', minWidth: '60px' }}>
              <div style={{ fontFamily: 'Bodoni Moda', fontSize: '1.8rem', color: '#b8860b', lineHeight: 1 }}>{pad(val)}</div>
              <div style={{ color: '#666', fontSize: '0.7rem', marginTop: '4px', letterSpacing: '1px' }}>{label}</div>
            </div>
          ))}
        </div>

        <button style={{
          padding: '14px 28px', background: '#b8860b', color: '#000', border: 'none',
          borderRadius: '8px', fontWeight: 700, cursor: 'pointer', fontSize: '0.9rem', whiteSpace: 'nowrap',
        }}
          onMouseEnter={e => e.currentTarget.style.background = '#c9a227'}
          onMouseLeave={e => e.currentTarget.style.background = '#b8860b'}
        >Shop Sale →</button>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════
   4. HOW IT WORKS — 4 STEPS
════════════════════════════════════════════════════════ */
export function HowItWorks() {
  const steps = [
    { num: '01', icon: '🏪', title: 'Visit Our Showroom', desc: 'Walk into our Ahmedabad showroom or book a private consultation at your convenience.' },
    { num: '02', icon: '💍', title: 'Choose or Design', desc: 'Browse 500+ designs or work with our artisans to create your custom dream piece.' },
    { num: '03', icon: '✅', title: 'Certified & Hallmarked', desc: 'Every piece is BIS hallmarked and certified. You get full documentation for your jewellery.' },
    { num: '04', icon: '🎁', title: 'Take Home or Get Delivered', desc: 'Carry it home or opt for insured pan-India delivery in our premium packaging.' },
  ];

  return (
    <section style={{ background: '#faf8f5', color: '#222', padding: '100px 5%' }}>
      <div style={{ textAlign: 'center', marginBottom: '60px' }}>
        <p style={{ color: '#b8860b', fontSize: '0.75rem', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '12px' }}>SIMPLE PROCESS</p>
        <h2 style={{ fontFamily: 'Bodoni Moda', fontSize: '2.8rem', color: '#1a1a1a' }}>
          How It <span style={{ color: '#b8860b' }}>Works</span>
        </h2>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0', maxWidth: '1100px', margin: '0 auto', position: 'relative' }}>
        {steps.map((s, i) => (
          <div key={i} style={{ textAlign: 'center', padding: '0 24px', position: 'relative' }}>
            {i < steps.length - 1 && (
              <div style={{ position: 'absolute', top: '36px', right: '-1px', width: '50%', height: '2px', background: 'linear-gradient(to right, #d4af37, #d4af3740)', zIndex: 0 }} />
            )}
            <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'var(--card-bg)', border: '2px solid #d4af37', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: '1.8rem', position: 'relative', zIndex: 1 }}>
              {s.icon}
            </div>
            <span style={{ color: '#d4af3780', fontFamily: 'Bodoni Moda', fontSize: '0.85rem', letterSpacing: '2px' }}>{s.num}</span>
            <h3 style={{ fontFamily: 'Bodoni Moda', fontSize: '1.15rem', color: '#1a1a1a', margin: '8px 0 10px' }}>{s.title}</h3>
            <p style={{ color: '#888', fontSize: '0.875rem', lineHeight: 1.7 }}>{s.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════
   5. AWARDS & CERTIFICATIONS
════════════════════════════════════════════════════════ */
export function AwardsCertifications() {
  const awards = [
    { icon: '🏅', title: 'BIS Hallmark', sub: 'Bureau of Indian Standards', year: 'Since 2002' },
    { icon: '💎', title: 'GIA Certified', sub: 'Gemological Institute of America', year: 'Diamonds Only' },
    { icon: '🏆', title: 'Best Jeweller', sub: 'Gujarat Retail Awards', year: '2022 & 2023' },
    { icon: '⭐', title: 'Google 4.9★', sub: '1200+ verified reviews', year: '2024' },
    { icon: '🛡️', title: 'ISO Certified', sub: 'Quality Management System', year: 'ISO 9001:2015' },
    { icon: '📰', title: 'Times of India', sub: 'Top Jewellers in Ahmedabad', year: '2023' },
  ];

  return (
    <section style={{ background: '#faf5ec', padding: '100px 5%' }}>
      <div className="section-header">
        <p className="subtitle">RECOGNITION & TRUST</p>
        <h2>Awards & <span className="highlight">Certifications</span></h2>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '20px', maxWidth: '1100px', margin: '0 auto' }}>
        {awards.map((a, i) => (
          <div key={i} style={{ background: 'var(--card-bg)', border: '1.5px solid #e8d9c0', borderRadius: '16px', padding: '28px', display: 'flex', gap: '18px', alignItems: 'flex-start', transition: 'border-color 0.3s' }}
            onMouseEnter={e => e.currentTarget.style.borderColor = '#b8860b'}
            onMouseLeave={e => e.currentTarget.style.borderColor = '#e8d9c0'}
          >
            <div style={{ fontSize: '2.2rem', flexShrink: 0 }}>{a.icon}</div>
            <div>
              <h3 style={{ fontFamily: 'Bodoni Moda', fontSize: '1.1rem', color: '#1a1a1a', marginBottom: '4px' }}>{a.title}</h3>
              <p style={{ color: '#777', fontSize: '0.82rem', marginBottom: '6px' }}>{a.sub}</p>
              <span style={{ background: '#d4af3720', color: '#b8860b', fontSize: '0.72rem', padding: '3px 10px', borderRadius: '20px', letterSpacing: '0.5px' }}>{a.year}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════
   6. JEWELLERY CARE GUIDE
════════════════════════════════════════════════════════ */
export function JewelleryCareGuide() {
  const tips = [
    { icon: '🧴', title: 'Cleaning Gold', tips: ['Use mild soap + warm water', 'Gently scrub with a soft bristle brush', 'Avoid chemical cleaners'] },
    { icon: '💎', title: 'Diamond Care', tips: ['Remove before applying lotion', 'Store separately to avoid scratches', 'Get professional cleaning done annually'] },
    { icon: '📦', title: 'Storage Tips', tips: ['Store in a fabric-lined box', 'Keep away from direct sunlight', 'Avoid humid environments'] },
    { icon: '🚿', title: "Daily Don'ts", tips: ['Remove while swimming', 'Do not wear to the gym', 'Wear only after applying perfume'] },
  ];

  return (
    <section style={{ background: '#faf8f5', color: '#222', padding: '100px 5%' }}>
      <div style={{ textAlign: 'center', marginBottom: '60px' }}>
        <p style={{ color: '#b8860b', fontSize: '0.75rem', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '12px' }}>CARE TIPS</p>
        <h2 style={{ fontFamily: 'Bodoni Moda', fontSize: '2.8rem', color: '#1a1a1a' }}>Keep Your Jewellery <span style={{ color: '#b8860b' }}>Sparkling</span></h2>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '24px', maxWidth: '1100px', margin: '0 auto' }}>
        {tips.map((t, i) => (
          <div key={i} style={{ background: 'var(--card-bg)', borderRadius: '16px', padding: '28px', border: '1px solid #ede9e3' }}>
            <div style={{ fontSize: '2rem', marginBottom: '14px' }}>{t.icon}</div>
            <h3 style={{ fontFamily: 'Bodoni Moda', fontSize: '1.1rem', color: '#1a1a1a', marginBottom: '14px' }}>{t.title}</h3>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {t.tips.map((tip, j) => (
                <li key={j} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', color: '#666', fontSize: '0.87rem', lineHeight: 1.5 }}>
                  <span style={{ color: '#b8860b', marginTop: '2px', flexShrink: 0 }}>✓</span> {tip}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════
   7. FAQ ACCORDION
════════════════════════════════════════════════════════ */
export function FAQSection() {
  const [open, setOpen] = useState(null);
  const faqs = [
    { q: 'Do you make custom jewellery designs?', a: 'Yes! Bring your design sketch or share your idea, and our skilled artisans will craft that exact piece for you. Custom orders take 15–21 days.' },
    { q: 'Is your gold BIS hallmarked?', a: 'Absolutely. 100% of our gold is BIS certified. Every piece comes with a hallmark certificate clearly mentioning the purity and weight.' },
    { q: 'What is your return and exchange policy?', a: 'Unused jewellery can be returned or exchanged within 7 days. Custom pieces are not eligible for exchange. Original bill and box are required for returns.' },
    { q: 'Do you offer home delivery?', a: 'Yes, pan-India insured delivery is available. Orders above ₹5,000 get free delivery. Shipping is completed within 3–7 business days.' },
    { q: 'Is EMI facility available?', a: 'Yes! No-cost EMI is available for 3, 6, 12, and 24 months on major bank credit cards. Inquire at the store or via WhatsApp.' },
    { q: 'Are your diamonds certified?', a: 'Our solitaire diamonds are GIA or IGI certified. Every diamond comes with a grading report detailing the 4Cs — Cut, Color, Clarity, and Carat.' },
    { q: 'Do you exchange old jewellery?', a: 'Yes! You can exchange your old gold or diamond jewellery at the current market rate. Visit our store for a fair valuation.' },
    { q: 'Do you offer repair and polishing services?', a: 'Yes! Every piece purchased from Riddhi Jewellers comes with lifetime free polishing, cleaning, and minor repair services.' },
  ];

  return (
    <section style={{ background: '#fdf9f4', padding: '100px 5%' }}>
      <div className="section-header">
        <p className="subtitle">GOT QUESTIONS?</p>
        <h2>Frequently Asked <span className="highlight">Questions</span></h2>
      </div>
      <div style={{ maxWidth: '780px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {faqs.map((faq, i) => (
          <div key={i} style={{ background: 'var(--card-bg)', border: '1px solid', borderColor: open === i ? '#b8860b' : '#e8d9c0', borderRadius: '12px', overflow: 'hidden', transition: 'border-color 0.3s' }}>
            <button onClick={() => setOpen(open === i ? null : i)} style={{
              width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '20px 24px', background: 'transparent', border: 'none', color: '#1a1a1a',
              fontSize: '0.95rem', textAlign: 'left', cursor: 'pointer', fontWeight: 500,
            }}>
              {faq.q}
              <span style={{ color: '#b8860b', fontSize: '1.4rem', fontWeight: 300, flexShrink: 0, marginLeft: '12px', transition: 'transform 0.3s', transform: open === i ? 'rotate(45deg)' : 'none' }}>+</span>
            </button>
            {open === i && (
              <div style={{ padding: '0 24px 20px', color: '#777', fontSize: '0.9rem', lineHeight: 1.8, borderTop: '1px solid #e8d9c0' }}>
                <div style={{ paddingTop: '16px' }}>{faq.a}</div>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════
   8. NEW ARRIVALS MARQUEE
════════════════════════════════════════════════════════ */
export function NewArrivalsMarquee() {
  const items = [
    '✦ NEW: Rose Gold Heart Bracelet', '✦ NEW: Kundan Choker Set', '✦ NEW: Diamond Stud Earrings',
    '✦ NEW: 22K Gold Bangles Set', '✦ NEW: Emerald Pendant Necklace', '✦ NEW: Polki Wedding Ring',
    '✦ NEW: Solitaire Engagement Ring', '✦ NEW: Temple Gold Earrings', '✦ NEW: Platinum Band',
  ];
  const text = items.join('   ');

  return (
    <section style={{ background: 'var(--bg-dark2)', borderTop: '1px solid #e8d9c0', borderBottom: '1px solid #e8d9c0', padding: '16px 0', overflow: 'hidden' }}>
      <div style={{ display: 'flex', width: 'max-content', animation: 'marquee 30s linear infinite' }}>
        {[text, text].map((t, i) => (
          <span key={i} style={{ color: '#b8860b', fontSize: '0.82rem', letterSpacing: '1.5px', whiteSpace: 'nowrap', paddingRight: '80px' }}>{t}</span>
        ))}
      </div>
      <style>{`@keyframes marquee { from { transform: translateX(0) } to { transform: translateX(-50%) } }`}</style>
    </section>
  );
}

/* ════════════════════════════════════════════════════════
   9. FESTIVAL CALENDAR
════════════════════════════════════════════════════════ */
export function FestivalCalendar() {
  const festivals = [
    { name: 'Akshaya Tritiya', date: '2025-04-30', icon: '🌟', tip: 'Most auspicious day to buy gold' },
    { name: 'Dhanteras', date: '2025-10-20', icon: '🪔', tip: 'Lakshmi puja — buy gold for prosperity' },
    { name: 'Diwali', date: '2025-10-21', icon: '✨', tip: 'Gift jewellery to loved ones' },
    { name: 'Navratri', date: '2025-10-02', icon: '🌸', tip: 'Traditional jewellery season' },
    { name: 'Eid', date: '2025-03-30', icon: '☪️', tip: 'Gold gifting tradition' },
    { name: 'Christmas', date: '2025-12-25', icon: '🎄', tip: 'Diamond gifts — premium season' },
  ];

  const getDaysLeft = (dateStr) => {
    const today = new Date(); today.setHours(0, 0, 0, 0);
    let target = new Date(dateStr);
    if (target < today) target.setFullYear(target.getFullYear() + 1);
    return Math.ceil((target - today) / 86400000);
  };

  const sorted = [...festivals].sort((a, b) => getDaysLeft(a.date) - getDaysLeft(b.date));

  return (
    <section style={{ background: '#f8f2e8', padding: '100px 5%' }}>
      <div className="section-header">
        <p className="subtitle">PLAN AHEAD</p>
        <h2>Festival <span className="highlight">Gift Calendar</span></h2>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px', maxWidth: '1100px', margin: '0 auto' }}>
        {sorted.map((f, i) => {
          const days = getDaysLeft(f.date);
          const isClose = days <= 30;
          return (
            <div key={i} style={{
              background: 'var(--card-bg)', border: `1px solid ${isClose ? '#b8860b' : '#e8d9c0'}`,
              borderRadius: '16px', padding: '24px', display: 'flex', gap: '16px', alignItems: 'flex-start', transition: 'transform 0.3s',
            }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'none'}
            >
              <div style={{ fontSize: '2rem', flexShrink: 0 }}>{f.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                  <h3 style={{ fontFamily: 'Bodoni Moda', fontSize: '1.1rem', color: '#1a1a1a' }}>{f.name}</h3>
                  <span style={{ background: isClose ? '#b8860b' : '#e8d9c0', color: isClose ? '#000' : '#888', fontSize: '0.72rem', padding: '3px 10px', borderRadius: '20px', fontWeight: isClose ? 700 : 400, flexShrink: 0, marginLeft: '8px' }}>
                    {days === 0 ? 'Today!' : `${days}d left`}
                  </span>
                </div>
                <p style={{ color: '#888', fontSize: '0.82rem' }}>{f.tip}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════
   10. BLOG PREVIEW CARDS
════════════════════════════════════════════════════════ */
export function BlogPreview() {
  const navigate = useNavigate();
  const posts = [
    { tag: 'Buying Guide', title: 'How to Choose the Perfect Engagement Ring', excerpt: 'Budget, stone shape, metal type — a complete guide in one place. A must-read for first-time buyers.', date: 'Mar 2025', readTime: '5 min read', slug: 'engagement-ring-guide' },
    { tag: 'Investment', title: 'Gold vs Diamond: Which is a Better Investment?', excerpt: 'Pros and cons of both, long-term value, and expert advice — a complete analysis.', date: 'Feb 2025', readTime: '7 min read', slug: 'gold-vs-diamond' },
    { tag: 'Care Tips', title: 'How to Keep Your Jewellery Sparkling at Home', excerpt: 'Get professional-level cleaning done at home. Simple tips that anyone can follow.', date: 'Jan 2025', readTime: '3 min read', slug: 'jewellery-care-tips' },
  ];

  return (
    <section style={{ background: '#faf5ec', padding: '100px 5%' }}>
      <div className="section-header">
        <p className="subtitle">FROM OUR JOURNAL</p>
        <h2>Tips, Guides & <span className="highlight">Stories</span></h2>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px', maxWidth: '1100px', margin: '0 auto' }}>
        {posts.map((p, i) => (
          <div key={i}
            onClick={() => navigate(`/blog/${p.slug}`)} 
            style={{ background: 'var(--card-bg)', border: '1.5px solid #e8d9c0', borderRadius: '16px', overflow: 'hidden', cursor: 'pointer', transition: 'transform 0.3s, border-color 0.3s' }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.borderColor = '#b8860b'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.borderColor = '#e8d9c0'; }}
          >
            <div style={{ background: '#f0e8d8', height: '160px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontFamily: 'Bodoni Moda', fontSize: '3rem', color: '#d4af3730' }}>✦</span>
            </div>
            <div style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ background: '#d4af3720', color: '#b8860b', fontSize: '0.72rem', padding: '3px 10px', borderRadius: '20px' }}>{p.tag}</span>
                <span style={{ color: '#555', fontSize: '0.75rem' }}>{p.readTime}</span>
              </div>
              <h3 style={{ fontFamily: 'Bodoni Moda', fontSize: '1.15rem', color: '#1a1a1a', marginBottom: '10px', lineHeight: 1.4 }}>{p.title}</h3>
              <p style={{ color: '#777', fontSize: '0.85rem', lineHeight: 1.7, marginBottom: '16px' }}>{p.excerpt}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#666', fontSize: '0.78rem' }}>{p.date}</span>
                <span style={{ color: '#b8860b', fontSize: '0.82rem' }}>Read More →</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════
   11. VIRTUAL TRY-ON TEASER
════════════════════════════════════════════════════════ */
export function VirtualTryOnTeaser() {
  return (
    <section style={{ background: 'var(--bg-dark2)', padding: '100px 5%', textAlign: 'center', borderTop: '1px solid #e8d9c0' }}>
      <div style={{ maxWidth: '680px', margin: '0 auto' }}>
        <div style={{ width: '90px', height: '90px', borderRadius: '50%', background: '#d4af3715', border: '2px solid #d4af3740', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 28px', fontSize: '2.5rem' }}>
          📱
        </div>
        <span style={{ background: '#b8860b', color: '#000', fontSize: '0.7rem', fontWeight: 700, padding: '4px 14px', borderRadius: '20px', letterSpacing: '2px' }}>COMING SOON</span>
        <h2 style={{ fontFamily: 'Bodoni Moda', fontSize: '2.8rem', lineHeight: 1.2, margin: '20px 0 16px' }}>
          Try Jewellery From <span style={{ color: '#b8860b' }}>Your Home</span>
        </h2>
        <p style={{ color: '#888', fontSize: '1rem', lineHeight: 1.8, marginBottom: '36px' }}>
          Hamaara upcoming AR Virtual Try-On feature aapko ghar baithe jewellery try karne dega — sirf apna phone camera use karke.
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button style={{ padding: '14px 28px', background: '#b8860b', color: '#000', border: 'none', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', fontSize: '0.9rem' }}>
            Get Early Access →
          </button>
          <button style={{ padding: '14px 28px', background: 'transparent', color: '#777', border: '1px solid #e0d0b8', borderRadius: '8px', cursor: 'pointer', fontSize: '0.9rem' }}>
            Learn More
          </button>
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════
   12. DELIVERY & SHIPPING INFO
════════════════════════════════════════════════════════ */
export function DeliveryInfo() {
  const features = [
    { icon: '🔒', title: 'Insured Shipping', desc: 'Every shipment is fully insured. No worries about damage or loss.' },
    { icon: '📦', title: 'Premium Packaging', desc: 'Delivered in a luxury gift box — ready to gift right out of the box.' },
    { icon: '🚚', title: 'Pan-India Delivery', desc: 'Delivered in 3–7 business days. Express options available for metro cities.' },
    { icon: '🆓', title: 'Free Shipping', desc: 'Enjoy completely free shipping on all orders above ₹5,000.' },
    { icon: '📍', title: 'Live Tracking', desc: 'A real-time tracking link is sent via SMS once your order is dispatched.' },
    { icon: '↩️', title: 'Easy Returns', desc: 'Hassle-free returns within 7 days. Home pickup can also be arranged.' },
  ];
  return (
    <section style={{ background: '#faf8f5', color: '#222', padding: '100px 5%' }}>
      <div style={{ textAlign: 'center', marginBottom: '60px' }}>
        <p style={{ color: '#b8860b', fontSize: '0.75rem', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '12px' }}>DELIVERY PROMISE</p>
        <h2 style={{ fontFamily: 'Bodoni Moda', fontSize: '2.8rem', color: '#1a1a1a' }}>
          Safe, Insured & <span style={{ color: '#b8860b' }}>On Time</span>
        </h2>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '20px', maxWidth: '1100px', margin: '0 auto' }}>
        {features.map((f, i) => (
          <div key={i} style={{ background: 'var(--card-bg)', borderRadius: '16px', padding: '28px', border: '1px solid #ede9e3', display: 'flex', gap: '16px', transition: 'border-color 0.3s' }}
            onMouseEnter={e => e.currentTarget.style.borderColor = '#b8860b'}
            onMouseLeave={e => e.currentTarget.style.borderColor = '#ede9e3'}
          >
            <span style={{ fontSize: '2rem', flexShrink: 0 }}>{f.icon}</span>
            <div>
              <h3 style={{ fontFamily: 'Bodoni Moda', fontSize: '1.05rem', color: '#1a1a1a', marginBottom: '6px' }}>{f.title}</h3>
              <p style={{ color: '#888', fontSize: '0.85rem', lineHeight: 1.6 }}>{f.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════
   13. GOLD INVESTMENT SECTION
════════════════════════════════════════════════════════ */
export function GoldInvestment() {
  const data = [
    { year: '2020', price: 4800 },
    { year: '2021', price: 4700 },
    { year: '2022', price: 5200 },
    { year: '2023', price: 6000 },
    { year: '2024', price: 6800 },
    { year: '2025', price: 7350 },
  ];
  const max = Math.max(...data.map(d => d.price));
  const min = Math.min(...data.map(d => d.price));

  return (
    <section style={{ background: '#f8f2e8', padding: '100px 5%' }}>
      <div className="section-header">
        <p className="subtitle">SMART INVESTMENT</p>
        <h2>Gold: Wear It, <span className="highlight">Grow It</span></h2>
      </div>
      <div style={{ maxWidth: '900px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', alignItems: 'center' }}>
        <div>
          <h3 style={{ fontFamily: 'Bodoni Moda', fontSize: '1.6rem', color: '#1a1a1a', marginBottom: '16px' }}>
            Gold Price Trend<br /><span style={{ color: '#b8860b' }}>2020 – 2025</span>
          </h3>
          <p style={{ color: '#888', fontSize: '0.9rem', lineHeight: 1.8, marginBottom: '24px' }}>
            Pichle 5 saalon mein 22K gold ka price ~53% badha hai. Jewellery sirf shringaar nahi, ek samajhdaar nivesh bhi hai.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[['₹4,800', '2020 avg (per gram)'], ['₹7,350', '2025 avg (per gram)'], ['+53%', '5-year return']].map(([val, label]) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 16px', background: 'var(--card-bg)', borderRadius: '10px', border: '1.5px solid #e8d9c0' }}>
                <span style={{ color: '#777', fontSize: '0.85rem' }}>{label}</span>
                <span style={{ color: '#b8860b', fontFamily: 'Bodoni Moda', fontSize: '1.1rem' }}>{val}</span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <div style={{ background: 'var(--card-bg)', borderRadius: '16px', padding: '24px', border: '1.5px solid #e8d9c0' }}>
            <p style={{ color: '#666', fontSize: '0.75rem', letterSpacing: '1.5px', marginBottom: '20px', textTransform: 'uppercase' }}>22K Gold — ₹ per gram</p>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px', height: '160px' }}>
              {data.map((d, i) => {
                const pct = ((d.price - min) / (max - min)) * 75 + 25;
                return (
                  <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', height: '100%', justifyContent: 'flex-end' }}>
                    <span style={{ color: '#888', fontSize: '0.68rem' }}>₹{(d.price / 1000).toFixed(1)}k</span>
                    <div style={{ width: '100%', background: i === data.length - 1 ? '#b8860b' : '#d4af3750', borderRadius: '4px 4px 0 0', height: `${pct}%`, transition: 'height 0.5s' }} />
                    <span style={{ color: '#666', fontSize: '0.7rem' }}>{d.year}</span>
                  </div>
                );
              })}
            </div>
          </div>
          <p style={{ color: '#444', fontSize: '0.72rem', textAlign: 'center', marginTop: '10px' }}>*Indicative prices. Source: MCX / IBJA</p>
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════
   14. EXIT INTENT POPUP
════════════════════════════════════════════════════════ */
export function ExitIntentPopup() {
  const [show, setShow] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [copied, setCopied] = useState(false);
  const triggered = useRef(false);

  useEffect(() => {
    if (dismissed) return;
    const handler = (e) => {
      if (e.clientY <= 10 && !triggered.current) {
        triggered.current = true;
        setShow(true);
      }
    };
    document.addEventListener('mouseleave', handler);
    return () => document.removeEventListener('mouseleave', handler);
  }, [dismissed]);

  const copyCode = () => {
    navigator.clipboard.writeText('RIDDHI5').then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
  };

  const close = () => { setShow(false); setDismissed(true); };

  if (!show) return null;

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 99999,
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px',
    }} onClick={close}>
      <div style={{ background: 'var(--card-bg)', border: '1px solid #d4af37', borderRadius: '20px', padding: '48px 40px', maxWidth: '480px', width: '100%', textAlign: 'center', position: 'relative' }}
        onClick={e => e.stopPropagation()}>
        <button onClick={close} style={{ position: 'absolute', top: '16px', right: '20px', background: 'none', border: 'none', color: '#666', fontSize: '1.4rem', cursor: 'pointer' }}>✕</button>
        <div style={{ fontSize: '3rem', marginBottom: '16px' }}>💎</div>
        <p style={{ color: '#b8860b', fontSize: '0.75rem', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '12px' }}>WAIT! SPECIAL OFFER</p>
        <h3 style={{ fontFamily: 'Bodoni Moda', fontSize: '1.8rem', color: '#1a1a1a', marginBottom: '12px' }}>
          Pehli Purchase Pe<br /><span style={{ color: '#b8860b' }}>5% Off</span> Paaiye!
        </h3>
        <p style={{ color: '#777', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: '28px' }}>
          Yeh offer sirf aaj ke liye hai. Apna coupon code copy karo aur store mein ya online order pe use karo.
        </p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '24px' }}>
          <div style={{ border: '2px dashed #d4af37', borderRadius: '8px', padding: '12px 24px', fontFamily: 'Bodoni Moda', fontSize: '1.6rem', color: '#b8860b', letterSpacing: '4px' }}>
            RIDDHI5
          </div>
          <button onClick={copyCode} style={{ padding: '12px 16px', background: '#b8860b', color: '#000', border: 'none', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', fontSize: '0.85rem' }}>
            {copied ? '✓ Copied!' : 'Copy'}
          </button>
        </div>
        <button onClick={close} style={{ color: '#555', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.85rem', textDecoration: 'underline' }}>
          Nahi chahiye, thanks
        </button>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════
   15. BEFORE & AFTER CUSTOM ORDERS
════════════════════════════════════════════════════════ */
export function BeforeAfterSection() {
  const stories = [
    { before: 'Rough sketch of a floral necklace with lotus motif', after: 'https://priyaasi.com/cdn/shop/files/JS-PR-10391-1_grande.jpg?v=1704893163', name: 'Riya Mehta', desc: 'Custom bridal necklace, 2024' },
    { before: 'Family heirloom gold bangles to be redesigned', after: 'https://images.jdmagicbox.com/quickquotes/images_main/-wpb08nw7.jpg', name: 'Kavya Shah', desc: 'Heirloom redesign, 2023' },
  ];

  return (
    <section style={{ background: '#fdf9f4', padding: '100px 5%' }}>
      <div className="section-header">
        <p className="subtitle">YOUR VISION, OUR CRAFT</p>
        <h2>Dream to <span className="highlight">Reality</span></h2>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(420px, 1fr))', gap: '32px', maxWidth: '1100px', margin: '0 auto' }}>
        {stories.map((s, i) => (
          <div key={i} style={{ background: 'var(--card-bg)', borderRadius: '20px', overflow: 'hidden', border: '1.5px solid #e8d9c0' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
              <div style={{ background: '#f0e8d8', padding: '28px', display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: '200px' }}>
                <span style={{ color: '#555', fontSize: '0.72rem', letterSpacing: '2px', textTransform: 'uppercase', display: 'block', marginBottom: '12px' }}>Before</span>
                <p style={{ color: '#888', fontSize: '0.85rem', lineHeight: 1.6, fontStyle: 'italic' }}>"{s.before}"</p>
              </div>
              <div style={{ position: 'relative' }}>
                <img src={s.after} alt="Final piece" style={{ width: '100%', height: '200px', objectFit: 'cover', display: 'block' }} />
                <span style={{ position: 'absolute', top: '12px', left: '12px', background: '#b8860b', color: '#000', fontSize: '0.7rem', fontWeight: 700, padding: '3px 10px', borderRadius: '4px', letterSpacing: '1px' }}>AFTER</span>
              </div>
            </div>
            <div style={{ padding: '20px 24px', borderTop: '1px solid #e8d9c0' }}>
              <strong style={{ color: '#1a1a1a', display: 'block', marginBottom: '4px', fontSize: '0.9rem' }}>{s.name}</strong>
              <span style={{ color: '#888', fontSize: '0.8rem' }}>{s.desc}</span>
            </div>
          </div>
        ))}
      </div>
      <div style={{ textAlign: 'center', marginTop: '48px' }}>
        <p style={{ color: '#666', marginBottom: '20px', fontSize: '0.9rem' }}>Want to create your own custom piece?</p>
        <a href="/contact" className="btn btn-primary">Start Your Custom Order →</a>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════
   16. LIVE CHAT — Tawk.to
   Add Tawk.to script directly in public/index.html inside <body>.
════════════════════════════════════════════════════════ */