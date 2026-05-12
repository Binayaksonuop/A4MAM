const Order = require('../models/Order');
const emailService = require('../services/emailService');

// @desc    Create new order (Public - from checkout)
// @route   POST /api/orders
const createOrder = async (req, res) => {
  try {
    const { customerName, phone, email, address, city, pincode, items, totalAmount, paymentMethod, isDonation, notes } = req.body;

    if (!customerName || !phone || !email || !address || !city || !pincode || !items || !totalAmount || !paymentMethod) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields.' });
    }
    if (!items.length) {
      return res.status(400).json({ success: false, message: 'Order must have at least one item.' });
    }

    const normalizedPaymentMethod = paymentMethod ? paymentMethod.toLowerCase() : 'cod';

    const order = await Order.create({
      customerName, phone, email, address, city, pincode,
      items, totalAmount, paymentMethod: normalizedPaymentMethod,
      isDonation: isDonation || false,
      notes: notes || ''
    });

    await emailService.sendOrderConfirmation({
      id: order.orderId,
      customerName,
      customerEmail: email,
      amount: totalAmount,
      paymentMethod: normalizedPaymentMethod,
      items
    });

    res.status(201).json({
      success: true,
      message: 'Order placed successfully.',
      data: { orderId: order.orderId, _id: order._id, totalAmount: order.totalAmount, orderStatus: order.orderStatus }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to place order.', error: error.message });
  }
};

// @desc    Get all orders (Admin)
// @route   GET /api/admin/orders
const getAdminOrders = async (req, res) => {
  try {
    const { status, paymentMethod, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (status) filter.orderStatus = status;
    if (paymentMethod) filter.paymentMethod = paymentMethod;

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Order.countDocuments(filter);
    const orders = await Order.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit));

    res.status(200).json({
      success: true,
      count: orders.length,
      total,
      pages: Math.ceil(total / Number(limit)),
      data: orders
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch orders.', error: error.message });
  }
};

// @desc    Get single order (Admin)
// @route   GET /api/admin/orders/:id
const getOrderById = async (req, res) => {
  try {
    let order = await Order.findOne({ orderId: req.params.id });
    if (!order) order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found.' });

    res.status(200).json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch order.', error: error.message });
  }
};

// @desc    Update order status (Admin)
// @route   PATCH /api/admin/orders/:id/status
const updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus, paymentStatus } = req.body;
    const update = {};
    if (orderStatus) update.orderStatus = orderStatus;
    if (paymentStatus) update.paymentStatus = paymentStatus;

    const order = await Order.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true });
    if (!order) return res.status(404).json({ success: false, message: 'Order not found.' });

    res.status(200).json({ success: true, message: 'Order status updated.', data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update order.', error: error.message });
  }
};

// @desc    Delete order (Admin)
// @route   DELETE /api/admin/orders/:id
const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found.' });
    res.status(200).json({ success: true, message: 'Order deleted successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete order.', error: error.message });
  }
};

module.exports = { createOrder, getAdminOrders, getOrderById, updateOrderStatus, deleteOrder };
