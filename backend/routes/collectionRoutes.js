const router = require('express').Router();
const { getCollections, getCollectionBySlug, createCollection, updateCollection, deleteCollection } = require('../controllers/productController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/', getCollections);
router.get('/:slug', getCollectionBySlug);
router.post('/', protect, adminOnly, createCollection);
router.put('/:id', protect, adminOnly, updateCollection);
router.delete('/:id', protect, adminOnly, deleteCollection);

module.exports = router;
