const express = require('express');
const router = express.Router();
const { getProducts, getProduct } = require('../controllers/productController');
const { createOrder } = require('../controllers/orderController');
const { createInquiry } = require('../controllers/inquiryController');
const { getGallery } = require('../controllers/galleryController');
const paymentService = require('../services/paymentService');

// ─── Products ──────────────────────────────────
router.get('/products', getProducts);
router.get('/products/:id', getProduct);

// ─── Orders ────────────────────────────────────
router.post('/orders', createOrder);

// ─── Inquiries ─────────────────────────────────
router.post('/inquiries', createInquiry);

// ─── Gallery ───────────────────────────────────
router.get('/gallery', getGallery);

// ─── Payment Routes ───────────────────────────
router.post('/payment/create-order', async (req, res) => {
  try {
    const { amount, receiptId, currency } = req.body;
    const order = await paymentService.createOrder(amount, currency || 'INR', receiptId);
    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create payment order', error: error.message });
  }
});

router.post('/payment/verify', async (req, res) => {
  try {
    const { paymentId, orderId, signature } = req.body;
    const result = await paymentService.verifyPayment(paymentId, orderId, signature);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Payment verification failed', error: error.message });
  }
});

module.exports = router;
