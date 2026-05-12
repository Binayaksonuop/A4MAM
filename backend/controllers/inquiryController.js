const Inquiry = require('../models/Inquiry');
const emailService = require('../services/emailService');

// @desc    Submit inquiry (Public)
// @route   POST /api/inquiries
const createInquiry = async (req, res) => {
  try {
    const { name, email, phone, organization, message, type } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'Name, email and message are required.' });
    }

    const inquiry = await Inquiry.create({ name, email, phone, organization, message, type: type || 'Contact' });

    await emailService.sendInquiryConfirmation({
      name,
      email,
      type: type || 'Contact',
      message
    });

    res.status(201).json({
      success: true,
      message: 'Inquiry submitted successfully. We will get back to you soon.',
      data: { referenceId: inquiry.referenceId, _id: inquiry._id }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to submit inquiry.', error: error.message });
  }
};

// @desc    Get all inquiries (Admin)
// @route   GET /api/admin/inquiries
const getAdminInquiries = async (req, res) => {
  try {
    const { status, type } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (type) filter.type = type;

    const inquiries = await Inquiry.find(filter).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: inquiries.length, data: inquiries });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch inquiries.', error: error.message });
  }
};

// @desc    Update inquiry status (Admin)
// @route   PATCH /api/admin/inquiries/:id/status
const updateInquiryStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['New', 'Viewed', 'Responded'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value.' });
    }

    const inquiry = await Inquiry.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!inquiry) return res.status(404).json({ success: false, message: 'Inquiry not found.' });

    res.status(200).json({ success: true, message: 'Inquiry status updated.', data: inquiry });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update inquiry.', error: error.message });
  }
};

module.exports = { createInquiry, getAdminInquiries, updateInquiryStatus };
