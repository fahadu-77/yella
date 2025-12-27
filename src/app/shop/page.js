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
        <main className="min-h-screen bg-black text-white relative font-sans selection:bg-[var(--primary)] selection:text-black">
            {/* Ambient Background */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-0 right-0 w-[50vw] h-[50vw] bg-[var(--primary-glow)] blur-[120px] opacity-[0.05]" />
                <div className="absolute bottom-0 left-0 w-[50vw] h-[50vw] bg-zinc-900 blur-[120px] opacity-20" />
            </div>

            <div className="relative z-10 max-w-[1600px] mx-auto p-4 md:p-8 space-y-8 md:space-y-12">
                {/* Header */}
                <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 animate-reveal">
                    <div className="flex items-center gap-6">
                        <Link href="/" className="group flex items-center justify-center w-12 h-12 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 transition-all">
                            <ArrowLeft size={20} className="text-zinc-400 group-hover:text-white transition-colors" />
                        </Link>
                        <div>
                            <h1 className="text-3xl md:text-4xl font-black tracking-tight leading-none">
                                YELLA<span className="text-[var(--primary)]">.</span>SHOP
                            </h1>
                            <p className="text-xs font-bold text-zinc-500 tracking-[0.2em] mt-1 uppercase">
                                Collection 2025
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto lg:min-w-[500px]">
                        <div className="relative flex-1">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                            <input
                                type="text"
                                placeholder="Search products..."
                                className="w-full bg-zinc-900/50 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] transition-all"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-3">
                            <Link
                                href="/account"
                                className="flex items-center justify-center w-12 h-12 bg-zinc-900/50 border border-white/10 rounded-xl hover:border-white/30 hover:bg-zinc-800 transition-all"
                            >
                                <User size={20} className="text-zinc-400 hover:text-white" />
                            </Link>
                            <button
                                onClick={() => setIsCartOpen(true)}
                                className="relative flex items-center justify-center w-12 h-12 bg-zinc-900/50 border border-white/10 rounded-xl hover:border-[var(--primary)] hover:bg-zinc-800 transition-all group"
                            >
                                <ShoppingBag size={20} className="text-zinc-400 group-hover:text-[var(--primary)] transition-colors" />
                                {cartCount > 0 && (
                                    <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-[var(--primary)] text-black text-[10px] font-bold flex items-center justify-center rounded-full shadow-lg">
                                        {cartCount}
                                    </span>
                                )}
                            </button>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <section className="space-y-8 animate-reveal" style={{ animationDelay: '0.1s' }}>
                    {/* Filters */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/5 pb-6">
                        <div className="flex items-center gap-3 overflow-x-auto pb-2 sm:pb-0 w-full no-scrollbar">
                            <div className="flex items-center gap-2 pr-4 border-r border-white/10 mr-2 shrink-0">
                                <Filter size={14} className="text-[var(--primary)]" />
                                <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-500">Filter</span>
                            </div>
                            {categories.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setActiveCategory(cat)}
                                    className={`px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wide transition-all whitespace-nowrap ${activeCategory === cat
                                            ? 'bg-white text-black'
                                            : 'bg-zinc-900 text-zinc-500 hover:text-white hover:bg-zinc-800'
                                        }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                        <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-wider shrink-0 hidden sm:block">
                            {filteredProducts.length} Products Found
                        </span>
                    </div>

                    {/* Product Grid */}
                    {loading ? (
                        <div className="flex flex-col items-center justify-center min-h-[40vh]">
                            <Loader2 className="animate-spin text-[var(--primary)] mb-4" size={32} />
                            <p className="text-xs text-zinc-600 font-medium tracking-widest uppercase animate-pulse">Loading Catalog...</p>
                        </div>
                    ) : filteredProducts.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6 lg:gap-8">
                            {filteredProducts.map((product) => (
                                <div key={product.id} className="group relative bg-zinc-900/40 border border-white/5 rounded-2xl overflow-hidden hover:border-white/20 transition-all duration-300 hover:shadow-2xl hover:shadow-[var(--primary-glow)]/10 flex flex-col">
                                    {/* Image Container */}
                                    <div className="aspect-[3/4] overflow-hidden bg-zinc-950 relative">
                                        {product.image ? (
                                            <img
                                                src={product.image}
                                                alt={product.name}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-90 group-hover:opacity-100"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-zinc-900">
                                                <ShoppingBag size={40} className="text-zinc-800" />
                                            </div>
                                        )}
                                        {/* Overlay Gradient */}
                                        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 to-transparent" />

                                        <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md border border-white/10 px-2 py-1 rounded-lg">
                                            <span className="text-[9px] font-bold uppercase tracking-wider text-white/90">
                                                {product.category || 'General'}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-4 flex flex-col flex-1 gap-3">
                                        <div className="flex-1 space-y-1">
                                            <h3 className="text-base font-bold leading-tight group-hover:text-[var(--primary)] transition-colors line-clamp-2">
                                                {product.name}
                                            </h3>
                                            <p className="text-[11px] text-zinc-500 font-medium leading-relaxed line-clamp-2">
                                                {product.description}
                                            </p>
                                        </div>

                                        <div className="flex items-center justify-between pt-2 mt-auto">
                                            <div>
                                                <span className="block text-[20px] font-black tracking-tight text-white">
                                                    ₹{product.price.toLocaleString()}
                                                </span>
                                            </div>
                                            <button
                                                onClick={() => addToCart(product)}
                                                className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center hover:bg-[var(--primary)] transition-all active:scale-90 shadow-lg"
                                            >
                                                <Plus size={20} strokeWidth={2.5} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center min-h-[40vh] border border-dashed border-zinc-800 rounded-3xl">
                            <ShoppingBag className="text-zinc-800 mb-6" size={64} strokeWidth={1} />
                            <h2 className="text-xl font-bold text-zinc-500 uppercase tracking-widest">No Products Found</h2>
                            <p className="text-sm text-zinc-600 mt-2">Try adjusting your filters or search query.</p>
                        </div>
                    )}
                </section>
            </div>

            <CartDrawer />
        </main>
    );
}

