const express = require('express');
const router = express.Router();
const { adminLogin, getAdminProfile } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { getAdminProducts, createProduct, updateProduct, deleteProduct } = require('../controllers/productController');
const { getAdminOrders, getOrderById, updateOrderStatus, deleteOrder } = require('../controllers/orderController');
const { getAdminInquiries, updateInquiryStatus } = require('../controllers/inquiryController');
const { addGalleryImage, updateGalleryImage, deleteGalleryImage } = require('../controllers/galleryController');
const { getDashboardStats } = require('../controllers/dashboardController');

// ─── Auth ──────────────────────────────────────
router.post('/login', adminLogin);
router.get('/me', protect, getAdminProfile);

// ─── Dashboard ─────────────────────────────────
router.get('/dashboard/stats', protect, getDashboardStats);

// ─── Products ──────────────────────────────────
router.route('/products')
  .get(protect, getAdminProducts)
  .post(protect, createProduct);

router.route('/products/:id')
  .put(protect, updateProduct)
  .delete(protect, deleteProduct);

// ─── Orders ────────────────────────────────────
router.get('/orders', protect, getAdminOrders);
router.get('/orders/:id', protect, getOrderById);
router.patch('/orders/:id/status', protect, updateOrderStatus);
router.delete('/orders/:id', protect, deleteOrder);

// ─── Inquiries ─────────────────────────────────
router.get('/inquiries', protect, getAdminInquiries);
router.patch('/inquiries/:id/status', protect, updateInquiryStatus);

// ─── Gallery ───────────────────────────────────
router.post('/gallery', protect, addGalleryImage);
router.put('/gallery/:id', protect, updateGalleryImage);
router.delete('/gallery/:id', protect, deleteGalleryImage);

module.exports = router;
