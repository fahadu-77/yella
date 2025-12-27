'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShoppingBag, Loader2, ArrowRight, User, Lock, Mail, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function RegisterPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password }),
            });

            const data = await res.json();

            if (res.ok) {
                router.push('/');
            } else {
                setError(data.error || 'Registration failed');
            }
        } catch (err) {
            setError('An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-black text-white relative flex items-center justify-center p-4">
            {/* Background Accents */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-[var(--primary-glow)] blur-[150px] opacity-[0.05] animate-float" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-[var(--primary-glow)] blur-[150px] opacity-[0.03] animate-float" style={{ animationDelay: '-3s' }} />
            </div>

            <div className="relative z-10 w-full max-w-md space-y-12 animate-reveal">
                <div className="text-center space-y-6">
                    <Link href="/" className="inline-flex items-center gap-3 text-zinc-600 hover:text-white transition-all text-[10px] font-black uppercase tracking-[0.4em] mb-4">
                        <ArrowLeft size={14} /> Back to Entry
                    </Link>
                    <div className="flex justify-center">
                        <div className="w-20 h-20 bg-[var(--primary)] rounded-3xl flex items-center justify-center rotate-12 shadow-[0_0_40px_var(--primary-glow)]">
                            <ShoppingBag size={40} color="#000" strokeWidth={2.5} />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <h1 className="text-5xl font-black uppercase italic tracking-tighter m-0">
                            New <span className="neon-text">Profile</span>
                        </h1>
                        <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.4em]">Register Identity Protocol</p>
                    </div>
                </div>

                <div className="glass-card p-10 border-white/5 relative overflow-hidden group">
                    <div className="absolute bottom-0 right-0 w-1 h-full bg-gradient-to-t from-transparent via-[var(--primary)] to-transparent opacity-20" />

                    <form onSubmit={handleSubmit} className="auth-form">
                        <div className="input-group">
                            <label className="flex items-center gap-2">
                                <User size={12} className="text-[var(--primary)]" />
                                Full Name / Alias
                            </label>
                            <input
                                type="text"
                                required
                                className="input-field"
                                placeholder="Identification Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>

                        <div className="input-group">
                            <label className="flex items-center gap-2">
                                <Mail size={12} className="text-[var(--primary)]" />
                                Contact / Email
                            </label>
                            <input
                                type="email"
                                required
                                className="input-field"
                                placeholder="name@domain.sh"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div className="input-group">
                            <label className="flex items-center gap-2">
                                <Lock size={12} className="text-[var(--primary)]" />
                                Security / Password
                            </label>
                            <input
                                type="password"
                                required
                                className="input-field"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-black uppercase tracking-widest p-4 rounded-xl animate-in fade-in slide-in-from-top-1">
                                [ Registry Failure ]: {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full h-16 group"
                        >
                            {loading ? (
                                <Loader2 className="animate-spin" size={20} />
                            ) : (
                                <>
                                    Establish Identity
                                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>
                </div>

                <p className="text-center text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600">
                    Existing Identity? <Link href="/login" className="text-[var(--primary)] hover:text-white transition-colors">Authorize Session</Link>
                </p>
            </div>
        </main>
    );
}
