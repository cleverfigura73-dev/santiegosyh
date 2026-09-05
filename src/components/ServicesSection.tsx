import React, { useState } from 'react';
import { 
  ShoppingBag, 
  ShoppingCart, 
  Eye, 
  Sparkles, 
  Tag, 
  Filter 
} from 'lucide-react';
import { ServiceItem, ServiceCategory } from '../types';
import { ServiceDetailModal } from './ServiceDetailModal';

interface ServicesSectionProps {
  services: ServiceItem[];
  onBuyService: (service: ServiceItem) => void;
}

const CATEGORIES: Array<'Todos' | ServiceCategory> = [
  'Todos',
  'Diamantes',
  'Passe Booyah',
  'Skins',
  'Contas',
  'Sensibilidade 13SHIBIRU',
  'Outros',
];

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  services,
  onBuyService,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'Todos' | ServiceCategory>('Todos');
  const [activeDetailService, setActiveDetailService] = useState<ServiceItem | null>(null);

  // Filter only active services
  const activeServices = services.filter(s => s.status === 'active');
  const filteredServices = selectedCategory === 'Todos'
    ? activeServices
    : activeServices.filter(s => s.category === selectedCategory);

  return (
    <section id="services-section" className="py-14 sm:py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/70 border border-cyan-500/30 text-cyan-400 text-xs font-bold uppercase tracking-wider">
            <ShoppingBag className="w-3.5 h-3.5 text-cyan-400" />
            CATÁLOGO COMPLETO
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-white tracking-tight">
            NOSSOS <span className="text-cyan-400 drop-shadow-[0_0_12px_rgba(6,182,212,0.6)]">SERVIÇOS</span>
          </h2>
          <p className="text-slate-300 text-sm sm:text-base">
            Selecione uma categoria para explorar os produtos e serviços Free Fire disponíveis na 13SHIBIRU.
          </p>
        </div>

        {/* Category Filters (Horizontal scroll on mobile) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-10 scrollbar-none justify-start md:justify-center">
          <div className="flex items-center gap-1.5 bg-slate-900/80 p-1 rounded-xl border border-slate-800">
            {CATEGORIES.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3.5 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === category
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-black shadow-md shadow-cyan-500/25'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Services Cards Grid */}
        {filteredServices.length === 0 ? (
          <div className="text-center py-16 px-4 bg-slate-950/50 rounded-2xl border border-slate-800">
            <Filter className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-300 font-semibold text-base">Nenhum serviço nesta categoria no momento.</p>
            <p className="text-slate-500 text-xs mt-1">O administrador adicionará novos itens em breve!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map(service => (
              <div
                key={service.id}
                className="group relative rounded-2xl bg-gradient-to-b from-[#091122] to-[#040813] border border-slate-800 hover:border-cyan-500/50 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-cyan-950/50 flex flex-col justify-between"
              >
                {/* Image Container with Badges */}
                <div 
                  className="relative h-48 sm:h-52 w-full overflow-hidden bg-black cursor-pointer"
                  onClick={() => setActiveDetailService(service)}
                >
                  <img
                    src={service.image_url || '/images/shibiru_logo.jpg'}
                    alt={service.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#091122] via-transparent to-black/30"></div>

                  {/* Category Pill */}
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider bg-black/80 text-cyan-400 border border-cyan-500/40 backdrop-blur-md flex items-center gap-1">
                      <Tag className="w-3 h-3" />
                      {service.category}
                    </span>
                  </div>

                  {/* Optional Badge */}
                  {service.badge && (
                    <div className="absolute top-3 right-3">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-wider uppercase bg-cyan-400 text-black shadow-md flex items-center gap-1">
                        <Sparkles className="w-2.5 h-2.5" />
                        {service.badge}
                      </span>
                    </div>
                  )}

                  {/* Hover Quick View Trigger */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-[2px]">
                    <span className="px-3 py-1.5 rounded-lg bg-black/80 text-cyan-300 text-xs font-bold border border-cyan-500/40 flex items-center gap-1.5 shadow-lg">
                      <Eye className="w-3.5 h-3.5" /> Ver Detalhes
                    </span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 
                      onClick={() => setActiveDetailService(service)}
                      className="text-lg font-bold font-display text-white group-hover:text-cyan-400 transition-colors cursor-pointer line-clamp-1"
                    >
                      {service.name}
                    </h3>
                    
                    <p className="text-slate-400 text-xs mt-2 line-clamp-2 leading-relaxed">
                      {service.description}
                    </p>
                  </div>

                  {/* Price & Actions */}
                  <div className="pt-5 mt-4 border-t border-slate-800/80">
                    <div className="flex items-baseline justify-between mb-4">
                      <span className="text-[11px] text-slate-400 font-medium">A partir de</span>
                      <div className="text-right">
                        <span className="text-2xl font-black font-display text-white">
                          {service.price_kz.toLocaleString('pt-AO')}
                        </span>
                        <span className="text-xs font-bold text-cyan-400 ml-1">KZ</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setActiveDetailService(service)}
                        className="py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" /> Detalhes
                      </button>

                      <button
                        onClick={() => onBuyService(service)}
                        className="py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-black text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md shadow-cyan-400/20 active:scale-95 transition-all cursor-pointer"
                      >
                        <ShoppingCart className="w-3.5 h-3.5" /> Comprar
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* Service Detail Modal */}
      {activeDetailService && (
        <ServiceDetailModal
          service={activeDetailService}
          onClose={() => setActiveDetailService(null)}
          onBuy={onBuyService}
        />
      )}
    </section>
  );
};
