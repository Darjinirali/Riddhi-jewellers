const router = require('express').Router();
const {
  createRazorpayOrder,
  placeOrder,
  getUserOrders,
  getOrderById,
  cancelOrder,
  getAllOrders,
  updateOrderStatus,
} = require('../controllers/orderController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.use(protect);

// ✅ Fixed routes - PEHLE (specific paths)
router.post('/create-razorpay-order', createRazorpayOrder);
router.post('/place', placeOrder);
router.get('/my-orders', getUserOrders);

// ✅ Admin routes - /:id se PEHLE
router.get('/admin/all', adminOnly, getAllOrders);
router.put('/admin/:id/status', adminOnly, updateOrderStatus);

// ✅ Dynamic :id routes - BAAD ME (warna /admin/all ko intercept kar leta)
router.get('/:id', getOrderById);
router.put('/:id/cancel', cancelOrder);

module.exports = router;