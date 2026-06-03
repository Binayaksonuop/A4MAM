const mongoose = require('mongoose');

const researchArticleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  category: { type: String, required: true },
  summary: { type: String, required: true },
  body: { type: String }, // TinyMCE HTML
  author: { type: String },
  publishedDate: { type: Date, default: Date.now },

  // SEO Fields
  seo: {
    metaTitle: String,
    metaDescription: String,
    keywords: String,
    ogImage: String,
    canonicalUrl: String
  },

  // Base CMS Fields
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
  status: { type: String, enum: ['Draft', 'Published'], default: 'Draft' }
}, { timestamps: true });

module.exports = mongoose.model('ResearchArticle', researchArticleSchema);
