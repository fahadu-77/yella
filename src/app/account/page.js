'use client';

import { useState, useEffect } from 'react';
import { User, Package, Clock, Shield, LogOut, Loader2, ChevronRight, CheckCircle2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function AccountPage() {
    const [user, setUser] = useState(null);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [requesting, setRequesting] = useState(false);

    const fetchData = async () => {
        try {
            const [uRes, oRes] = await Promise.all([
                fetch('/api/auth/me'),
                fetch('/api/orders')
            ]);

            if (uRes.ok) setUser(await uRes.json());
            if (oRes.ok) setOrders(await oRes.json());
        } catch (err) {
            console.error('Fetch account data error:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    const handleStaffRequest = async () => {
        setRequesting(true);
        try {
            const res = await fetch('/api/users', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isStaffRequested: true })
            });
            if (res.ok) {
                setUser({ ...user, isStaffRequested: true });
                alert('Request sent. Admin will review shortly.');
            }
        } catch (err) { } finally { setRequesting(false); }
    };

    const handleLogout = async () => {
        const res = await fetch('/api/auth/logout', { method: 'POST' });
        if (res.ok) window.location.href = '/';
    };

    if (loading) return (
        <div className="min-h-screen bg-black flex items-center justify-center">
            <div className="relative">
                <Loader2 className="animate-spin text-[var(--primary)]" size={48} strokeWidth={1.5} />
                <div className="absolute inset-0 blur-2xl bg-[var(--primary)] opacity-20 animate-pulse" />
            </div>
        </div>
    );

    if (!user) return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-center space-y-8 animate-reveal">
            <div className="space-y-4">
                <h1 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter leading-none">
                    Identify <span className="neon-text">Required</span>
                </h1>
                <p className="text-zinc-500 max-w-sm mx-auto font-medium tracking-wide uppercase text-[10px]">
                    Authentication check failed. Access to Personal Hub denied.
                </p>
            </div>
            <Link href="/login" className="btn-primary px-12 h-16">
                Establish Session
            </Link>
        </div>
    );

    return (
        <main className="min-h-screen bg-black text-white relative">
            {/* Background Accents */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[800px] h-[800px] bg-[var(--primary-glow)] blur-[150px] opacity-[0.03]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[800px] h-[800px] bg-[var(--primary-glow)] blur-[150px] opacity-[0.03]" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto p-4 md:p-10 space-y-16">
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 animate-reveal">
                    <div>
                        <Link href="/shop" className="group flex items-center gap-3 text-zinc-600 hover:text-white transition-all text-[10px] font-black uppercase tracking-[0.3em] mb-4">
                            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                            Return to Shop
                        </Link>
                        <h1 className="text-6xl md:text-8xl font-black uppercase italic tracking-tighter leading-none m-0">
                            Your <span className="neon-text">Hub</span>
                        </h1>
                        <p className="text-zinc-500 font-bold uppercase tracking-[0.4em] text-[10px] mt-2">Active Surveillance & Inventory Monitor</p>
                    </div>
                    <button onClick={handleLogout} className="group flex items-center gap-3 bg-zinc-950 border border-white/5 px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-red-950/20 hover:text-red-500 hover:border-red-500/20 transition-all active:scale-95">
                        <LogOut size={16} /> Terminate Session
                    </button>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 animate-reveal" style={{ animationDelay: '0.1s' }}>
                    {/* Left Column: Ident & Clearance */}
                    <div className="space-y-10">
                        <section className="glass-card border-white/5 space-y-8 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--primary-glow)] blur-3xl opacity-5 group-hover:opacity-10 transition-opacity" />

                            <div className="flex items-center gap-6 relative z-10">
                                <div className="w-20 h-20 bg-[var(--primary)] text-black rounded-3xl flex items-center justify-center shadow-[0_0_30px_var(--primary-glow)]">
                                    <User size={40} strokeWidth={2.5} />
                                </div>
                                <div className="space-y-1">
                                    <h2 className="text-2xl font-black tracking-tight leading-none italic">{user.name}</h2>
                                    <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">{user.email}</p>
                                </div>
                            </div>

                            <div className="pt-8 border-t border-white/5 relative z-10">
                                <div className="flex justify-between items-center">
                                    <div className="space-y-1">
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600">Clearance Level</span>
                                        <div className="flex items-center gap-2">
                                            <div className={`w-2 h-2 rounded-full animate-pulse ${user.role === 'ADMIN' ? 'bg-purple-500 shadow-[0_0_10px_purple]' : user.role === 'STAFF' ? 'bg-[var(--primary)] shadow-[0_0_10px_var(--primary)]' : 'bg-zinc-700'}`} />
                                            <span className={`text-xs font-black uppercase tracking-tighter ${user.role === 'ADMIN' ? 'text-purple-400' : user.role === 'STAFF' ? 'text-[var(--primary)]' : 'text-zinc-500'}`}>
                                                {user.role} Verified
                                            </span>
                                        </div>
                                    </div>
                                    <Shield size={32} className={`opacity-10 ${user.role === 'ADMIN' ? 'text-purple-500' : user.role === 'STAFF' ? 'text-[var(--primary)]' : 'text-white'}`} />
                                </div>
                            </div>
                        </section>

                        {user.role === 'CUSTOMER' && (
                            <section className="glass-card border-dashed border-zinc-800 space-y-6 hover:border-[var(--primary)]/30 transition-colors">
                                <div className="space-y-2">
                                    <h3 className="text-2xl font-black uppercase italic leading-none">Elevate <span className="neon-text">Access</span></h3>
                                    <p className="text-zinc-500 text-[10px] font-bold tracking-widest leading-relaxed uppercase opacity-80">Request clearance for POS & Inventory sub-systems.</p>
                                </div>

                                {user.isStaffRequested ? (
                                    <div className="bg-zinc-950/50 p-5 rounded-2xl flex items-center gap-4 border border-white/5 group">
                                        <Clock className="text-[var(--primary)] animate-pulse" size={20} />
                                        <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Protocol under review</span>
                                    </div>
                                ) : (
                                    <button
                                        onClick={handleStaffRequest}
                                        disabled={requesting}
                                        className="btn-primary w-full h-14"
                                    >
                                        {requesting ? 'Processing...' : 'Apply for Clearance'}
                                    </button>
                                )}
                            </section>
                        )}

                        {(user.role === 'STAFF' || user.role === 'ADMIN') && (
                            <Link href="/admin" className="block glass-card border-[var(--primary)]/20 hover:bg-[var(--primary)]/5 group transition-all">
                                <div className="flex justify-between items-center mb-4">
                                    <Shield className="text-[var(--primary)]" size={32} strokeWidth={1.5} />
                                    <ChevronRight className="text-[var(--primary)] group-hover:translate-x-1 transition-transform" />
                                </div>
                                <h3 className="text-2xl font-black uppercase italic leading-none text-[var(--primary)]">Store Command</h3>
                                <p className="text-zinc-500 text-[10px] font-bold tracking-widest uppercase mt-2">Enter Protected Sector</p>
                            </Link>
                        )}
                    </div>

                    {/* Right Column: Acquisition Log */}
                    <div className="lg:col-span-2 space-y-10">
                        <div className="flex justify-between items-end border-b border-white/5 pb-6">
                            <h2 className="text-4xl font-black uppercase italic tracking-tighter leading-none m-0">Acquisition <span className="neon-text">Log</span></h2>
                            <div className="flex flex-col items-end">
                                <span className="text-zinc-600 text-[8px] font-black uppercase tracking-[0.3em]">Temporal Scope</span>
                                <span className="text-white text-[10px] font-black uppercase tracking-widest">{orders.length} TOTAL ENTRIES</span>
                            </div>
                        </div>

                        <div className="space-y-6">
                            {orders.length > 0 ? orders.map((order, idx) => (
                                <div key={order.id}
                                    className="glass-card border-white/5 p-8 group hover:ring-1 hover:ring-[var(--primary)]/20 transition-all animate-reveal"
                                    style={{ animationDelay: `${0.2 + idx * 0.1}s` }}>
                                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                                        <div className="flex items-center gap-6">
                                            <div className="w-14 h-14 bg-zinc-950 rounded-2xl flex items-center justify-center text-zinc-700 group-hover:text-[var(--primary)] group-hover:shadow-[0_0_20px_var(--primary-glow)] transition-all duration-500 border border-white/5">
                                                <Package size={24} strokeWidth={1.5} />
                                            </div>
                                            <div className="space-y-1">
                                                <h4 className="font-black text-xl italic tracking-tight m-0 uppercase">#ID-{order.id.slice(-8)}</h4>
                                                <p className="text-zinc-600 text-[10px] font-black uppercase tracking-widest">{new Date(order.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                                            </div>
                                        </div>

                                        <div className="flex flex-col md:items-end gap-3 w-full md:w-auto">
                                            <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border self-start md:self-auto ${order.status === 'DELIVERED' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                                                    order.status === 'PROCESSING' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' :
                                                        'bg-zinc-900 text-zinc-500 border-white/5'
                                                }`}>
                                                {order.status}
                                            </span>
                                            <span className="text-3xl font-black text-white italic tracking-tighter">₹{order.total.toLocaleString()}</span>
                                        </div>
                                    </div>

                                    <div className="mt-8 flex flex-wrap gap-2 pt-6 border-t border-white/5">
                                        {order.items.map((item, i) => (
                                            <div key={i} className="flex items-center gap-2 bg-zinc-950/50 px-4 py-2 rounded-xl border border-white/5 text-[10px] font-bold uppercase tracking-tighter text-zinc-400 group-hover:border-white/10 transition-colors">
                                                <span className="text-[var(--primary)] font-black italic">{item.quantity}x</span>
                                                <span>{item.product.name}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )) : (
                                <div className="py-32 text-center glass-card border-dashed opacity-30 flex flex-col items-center gap-6">
                                    <Package size={64} className="text-zinc-700" strokeWidth={0.5} />
                                    <p className="font-black uppercase tracking-[0.5em] italic text-zinc-600 text-[10px]">No historical data found</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
