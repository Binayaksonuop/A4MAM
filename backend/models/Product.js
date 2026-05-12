const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  shortDescription: {
    type: String,
    default: ''
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: 0
  },
  originalPrice: {
    type: Number,
    default: 0
  },
  imageUrl: {
    type: String,
    default: 'assets/images/spirulina_s.png'
  },
  images: [{ type: String }],
  category: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    default: 'kids'
  },
  stock: {
    type: Number,
    default: 0,
    min: 0
  },
  status: {
    type: String,
    enum: ['Active', 'Draft', 'Out of Stock'],
    default: 'Draft'
  },
  tags: [{ type: String }],
  weight: { type: String, default: '' },
  benefits: [{ type: String }],
  isFeatured: {
    type: Boolean,
    default: false
  },
  fssaiCertified: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

// Auto-generate slug from name
productSchema.pre('save', function (next) {
  if (this.isModified('name') || this.isNew) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  next();
});

module.exports = mongoose.model('Product', productSchema);
