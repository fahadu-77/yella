'use client';

import { Plus, Minus } from 'lucide-react';
import { useState } from 'react';
import Button from './ui/Button';

export default function ProductCard({ product, onAddToCart }) {
    const [quantity, setQuantity] = useState(0);
    const [showQuickAdd, setShowQuickAdd] = useState(false);

    const handleAddToCart = () => {
        if (quantity > 0) {
            onAddToCart({ ...product, quantity });
            setQuantity(0);
            setShowQuickAdd(false);
        } else {
            setQuantity(1);
            setShowQuickAdd(true);
        }
    };

    const incrementQuantity = () => setQuantity(q => q + 1);
    const decrementQuantity = () => {
        if (quantity > 1) {
            setQuantity(q => q - 1);
        } else {
            setQuantity(0);
            setShowQuickAdd(false);
        }
    };

    // Determine badge
    const getBadge = () => {
        if (product.isNew) return { text: 'New', color: 'bg-emerald-500' };
        if (product.discount) return { text: `${product.discount}% OFF`, color: 'bg-amber-500' };
        if (product.isPopular) return { text: 'Popular', color: 'bg-blue-500' };
        return null;
    };

    const badge = getBadge();
    const finalPrice = product.discount
        ? product.price * (1 - product.discount / 100)
        : product.price;

    return (
        <div
            className="card card-hover p-0 overflow-hidden group"
            onMouseEnter={() => !showQuickAdd && setShowQuickAdd(false)}
        >
            {/* Product Image */}
            <div className="aspect-square bg-slate-700 relative overflow-hidden">
                {product.image ? (
                    <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-700 to-slate-800">
                        <div className="w-20 h-20 bg-slate-600 rounded-lg" />
                    </div>
                )}

                {/* Badge */}
                {badge && (
                    <div className="absolute top-3 left-3">
                        <span className={`${badge.color} text-white text-xs font-bold px-2.5 py-1 rounded-md shadow-lg`}>
                            {badge.text}
                        </span>
                    </div>
                )}

                {/* Stock Indicator */}
                {product.stock !== undefined && (
                    <div className="absolute top-3 right-3">
                        {product.stock > 0 ? (
                            product.stock < 10 && (
                                <span className="bg-amber-500/90 text-white text-xs font-bold px-2.5 py-1 rounded-md shadow-lg">
                                    Only {product.stock} left
                                </span>
                            )
                        ) : (
                            <span className="bg-red-500/90 text-white text-xs font-bold px-2.5 py-1 rounded-md shadow-lg">
                                Out of Stock
                            </span>
                        )}
                    </div>
                )}
            </div>

            {/* Product Info */}
            <div className="p-4 flex flex-col flex-1">
                {/* Category */}
                {product.category && (
                    <span className="text-xs text-slate-500 font-medium uppercase tracking-wide mb-1">
                        {product.category}
                    </span>
                )}

                <h3 className="text-base font-semibold text-slate-50 mb-1 line-clamp-2 min-h-[2.5rem]">
                    {product.name}
                </h3>

                {product.description && (
                    <p className="text-sm text-slate-400 mb-3 line-clamp-2">
                        {product.description}
                    </p>
                )}

                {/* Price & Add to Cart */}
                <div className="flex items-center justify-between mt-auto pt-3 border-t border-slate-700">
                    <div className="flex flex-col">
                        {product.discount ? (
                            <>
                                <span className="text-lg font-bold text-slate-50">
                                    ₹{Math.round(finalPrice).toLocaleString()}
                                </span>
                                <span className="text-xs text-slate-500 line-through">
                                    ₹{product.price.toLocaleString()}
                                </span>
                            </>
                        ) : (
                            <span className="text-lg font-bold text-slate-50">
                                ₹{product.price.toLocaleString()}
                            </span>
                        )}
                    </div>

                    {/* Quick Add Controls */}
                    {showQuickAdd && quantity > 0 ? (
                        <div className="flex items-center gap-2 bg-emerald-500 rounded-lg p-1">
                            <button
                                onClick={decrementQuantity}
                                className="w-7 h-7 flex items-center justify-center text-white hover:bg-emerald-600 rounded transition-colors"
                            >
                                <Minus size={16} />
                            </button>
                            <span className="text-white font-bold min-w-[1.5rem] text-center">
                                {quantity}
                            </span>
                            <button
                                onClick={incrementQuantity}
                                className="w-7 h-7 flex items-center justify-center text-white hover:bg-emerald-600 rounded transition-colors"
                            >
                                <Plus size={16} />
                            </button>
                        </div>
                    ) : (
                        <Button
                            variant="primary"
                            size="sm"
                            onClick={handleAddToCart}
                            disabled={product.stock === 0}
                            className="gap-1"
                        >
                            <Plus size={16} />
                            Add
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}
