'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, Package, LogOut, Loader2 } from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

export default function AccountPage() {
    const [user, setUser] = useState(null);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userRes = await fetch('/api/auth/me');
                if (!userRes.ok) {
                    router.push('/login');
                    return;
                }
                const userData = await userRes.json();
                setUser(userData);

                const ordersRes = await fetch('/api/orders');
                if (ordersRes.ok) {
                    const ordersData = await ordersRes.json();
                    setOrders(ordersData);
                }
            } catch (err) {
                console.error('Error fetching data:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [router]);

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        router.push('/login');
    };

    const getStatusBadge = (status) => {
        const badges = {
            PENDING: 'badge-warning',
            PROCESSING: 'badge-warning',
            SHIPPED: 'badge-success',
            DELIVERED: 'badge-success',
            CANCELLED: 'badge-error'
        };
        return badges[status] || 'badge-neutral';
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center">
                <Loader2 className="animate-spin text-emerald-500" size={40} />
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-slate-900">
            <div className="container-custom py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-slate-50 mb-2">My Account</h1>
                    <p className="text-slate-400">Manage your profile and orders</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Profile Card */}
                    <Card className="lg:col-span-1">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center">
                                <User className="text-emerald-400" size={32} />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-slate-50">{user?.name}</h2>
                                <p className="text-sm text-slate-400">{user?.email}</p>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="p-3 bg-slate-700/50 rounded-lg">
                                <p className="text-xs text-slate-400 mb-1">Role</p>
                                <p className="text-sm font-medium text-slate-50 capitalize">{user?.role?.toLowerCase()}</p>
                            </div>

                            <div className="p-3 bg-slate-700/50 rounded-lg">
                                <p className="text-xs text-slate-400 mb-1">Total Orders</p>
                                <p className="text-sm font-medium text-slate-50">{orders.length}</p>
                            </div>
                        </div>

                        <div className="mt-6 pt-6 border-t border-slate-700">
                            <Button variant="danger" className="w-full" onClick={handleLogout}>
                                <LogOut size={18} />
                                Logout
                            </Button>
                        </div>
                    </Card>

                    {/* Orders Section */}
                    <div className="lg:col-span-2">
                        <div className="flex items-center gap-3 mb-6">
                            <Package className="text-emerald-400" size={24} />
                            <h2 className="text-2xl font-bold text-slate-50">Order History</h2>
                        </div>

                        {orders.length > 0 ? (
                            <div className="space-y-4">
                                {orders.map((order) => (
                                    <Card key={order.id} hover>
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                                            <div>
                                                <p className="text-sm text-slate-400">Order #{order.id}</p>
                                                <p className="text-lg font-bold text-slate-50">₹{order.total.toLocaleString()}</p>
                                            </div>
                                            <span className={`badge ${getStatusBadge(order.status)}`}>
                                                {order.status}
                                            </span>
                                        </div>

                                        <div className="space-y-2">
                                            {order.items?.map((item, idx) => (
                                                <div key={idx} className="flex justify-between text-sm">
                                                    <span className="text-slate-300">
                                                        {item.product?.name || 'Product'} × {item.quantity}
                                                    </span>
                                                    <span className="text-slate-400">
                                                        ₹{(item.price * item.quantity).toLocaleString()}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="mt-4 pt-4 border-t border-slate-700">
                                            <p className="text-xs text-slate-500">
                                                {new Date(order.createdAt).toLocaleDateString('en-IN', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                            </p>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <Card className="text-center py-12">
                                <Package className="text-slate-600 mx-auto mb-4" size={48} />
                                <h3 className="text-lg font-semibold text-slate-50 mb-2">No orders yet</h3>
                                <p className="text-slate-400 mb-6">Start shopping to see your orders here</p>
                                <Button variant="primary" onClick={() => router.push('/shop')}>
                                    Browse Products
                                </Button>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}
