import React from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../../services/api';

const AdminDashboard = () => {
  const { data: stats, isLoading, isError } = useQuery({
    queryKey: ['admin', 'stats'],
    queryFn: () => api.get('/admin/stats').then(res => res.data),
    refetchInterval: 10000, 
  });

  if (isLoading) return <div>Analyzing Supermarket Data...</div>;
  if (isError) return <div>Error loading statistics.</div>;

  return (
    <div>
      <h1>Live Overview</h1>
      
      <div style={styles.grid}>
        <div style={styles.card}>
          <h3>Today's Orders</h3>
          <p style={styles.number}>{stats?.totalOrders || 0}</p>
        </div>
        
        <div style={styles.card}>
          <h3>Active Delivery Boys</h3>
          <p style={styles.number}>{stats?.onlineDrivers || 0}</p>
        </div>
        
        <div style={styles.card}>
          <h3>Total Sales</h3>
          <p style={styles.number}>₹{stats?.revenue || 0}</p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  grid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginTop: '20px' },
  card: { padding: '20px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', textAlign: 'center' },
  number: { fontSize: '2rem', fontWeight: 'bold', color: '#2c3e50' }
};

export default AdminDashboard;