import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../services/api';

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

  if (isLoading) return <div>Loading Inventory...</div>;

  return (
    <div>
      <h1>Inventory Management</h1>
      <table style={styles.table}>
        <thead>
          <tr>
            <th>Product</th>
            <th>Price</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {products?.map(product => (
            <tr key={product._id}>
              <td>{product.name}</td>
              <td>₹{product.price}</td>
              <td>{product.whStock>10 ? `✅ In Stock ${product.whStock}` : `❌ Out of Stock ${product.whStock}`}</td>
              <td>
                <button onClick={() => toggleStockMutation.mutate(product._id)}>
                  Toggle Stock {product.isActive? 'active':'inactive' }
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const styles = {
  table: { width: '100%', borderCollapse: 'collapse', backgroundColor: 'white', marginTop: '20px' },
};

export default AdminInventory;