const Cart = require('../models/Cart');
const Product = require('../models/Product');

// GET /api/cart
exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
    res.json(cart || { items: [] });
  } catch (err) { 
    res.status(500).json({ message: err.message }); 
  }
};

// POST /api/cart/add
exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) cart = await Cart.create({ user: req.user._id, items: [] });

    const itemIndex = cart.items.findIndex(i => i.product.toString() === productId);
    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity });
    }
    await cart.save();
    const updated = await Cart.findOne({ user: req.user._id }).populate('items.product');
    res.json(updated);
  } catch (err) { 
    res.status(500).json({ message: err.message }); 
  }
};

// PUT /api/cart/update
exports.updateCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    const item = cart.items.find(i => i.product.toString() === productId);
    if (!item) return res.status(404).json({ message: 'Item not in cart' });

    if (quantity <= 0) {
      cart.items = cart.items.filter(i => i.product.toString() !== productId);
    } else {
      item.quantity = quantity;
    }
    await cart.save();
    const updated = await Cart.findOne({ user: req.user._id }).populate('items.product');
    res.json(updated);
  } catch (err) { 
    res.status(500).json({ message: err.message }); 
  }
};

// DELETE /api/cart/remove/:productId
exports.removeFromCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    cart.items = cart.items.filter(i => i.product.toString() !== req.params.productId);
    await cart.save();
    const updated = await Cart.findOne({ user: req.user._id }).populate('items.product');
    res.json(updated);
  } catch (err) { 
    res.status(500).json({ message: err.message }); 
  }
};

// DELETE /api/cart/clear
exports.clearCart = async (req, res) => {
  try {
    await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });
    res.json({ message: 'Cart cleared' });
  } catch (err) { 
    res.status(500).json({ message: err.message }); 
  }
};