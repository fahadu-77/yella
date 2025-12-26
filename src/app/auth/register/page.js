'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
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
        <main className="min-h-screen flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-sm flex flex-col items-center gap-8">
                <Link href="/" className="text-4xl font-black tracking-tighter hover:neon-text transition-all">
                    YELLA<span className="neon-text">.</span>
                </Link>

                <div className="glass-card w-full">
                    <h2 className="text-2xl font-bold mb-6 text-center">Create Account</h2>

                    <form className="auth-form" onSubmit={handleSubmit}>
                        <div className="input-group">
                            <label>Full Name</label>
                            <input
                                type="text"
                                className="input-field"
                                placeholder="John Doe"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>

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
                            {loading ? 'Creating...' : 'Register'}
                        </button>
                    </form>

                    <p className="auth-link mt-6">
                        Already have an account? <Link href="/auth/login">Login</Link>
                    </p>
                </div>
            </div>
        </main>
    );
}
