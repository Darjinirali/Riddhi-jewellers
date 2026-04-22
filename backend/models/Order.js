const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name: String,
    image: String,
    quantity: Number,
    price: Number,
  }],
  totalAmount: { type: Number, required: true },
  shippingAddress: {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
  },
  paymentMethod: { type: String, enum: ['razorpay', 'cod'], required: true },
  paymentStatus: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
  razorpayOrderId: { type: String, default: '' },
  razorpayPaymentId: { type: String, default: '' },
  orderStatus: {
    type: String,
    enum: ['placed', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'placed',
  },
  cancelReason: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
