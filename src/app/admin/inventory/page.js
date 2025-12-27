'use client';

import { useState, useEffect } from 'react';
import { Plus, Search, Package, Edit, Trash2, X, Loader2 } from 'lucide-react';

export default function InventoryPage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [formData, setFormData] = useState({ name: '', description: '', price: '', stock: '', category: '', image: '' });

    const fetchProducts = async () => {
        try {
            const res = await fetch('/api/products');
            const data = await res.json();
            if (res.ok) setProducts(data);
        } catch (err) { } finally { setLoading(false); }
    };

    useEffect(() => { fetchProducts(); }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        const res = await fetch('/api/products', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        });
        if (res.ok) {
            setIsModalOpen(false);
            setFormData({ name: '', description: '', price: '', stock: '', category: '', image: '' });
            fetchProducts();
        } else {
            const data = await res.json();
            alert(`Error: ${data.error}`);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Delete this item?')) return;
        try {
            if ((await fetch(`/api/products/${id}`, { method: 'DELETE' })).ok) fetchProducts();
        } catch (err) { }
    };

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) return (
        <div className="h-full flex flex-col items-center justify-center p-20 gap-4">
            <Loader2 className="animate-spin text-[var(--primary)]" size={40} />
            <p className="text-zinc-500">Scanning manifest...</p>
        </div>
    );

    return (
        <div className="flex flex-col gap-8">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-black uppercase italic tracking-tighter">Vault <span className="neon-text">Control</span></h1>
                    <p className="text-zinc-500 mt-2 font-medium">Manage your elite stock and pricing.</p>
                </div>
                <button onClick={() => setIsModalOpen(true)} className="bg-[var(--primary)] text-black px-6 py-3 rounded-xl font-black uppercase text-xs flex items-center gap-2 hover:bg-white transition-all active:scale-95 shadow-xl">
                    <Plus size={18} /> Add Entry
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { label: 'Inventory Size', value: products.length, color: 'text-white' },
                    { label: 'Out of Stock', value: products.filter(p => !p.stock).length, color: 'text-red-500' },
                    { label: 'Low Reserves', value: products.filter(p => p.stock > 0 && p.stock < 10).length, color: 'text-yellow-500' },
                    { label: 'Active Keys', value: products.filter(p => p.stock >= 10).length, color: 'text-green-500' },
                ].map((stat, i) => (
                    <div key={i} className="glass-card flex flex-col gap-1 border border-zinc-900 border-l-2 border-l-[var(--primary)]">
                        <span className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">{stat.label}</span>
                        <span className={`text-3xl font-black tracking-tighter ${stat.color}`}>{stat.value}</span>
                    </div>
                ))}
            </div>

            <div className="glass-card !p-0 overflow-hidden border border-zinc-900 rounded-[2rem]">
                <div className="p-4 border-b border-zinc-900 bg-zinc-950/30">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={18} />
                        <input
                            type="text"
                            placeholder="Search Vault..."
                            className="w-full bg-zinc-900/50 border border-zinc-800 rounded-2xl py-3 pl-12 text-sm focus:outline-none focus:border-[var(--primary)] transition-all"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-zinc-900/50 text-zinc-600 text-[10px] font-black uppercase tracking-widest border-b border-zinc-900">
                            <tr>
                                <th className="p-6">Product</th>
                                <th className="p-6">Category</th>
                                <th className="p-6 text-right">Unit Price</th>
                                <th className="p-6">Stock Status</th>
                                <th className="p-6 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-900">
                            {filteredProducts.map((product) => (
                                <tr key={product.id} className="hover:bg-zinc-900/40 transition-colors group">
                                    <td className="p-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800">
                                                <img src={product.image} className="w-full h-full object-cover" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="font-black group-hover:neon-text transition-colors">{product.name}</span>
                                                <span className="text-[10px] font-bold text-zinc-600 tracking-tight uppercase">#{product.id.slice(-6)}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-6">
                                        <span className="px-3 py-1 bg-zinc-900 rounded-lg text-[10px] font-black tracking-tighter uppercase text-zinc-500">
                                            {product.category || 'General'}
                                        </span>
                                    </td>
                                    <td className="p-6 text-right font-black text-[var(--primary)]">₹{product.price.toFixed(2)}</td>
                                    <td className="p-6">
                                        <div className="flex flex-col gap-2">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-1.5 h-1.5 rounded-full ${!product.stock ? 'bg-red-500' : product.stock < 10 ? 'bg-yellow-500' : 'bg-green-500'}`} />
                                                <span className="font-black text-xs">{product.stock} units</span>
                                            </div>
                                            <div className="w-24 h-1 bg-zinc-900 rounded-full overflow-hidden">
                                                <div className={`h-full ${!product.stock ? 'bg-red-500' : product.stock < 10 ? 'bg-yellow-500' : 'bg-green-500'}`} style={{ width: `${Math.min(100, product.stock)}%` }} />
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-6 text-right">
                                        <div className="flex justify-end gap-1">
                                            <button className="p-2 hover:bg-zinc-800 rounded-xl text-zinc-600 hover:text-white transition-all"><Edit size={16} /></button>
                                            <button onClick={() => handleDelete(product.id)} className="p-2 hover:bg-red-900/20 rounded-xl text-zinc-700 hover:text-red-500 transition-all"><Trash2 size={16} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {!filteredProducts.length && <div className="p-20 text-center opacity-10 font-black uppercase text-4xl italic">No Results</div>}
                </div>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 z-50">
                    <div className="bg-zinc-950 border border-zinc-900 p-10 rounded-[3rem] w-full max-w-xl shadow-2xl animate-in zoom-in duration-300">
                        <div className="flex justify-between items-center mb-10">
                            <h2 className="text-4xl font-black italic uppercase tracking-tighter">New <span className="neon-text">Asset</span></h2>
                            <button onClick={() => setIsModalOpen(false)} className="p-3 bg-zinc-900 rounded-full hover:bg-zinc-800 transition-colors"><X size={24} /></button>
                        </div>
                        <form onSubmit={handleCreate} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Asset Identity</label>
                                <input type="text" className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl py-4 px-6 focus:border-[var(--primary)] transition-all font-bold" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Unit Price</label>
                                    <input type="number" step="0.01" className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl py-4 px-6 focus:border-[var(--primary)] transition-all font-bold" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} required />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Stock Count</label>
                                    <input type="number" className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl py-4 px-6 focus:border-[var(--primary)] transition-all font-bold" value={formData.stock} onChange={(e) => setFormData({ ...formData, stock: e.target.value })} required />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Visual Link</label>
                                <input type="text" className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl py-4 px-6 focus:border-[var(--primary)] transition-all font-bold" value={formData.image} onChange={(e) => setFormData({ ...formData, image: e.target.value })} />
                            </div>
                            <button type="submit" className="w-full bg-white text-black font-black py-5 rounded-2xl text-lg hover:bg-[var(--primary)] transition-all transform active:scale-95 shadow-2xl">Confirm Addition</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
