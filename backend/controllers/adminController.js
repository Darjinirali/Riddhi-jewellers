const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Collection = require('../models/Collection');

// GET /api/admin/dashboard
exports.getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();
    const totalRevenue = await Order.aggregate([
      { $match: { paymentStatus: 'paid' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);
    const recentOrders = await Order.find().populate('user', 'name email').sort('-createdAt').limit(5);
    res.json({
      totalUsers,
      totalProducts,
      totalOrders,
      totalRevenue: totalRevenue[0]?.total || 0,
      recentOrders,
    });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// GET /api/admin/users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: 'user' }).select('-password').sort('-createdAt');
    res.json(users);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// DELETE /api/admin/users/:id
exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};
