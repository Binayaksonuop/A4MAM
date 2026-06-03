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
  subtitle: {
    type: String,
    default: ''
  },
  badge: {
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
  includes: [{ type: String }],
  nutrition: {
    protein: { type: Number, default: 0 },
    iron: { type: Number, default: 0 },
    absorption: { type: Number, default: 0 }
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  fssaiCertified: {
    type: Boolean,
    default: true
  },
  seo: {
    metaTitle: String,
    metaDescription: String,
    ogImage: String,
    canonicalUrl: String,
    keywords: String
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin'
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin'
  }
}, { timestamps: true });

// Auto-generate slug from name
productSchema.pre('save', function (next) {
  if ((this.isModified('name') || this.isNew) && !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  next();
});

module.exports = mongoose.model('Product', productSchema);
