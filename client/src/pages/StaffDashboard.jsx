import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import { Package, CheckCircle2, ListTodo, MapPin, PackageCheck } from 'lucide-react';

const StaffDashboard = () => {
  const queryClient = useQueryClient();

  const { data: orders, isLoading } = useQuery({
    queryKey: ['staff', 'orders'],
    queryFn: () => api.get('/orders/staff-dashboard').then(res => res.data),
    refetchInterval: 10000,
  });

  const handleStatusUpdate = useMutation({
    mutationFn: ({ id, status }) => api.patch(`/orders/${id}/${status}`),
    onSuccess: () => {
      queryClient.invalidateQueries(['staff', 'orders']);
    }
  });

  if (isLoading) return (
    <div className="flex items-center justify-center p-12 mt-10">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <div className="mb-8 border-b border-gray-200 pb-5">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center tracking-tight">
          <ListTodo className="mr-3 text-primary-500 h-8 w-8" />
          Staff Operations
        </h1>
        <p className="text-gray-500 mt-2 text-base">Manage store orders and prepare them for delivery.</p>
      </div>

      {orders?.length === 0 ? (
        <div className="glass rounded-3xl p-16 text-center border border-white/40 shadow-xl">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-50 text-gray-400 mb-4 shadow-inner">
            <CheckCircle2 size={40} />
          </div>
          <h3 className="text-xl font-bold text-gray-900">All Caught Up!</h3>
          <p className="text-gray-500 mt-2 max-w-sm mx-auto">There are no pending orders to pack. Grab a coffee and wait for the next order.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {orders?.map(order => (
            <div key={order._id} className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="text-xs text-gray-400 font-medium tracking-wider uppercase mb-1">Order #</div>
                  <h3 className="text-lg font-bold text-gray-900 font-mono">{order._id.slice(-6)}</h3>
                </div>
                <span className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-widest border ${order.status === 'placed' ? 'bg-purple-100 text-purple-800 border-purple-200' :
                    'bg-amber-100 text-amber-800 border-amber-200'
                  }`}>
                  {order.status}
                </span>
              </div>

              <div className="bg-gray-50/50 rounded-xl p-4 mb-6 border border-gray-100/50 flex-1">
                <div className="flex items-center text-gray-600 mb-2">
                  <Package size={16} className="mr-2 text-primary-500 shrink-0" />
                  <span className="font-medium">Items to pack: <span className="font-bold text-gray-900">{order.items?.length || 0}</span></span>
                </div>
                <div className="flex items-start text-gray-600">
                  <MapPin size={16} className="mr-2 text-primary-500 shrink-0 mt-0.5" />
                  <span className="text-sm line-clamp-2">{order.address || 'Standard Delivery'}</span>
                </div>
              </div>

              <div className="mt-auto pt-2">
                {order.status === 'placed' && (
                  <button
                    onClick={() => handleStatusUpdate.mutate({ id: order._id, status: 'packing' })}
                    className="w-full py-3.5 px-4 bg-primary-50 text-primary-700 hover:bg-primary-600 hover:text-white font-semibold rounded-xl flex items-center justify-center space-x-2 transition-all group"
                  >
                    <Package size={18} className="group-hover:animate-bounce" />
                    <span>Start Packing</span>
                  </button>
                )}

                {order.status === 'packing' && (
                  <button
                    onClick={() => handleStatusUpdate.mutate({ id: order._id, status: 'ready' })}
                    className="w-full py-3.5 px-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold rounded-xl flex items-center justify-center space-x-2 transition-all shadow-md active:scale-95"
                  >
                    <PackageCheck size={18} />
                    <span>Mark Ready & Assign</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StaffDashboard;