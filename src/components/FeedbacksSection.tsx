import React, { useState } from 'react';
import { MessageSquare, Star, ShieldCheck, CheckCircle2, Eye, X } from 'lucide-react';
import { FeedbackItem } from '../types';

interface FeedbacksSectionProps {
  feedbacks: FeedbackItem[];
}

export const FeedbacksSection: React.FC<FeedbacksSectionProps> = ({ feedbacks }) => {
  const [activeImage, setActiveImage] = useState<string | null>(null);

  return (
    <section id="feedbacks-section" className="py-14 sm:py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/70 border border-cyan-500/30 text-cyan-400 text-xs font-bold uppercase tracking-wider">
            <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
            FEEDBACKS REAIS
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-white tracking-tight">
            QUEM COMPRA, <span className="text-cyan-400 drop-shadow-[0_0_12px_rgba(6,182,212,0.6)]">CONFIA!</span>
          </h2>
          <p className="text-slate-300 text-sm sm:text-base">
            Veja capturas de tela e depoimentos de jogadores de Free Fire que recarregam diamantes e adquirem produtos na 13SHIBIRU.
          </p>
        </div>

        {/* Feedbacks Grid */}
        {feedbacks.length === 0 ? (
          <div className="text-center py-16 px-4 bg-slate-950/50 rounded-2xl border border-slate-800">
            <p className="text-slate-400 text-sm">Nenhum feedback cadastrado ainda.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {feedbacks.map(fb => (
              <div
                key={fb.id}
                className="group rounded-2xl bg-gradient-to-b from-[#091122] to-[#040813] border border-slate-800 hover:border-cyan-500/50 overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-cyan-950/40 flex flex-col justify-between"
              >
                {/* Proof Image container */}
                <div 
                  className="relative h-56 sm:h-64 w-full overflow-hidden bg-black cursor-pointer"
                  onClick={() => setActiveImage(fb.image_url)}
                >
                  <img
                    src={fb.image_url}
                    alt={fb.description || 'Feedback 13SHIBIRU'}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#091122] via-transparent to-black/30"></div>

                  {/* Rating Stars */}
                  <div className="absolute top-3 left-3 flex items-center gap-1 bg-black/80 px-2.5 py-1 rounded-full border border-yellow-500/30 backdrop-blur-md">
                    {Array.from({ length: fb.rating || 5 }).map((_, i) => (
                      <Star key={i} className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>

                  {/* Verification Badge */}
                  <div className="absolute top-3 right-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950/90 text-emerald-300 border border-emerald-500/40 flex items-center gap-1 backdrop-blur-md">
                      <ShieldCheck className="w-3 h-3 text-emerald-400" />
                      Entrega Verificada
                    </span>
                  </div>

                  {/* Zoom Hint */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-[2px]">
                    <span className="px-3 py-1.5 rounded-lg bg-black/80 text-cyan-300 text-xs font-bold border border-cyan-500/40 flex items-center gap-1.5 shadow-lg">
                      <Eye className="w-3.5 h-3.5" /> Ampliar Imagem
                    </span>
                  </div>
                </div>

                {/* Feedback Body */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  {fb.description && (
                    <p className="text-slate-200 text-xs sm:text-sm leading-relaxed italic">
                      "{fb.description}"
                    </p>
                  )}

                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                    <span className="font-semibold text-cyan-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                      {fb.customer_name || 'Cliente 13SHIBIRU'}
                    </span>
                    {fb.created_at && (
                      <span className="text-[11px] text-slate-500">
                        {new Date(fb.created_at).toLocaleDateString('pt-AO')}
                      </span>
                    )}
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>

      {/* Image Modal Preview */}
      {activeImage && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in"
          onClick={() => setActiveImage(null)}
        >
          <div className="relative max-w-2xl max-h-[85vh] bg-[#090e1f] border border-cyan-500/50 rounded-2xl overflow-hidden p-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                Captura de Comprovativo / Feedback
              </span>
              <button
                onClick={() => setActiveImage(null)}
                className="p-1.5 rounded-full bg-slate-900 text-slate-300 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="mt-3 flex items-center justify-center overflow-auto max-h-[70vh]">
              <img
                src={activeImage}
                alt="Feedback ampliado"
                className="rounded-xl object-contain max-h-full"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
