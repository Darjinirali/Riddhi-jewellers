import { useState, useRef, useEffect } from 'react';

const SYSTEM_PROMPT = `You are Riddhi, the AI assistant for Riddhi Jewellers — helpful, warm and knowledgeable jewellery expert.

STORE INFO:
- Name: Riddhi Jewellers
- Location: Ahmedabad, Gujarat
- Experience: 29+ years (Est. 1995)
- Timing: Mon-Sat 10AM-8PM, Sun 11AM-6PM
- Phone: +91 9104261433
- Email: info@riddhijewellers.com
- Happy Clients: 2000+
- Designs: 500+

COLLECTIONS:
- Bridal Elegance: Complete bridal sets, necklace, bangles, earrings, maang tikka
- Diamond Luxury: GIA/IGI certified diamonds, solitaire rings, pendants
- Gold Heritage: Pure 22K and 18K gold jewellery, traditional designs
- Contemporary Style: Modern, fusion, everyday wear jewellery

GOLD RATES (indicative):
- 22K Gold: ~₹7,350 per gram
- 18K Gold: ~₹6,010 per gram
- Note: Contact store for exact rate

SERVICES:
- Custom jewellery design (15-21 days)
- BIS hallmark certification
- Lifetime free polishing & cleaning
- 7-day easy returns
- Pan-India insured delivery (free above ₹5000)
- Old jewellery exchange
- EMI available (3, 6, 12, 24 months no-cost)
- Personal consultation available

CERTIFICATIONS:
- BIS Hallmark certified
- GIA certified diamonds
- ISO 9001:2015

OCCASIONS: Wedding, Engagement, Anniversary, Birthday, Graduation, Gift

RULES:
- Always respond in English only
- Keep replies short and helpful (2-4 lines max)
- Suggest relevant collections for product queries
- For appointments or custom orders, suggest calling: +91 9104261433
- For gold rates, share indicative price but say "please confirm with store"
- Never give fake information
- If unsure, ask customer to contact the store`;

const QUICK_REPLIES = [
  '💍 Show Bridal Jewellery',
  '💎 Show Diamond Rings',
  '🥇 What is the Gold Rate?',
  '✨ I want a Custom Design',
  '📦 How is Delivery done?',
  '↩️ What is the Return Policy?',
];

