const mongoose = require('mongoose');

const inquirySchema = new mongoose.Schema({
  name: { type: String, required: [true, 'Name is required'], trim: true },
  email: { type: String, required: [true, 'Email is required'], lowercase: true, trim: true },
  phone: { type: String, default: '', trim: true },
  organization: { type: String, default: '', trim: true },
  message: { type: String, required: [true, 'Message is required'] },
  type: {
    type: String,
    enum: ['Contact', 'Partnership', 'Bulk Order', 'General'],
    default: 'Contact'
  },
  status: {
    type: String,
    enum: ['New', 'Viewed', 'Responded'],
    default: 'New'
  },
  referenceId: { type: String, unique: true }
}, { timestamps: true });

// Auto-generate reference ID
inquirySchema.pre('save', function (next) {
  if (!this.referenceId) {
    const rand = Math.random().toString(36).substr(2, 8).toUpperCase();
    this.referenceId = `INQ-${rand}`;
  }
  next();
});

module.exports = mongoose.model('Inquiry', inquirySchema);
