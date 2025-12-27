import Link from 'next/link';
import { ArrowRight, Zap, Shield, Truck, Clock, Star, Package } from 'lucide-react';
import Button from '@/components/ui/Button';
import CategoryCard from '@/components/CategoryCard';
import Footer from '@/components/Footer';

export default function Home() {
  const categories = [
    { name: 'Fruits & Vegetables', icon: '🥬', href: '/shop?category=Fruits' },
    { name: 'Dairy & Eggs', icon: '🥛', href: '/shop?category=Dairy' },
    { name: 'Snacks', icon: '🍿', href: '/shop?category=Snacks' },
    { name: 'Beverages', icon: '🥤', href: '/shop?category=Beverages' },
    { name: 'Bakery', icon: '🍞', href: '/shop?category=Bakery' },
    { name: 'Personal Care', icon: '🧴', href: '/shop?category=Personal Care' },
  ];

  return (
    <main className="min-h-screen">
      {/* Hero Banner */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-600 to-emerald-700">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }} />
        </div>

        <div className="container-custom relative py-16 md:py-24">
          <div className="max-w-3xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium mb-6">
              <Zap size={16} />
              <span>Free delivery on orders above ₹500</span>
            </div>

            {/* Heading */}
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Fresh Groceries
              <br />
              <span className="text-emerald-100">Delivered to Your Door</span>
            </h1>

            {/* Description */}
            <p className="text-xl text-emerald-50 mb-8 max-w-2xl">
              Shop from a wide range of fresh produce, dairy, snacks, and daily essentials. Fast delivery across Karnataka.
            </p>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/shop">
                <Button variant="primary" size="lg" className="bg-white text-emerald-600 hover:bg-emerald-50 gap-2">
                  Start Shopping
                  <ArrowRight size={20} />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="bg-slate-800/30 border-y border-slate-700">
        <div className="container-custom py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Truck className="text-emerald-400" size={20} />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-50">Free Delivery</p>
                <p className="text-xs text-slate-400">On orders above ₹500</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Clock className="text-emerald-400" size={20} />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-50">Fast Delivery</p>
                <p className="text-xs text-slate-400">Within 2 hours</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Shield className="text-emerald-400" size={20} />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-50">Quality Assured</p>
                <p className="text-xs text-slate-400">100% fresh products</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Star className="text-emerald-400" size={20} />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-50">Best Prices</p>
                <p className="text-xs text-slate-400">Guaranteed lowest</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-slate-900">
        <div className="container-custom">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-slate-50 mb-2">Shop by Category</h2>
            <p className="text-slate-400">Browse our wide range of products</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category) => (
              <CategoryCard key={category.name} {...category} />
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-slate-800/50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-50 mb-2">Why Choose Yella?</h2>
            <p className="text-slate-400">Your trusted grocery partner</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card text-center">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Package className="text-emerald-400" size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-50 mb-2">Wide Selection</h3>
              <p className="text-slate-400">
                Over 5,000+ products across all categories to choose from.
              </p>
            </div>

            <div className="card text-center">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Shield className="text-emerald-400" size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-50 mb-2">Quality Guaranteed</h3>
              <p className="text-slate-400">
                Every product is carefully selected and quality-checked before delivery.
              </p>
            </div>

            <div className="card text-center">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Truck className="text-emerald-400" size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-50 mb-2">Fast Delivery</h3>
              <p className="text-slate-400">
                Get your orders delivered quickly across Karnataka with our reliable network.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-b from-slate-900 to-slate-800">
        <div className="container-custom text-center">
          <h2 className="text-4xl font-bold text-slate-50 mb-4">
            Ready to get started?
          </h2>
          <p className="text-xl text-slate-400 mb-8 max-w-2xl mx-auto">
            Browse our wide selection of products and experience the convenience of Yella.
          </p>
          <Link href="/shop">
            <Button variant="primary" size="lg" className="gap-2">
              Browse Products
              <ArrowRight size={20} />
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
