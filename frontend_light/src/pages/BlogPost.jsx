import { useParams, useNavigate } from 'react-router-dom';
// ✅ Sahi
import { blogPosts } from "../blogData";
export default function BlogPost() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const post = blogPosts.find(p => p.slug === slug);

  if (!post) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#fdf9f4', gap: '16px' }}>
        <span style={{ fontSize: '3rem' }}>✦</span>
        <h2 style={{ fontFamily: 'Bodoni Moda', color: '#1a1a1a' }}>Blog post not found</h2>
        <button onClick={() => navigate('/')} style={backBtnStyle}>← Back to Home</button>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#fdf9f4', fontFamily: 'Georgia, serif' }}>

      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg, #1a1209 0%, #2d1f0a 50%, #1a1209 100%)', padding: '80px 5% 60px', position: 'relative', overflow: 'hidden' }}>
        {/* Decorative background pattern */}
        <div style={{ position: 'absolute', inset: 0, opacity: 0.05, backgroundImage: 'radial-gradient(circle at 20% 50%, #d4af37 1px, transparent 1px), radial-gradient(circle at 80% 20%, #d4af37 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

        <div style={{ maxWidth: '800px', margin: '0 auto', position: 'relative' }}>
          <button onClick={() => navigate(-1)} style={{ background: 'none', border: '1px solid #d4af3750', color: '#d4af37', padding: '8px 16px', borderRadius: '20px', cursor: 'pointer', fontSize: '0.82rem', marginBottom: '32px', display: 'inline-flex', alignItems: 'center', gap: '6px', transition: 'all 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.borderColor = '#d4af37'}
            onMouseLeave={e => e.currentTarget.style.borderColor = '#d4af3750'}
          >
            ← Back
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <span style={{ background: '#d4af3720', color: '#d4af37', fontSize: '0.75rem', padding: '4px 12px', borderRadius: '20px', border: '1px solid #d4af3740' }}>{post.tag}</span>
            <span style={{ color: '#d4af3780', fontSize: '0.78rem' }}>{post.date}</span>
            <span style={{ color: '#d4af3780', fontSize: '0.78rem' }}>• {post.readTime}</span>
          </div>

          <h1 style={{ fontFamily: 'Bodoni Moda', fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', color: '#fdf9f4', lineHeight: 1.3, marginBottom: '24px' }}>
            {post.title}
          </h1>

          <p style={{ color: '#d4af3799', fontSize: '1rem', lineHeight: 1.7 }}>{post.excerpt}</p>
        </div>
      </div>

      {/* Decorative divider */}
      <div style={{ textAlign: 'center', padding: '28px 0', background: '#fdf9f4' }}>
        <span style={{ color: '#d4af37', fontSize: '1.2rem', letterSpacing: '12px' }}>✦ ✦ ✦</span>
      </div>

      {/* Content */}
      <div style={{ maxWidth: '760px', margin: '0 auto', padding: '0 5% 80px' }}>
        {post.content.map((block, i) => {
          if (block.type === 'intro') return (
            <p key={i} style={{ fontSize: '1.08rem', color: '#444', lineHeight: 1.9, marginBottom: '36px', borderLeft: '3px solid #d4af37', paddingLeft: '20px', fontStyle: 'italic' }}>
              {block.text}
            </p>
          );
          if (block.type === 'heading') return (
            <h2 key={i} style={{ fontFamily: 'Bodoni Moda', fontSize: '1.4rem', color: '#1a1a1a', marginTop: '40px', marginBottom: '14px', paddingBottom: '8px', borderBottom: '1px solid #e8d9c0' }}>
              {block.text}
            </h2>
          );
          if (block.type === 'paragraph') return (
            <p key={i} style={{ fontSize: '0.97rem', color: '#555', lineHeight: 1.95, marginBottom: '20px' }}>
              {block.text}
            </p>
          );
          if (block.type === 'tip') return (
            <div key={i} style={{ background: '#d4af3712', border: '1px solid #d4af3740', borderRadius: '12px', padding: '20px 24px', margin: '36px 0', color: '#7a5c00', fontSize: '0.92rem', lineHeight: 1.7 }}>
              {block.text}
            </div>
          );
          return null;
        })}

        {/* Divider */}
        <div style={{ textAlign: 'center', margin: '48px 0 40px', color: '#d4af37', letterSpacing: '10px' }}>✦ ✦ ✦</div>

        {/* CTA */}
        <div style={{ background: 'linear-gradient(135deg, #1a1209, #2d1f0a)', borderRadius: '16px', padding: '40px', textAlign: 'center' }}>
          <p style={{ fontFamily: 'Bodoni Moda', fontSize: '1.4rem', color: '#fdf9f4', marginBottom: '10px' }}>Ready to find your perfect piece?</p>
          <p style={{ color: '#d4af3799', fontSize: '0.88rem', marginBottom: '24px' }}>Visit Riddhi Jewellers or get in touch with us today.</p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => navigate('/collections')} style={{ background: '#b8860b', color: '#fff', border: 'none', padding: '12px 28px', borderRadius: '30px', cursor: 'pointer', fontSize: '0.88rem', fontWeight: 600 }}>
              Explore Collections
            </button>
            <button onClick={() => navigate('/contact')} style={{ background: 'transparent', color: '#d4af37', border: '1px solid #d4af37', padding: '12px 28px', borderRadius: '30px', cursor: 'pointer', fontSize: '0.88rem' }}>
              Contact Us
            </button>
          </div>
        </div>

        {/* Other posts */}
        <div style={{ marginTop: '60px' }}>
          <h3 style={{ fontFamily: 'Bodoni Moda', fontSize: '1.2rem', color: '#1a1a1a', marginBottom: '20px' }}>More from our Journal</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {blogPosts.filter(p => p.slug !== slug).map((p, i) => (
              <div key={i} onClick={() => navigate(`/blog/${p.slug}`)} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', background: '#fff', border: '1px solid #e8d9c0', borderRadius: '10px', cursor: 'pointer', transition: 'border-color 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = '#b8860b'}
                onMouseLeave={e => e.currentTarget.style.borderColor = '#e8d9c0'}
              >
                <div>
                  <span style={{ color: '#b8860b', fontSize: '0.72rem', marginBottom: '4px', display: 'block' }}>{p.tag}</span>
                  <span style={{ color: '#1a1a1a', fontSize: '0.9rem', fontWeight: 500 }}>{p.title}</span>
                </div>
                <span style={{ color: '#b8860b', fontSize: '0.85rem', flexShrink: 0, marginLeft: '12px' }}>→</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const backBtnStyle = {
  background: '#b8860b',
  color: '#fff',
  border: 'none',
  padding: '10px 24px',
  borderRadius: '30px',
  cursor: 'pointer',
  fontSize: '0.88rem',
};