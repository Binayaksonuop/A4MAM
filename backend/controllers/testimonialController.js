const Testimonial = require('../models/Testimonial');

// @desc    Get all published testimonials (Public)
// @route   GET /api/testimonials
const getTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find({ status: 'Published' }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: testimonials });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// @desc    Get all testimonials (Admin)
// @route   GET /api/admin/testimonials
const getAdminTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: testimonials });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// @desc    Get single testimonial (Admin)
// @route   GET /api/admin/testimonials/:id
const getTestimonialById = async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) return res.status(404).json({ success: false, message: 'Testimonial not found' });
    res.status(200).json({ success: true, data: testimonial });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// @desc    Create a new testimonial (Admin)
// @route   POST /api/admin/testimonials
const createTestimonial = async (req, res) => {
  try {
    const data = {
      ...req.body,
      createdBy: req.admin.id,
      updatedBy: req.admin.id
    };
    
    const testimonial = await Testimonial.create(data);
    res.status(201).json({ success: true, data: testimonial });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// @desc    Update a testimonial (Admin)
// @route   PUT /api/admin/testimonials/:id
const updateTestimonial = async (req, res) => {
  try {
    const data = {
      ...req.body,
      updatedBy: req.admin.id
    };
    
    const testimonial = await Testimonial.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true });
    
    if (!testimonial) return res.status(404).json({ success: false, message: 'Testimonial not found' });
    
    res.status(200).json({ success: true, data: testimonial });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// @desc    Delete a testimonial (Admin)
// @route   DELETE /api/admin/testimonials/:id
const deleteTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findByIdAndDelete(req.params.id);
    if (!testimonial) return res.status(404).json({ success: false, message: 'Testimonial not found' });
    res.status(200).json({ success: true, message: 'Testimonial deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

module.exports = {
  getTestimonials,
  getAdminTestimonials,
  getTestimonialById,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial
};
