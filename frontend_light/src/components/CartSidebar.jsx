import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { FiX, FiTrash2, FiPlus, FiMinus, FiShoppingBag } from 'react-icons/fi';

export default function CartSidebar() {
  const { cart, cartOpen, setCartOpen, updateQuantity, removeItem, cartTotal } = useCart();
  const navigate = useNavigate();
  const fmt = (n) => '₹' + Number(n).toLocaleString('en-IN');

  if (!cartOpen) return null;

  return (
    <>
      <div onClick={() => setCartOpen(false)} style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)', zIndex: 2000,
        backdropFilter: 'blur(4px)',
      }} />
      <div style={{
        position: 'fixed', right: 0, top: 0, bottom: 0, width: '420px', maxWidth: '100vw',
        background: '#fff', borderLeft: '1.5px solid #e8d9c0', zIndex: 2001,
        display: 'flex', flexDirection: 'column',
        animation: 'slideIn 0.3s ease',
        boxShadow: '-8px 0 40px rgba(0,0,0,0.10)',
      }}>
        <style>{`@keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }`}</style>

        {/* Header */}
        <div style={{ padding: '24px', borderBottom: '1px solid #f0e8d8', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fffdf9' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FiShoppingBag size={20} color="#b8860b" />
            <h3 style={{ fontFamily: 'Bodoni Moda', fontSize: '1.3rem', color: '#1a1a1a' }}>Your Cart</h3>
            <span style={{ background: '#b8860b', color: '#fff', borderRadius: '50%', width: '22px', height: '22px', fontSize: '0.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {cart.items?.length || 0}
            </span>
          </div>
          <button onClick={() => setCartOpen(false)} style={{ background: 'none', border: 'none', color: '#aaa', cursor: 'pointer' }}>
            <FiX size={22} />
          </button>
        </div>

        {/* Items */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px', background: '#fffdf9' }}>
          {!cart.items?.length ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: '#bbb' }}>
              <FiShoppingBag size={48} style={{ marginBottom: '16px', opacity: 0.3, color: '#b8860b' }} />
              <p style={{ color: '#999' }}>Your cart is empty</p>
              <button onClick={() => { navigate('/collections'); setCartOpen(false); }} className="btn btn-primary" style={{ marginTop: '20px', fontSize: '0.85rem' }}>
                Shop Now
              </button>
            </div>
          ) : (
            cart.items.map(item => (
              <div key={item._id} style={{
                display: 'flex', gap: '14px', padding: '16px 0',
                borderBottom: '1px solid #f5ede0', alignItems: 'center',
              }}>
                <img src={item.product?.images?.[0] || 'https://via.placeholder.com/80x80?text=Jewel'} alt={item.product?.name}
                  style={{ width: '72px', height: '72px', objectFit: 'cover', borderRadius: '10px', border: '1.5px solid #e8d9c0' }} />
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '0.88rem', fontWeight: 500, marginBottom: '4px', lineHeight: 1.3, color: '#1a1a1a' }}>{item.product?.name}</p>
                  <p style={{ color: '#b8860b', fontWeight: 600, fontSize: '0.9rem' }}>{fmt(item.product?.price)}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '8px' }}>
                    <button onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                      style={{ background: '#f5efe6', border: '1px solid #e8d9c0', color: '#555', width: '26px', height: '26px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <FiMinus size={12} />
                    </button>
                    <span style={{ fontSize: '0.9rem', minWidth: '20px', textAlign: 'center', color: '#1a1a1a' }}>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                      style={{ background: '#f5efe6', border: '1px solid #e8d9c0', color: '#555', width: '26px', height: '26px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <FiPlus size={12} />
                    </button>
                    <button onClick={() => removeItem(item.product._id)}
                      style={{ marginLeft: 'auto', background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer' }}>
                      <FiTrash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cart.items?.length > 0 && (
          <div style={{ padding: '24px', borderTop: '1px solid #f0e8d8', background: '#fffdf9' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.85rem', color: '#999' }}>
              <span>Subtotal</span><span style={{ color: '#1a1a1a' }}>{fmt(cartTotal)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', fontSize: '0.85rem', color: '#999' }}>
              <span>Shipping</span><span style={{ color: '#16a34a' }}>Free</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', fontWeight: 700, fontSize: '1.1rem', color: '#1a1a1a' }}>
              <span>Total</span><span style={{ color: '#b8860b' }}>{fmt(cartTotal)}</span>
            </div>
            <button onClick={() => { navigate('/checkout'); setCartOpen(false); }} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '14px' }}>
              Proceed to Checkout →
            </button>
            <button onClick={() => { navigate('/collections'); setCartOpen(false); }} style={{ width: '100%', background: 'none', border: 'none', color: '#999', cursor: 'pointer', marginTop: '12px', fontSize: '0.85rem', padding: '8px' }}>
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  );
}
