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
  const [selectedEMI, setSelectedEMI] = useState(null);
  const [loading, setLoading] = useState(false);

  const set = (k) => (e) => setAddress({ ...address, [k]: e.target.value });

  // ─── EMI Plans ───────────────────────────────────────────────────────────────
  const emiPlans = [
    { months: 3,  bank: 'HDFC',  rate: 13, icon: '🏦' },
    { months: 6,  bank: 'ICICI', rate: 14, icon: '🏛️' },
    { months: 9,  bank: 'SBI',   rate: 15, icon: '🏧' },
    { months: 12, bank: 'Axis',  rate: 15, icon: '💳' },
  ];

  const emiMonthly = (months, rate) => {
    const r = rate / 12 / 100;
    return Math.round(cartTotal * r * Math.pow(1 + r, months) / (Math.pow(1 + r, months) - 1));
  };

  // ─── Validation ──────────────────────────────────────────────────────────────
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

  const buildOrderItems = () =>
    cart.items.map((i) => ({
      product: i.product._id,
      name: i.product.name,
      image: i.product.images?.[0] || '',
      quantity: i.quantity,
      price: i.product.price,
    }));

  // ─── COD Handler ─────────────────────────────────────────────────────────────
  const handleCOD = async () => {
    if (!validateAddress()) return;
    if (cartTotal > 50000) {
      toast.error('COD not available for orders above ₹50,000. Please use online payment.');
      return;
    }
    setLoading(true);
    try {
      await axios.post('/api/orders/place', {
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

  // ─── Razorpay / EMI Handler ───────────────────────────────────────────────────
  const handleRazorpay = async () => {
    if (paymentMethod === 'emi' && !selectedEMI) {
      toast.error('Please select an EMI plan first');
      return;
    }
    if (!validateAddress()) return;
    setLoading(true);
    try {
      const { data: rzpOrder } = await axios.post('/api/orders/create-razorpay-order', {
        amount: cartTotal,
      });

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: rzpOrder.amount,
        currency: 'INR',
        name: 'Riddhi Jewellers',
        description: selectedEMI
          ? `EMI - ${selectedEMI.months} months via ${selectedEMI.bank}`
          : 'Jewelry Purchase',
        order_id: rzpOrder.id,
        prefill: {
          name: address.name,
          contact: address.phone,
          email: user?.email,
        },
        theme: { color: '#b8860b' },
        handler: async (response) => {
          try {
            await axios.post('/api/orders/place', {
              items: buildOrderItems(),
              totalAmount: cartTotal,
              shippingAddress: address,
              paymentMethod: 'razorpay',
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              emiPlan: selectedEMI || null,
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
    } catch {
      toast.error('Could not initiate payment');
      setLoading(false);
    }
  };

  // ─── Empty Cart ───────────────────────────────────────────────────────────────
  if (!cart.items?.length)
    return (
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

  const paymentOptions = [
    {
      value: 'razorpay',
      icon: <FiCreditCard size={20} />,
      label: 'Online Payment',
      sub: 'UPI, Cards, Net Banking — via Razorpay (Recommended)',
      disabled: false,
    },
    {
      value: 'emi',
      icon: <span style={{ fontSize: '1rem' }}>📅</span>,
      label: 'EMI',
      sub: 'Easy monthly installments on Credit Cards',
      disabled: false,
    },
    {
      value: 'cod',
      icon: <FiTruck size={20} />,
      label: 'Cash on Delivery',
      sub: isCODDisabled
        ? '⚠️ COD not available above ₹50,000'
        : 'Pay when your order arrives (up to ₹50,000)',
      disabled: isCODDisabled,
    },
  ];

  // ─── Pay Button Label ─────────────────────────────────────────────────────────
  const payBtnLabel = () => {
    if (loading) return 'Processing...';
    if (paymentMethod === 'emi' && selectedEMI)
      return `💳 Pay ${fmt(emiMonthly(selectedEMI.months, selectedEMI.rate))}/mo via EMI`;
    if (paymentMethod === 'razorpay') return '💳 Pay Now';
    return '📦 Place Order (COD)';
  };

  const handlePay = paymentMethod === 'cod' ? handleCOD : handleRazorpay;

  // ─── Render ───────────────────────────────────────────────────────────────────
  return (
    <div style={{ paddingTop: '70px', minHeight: '100vh', background: '#fdf9f4' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 5%' }}>
        <h1 style={{ fontFamily: 'Bodoni Moda', fontSize: '2.2rem', marginBottom: '40px' }}>
          Checkout <span style={{ color: '#b8860b' }}>✦</span>
        </h1>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: '32px',
            alignItems: 'start',
          }}
        >
          {/* ── LEFT COLUMN ── */}
          <div>
            {/* Shipping Address */}
            <div
              style={{
                background: 'var(--card-bg)',
                border: '1.5px solid #e8d9c0',
                borderRadius: '16px',
                padding: '28px',
                marginBottom: '24px',
              }}
            >
              <h3
                style={{
                  marginBottom: '24px',
                  fontSize: '1rem',
                  letterSpacing: '1px',
                  color: '#b8860b',
                }}
              >
                📍 SHIPPING ADDRESS
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
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

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
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

            {/* Payment Method */}
            <div
              style={{
                background: 'var(--card-bg)',
                border: '1.5px solid #e8d9c0',
                borderRadius: '16px',
                padding: '28px',
              }}
            >
              <h3
                style={{
                  marginBottom: '24px',
                  fontSize: '1rem',
                  letterSpacing: '1px',
                  color: '#b8860b',
                }}
              >
                💳 PAYMENT METHOD
              </h3>

              {paymentOptions.map((opt) => (
                <div
                  key={opt.value}
                  onClick={() => {
                    if (opt.disabled) {
                      toast.error('COD not available for orders above ₹50,000.');
                      return;
                    }
                    setPaymentMethod(opt.value);
                    if (opt.value !== 'emi') setSelectedEMI(null);
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
                    background:
                      paymentMethod === opt.value ? 'rgba(184,134,11,0.05)' : 'transparent',
                    opacity: opt.disabled ? 0.45 : 1,
                    transition: 'all 0.2s',
                  }}
                >
                  <div
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '50%',
                      background: paymentMethod === opt.value ? '#b8860b' : '#e8d9c0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: paymentMethod === opt.value ? '#000' : '#888',
                      flexShrink: 0,
                    }}
                  >
                    {opt.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: 600, marginBottom: '2px' }}>{opt.label}</p>
                    <p style={{ color: opt.disabled ? '#ef4444' : '#666', fontSize: '0.8rem' }}>
                      {opt.sub}
                    </p>
                  </div>
                  <div
                    style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      border: `2px solid ${paymentMethod === opt.value ? '#b8860b' : '#333'}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {paymentMethod === opt.value && (
                      <div
                        style={{
                          width: '10px',
                          height: '10px',
                          borderRadius: '50%',
                          background: '#b8860b',
                        }}
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* ── EMI Plans Section ── */}
            {paymentMethod === 'emi' && (
              <div
                style={{
                  background: 'var(--card-bg)',
                  border: '1.5px solid #e8d9c0',
                  borderRadius: '16px',
                  padding: '28px',
                  marginTop: '24px',
                }}
              >
                <h3
                  style={{
                    marginBottom: '8px',
                    fontSize: '1rem',
                    letterSpacing: '1px',
                    color: '#b8860b',
                  }}
                >
                  📅 SELECT EMI PLAN
                </h3>
                <p style={{ fontSize: '0.8rem', color: '#999', marginBottom: '20px' }}>
                  Select a plan → Pay via Credit Card in Razorpay popup
                </p>

                {emiPlans.map((plan) => (
                  <div
                    key={plan.months}
                    onClick={() => setSelectedEMI(plan)}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '16px',
                      border: `2px solid ${
                        selectedEMI?.months === plan.months ? '#b8860b' : '#e8d9c0'
                      }`,
                      borderRadius: '12px',
                      marginBottom: '10px',
                      cursor: 'pointer',
                      background:
                        selectedEMI?.months === plan.months
                          ? 'rgba(184,134,11,0.05)'
                          : 'transparent',
                      transition: 'all 0.2s',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <span style={{ fontSize: '1.6rem' }}>{plan.icon}</span>
                      <div>
                        <p style={{ fontWeight: 600, marginBottom: '3px' }}>
                          {plan.bank} Credit Card
                        </p>
                        <p style={{ fontSize: '0.78rem', color: '#777' }}>
                          {plan.months} months &bull; {plan.rate}% p.a.
                        </p>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ color: '#b8860b', fontWeight: 700, fontSize: '1rem' }}>
                        {fmt(emiMonthly(plan.months, plan.rate))}/mo
                      </p>
                      <p style={{ fontSize: '0.75rem', color: '#999' }}>
                        Total:{' '}
                        {fmt(emiMonthly(plan.months, plan.rate) * plan.months)}
                      </p>
                    </div>
                  </div>
                ))}

                {/* Info Box */}
                <div
                  style={{
                    marginTop: '12px',
                    padding: '12px 14px',
                    background: 'rgba(184,134,11,0.06)',
                    borderRadius: '10px',
                    border: '1px solid rgba(184,134,11,0.15)',
                    fontSize: '0.78rem',
                    color: '#a07820',
                  }}
                >
                  ℹ️ After selecting plan, pay using your Credit Card in the Razorpay popup. EMI
                  will be applied by your bank automatically.
                </div>
              </div>
            )}
          </div>

          {/* ── RIGHT COLUMN — Order Summary ── */}
          <div
            style={{
              background: 'var(--card-bg)',
              border: '1.5px solid #e8d9c0',
              borderRadius: '16px',
              padding: '28px',
            }}
          >
            <h3
              style={{
                marginBottom: '20px',
                fontSize: '1rem',
                letterSpacing: '1px',
                color: '#b8860b',
              }}
            >
              🛍️ ORDER SUMMARY
            </h3>

            <div style={{ maxHeight: '320px', overflowY: 'auto', marginBottom: '20px' }}>
              {cart.items.map((item) => (
                <div
                  key={item._id}
                  style={{
                    display: 'flex',
                    gap: '12px',
                    marginBottom: '16px',
                    alignItems: 'center',
                  }}
                >
                  <img
                    src={item.product?.images?.[0] || 'https://via.placeholder.com/60'}
                    alt=""
                    style={{
                      width: '56px',
                      height: '56px',
                      borderRadius: '8px',
                      objectFit: 'cover',
                      border: '1.5px solid #e8d9c0',
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: '0.85rem', marginBottom: '2px', lineHeight: 1.3 }}>
                      {item.product?.name}
                    </p>
                    <p style={{ color: '#777', fontSize: '0.78rem' }}>Qty: {item.quantity}</p>
                  </div>
                  <p style={{ color: '#b8860b', fontWeight: 600, fontSize: '0.9rem' }}>
                    {fmt(
                      (item.product?.discountPrice || item.product?.price) * item.quantity
                    )}
                  </p>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div style={{ borderTop: '1px solid #e8d9c0', paddingTop: '16px' }}>
              {[
                ['Subtotal', fmt(cartTotal)],
                ['Shipping', 'FREE'],
                ['Tax (incl.)', 'Included'],
              ].map(([l, v]) => (
                <div
                  key={l}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '8px',
                    fontSize: '0.85rem',
                    color: '#777',
                  }}
                >
                  <span>{l}</span>
                  <span style={{ color: v === 'FREE' ? '#22c55e' : '#ddd' }}>{v}</span>
                </div>
              ))}

              {/* EMI monthly breakdown in summary */}
              {paymentMethod === 'emi' && selectedEMI && (
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '8px',
                    fontSize: '0.82rem',
                    color: '#b8860b',
                    background: 'rgba(184,134,11,0.06)',
                    padding: '8px 10px',
                    borderRadius: '8px',
                    marginTop: '4px',
                  }}
                >
                  <span>
                    EMI ({selectedEMI.months} mo × {selectedEMI.bank})
                  </span>
                  <span style={{ fontWeight: 700 }}>
                    {fmt(emiMonthly(selectedEMI.months, selectedEMI.rate))}/mo
                  </span>
                </div>
              )}

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginTop: '12px',
                  paddingTop: '12px',
                  borderTop: '1px solid #e8d9c0',
                  fontWeight: 700,
                  fontSize: '1.1rem',
                }}
              >
                <span>Total</span>
                <span style={{ color: '#b8860b' }}>{fmt(cartTotal)}</span>
              </div>
            </div>

            {/* Pay Button */}
            <button
              onClick={handlePay}
              className="btn btn-primary"
              style={{
                width: '100%',
                justifyContent: 'center',
                padding: '14px',
                marginTop: '24px',
                fontSize: '0.95rem',
              }}
              disabled={loading || (paymentMethod === 'emi' && !selectedEMI)}
            >
              {payBtnLabel()}
            </button>

            {/* EMI plan not selected warning */}
            {paymentMethod === 'emi' && !selectedEMI && (
              <p
                style={{
                  textAlign: 'center',
                  fontSize: '0.78rem',
                  color: '#f59e0b',
                  marginTop: '8px',
                }}
              >
                ⬆️ Please select an EMI plan above
              </p>
            )}

            {/* Trust Badges */}
            <div
              style={{
                marginTop: '20px',
                padding: '14px',
                background: 'rgba(184,134,11,0.04)',
                borderRadius: '10px',
                border: '1px solid rgba(184,134,11,0.12)',
              }}
            >
              {[
                { icon: '🔒', text: 'SSL Encrypted & Secure Payment' },
                { icon: '🏅', text: 'BIS Hallmarked Products' },
                { icon: '↩️', text: '7-Day Easy Returns' },
                { icon: '🚚', text: 'Insured Delivery on Every Order' },
              ].map(({ icon, text }) => (
                <div
                  key={text}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '8px',
                    fontSize: '0.76rem',
                    color: '#777',
                  }}
                >
                  <span>{icon}</span>
                  <span>{text}</span>
                </div>
              ))}
            </div>

            {/* EMI info banner */}
            <div
              style={{
                marginTop: '12px',
                padding: '12px',
                background: 'rgba(34,197,94,0.07)',
                borderRadius: '8px',
                border: '1px solid rgba(34,197,94,0.18)',
                fontSize: '0.78rem',
                color: '#86efac',
                textAlign: 'center',
              }}
            >
              💳 EMI available on Credit Cards — select EMI option above
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}