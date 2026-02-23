import React, { useContext } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../../services/api';
import { AuthContext } from '../../context/AuthContext';
import { ShoppingBag, Users, IndianRupee, Activity } from 'lucide-react';

const AdminDashboard = () => {
  const { data: stats, isLoading, isError } = useQuery({
    queryKey: ['admin', 'stats'],
    queryFn: () => api.get('/admin/stats').then(res => res.data),
    refetchInterval: 10000,
  });

  if (isLoading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
    </div>
  );

  if (isError) return (
    <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 flex items-center">
      Error loading statistics. Please try again.
    </div>
  );

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center">
          <Activity className="mr-3 text-primary-500" />
          Live Overview
        </h1>
        <p className="text-gray-500 mt-1 text-sm">Real-time statistics for your Yella store.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 bg-blue-50 w-24 h-24 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-500"></div>
          <div className="flex items-center justify-between relative z-10">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Today's Orders</p>
              <p className="text-3xl font-bold text-gray-900">{stats?.totalOrders || 0}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shadow-inner">
              <ShoppingBag size={24} />
            </div>
          </div>
        </div>

        <div className="glass rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 bg-teal-50 w-24 h-24 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-500"></div>
          <div className="flex items-center justify-between relative z-10">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Active Delivery</p>
              <p className="text-3xl font-bold text-gray-900">{stats?.onlineDrivers || 0}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-600 flex items-center justify-center shadow-inner">
              <Users size={24} />
            </div>
          </div>
        </div>

        <div className="glass rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 bg-primary-50 w-24 h-24 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-500"></div>
          <div className="flex items-center justify-between relative z-10">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Total Sales</p>
              <p className="text-3xl font-bold text-primary-600">₹{stats?.revenue || 0}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-primary-100 text-primary-600 flex items-center justify-center shadow-inner">
              <IndianRupee size={24} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;