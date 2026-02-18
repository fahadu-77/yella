import React from 'react';
import { Link, Outlet, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const AdminLayout = () => {
  const { user } = useContext(AuthContext);

  if (!user || user.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  return (
    <div style={styles.container}>
      <aside style={styles.sidebar}>
        <h2 style={styles.title}>Admin Panel</h2>
        <nav style={styles.nav}>
          <Link to="/admin/dashboard" style={styles.link}>📊 Dashboard</Link>
          <Link to="/admin/inventory" style={styles.link}>📦 Inventory</Link>
          <Link to="/admin/orders" style={styles.link}>🛒 All Orders</Link>
          <Link to="/admin/users" style={styles.link}>👥 Staff & Users</Link>
        </nav>
      </aside>

      <main style={styles.main}>
        <Outlet />
      </main>
    </div>
  );
};

const styles = {
  container: { display: 'flex', height: '100vh' },
  sidebar: { 
    width: '250px', 
    backgroundColor: '#2c3e50', 
    color: 'white', 
    padding: '20px',
    display: 'flex',
    flexDirection: 'column'
  },
  title: { borderBottom: '1px solid #34495e', paddingBottom: '10px' },
  nav: { display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' },
  link: { color: 'white', textDecoration: 'none', fontSize: '1.1rem' },
  main: { flex: 1, padding: '30px', backgroundColor: '#f4f7f6', overflowY: 'auto' }
};

export default AdminLayout;