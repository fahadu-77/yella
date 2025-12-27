'use client';

import { useState, useEffect } from 'react';
import { ShoppingBag, Loader2, CheckCircle, Clock, Truck, Search, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function OrdersPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('ALL');

    const fetchOrders = async () => {
        try {
            const res = await fetch('/api/orders');
            const data = await res.json();
            if (res.ok) setOrders(data);
        } catch (err) { } finally { setLoading(false); }
    };

    useEffect(() => { fetchOrders(); }, []);

    const updateStatus = async (orderId, status) => {
        try {
            const res = await fetch(`/api/orders/${orderId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status })
            });
            if (res.ok) fetchOrders();
        } catch (err) { }
    };

    const filteredOrders = orders.filter(o =>
        filter === 'ALL' || o.status === filter
    );

    if (loading) return (
        <div className="h-full flex flex-col items-center justify-center p-20 gap-4">
            <Loader2 className="animate-spin text-[var(--primary)]" size={40} />
            <p className="text-zinc-500">Retrieving manifest...</p>
        </div>
    );

    return (
        <div className="flex flex-col gap-10">
            <header className="flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-black italic uppercase tracking-tighter">Order <span className="neon-text">Manifest</span></h1>
                    <p className="text-zinc-500 mt-2 font-medium">Track and fulfill both online and in-store sales.</p>
                </div>
                <div className="flex bg-zinc-900 p-1 rounded-2xl border border-zinc-800">
                    {['ALL', 'PENDING', 'PROCESSING', 'DELIVERED'].map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filter === f ? 'bg-white text-black' : 'text-zinc-500 hover:text-white'
                                }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </header>

            <div className="grid grid-cols-1 gap-4">
                {filteredOrders.length > 0 ? (
                    filteredOrders.map(order => (
                        <div key={order.id} className="glass-card border border-zinc-900 group hover:border-zinc-700 transition-all rounded-[2rem] p-8 flex flex-col md:flex-row gap-8">
                            <div className="flex-1 space-y-4">
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${order.type === 'ONLINE' ? 'bg-blue-900/20 text-blue-500' : 'bg-green-900/20 text-green-500'
                                        }`}>
                                        {order.type === 'ONLINE' ? <Truck size={24} /> : <ShoppingBag size={24} />}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-xs font-black uppercase tracking-widest text-zinc-500">Order #{order.id.slice(-8)}</span>
                                        <span className="text-xl font-bold italic">{order.type === 'ONLINE' ? 'Home Delivery' : 'In-Store Checkout'}</span>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    {order.items.map(item => (
                                        <div key={item.id} className="flex justify-between text-sm">
                                            <span className="text-zinc-400"><span className="font-black text-white">{item.quantity}x</span> {item.product.name}</span>
                                            <span className="font-mono">₹{(item.price * item.quantity).toFixed(2)}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="flex flex-col justify-between items-end gap-6 text-right">
                                <div className="flex flex-col gap-1">
                                    <span className="text-xs font-black text-zinc-500 uppercase tracking-widest">Grand Total</span>
                                    <span className="text-3xl font-black text-[var(--primary)]">₹{order.total.toFixed(2)}</span>
                                </div>

                                <div className="flex gap-2">
                                    {order.status === 'PENDING' && (
                                        <button
                                            onClick={() => updateStatus(order.id, 'PROCESSING')}
                                            className="bg-white text-black px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-[var(--primary)] transition-all"
                                        >
                                            <Clock size={14} />
                                            Mark Processing
                                        </button>
                                    )}
                                    {(order.status === 'PENDING' || order.status === 'PROCESSING') && (
                                        <button
                                            onClick={() => updateStatus(order.id, 'DELIVERED')}
                                            className="bg-green-600 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-green-500 transition-all"
                                        >
                                            <CheckCircle size={14} />
                                            Mark {order.type === 'ONLINE' ? 'Delivered' : 'Completed'}
                                        </button>
                                    )}
                                    {order.status === 'DELIVERED' && (
                                        <span className="text-green-500 text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2">
                                            <CheckCircle size={14} />
                                            Fulfilled
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="py-20 text-center glass-card border-dashed opacity-20">
                        <ShoppingBag size={80} className="mx-auto mb-4" />
                        <p className="font-bold uppercase tracking-widest">No orders in this category</p>
                    </div>
                )}
            </div>
        </div>
    );
}
