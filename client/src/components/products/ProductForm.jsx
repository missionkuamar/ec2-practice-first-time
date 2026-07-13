import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Input from '../common/Input.jsx';
import Button from '../common/Button.jsx';
import { categories } from '../../utils/constants.js';
import { createProduct, updateProduct, clearError, clearSuccess } from '../../features/products/productSlice.js';

const ProductForm = ({ product, onClose }) => {
  const dispatch = useDispatch();
  const { loading, error, success } = useSelector((state) => state.products);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '',
    image: null,
  });

  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price,
        category: product.category,
        stock: product.stock,
        image: null,
      });
      setImagePreview(product.image);
    }
  }, [product]);

  useEffect(() => {
    if (success) {
      onClose();
      dispatch(clearSuccess());
    }
  }, [success, onClose, dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        image: file,
      }));
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

 // client/src/components/products/ProductForm.jsx
const handleSubmit = async (e) => {
  e.preventDefault();
  
  // Validation
  if (!formData.name || !formData.description || !formData.price || 
      !formData.category || !formData.stock) {
    alert('Please fill all required fi  elds');
    return;
  }

  if (!product && !formData.image) {
    alert('Please upload an image');
    return;
  }

  // FormData create करें
  const productData = new FormData();
  
  // Append all fields
  productData.append('name', formData.name);
  productData.append('description', formData.description);
  productData.append('price', formData.price.toString());
  productData.append('category', formData.category);
  productData.append('stock', formData.stock.toString());
  
  // Image append करें (अगर है तो)
  if (formData.image) {
    productData.append('image', formData.image);
  }

  // Debug के लिए FormData content check करें
  console.log('FormData entries:');
  for (let [key, value] of productData.entries()) {
    console.log(key, value);
  }

  if (product) {
    dispatch(updateProduct({ id: product._id, productData }));
  } else {
    dispatch(createProduct(productData));
  }
};

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0"></div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      <Input
        label="Product Name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Enter product name"
        required
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
          <span className="text-red-500 ml-1">*</span>
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows="3"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter product description"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Price"
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          placeholder="0.00"
          min="0"
          step="0.01"
          required
        />

        <Input
          label="Stock Quantity"
          type="number"
          name="stock"
          value={formData.stock}
          onChange={handleChange}
          placeholder="0"
          min="0"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Category
          <span className="text-red-500 ml-1">*</span>
        </label>
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          required
        >
          <option value="">Select a category</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Product Image
          {!product && <span className="text-red-500 ml-1">*</span>}
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        
        {imagePreview && (
          <div className="mt-4">
            <p className="text-sm text-gray-600 mb-2">Image Preview:</p>
            <img
              src={imagePreview}
              alt="Preview"
              className="w-32 h-32 object-cover rounded-lg border"
            />
          </div>
        )}
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <Button
          type="button"
          variant="secondary"
          onClick={onClose}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          disabled={loading}
        >
          {loading ? 'Processing...' : product ? 'Update Product' : 'Create Product'}
        </Button>
      </div>
    </form>
  );
};

export default ProductForm;