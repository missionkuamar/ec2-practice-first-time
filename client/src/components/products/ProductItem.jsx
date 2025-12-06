import React from 'react';
import { FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import Button from '../common/Button.jsx';

const ProductItem = ({ product, onEdit, onDelete, onView }) => {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow">
      <div className="p-4">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <img
              src={product.image}
              alt={product.name}
              className="w-24 h-24 object-cover rounded-lg"
            />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 truncate">
                {product.name}
              </h3>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {product.category}
              </span>
            </div>
            
            <p className="mt-1 text-sm text-gray-600 line-clamp-2">
              {product.description}
            </p>
            
            <div className="mt-2 flex items-center justify-between">
              <div>
                <span className="text-lg font-bold text-gray-900">
                  ${product.price.toFixed(2)}
                </span>
                <span className="ml-2 text-sm text-gray-500">
                  Stock: {product.stock}
                </span>
              </div>
              
              <div className="flex space-x-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => onView(product)}
                  className="!p-2"
                >
                  <FaEye className="w-4 h-4" />
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => onEdit(product)}
                  className="!p-2"
                >
                  <FaEdit className="w-4 h-4" />
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => onDelete(product._id)}
                  className="!p-2"
                >
                  <FaTrash className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductItem;