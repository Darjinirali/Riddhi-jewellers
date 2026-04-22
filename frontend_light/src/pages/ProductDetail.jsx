import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { FiShoppingBag, FiArrowLeft, FiStar, FiCheck } from 'react-icons/fi';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImg, setSelectedImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const fmt = (n) => '₹' + Number(n).toLocaleString('en-IN');

  useEffect(() => {
    axios.get(`/api/products/${id}`)
      .then(r => setProduct(r.data))
      .catch(() => setProduct(demoProduct))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = async () => {
    await addToCart(product._id, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) return <div style={{ paddingTop: '140px', textAlign: 'center' }}><div className="spinner" /></div>;
  if (!product) return <div style={{ paddingTop: '140px', textAlign: 'center', color: '#777' }}>Product not found</div>;

  const imgs = product.images?.length ? product.images : ['https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800'];
  const discount = product.discountPrice ? Math.round((1 - product.discountPrice / product.price) * 100) : 0;
  const displayPrice = product.discountPrice || product.price;

  return (
    <div style={{ paddingTop: '70px', minHeight: '100vh', background: '#fdf9f4' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 5%' }}>
        <button onClick={() => navigate(-1)} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', color: '#777', cursor: 'pointer', marginBottom: '32px', fontSize: '0.88rem' }}>
          <FiArrowLeft size={16} /> Back
        </button>

        {/* ✅ FIX 1: className="detail-grid" add kiya */}
        <div className="detail-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'start' }}>

          {/* Images */}
          <div>
            {/* ✅ FIX 2: className="main-img-box" add kiya */}
            <div className="main-img-box" style={{ borderRadius: '16px', overflow: 'hidden', marginBottom: '16px', border: '1.5px solid #e8d9c0', height: '500px' }}>
              <img src={imgs[selectedImg]} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            {imgs.length > 1 && (
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {imgs.map((img, i) => (
                  <div key={i} onClick={() => setSelectedImg(i)} style={{
                    width: '80px', height: '80px', borderRadius: '10px', overflow: 'hidden',
                    border: `2px solid ${selectedImg === i ? '#b8860b' : '#e8d9c0'}`, cursor: 'pointer',
                  }}>
                    <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            {product.collection && (
              <p style={{ color: '#b8860b', fontSize: '0.75rem', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '12px' }}>
                {product.collection.name || 'Collection'}
              </p>
            )}
            <h1 style={{ fontFamily: 'Bodoni Moda', fontSize: '2.2rem', fontWeight: 700, lineHeight: 1.2, marginBottom: '16px' }}>{product.name}</h1>

            {/* Rating */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
              {[1,2,3,4,5].map(s => <FiStar key={s} size={16} color="#d4af37" fill={s <= Math.round(product.avgRating) ? '#b8860b' : 'none'} />)}
              <span style={{ color: '#777', fontSize: '0.85rem' }}>({product.ratings?.length || 0} reviews)</span>
            </div>

            {/* Price */}
            <div style={{ marginBottom: '24px' }}>
              <span style={{ color: '#b8860b', fontSize: '2rem', fontWeight: 700 }}>{fmt(displayPrice)}</span>
              {product.discountPrice > 0 && (
                <>
                  <span style={{ color: '#666', fontSize: '1rem', textDecoration: 'line-through', marginLeft: '12px' }}>{fmt(product.price)}</span>
                  <span style={{ background: 'rgba(184,134,11,0.15)', color: '#b8860b', padding: '3px 10px', borderRadius: '20px', fontSize: '0.78rem', fontWeight: 700, marginLeft: '10px' }}>
                    {discount}% OFF
                  </span>
                </>
              )}
            </div>

            <p style={{ color: '#999', lineHeight: 1.8, marginBottom: '28px', fontSize: '0.93rem' }}>{product.description}</p>

            {/* Details */}
            <div style={{ background: 'var(--card-bg)', border: '1.5px solid #e8d9c0', borderRadius: '12px', padding: '20px', marginBottom: '28px' }}>
              {[
                ['Material', product.material],
                ['Weight', product.weight],
                ['Category', product.category],
                ['Stock', product.stock > 0 ? `${product.stock} available` : 'Out of Stock'],
              ].filter(([, v]) => v).map(([label, value]) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f0e8d8', fontSize: '0.88rem' }}>
                  <span style={{ color: '#888' }}>{label}</span>
                  <span style={{ color: '#ddd', fontWeight: 500 }}>{value}</span>
                </div>
              ))}
            </div>

            {/* Qty + Add */}
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #e8d9c0', borderRadius: '30px', overflow: 'hidden' }}>
                <button onClick={() => setQty(q => Math.max(1, q - 1))} style={{ background: 'none', border: 'none', color: '#1a1a1a', width: '44px', height: '44px', cursor: 'pointer', fontSize: '1.2rem' }}>−</button>
                <span style={{ minWidth: '32px', textAlign: 'center', fontWeight: 600 }}>{qty}</span>
                <button onClick={() => setQty(q => Math.min(product.stock, q + 1))} style={{ background: 'none', border: 'none', color: '#1a1a1a', width: '44px', height: '44px', cursor: 'pointer', fontSize: '1.2rem' }}>+</button>
              </div>
              <button onClick={handleAddToCart} className="btn btn-primary" style={{ flex: 1, justifyContent: 'center', padding: '13px 24px' }} disabled={product.stock === 0}>
                {added ? <><FiCheck size={16} /> Added!</> : <><FiShoppingBag size={16} /> Add to Cart</>}
              </button>
            </div>

            {/* Trust Badges Grid */}
            <div style={{
              marginTop: '28px',
              padding: '20px',
              background: 'var(--card-bg)',
              border: '1.5px solid #e8d9c0',
              borderRadius: '12px',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '14px',
            }}>
              {[
                { icon: '🚚', title: 'Free & Insured Delivery', sub: 'Every order shipped with insurance' },
                { icon: '🏅', title: 'BIS Hallmarked', sub: 'Certified purity guaranteed' },
                { icon: '↩️', title: '7-Day Returns', sub: 'Hassle-free return policy' },
                { icon: '📞', title: 'Order Verification', sub: 'We call to confirm large orders' },
              ].map(({ icon, title, sub }) => (
                <div key={title} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                  <span style={{ fontSize: '1.4rem', flexShrink: 0 }}>{icon}</span>
                  <div>
                    <p style={{ fontSize: '0.82rem', fontWeight: 600, color: '#ddd', marginBottom: '2px' }}>{title}</p>
                    <p style={{ fontSize: '0.74rem', color: '#888', lineHeight: 1.4 }}>{sub}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* WhatsApp Consult Button — only for products above ₹2 lakh */}
            {displayPrice > 200000 && (
              <a
                href={`https://wa.me/919104261433?text=Hi%2C%20I'm%20interested%20in%20*${encodeURIComponent(product.name)}*%20(${fmt(displayPrice)}).%20Can%20you%20help%20me%3F`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                  marginTop: '14px', padding: '13px', borderRadius: '10px',
                  background: '#25D366', color: '#1a1a1a', textDecoration: 'none',
                  fontSize: '0.9rem', fontWeight: 600, transition: 'opacity 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.opacity = '0.88'}
                onMouseLeave={e => e.currentTarget.style.opacity = '1'}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                WhatsApp pe Consult Karo — Free
              </a>
            )}

            {/* COD note for high value */}
            {displayPrice > 50000 && (
              <p style={{ marginTop: '12px', color: '#666', fontSize: '0.76rem', textAlign: 'center' }}>
                ⓘ Online payment only for items above ₹50,000 (UPI / Card / Net Banking / EMI)
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ✅ FIX 3: Pura responsive CSS */}
      <style>{`
        @media(max-width: 768px) {
          .detail-grid {
            grid-template-columns: 1fr !important;
            gap: 24px !important;
          }
          .main-img-box {
            height: 340px !important;
          }
        }
      `}</style>
    </div>
  );
}

const demoProduct = {
  _id: 'demo', name: 'Kundan Bridal Necklace Set', price: 125000, discountPrice: 99000,
  images: ['https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800', 'https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?w=800'],
  material: 'Gold 22K', weight: '45g', category: 'Necklace', stock: 5,
  description: 'A breathtaking kundan bridal necklace set crafted with pure 22K gold and precious stones. Perfect for your special day.',
  collection: { name: 'Bridal Elegance' }, ratings: [], avgRating: 4.5,
};