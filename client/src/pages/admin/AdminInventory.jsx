import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../services/api';
import { Package, ToggleLeft, ToggleRight, CheckCircle2, XCircle } from 'lucide-react';

const AdminInventory = () => {
  const queryClient = useQueryClient();

  const { data: products, isLoading } = useQuery({
    queryKey: ['admin', 'products'],
    queryFn: () => api.get('/products/all').then(res => res.data),
  });

  const toggleStockMutation = useMutation({
    mutationFn: (productId) => api.patch(`/admin/products/${productId}/toggle-stock`),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin', 'products']);
    }
  });

  if (isLoading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
    </div>
  );

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center">
          <Package className="mr-3 text-primary-500" />
          Inventory Management
        </h1>
        <p className="text-gray-500 mt-1 text-sm">Manage product availability and stock status.</p>
      </div>

      <div className="glass rounded-2xl overflow-hidden shadow-sm border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="py-4 px-6 font-semibold text-gray-600 text-sm">Product Name</th>
                <th className="py-4 px-6 font-semibold text-gray-600 text-sm">Price</th>
                <th className="py-4 px-6 font-semibold text-gray-600 text-sm">Status</th>
                <th className="py-4 px-6 font-semibold text-gray-600 text-sm text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {products?.map(product => (
                <tr key={product._id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="font-medium text-gray-900">{product.name}</div>
                  </td>
                  <td className="py-4 px-6 font-semibold text-gray-700">₹{product.price}</td>
                  <td className="py-4 px-6">
                    {product.whStock > 10 ? (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                        <CheckCircle2 size={12} className="mr-1" />
                        In Stock ({product.whStock})
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
                        <XCircle size={12} className="mr-1" />
                        Out of Stock ({product.whStock})
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button
                      onClick={() => toggleStockMutation.mutate(product._id)}
                      className={`inline-flex items-center justify-center space-x-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${product.isActive
                          ? 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-100'
                          : 'bg-green-50 text-green-600 hover:bg-green-100 border border-green-100'
                        }`}
                    >
                      {product.isActive ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
                      <span>{product.isActive ? 'Deactivate' : 'Activate'}</span>
                    </button>
                  </td>
                </tr>
              ))}
              {(!products || products.length === 0) && (
                <tr>
                  <td colSpan="4" className="py-8 text-center text-gray-500">
                    No products found in inventory.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminInventory;