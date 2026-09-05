import React from 'react';
import { 
  ArrowLeft, 
  ShoppingCart, 
  ShieldCheck, 
  Zap, 
  Tag, 
  Sparkles, 
  Smartphone, 
  MessageCircle, 
  CheckCircle2, 
  Share2,
  Clock
} from 'lucide-react';
import { ServiceItem } from '../types';

interface ProductDetailScreenProps {
  service: ServiceItem;
  whatsappNumber?: string;
  onBack: () => void;
  onBuy: (service: ServiceItem) => void;
}

export const ProductDetailScreen: React.FC<ProductDetailScreenProps> = ({
  service,
  whatsappNumber = '244948011244',
  onBack,
  onBuy,
}) => {
  const isSensitivityService = 
    service.category === 'Sensibilidade 13SHIBIRU' ||
    service.name.toLowerCase().includes('sensibilidade') ||
    service.name.toLowerCase().includes('sensi');

  const cleanWhatsApp = whatsappNumber.replace(/\D/g, '');
  const whatsappUrl = `https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent(
    `Olá 13SHIBIRU! Tenho dúvidas sobre o produto: *${service.name}* (Preço: ${service.price_kz.toLocaleString('pt-AO')} KZ). Poderia me ajudar?`
  )}`;

  return (
    <div className="py-8 sm:py-12 animate-in fade-in duration-300">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation Back Bar */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-800/80">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900/90 hover:bg-cyan-950/60 text-slate-300 hover:text-cyan-300 border border-slate-800 hover:border-cyan-500/40 font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar aos Serviços</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 hidden sm:inline">Categoria:</span>
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-cyan-950/80 text-cyan-300 border border-cyan-500/40">
              {service.category}
            </span>
          </div>
        </div>

        {/* Main Product Details Card */}
        <div className="bg-gradient-to-b from-[#080e1f] to-[#040814] border border-cyan-500/30 rounded-3xl p-6 sm:p-10 shadow-2xl shadow-black/80">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            
            {/* LEFT COLUMN: Product Image Presentation */}
            <div className="lg:col-span-5 space-y-4">
              <div className="relative rounded-2xl overflow-hidden bg-black border border-cyan-500/40 shadow-xl group aspect-square">
                <img
                  src={service.image_url || '/images/shibiru_logo.jpg'}
                  alt={service.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                
                {/* Overlay Vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20 pointer-events-none"></div>

                {/* Badge if present */}
                {service.badge && (
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-gradient-to-r from-cyan-400 to-blue-500 text-black shadow-lg flex items-center gap-1.5">
                      <Sparkles className="w-3 h-3" />
                      {service.badge}
                    </span>
                  </div>
                )}

                {/* Verified Seal */}
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between bg-black/70 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/10 text-[11px] text-slate-300">
                  <span className="flex items-center gap-1.5 font-bold text-cyan-300">
                    <ShieldCheck className="w-4 h-4 text-cyan-400" />
                    Produto 100% Verificado
                  </span>
                  <span className="text-slate-400 font-mono text-[10px]">
                    13SHIBIRU STORE
                  </span>
                </div>
              </div>

              {/* Quick Guarantees Box */}
              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2.5 text-xs text-slate-300">
                <div className="flex items-center gap-2.5">
                  <Zap className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>Entrega rápida no jogo via ID de jogador</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Clock className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>Ativação em até 10 a 30 minutos após confirmação</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Pagamento seguro via Multicaixa Express ou IBAN</span>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Product Information & Purchase Decision */}
            <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
              
              <div>
                {/* Category & Status */}
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className="px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider bg-slate-900 text-cyan-400 border border-cyan-800/60 flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5" />
                    {service.category}
                  </span>
                  <span className="px-2.5 py-1 rounded-lg text-xs font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Disponível para Compra
                  </span>
                </div>

                {/* Product Title */}
                <h1 className="text-2xl sm:text-4xl font-extrabold font-display text-white tracking-tight leading-tight">
                  {service.name}
                </h1>

                {/* Price Display */}
                <div className="mt-5 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-cyan-950/50 via-[#07122a] to-blue-950/30 border border-cyan-500/40 flex flex-wrap items-baseline justify-between gap-2">
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                      Preço Oficial
                    </span>
                    <div className="text-3xl sm:text-4xl font-black font-display text-white mt-0.5">
                      {service.price_kz.toLocaleString('pt-AO')}{' '}
                      <span className="text-xl sm:text-2xl font-bold text-cyan-400">KZ</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="inline-block px-3 py-1 rounded-full text-[11px] font-extrabold bg-cyan-400 text-black uppercase tracking-wider shadow-md shadow-cyan-400/20">
                      Melhor Preço em Angola
                    </span>
                  </div>
                </div>

                {/* Detailed Description */}
                <div className="mt-6 space-y-2">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Informações Detalhadas do Produto:
                  </h3>
                  <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 text-sm text-slate-200 leading-relaxed whitespace-pre-line">
                    {service.description || 'Nenhuma descrição adicional informada para este serviço.'}
                  </div>
                </div>

                {/* Special sensitivity note if applicable */}
                {isSensitivityService && (
                  <div className="mt-4 p-4 rounded-2xl bg-cyan-950/40 border border-cyan-500/40 text-xs text-cyan-200 space-y-1.5">
                    <div className="flex items-center gap-2 font-bold text-cyan-300">
                      <Smartphone className="w-4 h-4 text-cyan-400" />
                      <span>Configuração Personalizada para o seu Celular</span>
                    </div>
                    <p className="text-[11px] text-slate-300">
                      Após clicar em comprar, você poderá informar a marca e modelo do seu aparelho (Samsung, Xiaomi, iPhone, Motorola, Infinix, etc.) para receber a sensibilidade exata.
                    </p>
                  </div>
                )}
              </div>

              {/* Purchase and Action Buttons */}
              <div className="pt-6 border-t border-slate-800/80 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    onClick={() => onBuy(service)}
                    className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-cyan-400 via-cyan-300 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-black font-black font-display text-base uppercase tracking-wider flex items-center justify-center gap-3 shadow-xl shadow-cyan-500/30 active:scale-98 transition-all cursor-pointer"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    <span>Comprar Agora</span>
                  </button>

                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-4 px-6 rounded-2xl bg-emerald-950 hover:bg-emerald-900 text-emerald-300 hover:text-white border border-emerald-500/40 font-bold text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2.5 transition-all cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4 text-emerald-400" />
                    <span>Tirar Dúvidas WhatsApp</span>
                  </a>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <button
                    onClick={onBack}
                    className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer py-1"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Escolher outro serviço no catálogo</span>
                  </button>
                  <span className="text-[11px] text-slate-500">
                    ID do Serviço: #{service.id}
                  </span>
                </div>
              </div>

            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
