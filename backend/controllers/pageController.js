const Page = require('../models/Page');

// @desc    Get a page by slug (Public)
// @route   GET /api/pages/:slug
const getPageBySlug = async (req, res) => {
  try {
    const page = await Page.findOne({ slug: req.params.slug, status: 'Published' });
    
    if (!page) {
      return res.status(404).json({ success: false, message: 'Page not found or not published' });
    }
    
    // Auto-calculate impact counters if needed
    // In a real scenario, we might inject dynamic stats from Order/Intervention models here
    
    res.status(200).json({ success: true, data: page });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// @desc    Get all pages (Admin)
// @route   GET /api/admin/pages
const getAllPages = async (req, res) => {
  try {
    const pages = await Page.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: pages });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// @desc    Get single page for editing (Admin)
// @route   GET /api/admin/pages/:id
const getPageById = async (req, res) => {
  try {
    const page = await Page.findById(req.params.id);
    if (!page) return res.status(404).json({ success: false, message: 'Page not found' });
    res.status(200).json({ success: true, data: page });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// @desc    Create a new page (Admin)
// @route   POST /api/admin/pages
const createPage = async (req, res) => {
  try {
    const pageData = {
      ...req.body,
      createdBy: req.admin.id,
      updatedBy: req.admin.id
    };
    
    const page = await Page.create(pageData);
    res.status(201).json({ success: true, data: page });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'Page slug must be unique' });
    }
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// @desc    Update a page (Admin)
// @route   PUT /api/admin/pages/:id
const updatePage = async (req, res) => {
  try {
    const pageData = {
      ...req.body,
      updatedBy: req.admin.id
    };
    
    const page = await Page.findByIdAndUpdate(req.params.id, pageData, { new: true, runValidators: true });
    
    if (!page) return res.status(404).json({ success: false, message: 'Page not found' });
    
    res.status(200).json({ success: true, data: page });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

module.exports = {
  getPageBySlug,
  getAllPages,
  getPageById,
  createPage,
  updatePage
};
