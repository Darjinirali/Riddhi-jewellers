import { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FiPlus, FiEdit, FiTrash2, FiX } from 'react-icons/fi';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', description: '', price: '', discountPrice: '', images: '', collection: '', category: '', weight: '', material: '', stock: 10, isFeatured: false });
  const fmt = (n) => '₹' + Number(n).toLocaleString('en-IN');

  useEffect(() => {
    Promise.all([
      axios.get('/api/products').then(r => setProducts(r.data.products)),
      axios.get('/api/collections').then(r => setCollections(r.data)),
    ]).finally(() => setLoading(false));
  }, []);

  const openAdd = () => { setEditing(null); setForm({ name: '', description: '', price: '', discountPrice: '', images: '', collection: '', category: '', weight: '', material: '', stock: 10, isFeatured: false }); setModal(true); };
  const openEdit = (p) => { setEditing(p); setForm({ ...p, images: p.images.join(', '), discountPrice: p.discountPrice || '' }); setModal(true); };

  const handleSave = async (e) => {
    e.preventDefault();
    const payload = { ...form, price: Number(form.price), discountPrice: Number(form.discountPrice) || 0, stock: Number(form.stock), images: form.images.split(',').map(s => s.trim()).filter(Boolean) };
    try {
      if (editing) {
        const { data } = await axios.put(`/api/products/${editing._id}`, payload);
        setProducts(prev => prev.map(p => p._id === editing._id ? data : p));
        toast.success('Product updated');
      } else {
        const { data } = await axios.post('/api/products', payload);
        setProducts(prev => [data, ...prev]);
        toast.success('Product added');
      }
      setModal(false);
    } catch (err) { toast.error(err.response?.data?.message || 'Error saving'); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return;
    try { await axios.delete(`/api/products/${id}`); setProducts(prev => prev.filter(p => p._id !== id)); toast.success('Deleted'); }
    catch { toast.error('Delete failed'); }
  };

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value });

  return (
    <div style={{ padding: '40px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <h1 style={{ fontFamily: 'Bodoni Moda', fontSize: '2rem' }}>Products</h1>
        <button onClick={openAdd} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px' }}>
          <FiPlus size={16} /> Add Product
        </button>
      </div>

      {loading ? <div className="spinner" /> : (
        <div style={{ background: 'var(--card-bg)', border: '1.5px solid #e8d9c0', borderRadius: '16px', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ background: '#f5efe6' }}>
                {['Product', 'Collection', 'Price', 'Stock', 'Featured', 'Actions'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '14px 16px', color: '#666', fontWeight: 500, fontSize: '0.8rem', letterSpacing: '0.5px' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p._id} style={{ borderTop: '1px solid #e8d9c0' }}>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <img src={p.images?.[0] || 'https://via.placeholder.com/48'} alt={p.name} style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover' }} />
                      <div>
                        <p style={{ fontWeight: 500, marginBottom: '2px' }}>{p.name}</p>
                        <p style={{ color: '#888', fontSize: '0.75rem' }}>{p.material}</p>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px', color: '#777' }}>{p.collection?.name || '—'}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{ color: '#b8860b', fontWeight: 600 }}>{fmt(p.discountPrice || p.price)}</span>
                    {p.discountPrice > 0 && <span style={{ color: '#666', fontSize: '0.75rem', textDecoration: 'line-through', marginLeft: '6px' }}>{fmt(p.price)}</span>}
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{ color: p.stock > 0 ? '#22c55e' : '#ef4444' }}>{p.stock}</span>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{ color: p.isFeatured ? '#b8860b' : '#444' }}>{p.isFeatured ? '✦ Yes' : 'No'}</span>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => openEdit(p)} style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)', color: '#3b82f6', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <FiEdit size={12} /> Edit
                      </button>
                      <button onClick={() => handleDelete(p._id)} style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <FiTrash2 size={12} /> Del
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {modal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: 'var(--card-bg)', border: '1px solid #e8d9c0', borderRadius: '20px', padding: '32px', width: '100%', maxWidth: '620px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 style={{ fontFamily: 'Bodoni Moda', fontSize: '1.4rem' }}>{editing ? 'Edit' : 'Add'} Product</h3>
              <button onClick={() => setModal(false)} style={{ background: 'none', border: 'none', color: '#777', cursor: 'pointer' }}><FiX size={20} /></button>
            </div>
            <form onSubmit={handleSave}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group" style={{ gridColumn: '1 / -1' }}><label>Product Name *</label><input type="text" value={form.name} onChange={set('name')} required /></div>
                <div className="form-group" style={{ gridColumn: '1 / -1' }}><label>Description</label><textarea value={form.description} onChange={set('description')} rows={3} /></div>
                <div className="form-group"><label>Price (₹) *</label><input type="number" value={form.price} onChange={set('price')} required /></div>
                <div className="form-group"><label>Discount Price (₹)</label><input type="number" value={form.discountPrice} onChange={set('discountPrice')} /></div>
                <div className="form-group">
                  <label>Collection *</label>
                  <select value={form.collection} onChange={set('collection')} required>
                    <option value="">Select collection</option>
                    {collections.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                  </select>
                </div>
                <div className="form-group"><label>Category</label><input type="text" value={form.category} onChange={set('category')} placeholder="rings, necklace..." /></div>
                <div className="form-group"><label>Material</label><input type="text" value={form.material} onChange={set('material')} placeholder="Gold 22K, Diamond..." /></div>
                <div className="form-group"><label>Weight</label><input type="text" value={form.weight} onChange={set('weight')} placeholder="10g" /></div>
                <div className="form-group"><label>Stock</label><input type="number" value={form.stock} onChange={set('stock')} min="0" /></div>
                <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingTop: '24px' }}>
                  <input type="checkbox" id="featured" checked={form.isFeatured} onChange={set('isFeatured')} style={{ width: 'auto', accentColor: '#b8860b' }} />
                  <label htmlFor="featured" style={{ marginBottom: 0 }}>Featured Product</label>
                </div>
                <div className="form-group" style={{ gridColumn: '1 / -1' }}><label>Image URLs (comma-separated)</label><input type="text" value={form.images} onChange={set('images')} placeholder="https://img1.jpg, https://img2.jpg" /></div>
              </div>
              <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }}>{editing ? 'Update' : 'Add'} Product</button>
                <button type="button" onClick={() => setModal(false)} className="btn btn-secondary">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
