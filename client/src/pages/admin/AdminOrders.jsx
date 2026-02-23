import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../../services/api';
import { ShoppingCart, Filter, User, Banknote } from 'lucide-react';

const AdminOrders = () => {
  const [filter, setFilter] = useState('all');

  const { data: orders, isLoading } = useQuery({
    queryKey: ['admin', 'orders', filter],
    queryFn: () => api.get(`/admin/orders?status=${filter}`).then(res => res.data),
    refetchInterval: 15000,
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800 border-green-200';
      case 'on-the-way': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'ready': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'packing': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'placed': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <ShoppingCart className="mr-3 text-primary-500" />
            Order Management
          </h1>
          <p className="text-gray-500 mt-1 text-sm">Monitor and manage all customer orders.</p>
        </div>

        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Filter size={16} className="text-gray-400" />
          </div>
          <select
            onChange={(e) => setFilter(e.target.value)}
            value={filter}
            className="pl-9 pr-8 py-2.5 bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none shadow-sm cursor-pointer hover:bg-gray-50 transition-colors appearance-none"
          >
            <option value="all">All Orders</option>
            <option value="placed">Placed</option>
            <option value="packing">Packing</option>
            <option value="ready">Ready</option>
            <option value="on-the-way">On the Way</option>
            <option value="delivered">Delivered</option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center p-12 bg-white/50 rounded-2xl border border-gray-100 border-dashed">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600 mr-4"></div>
          <span className="text-gray-500 font-medium">Syncing Live Order Feed...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {orders?.map(order => (
            <div key={order._id} className="glass rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex justify-between items-start mb-4 pb-4 border-b border-gray-100">
                <div>
                  <p className="text-xs text-gray-400 font-medium tracking-wider uppercase mb-1">Order ID</p>
                  <p className="font-mono font-bold text-gray-900">#{order._id.slice(-6)}</p>
                </div>
                <span className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider border ${getStatusColor(order.status)}`}>
                  {order.status}
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex items-center text-gray-600">
                  <User size={16} className="mr-2 text-gray-400 shrink-0" />
                  <span className="font-medium truncate" title={order.customer?.name}>
                    {order.customer?.name || 'Unknown Customer'}
                  </span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Banknote size={16} className="mr-2 text-gray-400 shrink-0" />
                  <span className="font-medium">Total: </span>
                  <span className="ml-1 font-bold tracking-tight text-gray-900 bg-green-50 px-2 py-0.5 rounded text-sm">
                    ₹{order.totalAmount}
                  </span>
                </div>
              </div>
              <div className="mt-5 pt-4 border-t border-gray-100 text-right">
                <button className="text-sm font-semibold text-primary-600 hover:text-primary-700 hover:underline transition-colors">
                  View Details &rarr;
                </button>
              </div>
            </div>
          ))}
          {(!orders || orders.length === 0) && (
            <div className="col-span-full py-16 text-center bg-white/50 rounded-2xl border border-gray-100 border-dashed">
              <ShoppingCart className="mx-auto h-12 w-12 text-gray-300 mb-3" />
              <p className="text-gray-500 font-medium">No orders found for this status.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminOrders;