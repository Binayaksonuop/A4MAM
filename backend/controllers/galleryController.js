const Gallery = require('../models/Gallery');

// @desc    Get all active gallery images (Public)
// @route   GET /api/gallery
const getGallery = async (req, res) => {
  try {
    const { category } = req.query;
    const filter = { isActive: true };
    if (category) filter.category = category;

    const images = await Gallery.find(filter).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: images.length, data: images });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch gallery.', error: error.message });
  }
};

// @desc    Add gallery image (Admin)
// @route   POST /api/admin/gallery
const addGalleryImage = async (req, res) => {
  try {
    const { title, url, location, description, category } = req.body;
    if (!title || !url) {
      return res.status(400).json({ success: false, message: 'Title and URL are required.' });
    }

    const image = await Gallery.create({ title, url, location, description, category });
    res.status(201).json({ success: true, message: 'Image added to gallery.', data: image });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to add image.', error: error.message });
  }
};

// @desc    Update gallery image (Admin)
// @route   PUT /api/admin/gallery/:id
const updateGalleryImage = async (req, res) => {
  try {
    const image = await Gallery.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!image) return res.status(404).json({ success: false, message: 'Image not found.' });

    res.status(200).json({ success: true, message: 'Gallery image updated.', data: image });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update image.', error: error.message });
  }
};

// @desc    Delete gallery image (Admin)
// @route   DELETE /api/admin/gallery/:id
const deleteGalleryImage = async (req, res) => {
  try {
    const image = await Gallery.findByIdAndDelete(req.params.id);
    if (!image) return res.status(404).json({ success: false, message: 'Image not found.' });

    res.status(200).json({ success: true, message: 'Gallery image deleted.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete image.', error: error.message });
  }
};

module.exports = { getGallery, addGalleryImage, updateGalleryImage, deleteGalleryImage };
