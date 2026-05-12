const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema({
  title: { type: String, required: [true, 'Title is required'], trim: true },
  url: { type: String, required: [true, 'Image URL is required'] },
  location: { type: String, default: 'Odisha', trim: true },
  description: { type: String, default: '' },
  category: {
    type: String,
    enum: ['Field Data', 'Intervention', 'Outreach', 'Impact', 'Awareness', 'Production'],
    default: 'Field Data'
  },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Gallery', gallerySchema);
