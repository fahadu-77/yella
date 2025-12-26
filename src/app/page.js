import { ShoppingBag } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="flex flex-col items-center gap-8 animate-in fade-in zoom-in duration-700">
        <div className="w-24 h-24 bg-[var(--primary)] rounded-3xl flex items-center justify-center rotate-12 hover:rotate-0 transition-transform duration-500 shadow-[0_0_50px_var(--primary-glow)]">
          <ShoppingBag size={48} color="#000" strokeWidth={2.5} />
        </div>
        
        <div className="text-center">
          <h1 className="text-8xl md:text-9xl font-black mb-2 tracking-tighter">
            YELLA<span className="neon-text">.</span>
          </h1>
          <p className="text-[var(--foreground-muted)] text-xl md:text-2xl font-light tracking-widest uppercase">
            எಲ್ಲಾ • EVERYTHING
          </p>
        </div>

        <div className="mt-12 flex flex-col items-center gap-4">
          <button className="btn-primary">
            Start Shopping
          </button>
          <div className="text-[var(--foreground-muted)] text-sm font-medium">
            Karnataka's Premium Everything App
          </div>
        </div>
      </div>

      {/* Background Decorative Gradients */}
      <div className="fixed top-[-10%] right-[-10%] w-[500px] h-[500px] bg-[var(--primary-glow)] blur-[150px] pointer-events-none opacity-20" />
      <div className="fixed bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-[var(--primary-glow)] blur-[150px] pointer-events-none opacity-20" />
    </main>
  );
}
