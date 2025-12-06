import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ProductItem from './ProductItem.jsx';
import Button from '../common/Button.jsx';
import Modal from '../common/Modal.jsx';
import ProductForm from './ProductForm.jsx';
import Spinner from '../common/Spinner.jsx';
import { 
  fetchProducts, 
  deleteProduct, 
  setSelectedProduct,
  clearError 
} from '../../features/products/productSlice.js';

const ProductList = () => {
  const dispatch = useDispatch();
  const { products, loading, error, selectedProduct } = useSelector(
    (state) => state.products
  );

  const [showForm, setShowForm] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewingProduct, setViewingProduct] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        dispatch(clearError());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, dispatch]);

  const handleEdit = (product) => {
    dispatch(setSelectedProduct(product));
    setShowForm(true);
  };

  const handleDelete = (id) => {
    setDeleteConfirm(id);
  };

  const confirmDelete = () => {
    if (deleteConfirm) {
      dispatch(deleteProduct(deleteConfirm));
      setDeleteConfirm(null);
    }
  };

  const handleView = (product) => {
    setViewingProduct(product);
    setShowViewModal(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    dispatch(setSelectedProduct(null));
  };

  if (loading && products.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Products</h2>
        <Button
          variant="primary"
          onClick={() => setShowForm(true)}
        >
          Add New Product
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No products found. Create your first product!</p>
          </div>
        ) : (
          products.map((product) => (
            <ProductItem
              key={product._id}
              product={product}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onView={handleView}
            />
          ))
        )}
      </div>

      {/* Create/Edit Modal */}
      <Modal
        isOpen={showForm}
        onClose={handleCloseForm}
        title={selectedProduct ? 'Edit Product' : 'Create New Product'}
      >
        <ProductForm
          product={selectedProduct}
          onClose={handleCloseForm}
        />
      </Modal>

      {/* View Modal */}
      <Modal
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        title="Product Details"
      >
        {viewingProduct && (
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <img
                src={viewingProduct.image}
                alt={viewingProduct.name}
                className="w-32 h-32 object-cover rounded-lg"
              />
              <div>
                <h4 className="text-xl font-bold">{viewingProduct.name}</h4>
                <span className="inline-block px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                  {viewingProduct.category}
                </span>
              </div>
            </div>
            
            <div>
              <h5 className="font-semibold text-gray-700">Description</h5>
              <p className="text-gray-600">{viewingProduct.description}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h5 className="font-semibold text-gray-700">Price</h5>
                <p className="text-2xl font-bold text-gray-900">
                  ${viewingProduct.price.toFixed(2)}
                </p>
              </div>
              <div>
                <h5 className="font-semibold text-gray-700">Stock</h5>
                <p className="text-2xl font-bold text-gray-900">
                  {viewingProduct.stock}
                </p>
              </div>
            </div>
            
            <div>
              <h5 className="font-semibold text-gray-700">Created</h5>
              <p className="text-gray-600">
                {new Date(viewingProduct.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        title="Confirm Delete"
      >
        <div className="space-y-4">
          <p className="text-gray-700">
            Are you sure you want to delete this product? This action cannot be undone.
          </p>
          <div className="flex justify-end space-x-3">
            <Button
              variant="secondary"
              onClick={() => setDeleteConfirm(null)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={confirmDelete}
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ProductList;