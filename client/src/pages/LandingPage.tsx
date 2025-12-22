
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckSquare, Mic, Users, BarChart2, Shield, ArrowRight, Zap, Layout, Globe, Play } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const LandingPage: React.FC = () => {
  const { loginAsDemo } = useAuth();
  const navigate = useNavigate();

  const handleDemo = async () => {
      await loginAsDemo();
      navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-indigo-500/30">
      
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px]"></div>
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150"></div>
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      </div>

      {/* Navbar */}
      <nav className="fixed w-full z-50 bg-slate-950/70 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex justify-between items-center">
          <div className="flex items-center gap-2 text-indigo-400 font-bold text-2xl tracking-tighter">
            <CheckSquare className="w-8 h-8" />
            <span>Taskify</span>
          </div>
          <div className="hidden md:flex gap-8 text-sm font-medium text-slate-300">
            <a href="#features" className="hover:text-white transition hover:shadow-[0_0_20px_rgba(255,255,255,0.3)]">Features</a>
            <a href="#about" className="hover:text-white transition">About</a>
            <a href="#pricing" className="hover:text-white transition">Pricing</a>
          </div>
          <div className="flex gap-4">
            <button onClick={handleDemo} className="hidden md:flex items-center gap-2 px-4 py-2 text-sm font-medium text-emerald-400 hover:text-emerald-300 transition">
                <Play className="w-4 h-4" /> View Demo
            </button>
            <Link to="/auth?mode=signin" className="px-4 py-2 text-slate-300 font-medium hover:text-white transition">Sign In</Link>
            <Link to="/auth?mode=signup" className="bg-indigo-600 text-white px-5 py-2 rounded-full font-medium hover:bg-indigo-500 transition shadow-[0_0_20px_rgba(79,70,229,0.4)] border border-indigo-500/50">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-4 text-center z-10">
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 text-indigo-300 text-xs font-bold uppercase tracking-widest mb-8 border border-white/10 backdrop-blur-md"
        >
            <Zap className="w-3 h-3 text-yellow-400" />
            <span>Next Gen Productivity</span>
        </motion.div>
        
        <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-8xl font-black tracking-tight mb-8 leading-none"
        >
            Command Your <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 animate-pulse">Workflow</span>
        </motion.h1>

        <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed font-light"
        >
            Experience the future of task management. Voice-activated controls, real-time team synchronization, and AI-driven insights.
        </motion.p>

        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row justify-center gap-4"
        >
             <button onClick={handleDemo} className="bg-emerald-600/20 text-emerald-400 border border-emerald-500/50 px-8 py-4 rounded-full text-lg font-bold hover:bg-emerald-600/30 transition backdrop-blur-sm flex items-center justify-center gap-2">
                 <Play className="w-5 h-5" /> Try Live Demo
             </button>
             <Link to="/auth?mode=signup" className="bg-white text-slate-950 px-8 py-4 rounded-full text-lg font-bold hover:bg-indigo-50 transition shadow-[0_0_30px_rgba(255,255,255,0.3)] flex items-center justify-center gap-2 group">
               Start Free <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
             </Link>
        </motion.div>
        <p className="mt-4 text-xs text-slate-500">Demo data is temporary and flushed on refresh.</p>
      </header>

      {/* Dashboard Preview */}
      <section className="px-4 pb-32 relative z-10">
         <motion.div 
           initial={{ opacity: 0, y: 40 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           className="max-w-6xl mx-auto rounded-xl bg-gradient-to-b from-white/10 to-white/5 p-1 shadow-2xl backdrop-blur-sm"
         >
            <div className="bg-slate-900/80 rounded-lg overflow-hidden aspect-video relative group border border-white/5">
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center p-8">
                        <Layout className="w-20 h-20 text-indigo-500 mx-auto mb-4 opacity-50 drop-shadow-[0_0_15px_rgba(99,102,241,0.5)]" />
                        <p className="text-slate-500 font-mono text-sm tracking-widest uppercase">System Interface</p>
                    </div>
                </div>
            </div>
         </motion.div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-32 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Engineered for speed</h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg">Every interaction is optimized for efficiency. </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <FeatureCard 
              icon={Mic} 
              title="Voice Command" 
              desc="Dictate tasks and descriptions naturally. Our AI handles the formatting." 
            />
            <FeatureCard 
              icon={Users} 
              title="Real-time Sync" 
              desc="Collaborate instantly. Team chats and project updates happen live." 
            />
            <FeatureCard 
              icon={BarChart2} 
              title="Visual Analytics" 
              desc="Track momentum with beautiful, data-rich charts and trend lines." 
            />
             <FeatureCard 
              icon={Shield} 
              title="Encrypted Core" 
              desc="Enterprise-grade security standards protecting your proprietary data." 
            />
            <FeatureCard 
              icon={Globe} 
              title="Global Grid" 
              desc="Access your neural workspace from any node on the network." 
            />
            <FeatureCard 
              icon={Zap} 
              title="Automated Ops" 
              desc="Smart triggers handle the mundane, keeping you in the flow state." 
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-500 py-12 border-t border-white/5 relative z-10">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-xs tracking-widest uppercase opacity-50">&copy; 2024 Taskify Systems.</p>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon: Icon, title, desc }: any) => (
  <div className="p-8 rounded-2xl bg-white/5 border border-white/5 hover:border-indigo-500/50 hover:bg-white/10 transition group backdrop-blur-sm">
    <div className="w-12 h-12 bg-indigo-500/20 text-indigo-400 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(99,102,241,0.2)]">
      <Icon className="w-6 h-6" />
    </div>
    <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
    <p className="text-slate-400 leading-relaxed text-sm">{desc}</p>
  </div>
);

export default LandingPage;
