const SuccessStory = require('../models/SuccessStory');

// @desc    Get all published stories (Public)
// @route   GET /api/success-stories
const getStories = async (req, res) => {
  try {
    const stories = await SuccessStory.find({ status: 'Published' }).sort({ date: -1 });
    res.status(200).json({ success: true, data: stories });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// @desc    Get single story by slug (Public)
// @route   GET /api/success-stories/:slug
const getStoryBySlug = async (req, res) => {
  try {
    const story = await SuccessStory.findOne({ slug: req.params.slug, status: 'Published' });
    if (!story) return res.status(404).json({ success: false, message: 'Story not found' });
    res.status(200).json({ success: true, data: story });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// @desc    Get all stories (Admin)
// @route   GET /api/admin/success-stories
const getAdminStories = async (req, res) => {
  try {
    const stories = await SuccessStory.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: stories });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// @desc    Get single story by ID (Admin)
// @route   GET /api/admin/success-stories/:id
const getStoryById = async (req, res) => {
  try {
    const story = await SuccessStory.findById(req.params.id);
    if (!story) return res.status(404).json({ success: false, message: 'Story not found' });
    res.status(200).json({ success: true, data: story });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// @desc    Create a new story (Admin)
// @route   POST /api/admin/success-stories
const createStory = async (req, res) => {
  try {
    const data = {
      ...req.body,
      createdBy: req.admin.id,
      updatedBy: req.admin.id
    };
    
    const story = await SuccessStory.create(data);
    res.status(201).json({ success: true, data: story });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'Story slug must be unique' });
    }
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// @desc    Update a story (Admin)
// @route   PUT /api/admin/success-stories/:id
const updateStory = async (req, res) => {
  try {
    const data = {
      ...req.body,
      updatedBy: req.admin.id
    };
    
    const story = await SuccessStory.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true });
    
    if (!story) return res.status(404).json({ success: false, message: 'Story not found' });
    
    res.status(200).json({ success: true, data: story });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// @desc    Delete a story (Admin)
// @route   DELETE /api/admin/success-stories/:id
const deleteStory = async (req, res) => {
  try {
    const story = await SuccessStory.findByIdAndDelete(req.params.id);
    if (!story) return res.status(404).json({ success: false, message: 'Story not found' });
    res.status(200).json({ success: true, message: 'Story deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

module.exports = {
  getStories,
  getStoryBySlug,
  getAdminStories,
  getStoryById,
  createStory,
  updateStory,
  deleteStory
};
