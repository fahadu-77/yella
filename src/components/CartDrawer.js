'use client';

import { useCart } from '@/lib/CartContext';
import { ShoppingBag, X, Plus, Minus, Trash2, ArrowRight } from 'lucide-react';
import { useState } from 'react';

export default function CartDrawer() {
    const { cart, isCartOpen, setIsCartOpen, updateQuantity, removeFromCart, cartTotal, clearCart } = useCart();
    const [orderSuccess, setOrderSuccess] = useState(null);
    const [isCheckingOut, setIsCheckingOut] = useState(false);

    if (!isCartOpen) return null;

    const handleCheckout = async () => {
        setIsCheckingOut(true);
        try {
            const res = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    items: cart.map(item => ({ productId: item.id, quantity: item.quantity, price: item.price })),
                    total: cartTotal, type: 'ONLINE'
                })
            });

            if (res.ok) {
                const order = await res.json();
                setOrderSuccess(order);
                clearCart();
            } else {
                const data = await res.json();
                alert(`Checkout failed: ${data.error}`);
            }
        } catch (err) {
            alert('Failed to place order. Please try again.');
        } finally {
            setIsCheckingOut(false);
        }
    };

    if (orderSuccess) return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" onClick={() => { setOrderSuccess(null); setIsCartOpen(false); }} />
            <div className="relative bg-zinc-950 border border-zinc-900 p-10 rounded-[3rem] w-full max-w-md text-center space-y-6 animate-in zoom-in duration-300">
                <div className="w-20 h-20 bg-[var(--primary)] text-black rounded-full flex items-center justify-center mx-auto shadow-[0_0_40px_rgba(var(--primary-rgb),0.3)]">
                    <CheckCircle2 size={40} />
                </div>
                <div>
                    <h2 className="text-3xl font-black uppercase italic tracking-tighter">Order <span className="neon-text">Confirmed</span></h2>
                    <p className="text-zinc-500 mt-2 text-sm">Payment acknowledged. Your assets are being secured.</p>
                </div>
                <div className="bg-zinc-900/50 p-6 rounded-2xl border border-zinc-800 space-y-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Estimated Delivery</span>
                    <p className="text-xl font-black">Today, by 8:30 PM</p>
                </div>
                <div className="flex flex-col gap-3">
                    <Link href="/account" onClick={() => { setOrderSuccess(null); setIsCartOpen(false); }} className="w-full bg-white text-black py-4 rounded-xl font-black uppercase text-xs hover:bg-[var(--primary)] transition-all">Track in your Hub</Link>
                    <button onClick={() => { setOrderSuccess(null); setIsCartOpen(false); }} className="text-zinc-500 hover:text-white text-[10px] font-black uppercase tracking-widest">Close Window</button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
                onClick={() => setIsCartOpen(false)}
            />

            <div className="relative w-full max-w-md bg-zinc-950 border-l border-zinc-800 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
                <header className="p-6 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/50">
                    <div className="flex items-center gap-3">
                        <ShoppingBag className="text-[var(--primary)]" size={24} />
                        <h2 className="text-xl font-bold">Your Cart</h2>
                    </div>
                    <button
                        onClick={() => setIsCartOpen(false)}
                        className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
                    >
                        <X size={20} />
                    </button>
                </header>

                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {cart.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center">
                            <ShoppingBag className="text-zinc-800 mb-4" size={80} />
                            <p className="text-zinc-500 max-w-[200px]">Your shopping cart is empty. Start adding some goodies!</p>
                        </div>
                    ) : (
                        cart.map((item) => (
                            <div key={item.id} className="flex gap-4 group">
                                <div className="w-20 h-20 bg-zinc-900 rounded-xl overflow-hidden flex-shrink-0 border border-zinc-800">
                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1 flex flex-col">
                                    <div className="flex justify-between items-start">
                                        <h3 className="font-bold text-sm leading-tight">{item.name}</h3>
                                        <button
                                            onClick={() => removeFromCart(item.id)}
                                            className="text-zinc-600 hover:text-red-500 transition-colors p-1"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                    <p className="text-zinc-500 text-xs mb-auto">₹{item.price.toFixed(2)} / unit</p>
                                    <div className="flex justify-between items-center mt-2">
                                        <div className="flex items-center gap-3 bg-zinc-900 rounded-lg p-1 border border-zinc-800">
                                            <button
                                                onClick={() => updateQuantity(item.id, -1)}
                                                className="p-1 hover:bg-zinc-800 rounded transition-colors"
                                            >
                                                <Minus size={14} />
                                            </button>
                                            <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.id, 1)}
                                                className="p-1 hover:bg-zinc-800 rounded transition-colors"
                                            >
                                                <Plus size={14} />
                                            </button>
                                        </div>
                                        <span className="font-bold text-[var(--primary)]">₹{(item.price * item.quantity).toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {cart.length > 0 && (
                    <footer className="p-6 border-t border-zinc-800 bg-zinc-900/50 space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-zinc-400 font-medium">Subtotal</span>
                            <span className="text-2xl font-black neon-text">₹{cartTotal.toFixed(2)}</span>
                        </div>
                        <p className="text-[10px] text-zinc-500 italic text-center uppercase tracking-widest">
                            Taxes and delivery calculated at checkout
                        </p>
                        <button
                            onClick={handleCheckout}
                            disabled={isCheckingOut}
                            className="w-full bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-black font-black py-4 rounded-xl flex items-center justify-center gap-2 transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-wait"
                        >
                            {isCheckingOut ? 'Processing...' : (
                                <>
                                    Complete Order
                                    <ArrowRight size={20} />
                                </>
                            )}
                        </button>
                    </footer>
                )}
            </div>
        </div>
    );
}
