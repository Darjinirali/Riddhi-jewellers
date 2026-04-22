import { useEffect, useState } from 'react';

export default function AdminMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading]   = useState(true);

  const fetchMessages = async () => {
    try {
      const res  = await fetch('/api/contact');
      const data = await res.json();
      setMessages(data);
    } catch (err) {
      console.error('Messages fetch nahi hue:', err);
    } finally {
      setLoading(false);
    }
  };

  const deleteMessage = async (id) => {
    if (!confirm('Is message ko delete karna chahte ho?')) return;
    await fetch(`/api/contact/${id}`, { method: 'DELETE' });
    setMessages(prev => prev.filter(m => m._id !== id));
  };

  useEffect(() => { fetchMessages(); }, []);

  if (loading) return (
    <div style={{ padding: '40px', color: '#777', textAlign: 'center' }}>
      Messages load ho rahe hai...
    </div>
  );

  return (
    <div style={{ 
      padding: '40px', 
      background: '#fdf9f4',     // Dark background
      minHeight: '100vh',
      color: '#1a1a1a'
    }}>
      <h1 style={{ 
        fontFamily: 'Bodoni Moda', 
        color: '#1a1a1a', 
        marginBottom: '4px' 
      }}>
        Contact <span style={{ color: '#b8860b' }}>Messages</span>
      </h1>
      
      <p style={{ 
        color: '#cccccc', 
        marginBottom: '32px', 
        fontSize: '0.9rem' 
      }}>
        Total: {messages.length} messages
      </p>

      {messages.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '80px 20px', 
          color: '#777' 
        }}>
          <p style={{ fontSize: '3rem', marginBottom: '16px' }}>📭</p>
          <p style={{ fontSize: '1.1rem' }}>Abhi tak koi message nahi aaya.</p>
        </div>
      ) : (
        messages.map(msg => (
          <div 
            key={msg._id} 
            style={{
              background: 'var(--card-bg)',           // Dark card background
              border: '1px solid #e8d9c0',
              borderRadius: '16px',
              padding: '24px 28px',
              marginBottom: '16px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              gap: '16px',
            }}
          >
            <div style={{ flex: 1 }}>
              <h3 style={{ 
                color: '#1a1a1a', 
                margin: '0 0 6px', 
                fontSize: '1.05rem' 
              }}>
                {msg.name}
              </h3>
              
              <p style={{ 
                color: '#b8860b', 
                fontSize: '0.85rem', 
                margin: '0 0 4px' 
              }}>
                {msg.email}
              </p>
              
              {msg.phone && (
                <p style={{ 
                  color: '#aaaaaa', 
                  fontSize: '0.82rem', 
                  margin: '0 0 14px' 
                }}>
                  {msg.phone}
                </p>
              )}
              
              <p style={{ 
                color: '#cccccc', 
                lineHeight: 1.7, 
                margin: '12px 0 0', 
                fontSize: '0.95rem' 
              }}>
                {msg.message}
              </p>
            </div>

            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <p style={{ 
                color: '#888888', 
                fontSize: '0.75rem', 
                margin: '0 0 12px' 
              }}>
                {new Date(msg.createdAt).toLocaleString('en-IN')}
              </p>
              
              <button
                onClick={() => deleteMessage(msg._id)}
                style={{
                  background: '#e0d0b8',
                  color: '#ef4444',
                  border: '1px solid #444',
                  borderRadius: '8px',
                  padding: '8px 16px',
                  cursor: 'pointer',
                  fontSize: '0.82rem',
                  fontWeight: '500',
                  transition: 'all 0.2s',
                }}
                onMouseOver={(e) => {
                  e.target.style.background = '#3a3a3a';
                  e.target.style.borderColor = '#ef4444';
                }}
                onMouseOut={(e) => {
                  e.target.style.background = '#e0d0b8';
                  e.target.style.borderColor = '#444';
                }}
              >
                Delete
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}