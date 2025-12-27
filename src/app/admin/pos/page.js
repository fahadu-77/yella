'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, Plus, Minus, Trash2, CreditCard, ShoppingCart, User, Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function POSPage() {
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false);
    const searchInputRef = useRef(null);

    const fetchProducts = async () => {
        try {
            const res = await fetch('/api/products');
            const data = await res.json();
            if (res.ok) setProducts(data);
        } catch (err) { } finally { setLoading(false); }
    };

    useEffect(() => {
        fetchProducts();
        if (searchInputRef.current) searchInputRef.current.focus();
    }, []);

    const addToCart = (product) => {
        setCart(prev => {
            const existing = prev.find(item => item.id === product.id);
            if (existing) {
                return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
            }
            return [...prev, { ...product, quantity: 1 }];
        });
        setSearchQuery('');
        searchInputRef.current?.focus();
    };

    const updateQuantity = (id, delta) => {
        setCart(prev => prev.map(item => {
            if (item.id === id) return { ...item, quantity: Math.max(1, item.quantity + delta) };
            return item;
        }));
    };

    const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    const handleCheckout = async (paymentType) => {
        if (!cart.length) return;
        setIsProcessing(true);
        try {
            const res = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    items: cart.map(item => ({ productId: item.id, quantity: item.quantity, price: item.price })),
                    total, type: 'INSTORE', paymentType
                })
            });
            if (res.ok) {
                alert(`Order Success! Payment: ${paymentType}`);
                setCart([]);
            } else {
                const data = await res.json();
                alert(`Error: ${data.error}`);
            }
        } catch (err) {
            alert('Checkout failed');
        } finally { setIsProcessing(false); }
    };

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="flex h-screen bg-zinc-950 text-white overflow-hidden">
            <div className="flex-1 flex flex-col p-6 min-w-0">
                <header className="flex items-center gap-6 mb-8">
                    <Link href="/admin" className="p-2 hover:bg-zinc-900 rounded-full transition-colors font-bold flex items-center gap-2">
                        <ArrowLeft size={20} /> BACK
                    </Link>
                    <div className="relative flex-1 max-w-2xl">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={20} />
                        <input
                            ref={searchInputRef}
                            type="text"
                            placeholder="Scan barcode or type name..."
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl py-4 pl-14 pr-6 focus:outline-none focus:border-[var(--primary)] transition-all"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </header>

                {loading ? (
                    <div className="flex-1 flex items-center justify-center">
                        <Loader2 className="animate-spin text-[var(--primary)]" size={48} />
                    </div>
                ) : (
                    <div className="flex-1 overflow-y-auto grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {filteredProducts.map(product => (
                            <button
                                key={product.id}
                                onClick={() => addToCart(product)}
                                className="glass-card p-3 rounded-2xl border border-zinc-900 hover:border-[var(--primary)] transition-all flex flex-col items-center group active:scale-95 h-fit"
                            >
                                <div className="w-full aspect-square bg-zinc-900 rounded-xl mb-3 overflow-hidden relative">
                                    <img src={product.image} className="w-full h-full object-cover group-hover:scale-105 transition-all" />
                                    <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-lg text-[10px] font-bold text-zinc-300">
                                        {product.stock}
                                    </div>
                                </div>
                                <h3 className="font-bold text-xs mb-1 line-clamp-1">{product.name}</h3>
                                <span className="text-[var(--primary)] font-black text-sm">₹{product.price}</span>
                            </button>
                        ))}
                    </div>
                )}
            </div>

            <div className="w-96 bg-zinc-900 border-l border-zinc-800 flex flex-col">
                <div className="p-6 border-b border-zinc-800 flex items-center gap-3">
                    <ShoppingCart className="text-[var(--primary)]" size={24} />
                    <h2 className="text-xl font-bold italic uppercase">Current Sale</h2>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {cart.map(item => (
                        <div key={item.id} className="bg-black/40 border border-zinc-800 rounded-xl p-3 flex flex-col gap-2">
                            <div className="flex justify-between items-start">
                                <h4 className="font-bold text-xs">{item.name}</h4>
                                <button onClick={() => setCart(c => c.filter(i => i.id !== item.id))} className="text-zinc-600 hover:text-red-500">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2 bg-zinc-800 rounded-lg p-1">
                                    <button onClick={() => updateQuantity(item.id, -1)} className="p-1 hover:bg-zinc-700 rounded"><Minus size={14} /></button>
                                    <span className="text-xs font-bold w-6 text-center">{item.quantity}</span>
                                    <button onClick={() => updateQuantity(item.id, 1)} className="p-1 hover:bg-zinc-700 rounded"><Plus size={14} /></button>
                                </div>
                                <span className="font-black text-sm text-[var(--primary)]">₹{(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                        </div>
                    ))}
                    {!cart.length && <div className="h-full flex items-center justify-center opacity-10 italic py-20">Cart empty</div>}
                </div>

                <footer className="p-6 bg-black/40 border-t border-zinc-800 space-y-4">
                    <div className="flex justify-between items-end">
                        <span className="text-xs font-bold text-zinc-500 uppercase">Total Deposit</span>
                        <span className="text-4xl text-[var(--primary)] font-black tracking-tighter">₹{total.toFixed(2)}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <button onClick={() => handleCheckout('CASH')} disabled={isProcessing || !cart.length} className="bg-white text-black py-4 rounded-xl font-black uppercase text-[10px] hover:bg-zinc-100 transition-all disabled:opacity-50">Cash</button>
                        <button onClick={() => handleCheckout('UPI')} disabled={isProcessing || !cart.length} className="bg-[var(--primary)] text-black py-4 rounded-xl font-black uppercase text-[10px] hover:bg-[var(--primary-hover)] transition-all disabled:opacity-50">UPI / QR</button>
                    </div>

                    <button onClick={() => setCart([])} className="w-full text-zinc-600 hover:text-white text-[10px] font-black uppercase tracking-widest transition-colors">Discard Sale</button>
                </footer>
            </div>
        </div>
    );
}
