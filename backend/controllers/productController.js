const Product = require('../models/Product');

// @desc    Get all active products (Public)
// @route   GET /api/products
const getProducts = async (req, res) => {
  try {
    const { category, status, featured } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (status) filter.status = status;
    else filter.status = 'Active'; // Public sees only active
    if (featured === 'true') filter.isFeatured = true;

    const products = await Product.find(filter).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: products.length, data: products });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch products.', error: error.message });
  }
};

// @desc    Get single product by slug or ID (Public)
// @route   GET /api/products/:id
const getProduct = async (req, res) => {
  try {
    const { id } = req.params;
    // Try slug first, then MongoDB _id
    let product = await Product.findOne({ slug: id });
    if (!product) product = await Product.findById(id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found.' });

    res.status(200).json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch product.', error: error.message });
  }
};

// @desc    Get ALL products for admin (Private)
// @route   GET /api/admin/products
const getAdminProducts = async (req, res) => {
  try {
    const products = await Product.find({}).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: products.length, data: products });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch products.', error: error.message });
  }
};

// @desc    Create product (Admin)
// @route   POST /api/admin/products
const createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({ success: true, message: 'Product created successfully.', data: product });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'Product with this name already exists.' });
    }
    res.status(500).json({ success: false, message: 'Failed to create product.', error: error.message });
  }
};

// @desc    Update product (Admin)
// @route   PUT /api/admin/products/:id
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!product) return res.status(404).json({ success: false, message: 'Product not found.' });

    res.status(200).json({ success: true, message: 'Product updated.', data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update product.', error: error.message });
  }
};

// @desc    Delete product (Admin)
// @route   DELETE /api/admin/products/:id
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found.' });

    res.status(200).json({ success: true, message: 'Product deleted successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete product.', error: error.message });
  }
};

module.exports = { getProducts, getProduct, getAdminProducts, createProduct, updateProduct, deleteProduct };
