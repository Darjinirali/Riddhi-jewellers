const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Razorpay = require('razorpay');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// POST /api/orders/create-razorpay-order
exports.createRazorpayOrder = async (req, res) => {
  try {
    const { amount } = req.body;

    // ✅ amount rupees me aana chahiye (e.g. 19100)
    // * 100 karke paise me convert karo (e.g. 1910000)
    const amountInPaise = Math.round(amount * 100);

    // ✅ Safety check - Razorpay max limit ~50 lakh rupees
    if (amountInPaise > 500000000) {
      return res.status(400).json({ message: 'Order amount too large. Please contact support.' });
    }

    const options = {
      amount: amountInPaise,
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (err) {
    console.error('❌ Razorpay Error:', err);
    res.status(500).json({ message: err?.error?.description || err.message || 'Razorpay error' });
  }
};

// POST /api/orders/place
exports.placeOrder = async (req, res) => {
  try {
    const { items, totalAmount, shippingAddress, paymentMethod, razorpayOrderId, razorpayPaymentId } = req.body;

    // ✅ COD limit - Cash on Delivery only allowed upto ₹50,000
    if (paymentMethod === 'cod' && totalAmount > 50000) {
      return res.status(400).json({
        message: 'Cash on Delivery is only available for orders under ₹50,000. Please use online payment (UPI / Card / Net Banking).'
      });
    }

    const order = await Order.create({
      user: req.user._id,
      items,
      totalAmount,
      shippingAddress,
      paymentMethod,
      paymentStatus: paymentMethod === 'cod' ? 'pending' : 'paid',
      razorpayOrderId: razorpayOrderId || '',
      razorpayPaymentId: razorpayPaymentId || '',
    });

    await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });
    res.status(201).json({ message: 'Order placed successfully!', order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/orders/my-orders
exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort('-createdAt');
    res.json(orders);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// GET /api/orders/:id
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.user._id });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// PUT /api/orders/:id/cancel
exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.user._id });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (!['placed', 'processing'].includes(order.orderStatus))
      return res.status(400).json({ message: 'Order cannot be cancelled at this stage' });
    order.orderStatus = 'cancelled';
    order.cancelReason = req.body.reason || 'Cancelled by user';
    await order.save();
    res.json({ message: 'Order cancelled', order });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// --- ADMIN ---
// GET /api/orders/admin/all
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('user', 'name email').sort('-createdAt');
    res.json(orders);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// PUT /api/orders/admin/:id/status
exports.updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, { orderStatus: req.body.status }, { new: true });
    res.json(order);
  } catch (err) { res.status(500).json({ message: err.message }); }
};