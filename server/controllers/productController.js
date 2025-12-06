import Product from '../models/Product.js';
import { cloudinary } from '../config/cloudinary.js';

// @desc    Get all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// server/controllers/productController.js
const createProduct = async (req, res) => {
  try {
    console.log('=== CREATE PRODUCT REQUEST ===');
    console.log('Request body:', req.body);
    console.log('Request file:', req.file);
    console.log('File details:', {
      fieldname: req.file?.fieldname,
      originalname: req.file?.originalname,
      mimetype: req.file?.mimetype,
      size: req.file?.size,
      path: req.file?.path,
      filename: req.file?.filename
    });

    const { name, description, price, category, stock } = req.body;
    
    if (!name || !description || !price || !category || !stock) {
      console.log('Missing fields:', { name, description, price, category, stock });
      return res.status(400).json({ 
        message: 'Please provide all required fields' 
      });
    }

    if (!req.file) {
      console.log('No file uploaded');
      return res.status(400).json({ message: 'Please upload an image' });
    }

    console.log('Creating product with data:', {
      name, description, price, category, stock
    });

    const product = new Product({
      name,
      description,
      price: parseFloat(price),
      category,
      stock: parseInt(stock),
      image: req.file.path,
      imagePublicId: req.file.filename,
    });

    console.log('Product object created:', product);

    const createdProduct = await product.save();
    console.log('Product saved successfully:', createdProduct._id);
    
    res.status(201).json(createdProduct);
  } catch (error) {
    console.error('=== CREATE PRODUCT ERROR ===');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    
    res.status(500).json({ 
      message: error.message || 'Failed to create product',
      error: error.name
    });
  }
};
// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Public
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const { name, description, price, category, stock } = req.body;
    
    // Update fields
    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price || product.price;
    product.category = category || product.category;
    product.stock = stock || product.stock;

    // If new image is uploaded
    if (req.file) {
      // Delete old image from Cloudinary
      await cloudinary.uploader.destroy(product.imagePublicId);
      
      // Update with new image
      product.image = req.file.path;
      product.imagePublicId = req.file.filename;
    }

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Public
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Delete image from Cloudinary
    await cloudinary.uploader.destroy(product.imagePublicId);
    
    // Delete product from database
    await product.deleteOne();
    
    res.json({ message: 'Product removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};