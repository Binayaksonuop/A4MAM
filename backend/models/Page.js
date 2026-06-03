const mongoose = require('mongoose');

const seoSchema = new mongoose.Schema({
  metaTitle: { type: String },
  metaDescription: { type: String },
  ogImage: { type: String },
  canonicalUrl: { type: String },
  keywords: { type: String }
}, { _id: false });

const heroSchema = new mongoose.Schema({
  titleLine1: { type: String, required: true },
  titleLine2: { type: String },
  titleLine3: { type: String },
  body: { type: String },
  image: { type: String },
  ctaButtons: [{
    label: { type: String },
    link: { type: String },
    style: { type: String, enum: ['primary', 'secondary', 'outline'], default: 'primary' }
  }],
  statistics: [{
    label: { type: String },
    value: { type: String }
  }]
}, { _id: false });

const impactCounterSchema = new mongoose.Schema({
  label: { type: String },
  value: { type: Number },
  icon: { type: String },
  isAutoCalculated: { type: Boolean, default: false },
  calculationSource: { type: String, enum: ['interventions', 'orders', 'campaigns', 'none'], default: 'none' }
}, { _id: false });

const missionContentSchema = new mongoose.Schema({
  title: { type: String },
  body: { type: String }, // TinyMCE HTML
  imageUrl: { type: String }
}, { _id: false });

const ngoStatisticSchema = new mongoose.Schema({
  label: { type: String },
  value: { type: String },
  description: { type: String }
}, { _id: false });

const pageSchema = new mongoose.Schema({
  slug: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  title: {
    type: String,
    required: true
  },
  
  // Specific sections for the Homepage
  hero: heroSchema,
  impactCounters: [impactCounterSchema],
  missionContent: missionContentSchema,
  ngoStatistics: [ngoStatisticSchema],
  
  // Standard SEO metadata embedded
  seo: seoSchema,
  
  // Base CMS Fields
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
  status: { type: String, enum: ['Draft', 'Published'], default: 'Draft' }

}, { timestamps: true });

module.exports = mongoose.model('Page', pageSchema);
