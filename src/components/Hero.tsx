import React from 'react';
import { Gem, ArrowRight, ShieldCheck, Zap, Headphones, CheckCircle2 } from 'lucide-react';

interface HeroProps {
  onGoToDiamonds: () => void;
  onGoToServices: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onGoToDiamonds, onGoToServices }) => {
  return (
    <section className="relative overflow-hidden pt-8 pb-16 md:pt-12 md:pb-24 border-b border-cyan-500/10">
      {/* Background Neon Glows and Grid */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute top-1/3 right-10 w-[350px] h-[350px] bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>
      
      {/* Cyber Grid Lines */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(to right, #00f0ff 1px, transparent 1px), linear-gradient(to bottom, #00f0ff 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      ></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Text & CTAs */}
          <div className="lg:col-span-7 text-center lg:text-left space-y-6">
            
            {/* Tagline Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-400 text-xs font-bold uppercase tracking-widest shadow-md shadow-cyan-950">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
              RECARGA OFICIAL E INSTANTÂNEA FREE FIRE
            </div>

            {/* Main Title */}
            <h1 className="text-4xl sm:text-5xl xl:text-6xl font-black font-display tracking-tight text-white leading-none">
              LOJA OFICIAL <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-300 drop-shadow-[0_0_20px_rgba(6,182,212,0.5)]">
                13SHIBIRU
              </span>
            </h1>

            {/* Description */}
            <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
              A plataforma número #1 em Angola para recargas de <strong className="text-white font-semibold">Diamantes Free Fire</strong> com bônus exclusivos, Passes Booyah, Skins raras, Contas verificadas e a famosa <strong className="text-cyan-400 font-semibold">Sensibilidade 13SHIBIRU VIP</strong>.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                id="hero-buy-diamonds-btn"
                onClick={onGoToDiamonds}
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-black font-display tracking-wider text-base uppercase flex items-center justify-center gap-3 shadow-xl shadow-cyan-500/30 hover:shadow-cyan-500/50 hover:scale-[1.02] transition-all active:scale-95 cursor-pointer"
              >
                <Gem className="w-5 h-5 text-black" />
                <span>Recarregar Diamantes</span>
                <ArrowRight className="w-5 h-5 text-black" />
              </button>

              <button
                id="hero-view-services-btn"
                onClick={onGoToServices}
                className="w-full sm:w-auto px-7 py-4 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 hover:text-white font-bold tracking-wider text-sm border border-slate-700/80 hover:border-cyan-500/50 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <span>Explorar Serviços</span>
              </button>
            </div>

            {/* Trust Badges */}
            <div className="pt-6 grid grid-cols-2 sm:grid-cols-3 gap-3 border-t border-slate-800/80">
              <div className="flex items-center gap-2.5 text-left">
                <div className="p-2 rounded-lg bg-cyan-950/60 border border-cyan-800/50 text-cyan-400 shrink-0">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white leading-tight">Entrega Rápida</p>
                  <p className="text-[11px] text-slate-400">Direto no seu ID</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 text-left">
                <div className="p-2 rounded-lg bg-cyan-950/60 border border-cyan-800/50 text-cyan-400 shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white leading-tight">100% Seguro</p>
                  <p className="text-[11px] text-slate-400">Zero risco de ban</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 text-left col-span-2 sm:col-span-1">
                <div className="p-2 rounded-lg bg-cyan-950/60 border border-cyan-800/50 text-cyan-400 shrink-0">
                  <Headphones className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white leading-tight">Suporte 24/7</p>
                  <p className="text-[11px] text-slate-400">WhatsApp Angola</p>
                </div>
              </div>
            </div>

          </div>

          {/* Right Hero Visual Art (Using user-provided image) */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative group w-full max-w-md">
              
              {/* Outer Glowing Rings */}
              <div className="absolute -inset-2 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-3xl blur-xl opacity-50 group-hover:opacity-80 transition duration-700"></div>
              
              {/* Image Frame Card */}
              <div className="relative rounded-2xl overflow-hidden bg-gradient-to-b from-[#0e172e] to-[#050814] border-2 border-cyan-500/40 p-3 shadow-2xl shadow-cyan-950/80">
                <div className="relative aspect-square rounded-xl overflow-hidden bg-black flex items-center justify-center">
                  <img 
                    src="/images/shibiru_logo.jpg" 
                    alt="13SHIBIRU Free Fire Oficial" 
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  
                  {/* Subtle Electric Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none"></div>

                  {/* Corner Watermark Badge */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between bg-black/85 backdrop-blur-md px-3.5 py-2 rounded-lg border border-cyan-500/30">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                      <span className="text-xs font-bold text-white tracking-wide">SISTEMA ONLINE</span>
                    </div>
                    <span className="text-[11px] font-tech font-bold text-cyan-400">
                      ID FREE FIRE AUTOMÁTICO
                    </span>
                  </div>
                </div>

                {/* Additional caption card */}
                <div className="mt-3 px-2 py-1 flex items-center justify-between text-xs text-slate-400">
                  <span className="flex items-center gap-1 text-slate-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                    Identidade Visual Oficial
                  </span>
                  <span className="font-tech text-cyan-300 font-semibold">
                    13SHIBIRU STORE
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