export default function RiddhiChatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Namaste! 🙏 I am Riddhi, AI Assistant of Riddhi Jewellers. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showQuick, setShowQuick] = useState(true);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 300);
  }, [open]);

  const sendMessage = async (text) => {
    const userText = text || input.trim();
    if (!userText || loading) return;

    setShowQuick(false);
    setInput('');
    const newMessages = [...messages, { role: 'user', content: userText }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const response = await fetch('https://riddhi-jewellers-1.onrender.com/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          system: SYSTEM_PROMPT,
          messages: newMessages.map(m => ({ role: m.role, content: m.content })),
        }),
      });

      const data = await response.json();
      const reply = data.content?.[0]?.text || 'Sorry, something went wrong. Please call us at: +91 9104261433 🙏';
      setMessages([...newMessages, { role: 'assistant', content: reply }]);
    } catch {
      setMessages([...newMessages, { role: 'assistant', content: 'A technical issue occurred. Please call or WhatsApp us at +91 9104261433! 🙏' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  return (
    <>
      {/* Chat Window */}
      {open && (
        <div style={{
          position: 'fixed',
          bottom: '90px',
          right: '16px',
          left: 'auto',
          zIndex: 99998,
          width: 'min(360px, calc(100vw - 32px))',
          maxHeight: '70vh',
          background: 'var(--card-bg)',
          border: '1px solid #e8d9c0',
          borderRadius: '20px',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
        }}>

          {/* Header */}
          <div style={{ background: '#fdf9f4', borderBottom: '1px solid #e8d9c0', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: '#d4af3720', border: '2px solid #d4af37', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Bodoni Moda', fontSize: '1rem', color: '#b8860b', fontWeight: 700, flexShrink: 0 }}>R</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ color: '#1a1a1a', fontWeight: 600, fontSize: '0.88rem', margin: 0, fontFamily: 'Bodoni Moda' }}>Riddhi Jewellers</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22c55e', flexShrink: 0 }} />
                <span style={{ color: '#777', fontSize: '0.68rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>AI Assistant • Always Online</span>
              </div>
            </div>
            <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer', fontSize: '1.1rem', padding: '4px', flexShrink: 0 }}>✕</button>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '12px', display: 'flex', flexDirection: 'column', gap: '10px', minHeight: '200px' }}>
            {messages.map((m, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start', gap: '6px', alignItems: 'flex-end' }}>
                {m.role === 'assistant' && (
                  <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: '#d4af3720', border: '1px solid #d4af3760', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#b8860b', fontSize: '0.7rem', fontWeight: 700, flexShrink: 0, fontFamily: 'Bodoni Moda' }}>R</div>
                )}
                <div style={{
                  maxWidth: '80%',
                  padding: '9px 13px',
                  borderRadius: m.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                  background: m.role === 'user' ? '#b8860b' : '#f0e8d8',
                  color: m.role === 'user' ? '#1a1a1a' : '#2c2c2c',
                  fontSize: '0.85rem',
                  lineHeight: 1.6,
                  border: m.role === 'assistant' ? '1px solid #2a2a2a' : 'none',
                  wordBreak: 'break-word',
                }}>
                  {m.content}
                </div>
              </div>
            ))}

            {/* Loading dots */}
            {loading && (
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '6px' }}>
                <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: '#d4af3720', border: '1px solid #d4af3760', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#b8860b', fontSize: '0.7rem', fontWeight: 700, fontFamily: 'Bodoni Moda', flexShrink: 0 }}>R</div>
                <div style={{ background: '#f0e8d8', border: '1px solid #e8d9c0', borderRadius: '16px 16px 16px 4px', padding: '10px 14px', display: 'flex', gap: '4px', alignItems: 'center' }}>
                  {[0, 1, 2].map(i => (
                    <div key={i} style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#b8860b', animation: `bounce 1s ${i * 0.2}s infinite` }} />
                  ))}
                </div>
              </div>
            )}

            {/* Quick replies */}
            {showQuick && messages.length === 1 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '4px' }}>
                {QUICK_REPLIES.map((q, i) => (
                  <button key={i} onClick={() => sendMessage(q)} style={{
                    background: 'transparent',
                    border: '1px solid #e8d9c0',
                    borderRadius: '20px',
                    padding: '7px 13px',
                    color: '#444',
                    fontSize: '0.78rem',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.2s',
                  }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = '#b8860b'; e.currentTarget.style.color = '#b8860b'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = '#e0d0b8'; e.currentTarget.style.color = '#444'; }}
                  >{q}</button>
                ))}
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div style={{ borderTop: '1px solid #e8d9c0', padding: '10px 12px', display: 'flex', gap: '8px', alignItems: 'center', background: '#fdf9f4', flexShrink: 0 }}>
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Ask something..."
              disabled={loading}
              style={{ flex: 1, background: '#f0e8d8', border: '1px solid #e8d9c0', borderRadius: '20px', padding: '9px 14px', color: '#1a1a1a', fontSize: '0.85rem', outline: 'none', minWidth: 0 }}
            />
            <button
              onClick={() => sendMessage()}
              disabled={loading || !input.trim()}
              style={{
                width: '36px', height: '36px', borderRadius: '50%', border: 'none', flexShrink: 0,
                background: input.trim() && !loading ? '#b8860b' : '#e0d0b8',
                color: input.trim() && !loading ? '#000' : '#555',
                cursor: input.trim() && !loading ? 'pointer' : 'default',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem',
                transition: 'all 0.2s',
              }}>➤</button>
          </div>

          <div style={{ textAlign: 'center', padding: '5px', background: '#f8f2e8', flexShrink: 0 }}>
            <span style={{ color: '#444', fontSize: '0.62rem' }}>Powered by Groq AI • Riddhi Jewellers</span>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={() => setOpen(!open)}
        style={{
          position: 'fixed', bottom: '24px', right: '16px', zIndex: 99999,
          width: '56px', height: '56px', borderRadius: '50%',
          background: open ? '#f0e8d8' : '#b8860b',
          border: open ? '2px solid #d4af37' : 'none',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', boxShadow: '0 4px 24px rgba(184,134,11,0.4)',
          transition: 'all 0.3s', fontSize: '1.4rem',
        }}
        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
        title="Chat with Riddhi"
      >
        {open ? <span style={{ color: '#b8860b', fontSize: '1.1rem' }}>✕</span> : '💬'}
      </button>

      <style>{`
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-6px); }
        }
      `}</style>
    </>
  );
}