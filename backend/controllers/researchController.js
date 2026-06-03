const ResearchArticle = require('../models/ResearchArticle');

// @desc    Get all published research articles (Public)
// @route   GET /api/research
const getArticles = async (req, res) => {
  try {
    const articles = await ResearchArticle.find({ status: 'Published' }).sort({ publishedDate: -1 });
    res.status(200).json({ success: true, data: articles });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// @desc    Get single article by slug (Public)
// @route   GET /api/research/:slug
const getArticleBySlug = async (req, res) => {
  try {
    const article = await ResearchArticle.findOne({ slug: req.params.slug, status: 'Published' });
    if (!article) return res.status(404).json({ success: false, message: 'Article not found' });
    res.status(200).json({ success: true, data: article });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// @desc    Get all articles (Admin)
// @route   GET /api/admin/research
const getAdminArticles = async (req, res) => {
  try {
    const articles = await ResearchArticle.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: articles });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// @desc    Get single article (Admin)
// @route   GET /api/admin/research/:id
const getArticleById = async (req, res) => {
  try {
    const article = await ResearchArticle.findById(req.params.id);
    if (!article) return res.status(404).json({ success: false, message: 'Article not found' });
    res.status(200).json({ success: true, data: article });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// @desc    Create an article (Admin)
// @route   POST /api/admin/research
const createArticle = async (req, res) => {
  try {
    const data = {
      ...req.body,
      createdBy: req.admin.id,
      updatedBy: req.admin.id
    };
    
    const article = await ResearchArticle.create(data);
    res.status(201).json({ success: true, data: article });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// @desc    Update an article (Admin)
// @route   PUT /api/admin/research/:id
const updateArticle = async (req, res) => {
  try {
    const data = {
      ...req.body,
      updatedBy: req.admin.id
    };
    
    const article = await ResearchArticle.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true });
    
    if (!article) return res.status(404).json({ success: false, message: 'Article not found' });
    
    res.status(200).json({ success: true, data: article });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// @desc    Delete an article (Admin)
// @route   DELETE /api/admin/research/:id
const deleteArticle = async (req, res) => {
  try {
    const article = await ResearchArticle.findByIdAndDelete(req.params.id);
    if (!article) return res.status(404).json({ success: false, message: 'Article not found' });
    res.status(200).json({ success: true, message: 'Article deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

module.exports = {
  getArticles,
  getArticleBySlug,
  getAdminArticles,
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle
};
