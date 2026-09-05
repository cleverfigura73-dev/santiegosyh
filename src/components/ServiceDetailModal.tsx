import React from 'react';
import { X, ShoppingCart, ShieldCheck, Zap, Tag, Check } from 'lucide-react';
import { ServiceItem } from '../types';

interface ServiceDetailModalProps {
  service: ServiceItem | null;
  onClose: () => void;
  onBuy: (service: ServiceItem) => void;
}

export const ServiceDetailModal: React.FC<ServiceDetailModalProps> = ({
  service,
  onClose,
  onBuy,
}) => {
  if (!service) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl bg-[#080e1e] border border-cyan-500/40 rounded-3xl shadow-2xl shadow-cyan-950 overflow-hidden text-left animate-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/60 hover:bg-black text-slate-300 hover:text-white border border-slate-700/60 transition-colors"
          title="Fechar"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Hero Image */}
        <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-black">
          <img
            src={service.image_url || '/images/shibiru_logo.jpg'}
            alt={service.name}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#080e1e] via-[#080e1e]/40 to-transparent"></div>
          
          {/* Category Tag */}
          <div className="absolute top-4 left-4">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-cyan-950/90 text-cyan-300 border border-cyan-500/50 backdrop-blur-md flex items-center gap-1.5 shadow-lg">
              <Tag className="w-3.5 h-3.5" />
              {service.category}
            </span>
          </div>

          {/* Badge if exists */}
          {service.badge && (
            <div className="absolute bottom-4 left-4">
              <span className="px-3 py-0.5 rounded-full text-xs font-black uppercase tracking-wider bg-gradient-to-r from-cyan-400 to-blue-500 text-black shadow-md">
                {service.badge}
              </span>
            </div>
          )}
        </div>

        {/* Modal Body Content */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black font-display text-white">
                {service.name}
              </h2>
              <p className="text-xs text-slate-400 font-tech mt-1 tracking-wider uppercase">
                Código: {service.id} • Categoria: {service.category}
              </p>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-xs text-slate-400 block font-medium">Preço</span>
              <div className="text-3xl font-black font-display text-cyan-400">
                {service.price_kz.toLocaleString('pt-AO')} <span className="text-sm font-bold text-white">KZ</span>
              </div>
            </div>
          </div>

          {/* Full Description */}
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Descrição do Serviço
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line">
              {service.description}
            </p>
          </div>

          {/* Features Highlights */}
          {service.features && service.features.length > 0 && (
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                Vantagens Inclusas
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {service.features.map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-slate-200 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                    <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Delivery & Security Guarantees */}
          <div className="grid grid-cols-2 gap-3 p-4 rounded-xl bg-slate-900/40 border border-slate-800 text-xs">
            <div className="flex items-center gap-2 text-slate-300">
              <Zap className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>Entrega Direta pelo ID</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>Garantia 13SHIBIRU Oficial</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={onClose}
              className="w-full sm:w-1/3 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 font-semibold text-xs uppercase tracking-wider transition-colors cursor-pointer"
            >
              Voltar
            </button>
            <button
              onClick={() => {
                onClose();
                onBuy(service);
              }}
              className="w-full sm:w-2/3 py-3.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-black font-black font-display text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-cyan-400/30 active:scale-95 transition-all cursor-pointer"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Comprar Agora</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
