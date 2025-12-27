'use client';

import { useState, useEffect } from 'react';
import { ShoppingCart, Package, TrendingUp, AlertCircle, ArrowRight, Zap } from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        totalSales: 0,
        onlineOrders: 0,
        lowStock: 0,
        recentOrders: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [productsRes, ordersRes] = await Promise.all([
                    fetch('/api/products'),
                    fetch('/api/orders')
                ]);
                const products = await productsRes.json();
                const orders = await ordersRes.json();

                if (productsRes.ok && ordersRes.ok) {
                    const totalSales = orders.reduce((acc, order) => acc + order.total, 0);
                    const onlineOrders = orders.filter(o => o.type === 'ONLINE' && o.status === 'PENDING').length;
                    const lowStock = products.filter(p => p.stock < 10).length;

                    setStats({
                        totalSales,
                        onlineOrders,
                        lowStock,
                        recentOrders: orders.slice(0, 5)
                    });
                }
            } catch (err) {
                console.error('Failed to fetch dashboard stats:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const cards = [
        { label: 'Revenue', value: `₹${stats.totalSales.toFixed(2)}`, icon: TrendingUp, color: 'text-green-500', sub: '+12% from last week' },
        { label: 'Pending Orders', value: stats.onlineOrders, icon: ShoppingCart, color: 'text-[var(--primary)]', sub: 'Action required' },
        { label: 'Low Stock', value: stats.lowStock, icon: AlertCircle, color: 'text-red-500', sub: 'Needs restock' },
    ];

    return (
        <div className="flex flex-col gap-12 max-w-7xl mx-auto p-4 md:p-8">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-5xl font-black tracking-tight italic uppercase">Store <span className="neon-text">Ops</span></h1>
                    <p className="text-zinc-500 mt-2 font-medium tracking-wide">Command center for your Yella branch.</p>
                </div>
                <div className="flex gap-4">
                    <Link href="/admin/pos" className="bg-white text-black px-6 py-3 rounded-2xl font-black text-sm uppercase flex items-center gap-2 hover:bg-[var(--primary)] transition-all active:scale-95 shadow-xl">
                        <Zap size={18} fill="currentColor" />
                        Open POS
                    </Link>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {cards.map((card, i) => (
                    <div key={i} className="glass-card group hover:border-zinc-700 transition-all border border-zinc-900 p-8 rounded-[2rem] flex flex-col gap-4">
                        <div className="flex justify-between items-start">
                            <card.icon className={card.color} size={28} />
                            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Real-time</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-4xl font-black tracking-tighter">{card.value}</span>
                            <span className="text-zinc-500 text-xs font-bold uppercase tracking-widest mt-1">{card.label}</span>
                        </div>
                        <p className={`text-[10px] font-bold ${card.color} opacity-80 uppercase tracking-tighter mt-2`}>{card.sub}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Quick Navigation */}
                <div className="flex flex-col gap-4">
                    <h2 className="text-xl font-black uppercase flex items-center gap-2">
                        Quick <span className="neon-text">Links</span>
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {[
                            { name: 'Inventory Management', desc: 'Add, edit or restock products', href: '/admin/inventory', icon: Package },
                            { name: 'Active Orders', desc: 'Process and fulfill orders', href: '/admin/orders', icon: ShoppingCart },
                        ].map((link, i) => (
                            <Link key={i} href={link.href} className="group glass-card border border-zinc-900 p-6 rounded-3xl hover:border-[var(--primary)] transition-all flex flex-col gap-2">
                                <link.icon size={24} className="group-hover:neon-text transition-colors" />
                                <h3 className="font-bold">{link.name}</h3>
                                <p className="text-zinc-500 text-xs">{link.desc}</p>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="flex flex-col gap-4">
                    <h2 className="text-xl font-black uppercase flex items-center gap-2">
                        Recent <span className="neon-text">Activity</span>
                    </h2>
                    <div className="glass-card border border-zinc-900 rounded-[2rem] p-6 h-full flex flex-col">
                        {stats.recentOrders.length > 0 ? (
                            <div className="space-y-4">
                                {stats.recentOrders.map((order) => (
                                    <div key={order.id} className="flex justify-between items-center p-3 rounded-2xl hover:bg-zinc-900/50 transition-colors">
                                        <div className="flex flex-col">
                                            <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Order #{order.id.slice(-6)}</span>
                                            <span className="font-bold">₹{order.total.toFixed(2)}</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter ${order.type === 'ONLINE' ? 'bg-blue-900/40 text-blue-400' : 'bg-green-900/40 text-green-400'
                                                }`}>
                                                {order.type}
                                            </span>
                                            <ArrowRight size={16} className="text-zinc-700" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center opacity-20 italic">
                                <p>No recent activity found.</p>
                            </div>
                        )}
                        <Link href="/admin/orders" className="text-center text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-colors mt-auto pt-4 border-t border-zinc-900">
                            View All Activities
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
