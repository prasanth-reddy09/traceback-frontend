"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Search, 
  ShieldCheck, 
  MapPin, 
  Zap, 
  ArrowRight, 
  UserCheck, 
} from 'lucide-react';

export default function LandingPage() {
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const userId = localStorage.getItem("user_id");
    if (userId) {
      router.push("/dashboard");
    }
  }, [router]);

  const handleGuestLogin = () => {
    router.push("/login?guest=true");
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-blue-100 font-sans">
      
      {/* --- NAVIGATION --- */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? "bg-white/90 backdrop-blur-md py-4 shadow-sm" : "bg-transparent py-6"
      }`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <Link href="#nav"className="flex items-center gap-2">
            <div className="bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-200">
              <Search className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-black tracking-tighter uppercase italic">Traceback</span>
          </Link>
          
          <div className="hidden md:flex gap-8 items-center font-bold text-sm">
            <Link href="#features" className="text-slate-500 hover:text-blue-600 transition">How it Works</Link>
            <Link href="/login" className="text-slate-500 hover:text-blue-600 transition">Log In</Link>
            <Link href="/register" className="bg-slate-900 text-white px-6 py-3 rounded-full hover:bg-slate-800 transition shadow-lg active:scale-95">
              Create Account
            </Link>
          </div>
        </div>
      </nav>

      <div  id="nav"  className='hidden'></div>

      {/* --- HERO SECTION --- */}
      <section  className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 opacity-50">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-100 rounded-full blur-[120px]" />
          <div className="absolute bottom-[10%] right-[-10%] w-[30%] h-[30%] bg-indigo-100 rounded-full blur-[100px]" />
        </div>

        <div  className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-700 text-xs font-black uppercase tracking-widest mb-10 shadow-sm border border-blue-100">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            Community Network Live
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black tracking-tight leading-[0.95] mb-8">
            Lost it? <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-indigo-500">Traceback</span> it.
          </h1>
          
          <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto mb-12 leading-relaxed font-medium">
            The community-driven network for reuniting people with their lost belongings. Fast, secure, and built for everyone.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button 
              onClick={handleGuestLogin}
              className="group cursor-pointer bg-blue-600 text-white px-10 py-5 rounded-2xl text-lg font-extrabold hover:bg-blue-700 shadow-2xl shadow-blue-200 transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              <UserCheck className="w-5 h-5" />
              Explore as Guest
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <Link href="/register" className="bg-white border-2 border-slate-100 px-10 py-5 rounded-2xl text-lg font-extrabold hover:border-blue-200 hover:bg-blue-50/30 transition-all active:scale-95 text-center">
              Sign Up Free
            </Link>
          </div>

          {/* --- IMPACT STATS --- */}
          <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-8 border-y border-slate-100 py-16">
            <StatItem 
              label="Items Found" 
              value="1.2k+" 
              description="Successful reunions"
              color="text-blue-600"
            />
            <StatItem 
              label="Active Users" 
              value="4.5k+" 
              description="Community members"
              color="text-indigo-600"
            />
            <StatItem 
              label="Daily Reports" 
              value="85" 
              description="Items listed today"
              color="text-emerald-600"
            />
            <StatItem 
              label="Avg. Response" 
              value="< 2hr" 
              description="Fast communication"
              color="text-amber-500"
            />
          </div>
        </div>
      </section>

      {/* --- FEATURES SECTION --- */}
      <section id="features" className="py-24 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">Reuniting is simple.</h2>
            <p className="text-slate-500 font-bold max-w-xl mx-auto">Our platform uses modern architecture to ensure every lost item finds its way home.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-10">
            <FeatureCard 
              icon={<MapPin className="w-6 h-6 text-blue-600" />}
              title="Location Precision"
              desc="Tag the exact spot where you found or lost an item using integrated geolocation data."
            />
            <FeatureCard 
              icon={<ShieldCheck className="w-6 h-6 text-emerald-600" />}
              title="Secure Claims"
              desc="Our proof-based verification system ensures items go to the right owners, every time."
            />
            <FeatureCard 
              icon={<Zap className="w-6 h-6 text-amber-500" />}
              title="Real-time Alerts"
              desc="Get instant push notifications via WebSockets the second a matching item is reported."
            />
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="py-16 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2 opacity-50 grayscale">
            <Search className="w-4 h-4" />
            <span className="text-lg font-black tracking-tighter uppercase italic">Traceback</span>
          </div>
          <p className="text-slate-400 font-bold text-sm tracking-wide">
            © 2026 TRACEBACK TECHNOLOGIES. ALL RIGHTS RESERVED.
          </p>
          <div className="flex gap-6 text-xs font-black uppercase tracking-widest text-slate-400">
            <span className="hover:text-blue-600 cursor-pointer transition">Privacy</span>
            <span className="hover:text-blue-600 cursor-pointer transition">Terms</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

// --- HELPER COMPONENTS ---

function StatItem({ label, value, description, color }: { label: string, value: string, description: string, color: string }) {
  return (
    <div className="flex flex-col items-center md:items-start transition-all hover:scale-105 duration-300">
      <span className={`text-5xl font-black tracking-tighter ${color}`}>{value}</span>
      <span className="text-sm font-black text-slate-900 mt-2 uppercase tracking-tighter">{label}</span>
      <p className="text-[10px] text-slate-400 mt-1 font-bold uppercase tracking-widest">{description}</p>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200/60 shadow-sm hover:shadow-2xl hover:shadow-blue-100/50 hover:-translate-y-2 transition-all duration-500 group">
      <div className="bg-slate-50 w-16 h-16 flex items-center justify-center rounded-2xl mb-8 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-500">
        {icon}
      </div>
      <h3 className="text-2xl font-black mb-4 tracking-tight">{title}</h3>
      <p className="text-slate-500 leading-relaxed font-medium">{desc}</p>
    </div>
  );
}