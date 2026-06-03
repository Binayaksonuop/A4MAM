const mongoose = require('mongoose');

const interventionSchema = new mongoose.Schema({
  childId: {
    type: String,
    required: true
  },
  interventionType: {
    type: String,
    enum: ['Nutrition Kit', 'Counseling', 'Medical Treatment', 'Spirulina Supplement'],
    required: true
  },
  initialStatus: {
    type: String
  },
  finalStatus: {
    type: String
  },
  outcome: {
    type: String
  },
  reportingData: {
    type: mongoose.Schema.Types.Mixed
  },
  dateRegistered: {
    type: Date,
    default: Date.now
  },
  recovered: {
    type: Boolean,
    default: false
  },
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
    enum: ['Active', 'Completed', 'Dropped'],
    default: 'Active'
  }
}, { timestamps: true });

module.exports = mongoose.model('Intervention', interventionSchema);
