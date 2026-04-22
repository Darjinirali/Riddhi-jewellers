const router = require('express').Router();
const { getDashboardStats, getAllUsers, deleteUser } = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.use(protect, adminOnly);
router.get('/dashboard', getDashboardStats);
router.get('/users', getAllUsers);
router.delete('/users/:id', deleteUser);

module.exports = router;
