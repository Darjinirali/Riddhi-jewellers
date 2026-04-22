import { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FiPlus, FiEdit, FiTrash2, FiX } from 'react-icons/fi';

export default function AdminCollections() {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', description: '', image: '' });

  useEffect(() => {
    axios.get('/api/collections').then(r => setCollections(r.data)).finally(() => setLoading(false));
  }, []);

  const openAdd = () => { setEditing(null); setForm({ name: '', description: '', image: '' }); setModal(true); };
  const openEdit = (c) => { setEditing(c); setForm({ name: c.name, description: c.description, image: c.image }); setModal(true); };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        const { data } = await axios.put(`/api/collections/${editing._id}`, form);
        setCollections(prev => prev.map(c => c._id === editing._id ? data : c));
        toast.success('Collection updated');
      } else {
        const { data } = await axios.post('/api/collections', form);
        setCollections(prev => [...prev, data]);
        toast.success('Collection added');
      }
      setModal(false);
    } catch (err) { toast.error(err.response?.data?.message || 'Error'); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this collection?')) return;
    try { await axios.delete(`/api/collections/${id}`); setCollections(prev => prev.filter(c => c._id !== id)); toast.success('Deleted'); }
    catch { toast.error('Delete failed'); }
  };

  return (
    <div style={{ padding: '40px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <h1 style={{ fontFamily: 'Bodoni Moda', fontSize: '2rem' }}>Collections</h1>
        <button onClick={openAdd} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px' }}>
          <FiPlus size={16} /> Add Collection
        </button>
      </div>

      {loading ? <div className="spinner" /> : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
          {collections.map(c => (
            <div key={c._id} style={{ background: 'var(--card-bg)', border: '1.5px solid #e8d9c0', borderRadius: '16px', overflow: 'hidden' }}>
              <div style={{ height: '180px', overflow: 'hidden' }}>
                <img src={c.image} alt={c.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ padding: '20px' }}>
                <h3 style={{ fontFamily: 'Bodoni Moda', fontSize: '1.2rem', marginBottom: '6px' }}>{c.name}</h3>
                <p style={{ color: '#888', fontSize: '0.82rem', marginBottom: '6px', lineHeight: 1.5 }}>{c.description}</p>
                <p style={{ color: '#555', fontSize: '0.75rem', marginBottom: '16px', fontFamily: 'monospace' }}>/{c.slug}</p>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button onClick={() => openEdit(c)} style={{ flex: 1, background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)', color: '#3b82f6', padding: '8px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.82rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                    <FiEdit size={13} /> Edit
                  </button>
                  <button onClick={() => handleDelete(c._id)} style={{ flex: 1, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444', padding: '8px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.82rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                    <FiTrash2 size={13} /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: 'var(--card-bg)', border: '1px solid #e8d9c0', borderRadius: '20px', padding: '32px', width: '100%', maxWidth: '500px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 style={{ fontFamily: 'Bodoni Moda', fontSize: '1.4rem' }}>{editing ? 'Edit' : 'Add'} Collection</h3>
              <button onClick={() => setModal(false)} style={{ background: 'none', border: 'none', color: '#777', cursor: 'pointer' }}><FiX size={20} /></button>
            </div>
            <form onSubmit={handleSave}>
              <div className="form-group"><label>Collection Name *</label><input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required /></div>
              <div className="form-group"><label>Description</label><textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} /></div>
              <div className="form-group"><label>Image URL</label><input type="url" value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} placeholder="https://..." /></div>
              {form.image && <img src={form.image} alt="preview" style={{ width: '100%', height: '160px', objectFit: 'cover', borderRadius: '10px', marginBottom: '16px', border: '1px solid #e8d9c0' }} />}
              <div style={{ display: 'flex', gap: '12px' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }}>{editing ? 'Update' : 'Add'} Collection</button>
                <button type="button" onClick={() => setModal(false)} className="btn btn-secondary">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
