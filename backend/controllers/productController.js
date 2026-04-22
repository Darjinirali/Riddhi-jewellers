const Product = require('../models/Product');
const Collection = require('../models/Collection');

// GET /api/collections
exports.getCollections = async (req, res) => {
  try {
    const collections = await Collection.find({ isActive: true });
    res.json(collections);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// GET /api/collections/:slug
exports.getCollectionBySlug = async (req, res) => {
  try {
    const collection = await Collection.findOne({ slug: req.params.slug });
    if (!collection) return res.status(404).json({ message: 'Collection not found' });
    res.json(collection);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// GET /api/products
exports.getProducts = async (req, res) => {
  try {
    const { collection, category, search, featured, page = 1, limit = 12 } = req.query;
    const query = {};
    if (collection) query.collection = collection;
    if (category) query.category = category;
    if (featured) query.isFeatured = true;
    if (search) query.name = { $regex: search, $options: 'i' };

    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .populate('collection', 'name slug')
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort('-createdAt');

    res.json({ products, total, pages: Math.ceil(total / limit) });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// GET /api/products/:id
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('collection', 'name slug');
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// POST /api/products (admin)
exports.createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// PUT /api/products/:id (admin)
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(product);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// DELETE /api/products/:id (admin)
exports.deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// POST /api/collections (admin)
exports.createCollection = async (req, res) => {
  try {
    const { name, description, image } = req.body;
    const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const collection = await Collection.create({ name, description, image, slug });
    res.status(201).json(collection);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// PUT /api/collections/:id (admin)
exports.updateCollection = async (req, res) => {
  try {
    const collection = await Collection.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(collection);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// DELETE /api/collections/:id (admin)
exports.deleteCollection = async (req, res) => {
  try {
    await Collection.findByIdAndDelete(req.params.id);
    res.json({ message: 'Collection deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};
