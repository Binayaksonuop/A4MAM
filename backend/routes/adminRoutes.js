const express = require('express');
const router = express.Router();
const { adminLogin, getAdminProfile } = require('../controllers/authController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');
const { logAction } = require('../middleware/auditLogger');
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

// ─── Settings ──────────────────────────────────
router.put('/settings', protect, authorizeRoles('Admin'), logAction('Update', 'SiteSettings'), async (req, res) => {
  try {
    const SiteSettings = require('../models/SiteSettings');
    let settings = await SiteSettings.findOne();
    if (!settings) {
      settings = new SiteSettings();
    }
    Object.assign(settings, req.body);
    settings.updatedBy = req.admin._id;
    await settings.save();
    res.json({ success: true, data: settings });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

const { getAllPages, getPageById, createPage, updatePage } = require('../controllers/pageController');
const { getAdminTestimonials, getTestimonialById, createTestimonial, updateTestimonial, deleteTestimonial } = require('../controllers/testimonialController');
const { getAdminStories, getStoryById, createStory, updateStory, deleteStory } = require('../controllers/successStoryController');
const { getAdminFaqs, getFaqById, createFaq, updateFaq, deleteFaq } = require('../controllers/faqController');
const { getAdminArticles, getArticleById, createArticle, updateArticle, deleteArticle } = require('../controllers/researchController');

// Pages
router.get('/pages', protect, getAllPages);
router.get('/pages/:id', protect, getPageById);
router.post('/pages', protect, authorizeRoles('Admin', 'Content Manager'), createPage);
router.put('/pages/:id', protect, authorizeRoles('Admin', 'Content Manager'), updatePage);

// Testimonials
router.get('/testimonials', protect, getAdminTestimonials);
router.get('/testimonials/:id', protect, getTestimonialById);
router.post('/testimonials', protect, authorizeRoles('Admin', 'Content Manager'), createTestimonial);
router.put('/testimonials/:id', protect, authorizeRoles('Admin', 'Content Manager'), updateTestimonial);
router.delete('/testimonials/:id', protect, authorizeRoles('Admin', 'Content Manager'), deleteTestimonial);

// Success Stories
router.get('/success-stories', protect, getAdminStories);
router.get('/success-stories/:id', protect, getStoryById);
router.post('/success-stories', protect, authorizeRoles('Admin', 'Content Manager'), createStory);
router.put('/success-stories/:id', protect, authorizeRoles('Admin', 'Content Manager'), updateStory);
router.delete('/success-stories/:id', protect, authorizeRoles('Admin', 'Content Manager'), deleteStory);

// FAQs
router.get('/faqs', protect, getAdminFaqs);
router.get('/faqs/:id', protect, getFaqById);
router.post('/faqs', protect, authorizeRoles('Admin', 'Content Manager'), createFaq);
router.put('/faqs/:id', protect, authorizeRoles('Admin', 'Content Manager'), updateFaq);
router.delete('/faqs/:id', protect, authorizeRoles('Admin', 'Content Manager'), deleteFaq);

// Research Articles
router.get('/research', protect, getAdminArticles);
router.get('/research/:id', protect, getArticleById);
router.post('/research', protect, authorizeRoles('Admin', 'Content Manager', 'Research Manager'), createArticle);
router.put('/research/:id', protect, authorizeRoles('Admin', 'Content Manager', 'Research Manager'), updateArticle);
router.delete('/research/:id', protect, authorizeRoles('Admin', 'Content Manager', 'Research Manager'), deleteArticle);

module.exports = router;
