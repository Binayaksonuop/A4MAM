const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  productId: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
  image: { type: String, default: '' },
  option: { type: String, default: '' }
});

const orderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    unique: true
  },
  customerName: { type: String, required: [true, 'Customer name is required'], trim: true },
  phone: { type: String, required: [true, 'Phone is required'], trim: true },
  email: { type: String, required: [true, 'Email is required'], lowercase: true, trim: true },
  address: { type: String, required: [true, 'Address is required'] },
  city: { type: String, required: [true, 'City is required'] },
  pincode: { type: String, required: [true, 'Pincode is required'] },
  items: [orderItemSchema],
  totalAmount: { type: Number, required: true, min: 0 },
  paymentMethod: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Paid', 'Failed'],
    default: 'Pending'
  },
  orderStatus: {
    type: String,
    enum: ['Processing', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'],
    default: 'Processing'
  },
  isDonation: { type: Boolean, default: false },
  notes: { type: String, default: '' }
}, { timestamps: true });

// Auto-generate order ID before saving
orderSchema.pre('save', function (next) {
  if (!this.orderId) {
    const ts = Date.now().toString(36).toUpperCase();
    const rand = Math.random().toString(36).substr(2, 5).toUpperCase();
    this.orderId = `MAM-${ts}-${rand}`;
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema);
