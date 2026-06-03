const FAQ = require('../models/Faq');

// @desc    Get all published FAQs (Public)
// @route   GET /api/faqs
const getFaqs = async (req, res) => {
  try {
    const faqs = await FAQ.find({ status: 'Published' }).sort({ sortOrder: 1, createdAt: -1 });
    res.status(200).json({ success: true, data: faqs });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// @desc    Get all FAQs (Admin)
// @route   GET /api/admin/faqs
const getAdminFaqs = async (req, res) => {
  try {
    const faqs = await FAQ.find().sort({ sortOrder: 1, createdAt: -1 });
    res.status(200).json({ success: true, data: faqs });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// @desc    Get single FAQ (Admin)
// @route   GET /api/admin/faqs/:id
const getFaqById = async (req, res) => {
  try {
    const faq = await FAQ.findById(req.params.id);
    if (!faq) return res.status(404).json({ success: false, message: 'FAQ not found' });
    res.status(200).json({ success: true, data: faq });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// @desc    Create a new FAQ (Admin)
// @route   POST /api/admin/faqs
const createFaq = async (req, res) => {
  try {
    const data = {
      ...req.body,
      createdBy: req.admin.id,
      updatedBy: req.admin.id
    };
    
    const faq = await FAQ.create(data);
    res.status(201).json({ success: true, data: faq });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// @desc    Update an FAQ (Admin)
// @route   PUT /api/admin/faqs/:id
const updateFaq = async (req, res) => {
  try {
    const data = {
      ...req.body,
      updatedBy: req.admin.id
    };
    
    const faq = await FAQ.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true });
    
    if (!faq) return res.status(404).json({ success: false, message: 'FAQ not found' });
    
    res.status(200).json({ success: true, data: faq });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// @desc    Delete an FAQ (Admin)
// @route   DELETE /api/admin/faqs/:id
const deleteFaq = async (req, res) => {
  try {
    const faq = await FAQ.findByIdAndDelete(req.params.id);
    if (!faq) return res.status(404).json({ success: false, message: 'FAQ not found' });
    res.status(200).json({ success: true, message: 'FAQ deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

module.exports = {
  getFaqs,
  getAdminFaqs,
  getFaqById,
  createFaq,
  updateFaq,
  deleteFaq
};
