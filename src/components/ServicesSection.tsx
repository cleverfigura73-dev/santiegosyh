import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Eye, 
  Sparkles, 
  Tag, 
  Filter,
  Search,
  ArrowRight
} from 'lucide-react';
import { ServiceItem, ServiceCategory } from '../types';

interface ServicesSectionProps {
  services: ServiceItem[];
  onSelectService: (service: ServiceItem) => void;
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
  onSelectService,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'Todos' | ServiceCategory>('Todos');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter only active services
  const activeServices = services.filter(s => s.status === 'active');
  
  const filteredServices = activeServices.filter(service => {
    const matchesCategory = selectedCategory === 'Todos' || service.category === selectedCategory;
    const matchesSearch = service.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section id="services-section" className="py-8 sm:py-14 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 space-y-2.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/70 border border-cyan-500/30 text-cyan-400 text-xs font-bold uppercase tracking-wider">
            <ShoppingBag className="w-3.5 h-3.5 text-cyan-400" />
            CATÁLOGO DE SERVIÇOS 13SHIBIRU
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold font-display text-white tracking-tight">
            NOSSOS <span className="text-cyan-400 drop-shadow-[0_0_12px_rgba(6,182,212,0.6)]">PRODUTOS & SERVIÇOS</span>
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm">
            Selecione qualquer serviço abaixo e clique em <strong>Ver Produto</strong> para conferir as informações completas, preços e realizar sua compra.
          </p>
        </div>

        {/* Search & Category Filter Toolbar */}
        <div className="space-y-4 mb-8">
          {/* Search Input */}
          <div className="max-w-md mx-auto relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Buscar serviço por nome..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-white placeholder-slate-500 text-xs sm:text-sm focus:border-cyan-500 focus:outline-none transition-colors"
            />
          </div>

          {/* Category Filter Buttons */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none justify-start md:justify-center">
            <div className="flex items-center gap-1.5 bg-slate-900/80 p-1.5 rounded-2xl border border-slate-800 shadow-lg">
              {CATEGORIES.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    selectedCategory === category
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-black shadow-md shadow-cyan-500/25 font-extrabold'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Services Cards Grid: STRICTLY IMAGE + NAME + VER PRODUTO BUTTON */}
        {filteredServices.length === 0 ? (
          <div className="text-center py-16 px-4 bg-slate-950/50 rounded-2xl border border-slate-800">
            <Filter className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-300 font-semibold text-base">Nenhum serviço encontrado.</p>
            <p className="text-slate-500 text-xs mt-1">Tente selecionar outra categoria ou limpar a busca.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredServices.map(service => (
              <div
                key={service.id}
                onClick={() => onSelectService(service)}
                className="group relative rounded-2xl bg-gradient-to-b from-[#091122] to-[#040813] border border-slate-800 hover:border-cyan-500/60 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-950/50 flex flex-col justify-between cursor-pointer hover:-translate-y-1"
              >
                {/* 1. IMAGEM DO SERVIÇO */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-black">
                  <img
                    src={service.image_url || '/images/shibiru_logo.jpg'}
                    alt={service.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#091122] via-transparent to-black/20"></div>

                  {/* Category Pill Tag */}
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-black/80 text-cyan-400 border border-cyan-500/40 backdrop-blur-md flex items-center gap-1">
                      <Tag className="w-2.5 h-2.5" />
                      {service.category}
                    </span>
                  </div>

                  {/* Badge if present */}
                  {service.badge && (
                    <div className="absolute top-3 right-3">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-wider uppercase bg-cyan-400 text-black shadow-md flex items-center gap-1">
                        <Sparkles className="w-2.5 h-2.5" />
                        {service.badge}
                      </span>
                    </div>
                  )}
                </div>

                {/* 2. NOME DO SERVIÇO E 3. OPÇÃO DE VER PRODUTO */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="text-base font-bold font-display text-white group-hover:text-cyan-400 transition-colors line-clamp-2 leading-snug">
                      {service.name}
                    </h3>
                  </div>

                  {/* Botão Ver Produto */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectService(service);
                    }}
                    className="w-full py-2.5 px-4 rounded-xl bg-slate-900 group-hover:bg-cyan-500 text-cyan-400 group-hover:text-black border border-cyan-500/40 group-hover:border-cyan-400 font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Ver Produto</span>
                    <ArrowRight className="w-3.5 h-3.5 opacity-70 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
};

