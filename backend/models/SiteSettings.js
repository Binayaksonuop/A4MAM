const mongoose = require('mongoose');

const siteSettingsSchema = new mongoose.Schema({
  branding: {
    logoUrl: String,
    faviconUrl: String
  },
  tracking: {
    googleAnalyticsId: String,
    googleTagManagerId: String,
    facebookPixelId: String
  },
  contact: {
    headOffice: String,
    branchOffice: String,
    email: String,
    phone: String
  },
  social: {
    linkedin: String,
    facebook: String,
    twitter: String,
    instagram: String,
    whatsapp: String
  },
  marquee: [{
    text: String,
    icon: String
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin'
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin'
  },
  status: {
    type: String,
    enum: ['Draft', 'Published'],
    default: 'Published'
  }
}, { timestamps: true });

module.exports = mongoose.model('SiteSettings', siteSettingsSchema);
