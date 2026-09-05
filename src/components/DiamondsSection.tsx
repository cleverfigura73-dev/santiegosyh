import React from 'react';
import { Gem, Sparkles, Zap, ShoppingCart, Award } from 'lucide-react';
import { DiamondPackage } from '../types';

interface DiamondsSectionProps {
  packages: DiamondPackage[];
  onSelectPackage: (pkg: DiamondPackage) => void;
}

export const DiamondsSection: React.FC<DiamondsSectionProps> = ({
  packages,
  onSelectPackage,
}) => {
  // Sort packages by sort_order
  const sortedPackages = [...packages].sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));

  return (
    <section id="diamonds-section" className="py-14 sm:py-20 relative">
      {/* Ambient background highlight */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-cyan-600/5 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/70 border border-cyan-500/30 text-cyan-400 text-xs font-bold uppercase tracking-wider">
            <Gem className="w-3.5 h-3.5 text-cyan-400" />
            TABELA DE PREÇOS OFICIAL
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-white tracking-tight">
            PACOTES DE <span className="text-cyan-400 drop-shadow-[0_0_12px_rgba(6,182,212,0.6)]">DIAMANTES FF</span>
          </h2>
          <p className="text-slate-300 text-sm sm:text-base">
            Selecione o pacote desejado. Bônus em diamantes aplicados diretamente na entrega via ID do jogador.
          </p>
        </div>

        {/* Packages Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {sortedPackages.map(pkg => {
            const isHighlighted = pkg.is_popular;

            return (
              <div
                key={pkg.id}
                className={`relative group rounded-2xl p-6 transition-all duration-300 flex flex-col justify-between ${
                  isHighlighted
                    ? 'bg-gradient-to-b from-[#0a1832] to-[#060c1c] border-2 border-cyan-400 shadow-[0_0_30px_rgba(6,182,212,0.25)] scale-[1.02]'
                    : 'bg-gradient-to-b from-[#070e1e] to-[#040813] border border-slate-800 hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-950/40'
                }`}
              >
                {/* Popular / Special Badge */}
                {pkg.badge && (
                  <div className="absolute -top-3 right-5">
                    <span className={`px-3 py-0.5 rounded-full text-[10px] font-black tracking-wider uppercase shadow-md flex items-center gap-1 ${
                      isHighlighted
                        ? 'bg-cyan-400 text-black shadow-cyan-400/40'
                        : 'bg-slate-800 text-cyan-300 border border-cyan-500/30'
                    }`}>
                      <Sparkles className="w-3 h-3" />
                      {pkg.badge}
                    </span>
                  </div>
                )}

                <div>
                  {/* Top diamond icon & Title */}
                  <div className="flex items-start gap-4 mb-4">
                    <div className={`p-3.5 rounded-xl shrink-0 flex items-center justify-center ${
                      isHighlighted 
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 shadow-inner' 
                        : 'bg-slate-900 text-cyan-400 border border-slate-800'
                    }`}>
                      <Gem className="w-7 h-7 animate-pulse" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl font-bold font-display text-white group-hover:text-cyan-400 transition-colors">
                        {pkg.name}
                      </h3>
                      {pkg.bonus_count > 0 && (
                        <p className="text-xs text-emerald-400 font-semibold flex items-center gap-1 mt-0.5">
                          <Zap className="w-3 h-3 fill-emerald-400" />
                          + {pkg.bonus_count} Diamantes de Bônus Grátis
                        </p>
                      )}
                      {pkg.diamonds_count === 0 && (
                        <p className="text-xs text-blue-400 font-semibold mt-0.5">
                          Ativação Oficial da Temporada
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Price Tag in KZ */}
                  <div className="my-5 p-3.5 rounded-xl bg-black/40 border border-slate-800/80 flex items-baseline justify-between">
                    <span className="text-xs text-slate-400 font-medium">Preço à vista:</span>
                    <div className="text-right">
                      <span className="text-2xl sm:text-3xl font-black font-display text-white tracking-tight">
                        {pkg.price_kz.toLocaleString('pt-AO')}
                      </span>
                      <span className="text-xs font-bold text-cyan-400 ml-1">KZ</span>
                    </div>
                  </div>

                  {/* Features list */}
                  <div className="space-y-2 mb-6 text-xs text-slate-300">
                    <div className="flex items-center gap-2">
                      <Award className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span>Entrega rápida no ID do Free Fire</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Award className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span>Pagamento via Multicaixa Express / PayPay / IBAN</span>
                    </div>
                  </div>
                </div>

                {/* Buy Button */}
                <button
                  id={`buy-pkg-${pkg.id}-btn`}
                  onClick={() => onSelectPackage(pkg)}
                  className={`w-full py-3.5 rounded-xl font-extrabold text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95 cursor-pointer ${
                    isHighlighted
                      ? 'bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-black shadow-cyan-400/30'
                      : 'bg-slate-900 hover:bg-cyan-950 text-cyan-400 border border-cyan-500/40 hover:border-cyan-400'
                  }`}
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>Comprar Agora</span>
                </button>

              </div>
            );
          })}
        </div>

        {/* Informational banner underneath */}
        <div className="mt-12 p-5 rounded-2xl bg-gradient-to-r from-blue-950/40 via-cyan-950/30 to-blue-950/40 border border-cyan-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <h4 className="font-bold text-white text-base">Não encontrou a quantidade que precisa?</h4>
            <p className="text-slate-300 text-xs sm:text-sm mt-0.5">
              Temos recargas personalizadas para guildas, campeonatos e revendedores.
            </p>
          </div>
          <a
            href="https://wa.me/244952778374?text=Ol%C3%A1%20suporte%2013SHIBIRU,%20gostaria%20de%20um%20pacote%20personalizado%20de%20diamantes"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs uppercase tracking-wider shrink-0 transition-colors"
          >
            Falar com Atendente
          </a>
        </div>

      </div>
    </section>
  );
};
