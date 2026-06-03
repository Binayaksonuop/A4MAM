const mongoose = require('mongoose');

const seoSchema = new mongoose.Schema({
  metaTitle: { type: String },
  metaDescription: { type: String },
  ogImage: { type: String },
  canonicalUrl: { type: String },
  keywords: { type: String }
}, { _id: false });

const successStorySchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true, index: true },
  summary: { type: String, required: true },
  body: { type: String, required: true }, // TinyMCE HTML
  featuredImage: { type: String },
  date: { type: Date, default: Date.now },
  
  // Specific stats for the story (optional)
  impactMetrics: [{
    label: { type: String },
    value: { type: String }
  }],
  
  // Standard SEO metadata embedded
  seo: seoSchema,
  
  // Base CMS Fields
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
  status: { type: String, enum: ['Draft', 'Published'], default: 'Draft' }
}, { timestamps: true });

module.exports = mongoose.model('SuccessStory', successStorySchema);
