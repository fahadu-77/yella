import Link from 'next/link';
import { ArrowRight, Zap, Shield, Truck } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800">
        {/* Background Decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl" />
        </div>

        <div className="container-custom relative">
          <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] text-center py-20">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-sm font-medium mb-8 animate-fade-in">
              <Zap size={16} />
              <span>Fast Delivery Across Karnataka</span>
            </div>

            {/* Heading */}
            <h1 className="text-5xl md:text-7xl font-bold text-slate-50 mb-6 animate-slide-up max-w-4xl">
              Everything You Need,
              <span className="text-emerald-400"> Delivered Fresh</span>
            </h1>

            {/* Description */}
            <p className="text-xl text-slate-400 mb-12 max-w-2xl animate-slide-up" style={{ animationDelay: '0.1s' }}>
              From groceries to essentials, get premium quality products delivered to your doorstep in Karnataka.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <Link href="/shop">
                <Button variant="primary" size="lg" className="gap-2">
                  Start Shopping
                  <ArrowRight size={20} />
                </Button>
              </Link>
              <Link href="/account">
                <Button variant="secondary" size="lg">
                  My Account
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-slate-800/50">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="card card-hover text-center">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Truck className="text-emerald-400" size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-50 mb-2">Fast Delivery</h3>
              <p className="text-slate-400">
                Get your orders delivered quickly across Karnataka with our reliable delivery network.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="card card-hover text-center">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Shield className="text-emerald-400" size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-50 mb-2">Quality Assured</h3>
              <p className="text-slate-400">
                Every product is carefully selected and quality-checked before delivery.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="card card-hover text-center">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Zap className="text-emerald-400" size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-50 mb-2">Easy Ordering</h3>
              <p className="text-slate-400">
                Simple, intuitive interface makes shopping a breeze. Order in just a few clicks.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-b from-slate-800/50 to-slate-900">
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
    </main>
  );
}
