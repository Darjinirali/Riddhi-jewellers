import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import { FiFilter } from 'react-icons/fi';

export default function CollectionProducts() {
  const { slug } = useParams();
  const [collection, setCollection] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sort, setSort] = useState('newest');
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`/api/collections/${slug}`)
      .then(r => setCollection(r.data))
      .catch(() => setCollection({ name: slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()), description: 'Exquisite pieces crafted with love.' }));
  }, [slug]);

  useEffect(() => {
    setLoading(true);
    if (!collection) return;
    const params = new URLSearchParams({ page, limit: 12 });
    if (collection._id) params.append('collection', collection._id);
    axios.get(`/api/products?${params}`)
      .then(r => { setProducts(r.data.products); setTotalPages(r.data.pages || 1); })
      .catch(() => setProducts(demoProducts))
      .finally(() => setLoading(false));
  }, [collection, page]);

  const sorted = [...products].sort((a, b) => {
    if (sort === 'price-asc') return (a.discountPrice || a.price) - (b.discountPrice || b.price);
    if (sort === 'price-desc') return (b.discountPrice || b.price) - (a.discountPrice || a.price);
    return 0;
  });

  return (
    <div style={{ paddingTop: '70px', minHeight: '100vh', background: '#fdf9f4' }}>
      {/* Hero */}
      <div style={{ background: 'var(--card-bg)', padding: '60px 5%', borderBottom: '1px solid #f0e8d8' }}>
        <p onClick={() => navigate('/collections')} style={{ color: '#777', fontSize: '0.82rem', cursor: 'pointer', marginBottom: '12px' }}>← Collections</p>
        <h1 style={{ fontFamily: 'Bodoni Moda', fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontWeight: 700, marginBottom: '10px' }}>
          {collection?.name || '...'} <span style={{ color: '#b8860b' }}>✦</span>
        </h1>
        <p style={{ color: '#777', maxWidth: '500px', fontSize: '0.9rem', lineHeight: 1.7 }}>{collection?.description}</p>
      </div>

      <div style={{ padding: '40px 5%' }}>
        {/* Filters bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '12px' }}>
          <p style={{ color: '#777', fontSize: '0.88rem' }}>{products.length} products</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <FiFilter size={16} color="#888" />
            <select value={sort} onChange={e => setSort(e.target.value)} style={{
              background: 'var(--card-bg)', border: '1px solid #e8d9c0', borderRadius: '8px',
              color: '#666', padding: '8px 14px', fontSize: '0.85rem', cursor: 'pointer', outline: 'none',
            }}>
              <option value="newest">Newest First</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="spinner" />
        ) : sorted.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: '#666' }}>
            <p style={{ fontSize: '3rem', marginBottom: '16px' }}>💎</p>
            <p>No products in this collection yet.</p>
          </div>
        ) : (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '24px' }}>
              {sorted.map(p => <ProductCard key={p._id} product={p} />)}
            </div>
            {totalPages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '48px' }}>
                {Array.from({ length: totalPages }, (_, i) => (
                  <button key={i} onClick={() => setPage(i + 1)} style={{
                    width: '40px', height: '40px', borderRadius: '50%',
                    background: page === i + 1 ? '#b8860b' : 'transparent',
                    color: page === i + 1 ? '#000' : '#888',
                    border: `1px solid ${page === i + 1 ? '#b8860b' : '#e0d0b8'}`,
                    cursor: 'pointer', fontWeight: 600, fontSize: '0.88rem',
                  }}>{i + 1}</button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

const demoProducts = [
  { _id: '1', name: 'Kundan Bridal Necklace', price: 125000, discountPrice: 99000, images: ['https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400'], material: 'Gold 22K', category: 'Necklace', isFeatured: true, ratings: [], avgRating: 0 },
  { _id: '2', name: 'Diamond Solitaire Ring', price: 85000, images: ['https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?w=400'], material: 'Diamond', category: 'Rings', isFeatured: false, ratings: [], avgRating: 0 },
  { _id: '3', name: 'Gold Bangles Set', price: 45000, discountPrice: 38000, images: ['https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400'], material: 'Gold 22K', category: 'Bangles', isFeatured: true, ratings: [], avgRating: 0 },
  { _id: '4', name: 'Pearl Drop Earrings', price: 22000, images: ['https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400'], material: 'Silver', category: 'Earrings', isFeatured: false, ratings: [], avgRating: 0 },
];
