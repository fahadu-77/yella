'use client';

import { useState, useEffect } from 'react';
import { ShoppingBag, Search, Plus, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function ShopPage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await fetch('/api/products');
                const data = await res.json();
                if (res.ok) setProducts(data);
            } catch (err) {
                console.error('Failed to fetch products:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <main className="min-h-screen bg-black text-white p-4 md:p-8">
            <header className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 mb-12 animate-in fade-in slide-in-from-top duration-700">
                <Link href="/" className="text-4xl font-black tracking-tighter hover:neon-text transition-all">
                    YELLA<span className="neon-text">.</span>
                </Link>

                <div className="relative w-full max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={20} />
                    <input
                        type="text"
                        placeholder="Search for essentials..."
                        className="w-full bg-zinc-900/50 border border-zinc-800 rounded-2xl py-3 pl-12 pr-4 text-white placeholder:text-zinc-600 focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] transition-all"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </header>

            <section className="max-w-7xl mx-auto">
                <div className="flex justify-between items-baseline mb-8">
                    <h1 className="text-2xl md:text-3xl font-bold">Today's Selection</h1>
                    <span className="text-zinc-500 text-sm font-medium">{filteredProducts.length} items found</span>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <Loader2 className="animate-spin text-[var(--primary)]" size={40} />
                        <p className="text-zinc-500 animate-pulse">Fetching the best for you...</p>
                    </div>
                ) : filteredProducts.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-in fade-in zoom-in duration-500">
                        {filteredProducts.map((product) => (
                            <div key={product.id} className="glass-card group hover:border-[var(--primary)] transition-all duration-300 flex flex-col h-full">
                                <div className="aspect-square bg-zinc-900 rounded-xl mb-4 overflow-hidden relative">
                                    {product.image ? (
                                        <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-zinc-800">
                                            <ShoppingBag size={64} />
                                        </div>
                                    )}
                                    <div className="absolute top-3 right-3">
                                        <span className="bg-black/50 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border border-white/10 italic text-zinc-300">
                                            {product.category || 'General'}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex flex-col flex-1">
                                    <h3 className="text-lg font-bold mb-1 group-hover:neon-text transition-colors">{product.name}</h3>
                                    <p className="text-zinc-500 text-sm mb-4 line-clamp-2 flex-1">{product.description || 'No description available.'}</p>
                                    <div className="flex justify-between items-center mt-auto">
                                        <span className="text-xl font-black text-[var(--primary)]">₹{product.price.toFixed(2)}</span>
                                        <button className="bg-white text-black p-2 rounded-xl hover:bg-[var(--primary)] transition-colors shadow-lg active:scale-95">
                                            <Plus size={20} strokeWidth={3} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 glass-card">
                        <ShoppingBag className="mx-auto mb-4 text-zinc-800" size={64} />
                        <h2 className="text-xl font-bold mb-2">No items found</h2>
                        <p className="text-zinc-500">Try adjusting your search or come back later!</p>
                    </div>
                )}
            </section>

            {/* Background Decorative Gradients */}
            <div className="fixed top-[-10%] right-[-10%] w-[500px] h-[500px] bg-[var(--primary-glow)] blur-[150px] pointer-events-none opacity-10" />
            <div className="fixed bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-[var(--primary-glow)] blur-[150px] pointer-events-none opacity-10" />
        </main>
    );
}
