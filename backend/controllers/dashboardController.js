const Order = require('../models/Order');
const Product = require('../models/Product');
const Inquiry = require('../models/Inquiry');
const Gallery = require('../models/Gallery');
const Intervention = require('../models/Intervention');

// @desc    Get admin dashboard stats
// @route   GET /api/admin/dashboard/stats
const getDashboardStats = async (req, res) => {
  try {
    const [
      totalProducts,
      totalOrders,
      totalInquiries,
      totalGallery,
      pendingOrders,
      newInquiries,
      revenueResult,
      recentOrders,
      interventionsTotal,
      interventionsRecovered,
      interventionsActive
    ] = await Promise.all([
      Product.countDocuments({ status: 'Active' }),
      Order.countDocuments(),
      Inquiry.countDocuments(),
      Gallery.countDocuments({ isActive: true }),
      Order.countDocuments({ orderStatus: 'Processing' }),
      Inquiry.countDocuments({ status: 'New' }),
      Order.aggregate([
        { $match: { orderStatus: { $ne: 'Cancelled' } } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } }
      ]),
      Order.find({}).sort({ createdAt: -1 }).limit(5).select('orderId customerName totalAmount orderStatus paymentMethod createdAt'),
      Intervention.countDocuments(),
      Intervention.countDocuments({ recovered: true }),
      Intervention.countDocuments({ status: 'Active' })
    ]);

    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

    // Orders per status breakdown
    const statusBreakdown = await Order.aggregate([
      { $group: { _id: '$orderStatus', count: { $sum: 1 } } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalProducts,
        totalOrders,
        totalInquiries,
        totalGallery,
        pendingOrders,
        newInquiries,
        totalRevenue,
        recentOrders,
        statusBreakdown,
        interventions: {
          total: interventionsTotal,
          recovered: interventionsRecovered,
          active: interventionsActive
        }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch dashboard stats.', error: error.message });
  }
};

module.exports = { getDashboardStats };
