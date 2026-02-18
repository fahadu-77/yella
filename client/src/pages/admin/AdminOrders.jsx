import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../../services/api';

const AdminOrders = () => {
  const [filter, setFilter] = useState('all');

  const { data: orders, isLoading } = useQuery({
    queryKey: ['admin', 'orders', filter],
    queryFn: () => api.get(`/admin/orders?status=${filter}`).then(res => res.data),
    refetchInterval: 15000, 
  });

  if (isLoading) return <div>Syncing Live Order Feed...</div>;

  return (
    <div>
  <header style={styles.header}>
    <h1>Order Management</h1>
    <select onChange={(e) => setFilter(e.target.value)} value={filter} style={styles.select}>
      <option value="all">All Orders</option>
      <option value="placed">Placed</option>
      <option value="packing">Packing</option>
      <option value="ready">Ready</option>
      <option value="on-the-way">On the Way</option>
      <option value="delivered">Delivered</option>
    </select>
  </header>

      <div style={styles.list}>
        {orders?.map(order => (
          <div key={order._id} style={styles.orderCard}>
            <div style={styles.orderInfo}>
              <strong>Order ID: #{order._id.slice(-6)}</strong>
              <span>Customer: {order.customer?.name}</span>
              <span>Total: ${order.totalAmount}</span>
            </div>
            <div style={styles.statusBadge(order.status)}>
              {order.status.toUpperCase()}
            </div>
          </div>
        ))}
        {orders?.length === 0 && <p>No orders found for this status.</p>}
      </div>
    </div>
  );
};

const styles = {
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  select: { padding: '8px', borderRadius: '4px' },
  orderCard: { 
    display: 'flex', 
    justifyContent: 'space-between', 
    padding: '15px', 
    backgroundColor: 'white', 
    marginBottom: '10px',
    borderRadius: '8px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
  },
  orderInfo: { display: 'flex', flexDirection: 'column', gap: '5px' },
  statusBadge: (status) => ({
    padding: '5px 10px',
    borderRadius: '12px',
    fontSize: '0.8rem',
    fontWeight: 'bold',
    height: 'fit-content',
    backgroundColor: status === 'delivered' ? '#d4edda' : status === 'pending' ? '#fff3cd' : '#f8d7da',
    color: status === 'delivered' ? '#155724' : status === 'pending' ? '#856404' : '#721c24'
  })
};

export default AdminOrders;