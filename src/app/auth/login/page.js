'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
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
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (res.ok) {
                if (data.user.role === 'STAFF' || data.user.role === 'ADMIN') {
                    router.push('/admin');
                } else {
                    router.push('/');
                }
            } else {
                setError(data.error || 'Login failed');
            }
        } catch (err) {
            setError('An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-sm flex flex-col items-center gap-8">
                <Link href="/" className="text-4xl font-black tracking-tighter hover:neon-text transition-all">
                    YELLA<span className="neon-text">.</span>
                </Link>

                <div className="glass-card w-full">
                    <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

                    <form className="auth-form" onSubmit={handleSubmit}>
                        <div className="input-group">
                            <label>Email Address</label>
                            <input
                                type="email"
                                className="input-field"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="input-group">
                            <label>Password</label>
                            <input
                                type="password"
                                className="input-field"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                        <button type="submit" className="btn-primary mt-2" disabled={loading}>
                            {loading ? 'Logging in...' : 'Sign In'}
                        </button>
                    </form>

                    <p className="auth-link mt-6">
                        Don't have an account? <Link href="/auth/register">Sign Up</Link>
                    </p>
                </div>
            </div>
        </main>
    );
}
