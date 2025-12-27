'use client';

import { useState, useEffect } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { useCart } from '@/lib/CartContext';
import CartDrawer from '@/components/CartDrawer';
import ProductCard from '@/components/ProductCard';
import Footer from '@/components/Footer';

export default function ShopPage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');
    const { addToCart } = useCart();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await fetch('/api/products');
                const data = await res.json();
                if (res.ok) {
                    // Add some sample badges/properties to products
                    const enhancedProducts = data.map((p, idx) => ({
                        ...p,
                        isNew: idx % 5 === 0,
                        isPopular: idx % 3 === 0,
                        discount: idx % 4 === 0 ? 10 : idx % 7 === 0 ? 20 : null,
                        stock: Math.floor(Math.random() * 50) + 5
                    }));
                    setProducts(enhancedProducts);
                }
            } catch (err) {
                console.error('Fetch products error:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const categories = ['All', ...new Set(products.map(p => p.category || 'General'))];

    const filteredProducts = products.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.description?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = activeCategory === 'All' || (p.category || 'General') === activeCategory;
        return matchesSearch && matchesCategory;
    });

    const handleAddToCart = (productWithQuantity) => {
        for (let i = 0; i < productWithQuantity.quantity; i++) {
            addToCart(productWithQuantity);
        }
    };

    return (
        <>
            <main className="min-h-screen bg-slate-900">
                <div className="container-custom py-8">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-4xl font-bold text-slate-50 mb-2">Shop</h1>
                        <p className="text-slate-400">Browse our collection of premium products</p>
                    </div>

                    {/* Search & Filters */}
                    <div className="mb-8 space-y-4">
                        {/* Search */}
                        <div className="relative max-w-md">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                            <input
                                type="text"
                                placeholder="Search products..."
                                className="input pl-12"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        {/* Category Filters */}
                        <div className="flex flex-wrap gap-2">
                            {categories.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setActiveCategory(cat)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeCategory === cat
                                            ? 'bg-emerald-500 text-white'
                                            : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                                        }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>

                        {/* Results Count */}
                        <p className="text-sm text-slate-400">
                            {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'} found
                        </p>
                    </div>

                    {/* Product Grid */}
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <Loader2 className="animate-spin text-emerald-500 mb-4" size={40} />
                            <p className="text-slate-400">Loading products...</p>
                        </div>
                    ) : filteredProducts.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredProducts.map((product) => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                    onAddToCart={handleAddToCart}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20">
                            <div className="w-16 h-16 bg-slate-800 rounded-lg mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-slate-50 mb-2">No products found</h3>
                            <p className="text-slate-400">Try adjusting your search or filters</p>
                        </div>
                    )}
                </div>

                <CartDrawer />
            </main>
            <Footer />
        </>
    );
}
