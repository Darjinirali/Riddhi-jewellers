const mongoose = require('mongoose');

const collectionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, default: '' },
  image: { type: String, default: '' },
  slug: { type: String, unique: true, required: true },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Collection', collectionSchema);
