const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String }, // e.g., 'Anganwadi Worker', 'Mother'
  location: { type: String },
  quote: { type: String, required: true },
  rating: { type: Number, default: 5, min: 1, max: 5 },
  avatar: { type: String }, // URL or icon name
  acceptanceRate: { type: String }, // Optional stat like '92% Acceptance Rate'
  
  // Base CMS Fields
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
  status: { type: String, enum: ['Draft', 'Published'], default: 'Draft' }
}, { timestamps: true });

module.exports = mongoose.model('Testimonial', testimonialSchema);
