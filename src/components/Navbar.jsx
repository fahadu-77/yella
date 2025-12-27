'use client';

import Link from 'next/link';
import { ShoppingBag, User, LogOut } from 'lucide-react';
import { useCart } from '@/lib/CartContext';
import { useRouter } from 'next/navigation';

export default function Navbar() {
    const { cartCount, setIsCartOpen } = useCart();
    const router = useRouter();

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        router.push('/login');
    };

    return (
        <nav className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-sm border-b border-slate-800">
            <div className="container-custom">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center group-hover:bg-emerald-400 transition-colors">
                            <span className="text-slate-900 font-bold text-lg">Y</span>
                        </div>
                        <span className="text-xl font-bold text-slate-50">Yella</span>
                    </Link>

                    {/* Navigation Links */}
                    <div className="hidden md:flex items-center gap-6">
                        <Link href="/shop" className="text-slate-300 hover:text-emerald-400 transition-colors font-medium">
                            Shop
                        </Link>
                        <Link href="/account" className="text-slate-300 hover:text-emerald-400 transition-colors font-medium">
                            Account
                        </Link>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setIsCartOpen(true)}
                            className="relative p-2 text-slate-300 hover:text-emerald-400 transition-colors"
                        >
                            <ShoppingBag size={22} />
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 text-slate-900 text-xs font-bold rounded-full flex items-center justify-center">
                                    {cartCount}
                                </span>
                            )}
                        </button>

                        <Link href="/account" className="p-2 text-slate-300 hover:text-emerald-400 transition-colors">
                            <User size={22} />
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}
