import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { FiShoppingBag, FiStar } from 'react-icons/fi';

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const fmt = (n) => '₹' + Number(n).toLocaleString('en-IN');
  const discount = product.discountPrice ? Math.round((1 - product.discountPrice / product.price) * 100) : 0;

  return (
    <div style={{
      background: '#fff', borderRadius: '16px', overflow: 'hidden',
      border: '1.5px solid #e8d9c0', transition: 'all 0.3s ease', cursor: 'pointer',
      position: 'relative', boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
    }}
      onMouseEnter={e => { e.currentTarget.style.border = '1.5px solid rgba(184,134,11,0.4)'; e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 16px 40px rgba(184,134,11,0.12)'; }}
      onMouseLeave={e => { e.currentTarget.style.border = '1.5px solid #e8d9c0'; e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.05)'; }}
    >
      {discount > 0 && (
        <div style={{ position: 'absolute', top: '12px', left: '12px', background: '#b8860b', color: '#fff', padding: '3px 10px', borderRadius: '20px', fontSize: '0.72rem', fontWeight: 700, zIndex: 1 }}>
          -{discount}%
        </div>
      )}
      {product.isFeatured && (
        <div style={{ position: 'absolute', top: '12px', right: '12px', background: 'rgba(184,134,11,0.10)', border: '1px solid rgba(184,134,11,0.3)', color: '#b8860b', padding: '3px 10px', borderRadius: '20px', fontSize: '0.72rem', fontWeight: 600, zIndex: 1 }}>
          ✦ Featured
        </div>
      )}
      <div onClick={() => navigate(`/product/${product._id}`)} style={{ overflow: 'hidden' }}>
        <img
          src={product.images?.[0] || 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400'}
          alt={product.name}
          style={{ width: '100%', height: '240px', objectFit: 'cover', transition: 'transform 0.5s ease' }}
          onMouseEnter={e => e.target.style.transform = 'scale(1.05)'}
          onMouseLeave={e => e.target.style.transform = 'scale(1)'}
        />
      </div>
      <div style={{ padding: '20px' }}>
        <p style={{ fontSize: '0.72rem', color: '#b8860b', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '6px', fontWeight: 600 }}>{product.material || product.category}</p>
        <h3 onClick={() => navigate(`/product/${product._id}`)} style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '8px', lineHeight: 1.3, cursor: 'pointer', color: '#1a1a1a' }}
          onMouseEnter={e => e.target.style.color = '#b8860b'} onMouseLeave={e => e.target.style.color = '#1a1a1a'}
        >{product.name}</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '14px' }}>
          <FiStar size={13} color="#b8860b" fill="#b8860b" />
          <span style={{ fontSize: '0.8rem', color: '#888' }}>{product.avgRating > 0 ? product.avgRating : 'New'}</span>
          {product.ratings?.length > 0 && <span style={{ fontSize: '0.75rem', color: '#bbb' }}>({product.ratings.length})</span>}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <span style={{ color: '#b8860b', fontWeight: 700, fontSize: '1.1rem' }}>{fmt(product.discountPrice || product.price)}</span>
            {product.discountPrice > 0 && <span style={{ color: '#bbb', fontSize: '0.8rem', textDecoration: 'line-through', marginLeft: '8px' }}>{fmt(product.price)}</span>}
          </div>
          <button onClick={(e) => { e.stopPropagation(); addToCart(product._id); }}
            style={{ background: 'rgba(184,134,11,0.08)', border: '1.5px solid rgba(184,134,11,0.3)', color: '#b8860b', width: '38px', height: '38px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.background = '#b8860b'; e.currentTarget.style.color = '#fff'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(184,134,11,0.08)'; e.currentTarget.style.color = '#b8860b'; }}
          >
            <FiShoppingBag size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
