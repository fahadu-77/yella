import { ShoppingBag, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden w-full">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-[var(--primary-glow)] blur-[120px] opacity-20 animate-float" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-[var(--primary-glow)] blur-[120px] opacity-10 animate-float" style={{ animationDelay: '-2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_0%,transparent_70%)]" />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-16 max-w-5xl mx-auto text-center animate-reveal">
        {/* Brand Icon */}
        <div className="group relative">
          <div className="absolute inset-0 bg-[var(--primary)] blur-3xl opacity-20 group-hover:opacity-40 transition-opacity duration-1000" />
          <div className="w-28 h-28 bg-[var(--primary)] rounded-[2.5rem] flex items-center justify-center rotate-12 group-hover:rotate-0 transition-all duration-700 shadow-[0_0_80px_var(--primary-glow)] relative z-10">
            <ShoppingBag size={56} color="#000" strokeWidth={2.5} />
          </div>
        </div>

        {/* Hero Text */}
        <div className="space-y-6">
          <h1 className="text-8xl md:text-[13rem] font-black tracking-tighter leading-none m-0">
            YELLA<span className="neon-text">.</span>
          </h1>
          <div className="flex flex-col items-center gap-1">
            <p className="text-[var(--foreground-muted)] text-xl md:text-2xl font-light tracking-[0.4em] uppercase">
              ಎಲ್ಲಾ • EVERYTHING
            </p>
            <div className="h-px w-24 bg-gradient-to-r from-transparent via-[var(--primary)] to-transparent opacity-50 mt-4" />
          </div>
        </div>

        {/* CTA Section */}
        <div className="flex flex-col items-center gap-8 w-full max-w-md">
          <Link href="/shop" className="btn-primary w-full md:w-auto h-16 px-12 group">
            Start Shopping
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Link>

          <div className="flex flex-col items-center gap-6">
            <p className="text-[var(--foreground-muted)] text-xs font-bold uppercase tracking-[0.3em] opacity-80 backdrop-blur-sm px-4 py-2 border border-white/5 rounded-full">
              Karnataka's Premium Everything App
            </p>

            <Link href="/account" className="text-zinc-500 hover:text-[var(--primary)] text-[10px] font-black uppercase tracking-[0.4em] transition-all hover:tracking-[0.6em] py-2">
              Identify / Manage Hub
            </Link>
          </div>
        </div>
      </div>

      {/* Subtle Bottom Accent */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 text-[10px] font-black text-white/10 uppercase tracking-[1em] pointer-events-none select-none">
        Obsidian Standard © 2025
      </div>
    </main>
  );
}
