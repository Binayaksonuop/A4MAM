const express = require('express');
const router = express.Router();
const Media = require('../models/Media');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');
const { upload } = require('../config/cloudinary');
const { logAction } = require('../middleware/auditLogger');

// Upload Media
router.post('/upload', protect, authorizeRoles('Admin', 'Content Manager'), upload.single('image'), logAction('Upload', 'Media'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image uploaded' });
    }

    const media = await Media.create({
      url: req.file.path,
      publicId: req.file.filename,
      altText: req.body.altText || '',
      folder: 'a4mam_media',
      createdBy: req.admin._id,
      updatedBy: req.admin._id
    });

    res.status(201).json({ success: true, data: media });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error uploading media', error: error.message });
  }
});

// Get all media
router.get('/', protect, authorizeRoles('Admin', 'Content Manager', 'Research Manager'), async (req, res) => {
  try {
    const media = await Media.find().sort({ createdAt: -1 }).populate('createdBy', 'name');
    res.json({ success: true, count: media.length, data: media });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// Delete media
router.delete('/:id', protect, authorizeRoles('Admin'), logAction('Delete', 'Media'), async (req, res) => {
  try {
    const media = await Media.findById(req.params.id);
    if (!media) {
      return res.status(404).json({ success: false, message: 'Media not found' });
    }

    // In a real app we should also delete from Cloudinary using cloudinary.uploader.destroy(media.publicId)
    await media.deleteOne();
    res.json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

module.exports = router;
