import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { FiCreditCard, FiTruck } from 'react-icons/fi';

export default function Checkout() {
  const { cart, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const fmt = (n) => '₹' + Number(n).toLocaleString('en-IN');

  const [address, setAddress] = useState({
    name: user?.name || '', 
    phone: user?.phone || '',
    street: '', 
    city: '', 
    state: '', 
    pincode: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('razorpay');
  const [loading, setLoading] = useState(false);

  const set = (k) => (e) => setAddress({ ...address, [k]: e.target.value });

  const validateAddress = () => {
    const required = ['name', 'phone', 'street', 'city', 'state', 'pincode'];
    for (const key of required) {
      if (!address[key].trim()) { 
        toast.error(`Please fill in ${key}`); 
        return false; 
      }
    }
    return true;
  };

  const buildOrderItems = () => cart.items.map(i => ({
    product: i.product._id, 
    name: i.product.name,
    image: i.product.images?.[0] || '', 
    quantity: i.quantity, 
    price: i.product.price,
  }));

  const handleCOD = async () => {
    if (!validateAddress()) return;
    if (cartTotal > 50000) {
      toast.error('COD not available for orders above ₹50,000. Please use online payment.');
      return;
    }
    setLoading(true);
    try {
      const { data } = await axios.post('/api/orders/place', {
        items: buildOrderItems(), 
        totalAmount: cartTotal,
        shippingAddress: address, 
        paymentMethod: 'cod',
      });
      await clearCart();
      toast.success('Order placed! Pay on delivery.');
      navigate('/user/orders');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Order failed');
    } finally { 
      setLoading(false); 
    }
  };

  const handleRazorpay = async () => {
    if (!validateAddress()) return;
    setLoading(true);
    try {
      const { data: rzpOrder } = await axios.post('/api/orders/create-razorpay-order', { amount: cartTotal });
      
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: rzpOrder.amount, 
        currency: 'INR',
        name: 'Riddhi Jewellers', 
        description: 'Jewelry Purchase',
        order_id: rzpOrder.id,
        prefill: { 
          name: address.name, 
          contact: address.phone, 
          email: user?.email 
        },
        theme: { color: '#b8860b' },
        config: {
    display: {
      blocks: {
        emi: {
          name: "Easy EMI",
          instruments: [{ method: "emi" }]
        }
      },
      sequence: ["block.emi", "block.other"],
      preferences: { show_default_blocks: true }
    }
  },
        handler: async (response) => {
          try {
            await axios.post('/api/orders/place', {
              items: buildOrderItems(), 
              totalAmount: cartTotal,
              shippingAddress: address, 
              paymentMethod: 'razorpay',
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
            });
            await clearCart();
            toast.success('Payment successful! Order placed.');
            navigate('/user/orders');
          } catch { 
            toast.error('Order save failed after payment. Contact support.'); 
          }
        },
        modal: { ondismiss: () => setLoading(false) },
      };
      new window.Razorpay(options).open();
    } catch (err) {
      toast.error('Could not initiate payment');
      setLoading(false);
    }
  };

  if (!cart.items?.length) return (
    <div style={{ paddingTop: '140px', textAlign: 'center', color: '#777' }}>
      <p style={{ fontSize: '3rem', marginBottom: '16px' }}>🛒</p>
      <p>Your cart is empty</p>
      <button 
        onClick={() => navigate('/collections')} 
        className="btn btn-primary" 
        style={{ marginTop: '20px' }}
      >
        Shop Now
      </button>
    </div>
  );

  const isCODDisabled = cartTotal > 50000;

  return (
    <div style={{ 
      paddingTop: '70px', 
      minHeight: '100vh', 
      background: '#fdf9f4' 
    }}>
      <div style={{ 
        maxWidth: '1100px', 
        margin: '0 auto', 
        padding: '40px 5%' 
      }}>
        <h1 style={{ 
          fontFamily: 'Bodoni Moda', 
          fontSize: '2.2rem', 
          marginBottom: '40px' 
        }}>
          Checkout <span style={{ color: '#b8860b' }}>✦</span>
        </h1>

        {/* Responsive Grid - Yeh main change hai */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr',           // Mobile: 1 column
          gap: '32px',
          alignItems: 'start',

          // Tablet aur Desktop ke liye
          '@media (min-width: 992px)': {
            gridTemplateColumns: '1fr 420px',
            gap: '40px'
          }
        }}>

          {/* Left - Address + Payment */}
          <div>
            {/* Shipping Address */}
            <div style={{ 
              background: 'var(--card-bg)', 
              border: '1.5px solid #e8d9c0', 
              borderRadius: '16px', 
              padding: '28px', 
              marginBottom: '24px' 
            }}>
              <h3 style={{ 
                marginBottom: '24px', 
                fontSize: '1rem', 
                letterSpacing: '1px', 
                color: '#b8860b' 
              }}>📍 SHIPPING ADDRESS</h3>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
                <div className="form-group">
                  <label>Full Name</label>
                  <input 
                    type="text" 
                    value={address.name} 
                    onChange={set('name')} 
                    placeholder="Recipient name" 
                  />
                </div>
                <div className="form-group">
                  <label>Phone</label>
                  <input 
                    type="tel" 
                    value={address.phone} 
                    onChange={set('phone')} 
                    placeholder="+91 98765 43210" 
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Street Address</label>
                <input 
                  type="text" 
                  value={address.street} 
                  onChange={set('street')} 
                  placeholder="House no., Street, Area" 
                />
              </div>

              {/* City, State, Pincode - Responsive */}
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: '1fr', 
                gap: '16px',
                '@media (min-width: 768px)': { gridTemplateColumns: '1fr 1fr 1fr' }
              }}>
                <div className="form-group">
                  <label>City</label>
                  <input 
                    type="text" 
                    value={address.city} 
                    onChange={set('city')} 
                    placeholder="City" 
                  />
                </div>
                <div className="form-group">
                  <label>State</label>
                  <input 
                    type="text" 
                    value={address.state} 
                    onChange={set('state')} 
                    placeholder="State" 
                  />
                </div>
                <div className="form-group">
                  <label>Pincode</label>
                  <input 
                    type="text" 
                    value={address.pincode} 
                    onChange={set('pincode')} 
                    placeholder="380001" 
                  />
                </div>
              </div>
            </div>

            {/* Payment Method - Same as before */}
            <div style={{ 
              background: 'var(--card-bg)', 
              border: '1.5px solid #e8d9c0', 
              borderRadius: '16px', 
              padding: '28px' 
            }}>
              <h3 style={{ 
                marginBottom: '24px', 
                fontSize: '1rem', 
                letterSpacing: '1px', 
                color: '#b8860b' 
              }}>💳 PAYMENT METHOD</h3>

              {[
                {
                  value: 'razorpay',
                  icon: <FiCreditCard size={20} />,
                  label: 'Online Payment',
                  sub: 'UPI, Cards, Net Banking, EMI — via Razorpay (Recommended)',
                  disabled: false,
                },
                {
                  value: 'cod',
                  icon: <FiTruck size={20} />,
                  label: 'Cash on Delivery',
                  sub: isCODDisabled
                    ? '⚠️ COD not available above ₹50,000 — please use online payment'
                    : 'Pay when your order arrives (available up to ₹50,000)',
                  disabled: isCODDisabled,
                },
              ].map(opt => (
                <div
                  key={opt.value}
                  onClick={() => {
                    if (opt.disabled) {
                      toast.error('COD not available for orders above ₹50,000. Please pay online.');
                      return;
                    }
                    setPaymentMethod(opt.value);
                  }}
                  style={{
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '16px', 
                    padding: '16px',
                    border: `2px solid ${paymentMethod === opt.value ? '#b8860b' : '#e8d9c0'}`,
                    borderRadius: '12px',
                    cursor: opt.disabled ? 'not-allowed' : 'pointer',
                    marginBottom: '12px',
                    background: paymentMethod === opt.value ? 'rgba(184,134,11,0.05)' : 'transparent',
                    opacity: opt.disabled ? 0.45 : 1,
                    transition: 'all 0.2s',
                  }}
                >
                  <div style={{ 
                    width: '44px', 
                    height: '44px', 
                    borderRadius: '50%', 
                    background: paymentMethod === opt.value ? '#b8860b' : '#e8d9c0', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    color: paymentMethod === opt.value ? '#000' : '#888', 
                    flexShrink: 0 
                  }}>
                    {opt.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: 600, marginBottom: '2px' }}>{opt.label}</p>
                    <p style={{ 
                      color: opt.disabled ? '#ef4444' : '#666', 
                      fontSize: '0.8rem' 
                    }}>
                      {opt.sub}
                    </p>
                  </div>
                  <div style={{ 
                    width: '20px', 
                    height: '20px', 
                    borderRadius: '50%', 
                    border: `2px solid ${paymentMethod === opt.value ? '#b8860b' : '#333'}`, 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center' 
                  }}>
                    {paymentMethod === opt.value && (
                      <div style={{ 
                        width: '10px', 
                        height: '10px', 
                        borderRadius: '50%', 
                        background: '#b8860b' 
                      }} />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right - Order Summary (Mobile pe upar nahi chipkega) */}
          <div style={{
            background: 'var(--card-bg)',
            border: '1.5px solid #e8d9c0',
            borderRadius: '16px',
            padding: '28px',
            position: 'static',        // Mobile pe sticky nahi rahega
            top: 'auto'
          }}>
            <h3 style={{ 
              marginBottom: '20px', 
              fontSize: '1rem', 
              letterSpacing: '1px', 
              color: '#b8860b' 
            }}>🛍️ ORDER SUMMARY</h3>

            <div style={{ 
              maxHeight: '320px', 
              overflowY: 'auto', 
              marginBottom: '20px' 
            }}>
              {cart.items.map(item => (
                <div key={item._id} style={{ 
                  display: 'flex', 
                  gap: '12px', 
                  marginBottom: '16px', 
                  alignItems: 'center' 
                }}>
                  <img 
                    src={item.product?.images?.[0] || 'https://via.placeholder.com/60'} 
                    alt="" 
                    style={{ 
                      width: '56px', 
                      height: '56px', 
                      borderRadius: '8px', 
                      objectFit: 'cover', 
                      border: '1.5px solid #e8d9c0' 
                    }} 
                  />
                  <div style={{ flex: 1 }}>
                    <p style={{ 
                      fontSize: '0.85rem', 
                      marginBottom: '2px', 
                      lineHeight: 1.3 
                    }}>
                      {item.product?.name}
                    </p>
                    <p style={{ color: '#777', fontSize: '0.78rem' }}>
                      Qty: {item.quantity}
                    </p>
                  </div>
                  <p style={{ 
                    color: '#b8860b', 
                    fontWeight: 600, 
                    fontSize: '0.9rem' 
                  }}>
                    {fmt((item.product?.discountPrice || item.product?.price) * item.quantity)}
                  </p>
                </div>
              ))}
            </div>

            <div style={{ borderTop: '1px solid #e8d9c0', paddingTop: '16px' }}>
              {[['Subtotal', fmt(cartTotal)], ['Shipping', 'FREE'], ['Tax (incl.)', 'Included']].map(([l, v]) => (
                <div key={l} style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  marginBottom: '8px', 
                  fontSize: '0.85rem', 
                  color: '#777' 
                }}>
                  <span>{l}</span>
                  <span style={{ color: v === 'FREE' ? '#22c55e' : '#ddd' }}>{v}</span>
                </div>
              ))}
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                marginTop: '12px', 
                paddingTop: '12px', 
                borderTop: '1px solid #e8d9c0', 
                fontWeight: 700, 
                fontSize: '1.1rem' 
              }}>
                <span>Total</span>
                <span style={{ color: '#b8860b' }}>{fmt(cartTotal)}</span>
              </div>
            </div>

            <button
              onClick={paymentMethod === 'razorpay' ? handleRazorpay : handleCOD}
              className="btn btn-primary"
              style={{ 
                width: '100%', 
                justifyContent: 'center', 
                padding: '14px', 
                marginTop: '24px', 
                fontSize: '0.95rem' 
              }}
              disabled={loading}
            >
              {loading 
                ? 'Processing...' 
                : paymentMethod === 'razorpay' 
                  ? '💳 Pay Now' 
                  : '📦 Place Order (COD)'
              }
            </button>

            {/* Trust Badges */}
            <div style={{ 
              marginTop: '20px', 
              padding: '14px', 
              background: 'rgba(184,134,11,0.04)', 
              borderRadius: '10px', 
              border: '1px solid rgba(184,134,11,0.12)' 
            }}>
              {[
                { icon: '🔒', text: 'SSL Encrypted & Secure Payment' },
                { icon: '🏅', text: 'BIS Hallmarked Products' },
                { icon: '↩️', text: '7-Day Easy Returns' },
                { icon: '🚚', text: 'Insured Delivery on Every Order' },
              ].map(({ icon, text }) => (
                <div key={text} style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px', 
                  marginBottom: '8px', 
                  fontSize: '0.76rem', 
                  color: '#777' 
                }}>
                  <span>{icon}</span><span>{text}</span>
                </div>
              ))}
            </div>

            {cartTotal > 100000 && (
              <div style={{ 
                marginTop: '12px', 
                padding: '12px', 
                background: 'rgba(34,197,94,0.07)', 
                borderRadius: '8px', 
                border: '1px solid rgba(34,197,94,0.18)', 
                fontSize: '0.78rem', 
                color: '#86efac', 
                textAlign: 'center' 
              }}>
                💳 EMI available on Credit Cards — select inside Razorpay
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}