export default function AdminDashboard() {
    return (
        <div className="flex flex-col gap-8">
            <div>
                <h1 className="text-4xl font-bold tracking-tight">Store Dashboard</h1>
                <p className="text-zinc-500 mt-2">Welcome back to Yella. Here's what's happening today.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-card flex flex-col gap-2">
                    <span className="text-zinc-500 text-sm font-medium uppercase tracking-wider">Total Sales</span>
                    <span className="text-3xl font-bold">₹0.00</span>
                    <span className="text-green-500 text-xs font-semibold">+0% from yesterday</span>
                </div>

                <div className="glass-card flex flex-col gap-2">
                    <span className="text-zinc-500 text-sm font-medium uppercase tracking-wider">Online Orders</span>
                    <span className="text-3xl font-bold text-[var(--primary)]">0</span>
                    <span className="text-zinc-500 text-xs font-medium">Pending fulfillment</span>
                </div>

                <div className="glass-card flex flex-col gap-2">
                    <span className="text-zinc-500 text-sm font-medium uppercase tracking-wider">Low Stock items</span>
                    <span className="text-3xl font-bold text-red-500">0</span>
                    <span className="text-zinc-500 text-xs font-medium">Needs immediate restock</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="glass-card h-64 flex items-center justify-center text-zinc-700 italic border-dashed">
                    Sales Analytics (Chart pending)
                </div>
                <div className="glass-card h-64 flex items-center justify-center text-zinc-700 italic border-dashed">
                    Recent Activities (Feed pending)
                </div>
            </div>
        </div>
    );
}
