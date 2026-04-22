const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, default: '' },
  price: { type: Number, required: true },
  discountPrice: { type: Number, default: 0 },
  images: [{ type: String }],
  collection: { type: mongoose.Schema.Types.ObjectId, ref: 'Collection', required: true },
  category: { type: String, default: '' }, // rings, necklace, bangles, earrings, etc.
  weight: { type: String, default: '' }, // e.g. "5g", "10g"
  material: { type: String, default: '' }, // Gold 22K, Diamond, Silver, etc.
  stock: { type: Number, default: 10 },
  isFeatured: { type: Boolean, default: false },
  ratings: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    rating: { type: Number, min: 1, max: 5 },
    review: String,
  }],
}, { timestamps: true });

productSchema.virtual('avgRating').get(function () {
  if (!this.ratings.length) return 0;
  return (this.ratings.reduce((s, r) => s + r.rating, 0) / this.ratings.length).toFixed(1);
});

productSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Product', productSchema);
