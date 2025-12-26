import Link from 'next/link';

export default function AdminLayout({ children }) {
    return (
        <div className="flex min-h-screen bg-black text-white">
            {/* Sidebar */}
            <aside className="w-64 border-r border-zinc-800 p-6 flex flex-col gap-8">
                <Link href="/" className="text-2xl font-black tracking-tighter hover:neon-text transition-all">
                    YELLA<span className="neon-text">.</span>
                </Link>

                <nav className="flex flex-col gap-2">
                    <Link href="/admin" className="p-3 rounded-lg hover:bg-zinc-900 transition-colors font-medium">
                        Dashboard
                    </Link>
                    <Link href="/admin/pos" className="p-3 rounded-lg hover:bg-zinc-900 transition-colors font-medium">
                        Billing (POS)
                    </Link>
                    <Link href="/admin/inventory" className="p-3 rounded-lg hover:bg-zinc-900 transition-colors font-medium">
                        Inventory
                    </Link>
                    <Link href="/admin/orders" className="p-3 rounded-lg hover:bg-zinc-900 transition-colors font-medium text-zinc-400">
                        Online Orders
                    </Link>
                    <Link href="/admin/users" className="p-3 rounded-lg hover:bg-zinc-900 transition-colors font-medium text-[var(--primary)]">
                        User Management
                    </Link>
                </nav>

                <div className="mt-auto">
                    <button className="text-zinc-500 hover:text-white text-sm">Logout</button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-10 overflow-auto">
                {children}
            </main>
        </div>
    );
}
