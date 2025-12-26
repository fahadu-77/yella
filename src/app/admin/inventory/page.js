'use client';

import { useState, useEffect } from 'react';
import { Plus, Search, Package, Edit, Trash2, AlertTriangle } from 'lucide-react';

export default function InventoryPage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        stock: '',
        category: '',
    });

    const fetchProducts = async () => {
        const res = await fetch('/api/products');
        const data = await res.json();
        if (res.ok) setProducts(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        const res = await fetch('/api/products', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        });

        if (res.ok) {
            setIsModalOpen(false);
            setFormData({ name: '', description: '', price: '', stock: '', category: '' });
            fetchProducts();
        }
    };

    if (loading) return <div className="text-zinc-500">Loading inventory...</div>;

    return (
        <div className="flex flex-col gap-8">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-bold">Inventory</h1>
                    <p className="text-zinc-500 mt-2">Manage your stock, prices, and product details.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="btn-primary"
                >
                    <Plus size={20} />
                    Add Product
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="glass-card flex flex-col gap-1">
                    <span className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Total Items</span>
                    <span className="text-3xl font-bold">{products.length}</span>
                </div>
                <div className="glass-card flex flex-col gap-1">
                    <span className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Out of Stock</span>
                    <span className="text-3xl font-bold text-red-500">
                        {products.filter(p => p.stock === 0).length}
                    </span>
                </div>
                <div className="glass-card flex flex-col gap-1">
                    <span className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Low Stock</span>
                    <span className="text-3xl font-bold text-yellow-500">
                        {products.filter(p => p.stock > 0 && p.stock < 10).length}
                    </span>
                </div>
                <div className="glass-card flex flex-col gap-1">
                    <span className="text-zinc-500 text-xs font-bold uppercase tracking-widest">In Stock</span>
                    <span className="text-3xl font-bold text-green-500">
                        {products.filter(p => p.stock >= 10).length}
                    </span>
                </div>
            </div>

            <div className="glass-card !p-0 overflow-hidden">
                <div className="p-4 border-b border-zinc-900 flex items-center gap-4 bg-zinc-950/50">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" size={18} />
                        <input
                            type="text"
                            placeholder="Search by name, category, or SKU..."
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-[var(--primary)]"
                        />
                    </div>
                </div>
                <table className="w-full text-left">
                    <thead className="bg-zinc-900/50 text-zinc-400 text-xs font-bold uppercase tracking-wider">
                        <tr>
                            <th className="p-4">Product Name</th>
                            <th className="p-4">Category</th>
                            <th className="p-4">Price</th>
                            <th className="p-4">Stock</th>
                            <th className="p-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product) => (
                            <tr key={product.id} className="border-b border-zinc-900 hover:bg-zinc-950/50 transition-colors">
                                <td className="p-4">
                                    <div className="flex flex-col">
                                        <span className="font-semibold">{product.name}</span>
                                        <span className="text-xs text-zinc-500 truncate max-w-[200px]">{product.description || 'No description'}</span>
                                    </div>
                                </td>
                                <td className="p-4 italic text-zinc-400">{product.category || 'General'}</td>
                                <td className="p-4 font-mono font-bold">₹{product.price.toFixed(2)}</td>
                                <td className="p-4">
                                    <div className="flex items-center gap-2">
                                        <span className={`w-2 h-2 rounded-full ${product.stock === 0 ? 'bg-red-500 shadow-[0_0_8px_red]' :
                                                product.stock < 10 ? 'bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.5)]' :
                                                    'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]'
                                            }`} />
                                        <span className="font-medium">{product.stock}</span>
                                    </div>
                                </td>
                                <td className="p-4 text-right flex justify-end gap-2">
                                    <button className="p-2 hover:bg-zinc-900 rounded-lg text-zinc-400 hover:text-white transition-colors">
                                        <Edit size={18} />
                                    </button>
                                    <button className="p-2 hover:bg-red-900/20 rounded-lg text-zinc-600 hover:text-red-500 transition-colors">
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {products.length === 0 && (
                            <tr>
                                <td colSpan="5" className="p-20 text-center text-zinc-700">
                                    <div className="flex flex-col items-center gap-4">
                                        <Package size={48} />
                                        <p>No products in inventory yet. Add your first item!</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Add Product Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="glass-card w-full max-w-lg animate-in fade-in zoom-in duration-200">
                        <h2 className="text-2xl font-bold mb-6">Add New Product</h2>
                        <form onSubmit={handleCreate} className="flex flex-col gap-4">
                            <div className="input-group">
                                <label>Name</label>
                                <input
                                    type="text"
                                    className="input-field"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="input-group">
                                <label>Description</label>
                                <textarea
                                    className="input-field min-h-[100px]"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="input-group">
                                    <label>Price (₹)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        className="input-field"
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="input-group">
                                    <label>Initial Stock</label>
                                    <input
                                        type="number"
                                        className="input-field"
                                        value={formData.stock}
                                        onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="input-group">
                                <label>Category</label>
                                <input
                                    type="text"
                                    className="input-field"
                                    placeholder="e.g., Dairy, Bakery, Electronics"
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                />
                            </div>

                            <div className="flex gap-4 mt-4">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 p-3 rounded-lg border border-zinc-800 hover:bg-zinc-900 transition-colors">
                                    Cancel
                                </button>
                                <button type="submit" className="flex-1 btn-primary">
                                    Save Product
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
