'use client';

import { useState, useEffect } from 'react';
import { ShoppingBag, Search, Plus, Loader2, ArrowLeft, User, Filter } from 'lucide-react';
import Link from 'next/link';
import { useCart } from '@/lib/CartContext';
import CartDrawer from '@/components/CartDrawer';

export default function ShopPage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');
    const { addToCart, cartCount, setIsCartOpen } = useCart();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await fetch('/api/products');
                const data = await res.json();
                if (res.ok) setProducts(data);
            } catch (err) {
                console.error('Fetch products error:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const categories = ['All', ...new Set(products.map(p => p.category || 'General'))];

    const filteredProducts = products.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.description?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = activeCategory === 'All' || (p.category || 'General') === activeCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <main className="min-h-screen bg-black text-white relative">
            {/* Background Accents */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] right-[-10%] w-[800px] h-[800px] bg-[var(--primary-glow)] blur-[150px] opacity-[0.03]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[800px] h-[800px] bg-[var(--primary-glow)] blur-[150px] opacity-[0.03]" />
            </div>

            <div className="relative z-10 p-4 md:p-10 max-w-screen-2xl mx-auto space-y-12">
                <header className="flex flex-col lg:flex-row justify-between items-center gap-8 animate-reveal">
                    <div className="flex items-center gap-8 w-full lg:w-auto">
                        <Link href="/" className="group p-4 bg-white/5 hover:bg-[var(--primary)] rounded-2xl transition-all duration-500">
                            <ArrowLeft size={24} className="group-hover:text-black transition-colors" />
                        </Link>
                        <div>
                            <h1 className="text-4xl md:text-5xl font-black tracking-tighter m-0">
                                YELLA<span className="neon-text">.</span>SHOP
                            </h1>
                            <p className="text-[10px] uppercase tracking-[0.4em] text-zinc-500 font-bold mt-1">Acquisition Terminal V.01</p>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row items-center gap-4 w-full lg:max-w-3xl">
                        <div className="relative flex-1 w-full">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={20} />
                            <input
                                type="text"
                                placeholder="Search the catalog..."
                                className="w-full bg-zinc-950/50 border border-white/10 rounded-2xl py-4 pl-14 pr-6 text-white placeholder:text-zinc-700 focus:outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/5 transition-all text-sm font-medium"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        <div className="flex items-center gap-3 w-full md:w-auto">
                            <Link
                                href="/account"
                                className="p-4 bg-zinc-950 border border-white/10 rounded-2xl hover:border-[var(--primary)] transition-all active:scale-95 group flex-1 md:flex-none flex items-center justify-center"
                            >
                                <User size={24} className="group-hover:neon-text transition-colors" />
                            </Link>

                            <button
                                onClick={() => setIsCartOpen(true)}
                                className="relative p-4 bg-zinc-950 border border-white/10 rounded-2xl hover:border-[var(--primary)] transition-all active:scale-95 group flex-1 md:flex-none flex items-center justify-center"
                            >
                                <ShoppingBag size={24} className="group-hover:neon-text transition-colors" />
                                {cartCount > 0 && (
                                    <span className="absolute -top-2 -right-2 w-7 h-7 bg-[var(--primary)] text-black text-[10px] font-black flex items-center justify-center rounded-full shadow-[0_0_15px_var(--primary-glow)] border-2 border-black animate-in fade-in zoom-in">
                                        {cartCount}
                                    </span>
                                )}
                            </button>
                        </div>
                    </div>
                </header>

                <section className="space-y-10 animate-reveal" style={{ animationDelay: '0.2s' }}>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/[0.05] pb-10">
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <Filter size={16} className="text-[var(--primary)]" />
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Filter / Segment</span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {categories.map(cat => (
                                    <button
                                        key={cat}
                                        onClick={() => setActiveCategory(cat)}
                                        className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${activeCategory === cat
                                                ? 'bg-white text-black ring-4 ring-white/10'
                                                : 'bg-zinc-900/50 text-zinc-500 hover:text-white border border-white/5'
                                            }`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <span className="text-zinc-600 text-[10px] font-black uppercase tracking-[0.2em]">
                            Found {filteredProducts.length} Results
                        </span>
                    </div>

                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-40 gap-6">
                            <div className="relative">
                                <Loader2 className="animate-spin text-[var(--primary)]" size={64} strokeWidth={1.5} />
                                <div className="absolute inset-0 blur-2xl bg-[var(--primary)] opacity-20 animate-pulse" />
                            </div>
                            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-700 animate-pulse">Initializing Data Stream</p>
                        </div>
                    ) : filteredProducts.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8">
                            {filteredProducts.map((product) => (
                                <div key={product.id} className="glass-card group p-0 overflow-hidden flex flex-col hover:ring-1 hover:ring-[var(--primary)]/30">
                                    <div className="aspect-[4/5] bg-zinc-950 relative overflow-hidden">
                                        {product.image ? (
                                            <img
                                                src={product.image}
                                                alt={product.name}
                                                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-80 group-hover:opacity-100"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-zinc-900">
                                                <ShoppingBag size={80} strokeWidth={0.5} />
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />

                                        <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                                            <span className="bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest border border-white/10 italic text-[var(--primary)] shadow-2xl">
                                                {product.category || 'General'}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="p-6 flex flex-col flex-1 space-y-4">
                                        <div className="space-y-1">
                                            <h3 className="text-xl m-0 leading-tight group-hover:neon-text transition-colors duration-500">
                                                {product.name}
                                            </h3>
                                            <p className="text-zinc-500 text-[10px] font-medium leading-relaxed line-clamp-2 uppercase tracking-tighter opacity-70">
                                                {product.description || 'Premium quality essential carefully selected for you.'}
                                            </p>
                                        </div>

                                        <div className="pt-4 border-t border-white/5 mt-auto flex justify-between items-center">
                                            <div className="flex flex-col">
                                                <span className="text-[8px] text-zinc-600 uppercase font-black tracking-widest">Market Price</span>
                                                <span className="text-2xl font-black text-white">₹{product.price.toLocaleString()}</span>
                                            </div>
                                            <button
                                                onClick={() => addToCart(product)}
                                                className="bg-white text-black h-12 w-12 rounded-2xl hover:bg-[var(--primary)] transition-all duration-500 shadow-xl active:scale-90 flex items-center justify-center group/btn"
                                            >
                                                <Plus size={24} strokeWidth={3} className="group-hover/btn:scale-125 transition-transform" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-40 glass-card border-dashed border-zinc-800">
                            <ShoppingBag className="mx-auto mb-8 text-zinc-900" size={120} strokeWidth={0.5} />
                            <h2 className="text-3xl font-black mb-4 uppercase tracking-tighter italic">Out of Stock</h2>
                            <p className="text-zinc-600 text-sm font-medium tracking-widest uppercase">The requested data stream is currently empty.</p>
                        </div>
                    )}
                </section>
            </div>

            <CartDrawer />
        </main>
    );
}
