import './App.css'
import { BrowserRouter as Router,Routes, Route ,Navigate} from 'react-router-dom'
import {useContext} from 'react'
import {AuthContext} from './context/AuthContext'
import Login from './pages/LoginPage'
import Register from './pages/RegisterPage'
import StaffDashboard from './pages/StaffDashboard'
import CustomerStore from './pages/CustomerStore'
import DeliveryTask from './pages/DeliveryTask'
import Navbar from './components/Navbar'

import AdminLayout from './components/AdminLayout';

import AdminDashboard from './pages/admin/AdminDashboard';
import AdminInventory from './pages/admin/AdminInventory';
import AdminUsers from './pages/admin/AdminUsers';
import AdminOrders from './pages/admin/AdminOrders';

function App() {
  const { user,loading } = useContext(AuthContext)
  if(loading) return <div>Loading...</div>

  return (
    <Router>
        {user?.role !== 'admin' && <Navbar/>}
      <Routes>
        <Route path="*" element={<Navigate to="/" />} />

        <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />

        <Route path="/" element={
          !user ? <Navigate to="/login" /> : 
          user.role === 'admin' ? <Navigate to="/admin/dashboard" /> :
          user.role === 'staff' ? <Navigate to="/staff" /> : 
          user.role === 'delivery' ? <Navigate to="/delivery" /> : 
          <Navigate to="/store" />
        } />

        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="inventory" element={<AdminInventory />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="orders" element={<AdminOrders />} />
        </Route>

        <Route path="/staff" element={user?.role === 'staff' ? <StaffDashboard /> : <Navigate to="/login" />} />
        <Route path="/store" element={user?.role === 'customer' ? <CustomerStore /> : <Navigate to="/login" />} />
        <Route path="/delivery" element={user?.role === 'delivery' ? <DeliveryTask /> : <Navigate to="/login" />} />
        
      </Routes>
    </Router>
  )
}

export default App
