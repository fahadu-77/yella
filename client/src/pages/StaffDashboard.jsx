import { useEffect, useState } from 'react';
import api from '../services/api';

const StaffDashboard = () => {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    const res = await api.get('/orders/staff-dashboard');
    setOrders(res.data);
  };

  useEffect(() => { fetchOrders(); }, []);

  const handleStatusUpdate = async (id, statusType) => {
    try {
      await api.put(`/orders/${id}/${statusType}`);
      fetchOrders(); 
    } catch (err) {
      alert("Update failed!");
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Staff Dashboard</h1>
      {orders.map(order => (
        <div key={order._id} style={{ border: '1px solid #ccc', margin: '10px 0', padding: '10px' }}>
          <h3>Order #{order._id.slice(-5)}</h3>
          <p>Status: <strong>{order.status}</strong></p>
          
          {order.status === 'placed' && (
            <button onClick={() => handleStatusUpdate(order._id, 'packing')}>Start Packing</button>
          )}
          
          {order.status === 'packing' && (
            <button onClick={() => handleStatusUpdate(order._id, 'ready')}>Mark Ready & Assign</button>
          )}
        </div>
      ))}
    </div>
  );
};

export default StaffDashboard;