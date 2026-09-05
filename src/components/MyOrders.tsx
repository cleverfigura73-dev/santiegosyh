import React, { useState } from 'react';
import { 
  Package, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Search, 
  ExternalLink, 
  MessageSquare,
  Sparkles,
  ShoppingBag,
  Eye,
  X,
  Smartphone
} from 'lucide-react';
import { OrderItem, OrderStatus } from '../types';

interface MyOrdersProps {
  orders: OrderItem[];
  onGoToStore: () => void;
}

export const MyOrders: React.FC<MyOrdersProps> = ({ orders, onGoToStore }) => {
  const [selectedProof, setSelectedProof] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredOrders = orders.filter(order => {
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    const matchesSearch = 
      order.order_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.service_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.player_id.includes(searchQuery);
    return matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'Concluído':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-950 text-emerald-300 border border-emerald-500/40 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            CONCLUÍDO
          </span>
        );
      case 'Aprovado':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-cyan-950 text-cyan-300 border border-cyan-500/40 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            APROVADO
          </span>
        );
      case 'Em análise':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-950 text-blue-300 border border-blue-500/40 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-blue-400" />
            EM ANÁLISE
          </span>
        );
      case 'Cancelado':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-950 text-red-300 border border-red-500/40 flex items-center gap-1.5">
            <XCircle className="w-3.5 h-3.5 text-red-400" />
            CANCELADO
          </span>
        );
      case 'Pendente':
      default:
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-950 text-amber-300 border border-amber-500/40 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            PENDENTE
          </span>
        );
    }
  };

  const getStatusMessage = (status: OrderStatus) => {
    switch (status) {
      case 'Concluído':
        return 'Seu pedido foi concluído com sucesso. Obrigado por comprar na 13SHIBIRU!';
      case 'Aprovado':
        return 'Seu comprovativo foi aprovado com sucesso! Seus itens estão sendo creditados agora no Free Fire.';
      case 'Em análise':
        return 'Nossa equipe está conferindo o comprovativo bancário. Em instantes o pedido será liberado.';
      case 'Cancelado':
        return 'Pedido cancelado. Caso tenha dúvidas, entre em contato imediatamente com o suporte via WhatsApp.';
      case 'Pendente':
      default:
        return 'Seu comprovativo foi recebido. Aguarde enquanto verificamos a sua compra.';
    }
  };

  return (
    <section className="py-12 sm:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title & Filters */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/70 border border-cyan-500/30 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-2">
              <Package className="w-3.5 h-3.5 text-cyan-400" />
              HISTÓRICO DA CONTA
            </div>
            <h2 className="text-3xl font-extrabold font-display text-white tracking-tight">
              MEUS <span className="text-cyan-400">PEDIDOS</span>
            </h2>
          </div>

          {/* Search & Status Filter */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar pedido ou ID..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              />
            </div>

            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-300 focus:outline-none focus:border-cyan-400"
            >
              <option value="all">Todos os Status</option>
              <option value="Pendente">Pendente</option>
              <option value="Em análise">Em análise</option>
              <option value="Aprovado">Aprovado</option>
              <option value="Concluído">Concluído</option>
              <option value="Cancelado">Cancelado</option>
            </select>
          </div>
        </div>

        {/* Orders List */}
        {orders.length === 0 ? (
          <div className="text-center py-16 px-4 bg-slate-950/60 rounded-3xl border border-slate-800 space-y-4">
            <ShoppingBag className="w-12 h-12 text-slate-600 mx-auto" />
            <h3 className="text-lg font-bold text-white">Você ainda não realizou nenhum pedido</h3>
            <p className="text-slate-400 text-xs max-w-sm mx-auto">
              Aproveite os melhores preços em diamantes Free Fire com entrega instantânea e bônus exclusivo!
            </p>
            <button
              onClick={onGoToStore}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-bold text-xs uppercase tracking-wider shadow-lg shadow-cyan-400/20 hover:scale-105 transition-all"
            >
              Ver Tabela de Diamantes
            </button>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-12 text-slate-400 text-xs">
            Nenhum pedido encontrado com estes filtros de busca.
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map(order => (
              <div
                key={order.id}
                className="p-5 sm:p-6 rounded-2xl bg-[#090f20] border border-slate-800 hover:border-cyan-500/40 transition-colors shadow-lg space-y-4"
              >
                {/* Header: Order Number, Date, Status */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-black font-display text-white tracking-wider">
                      Pedido #{order.order_number}
                    </span>
                    <span className="text-xs text-slate-400">
                      {new Date(order.created_at).toLocaleDateString('pt-AO')} às {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <div>{getStatusBadge(order.status)}</div>
                </div>

                {/* Details Grid */}
                <div className={`grid grid-cols-1 sm:grid-cols-2 ${order.phone_brand ? 'lg:grid-cols-4' : 'lg:grid-cols-3'} gap-4 text-xs`}>
                  <div>
                    <span className="text-slate-400 block mb-0.5">Serviço Adquirido:</span>
                    <span className="font-bold text-white text-sm font-display">
                      {order.service_name}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 block mb-0.5">ID do Jogador FF:</span>
                    <span className="font-mono font-bold text-cyan-300 text-sm bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-800/40">
                      {order.player_id}
                    </span>
                  </div>

                  {order.phone_brand && (
                    <div>
                      <span className="text-slate-400 block mb-0.5 flex items-center gap-1">
                        <Smartphone className="w-3.5 h-3.5 text-cyan-400" />
                        Marca do Celular:
                      </span>
                      <span className="font-bold text-cyan-300 text-sm bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-800/40 inline-block font-tech">
                        {order.phone_brand}
                      </span>
                    </div>
                  )}

                  <div>
                    <span className="text-slate-400 block mb-0.5">Valor Pago:</span>
                    <span className="font-black text-white text-sm font-display">
                      {order.price_kz.toLocaleString('pt-AO')} KZ
                    </span>
                  </div>
                </div>

                {/* Status Notification Message Box (Requirement 14) */}
                <div className={`p-3.5 rounded-xl border text-xs flex items-start gap-2.5 ${
                  order.status === 'Concluído'
                    ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
                    : order.status === 'Cancelado'
                    ? 'bg-red-950/40 border-red-500/40 text-red-200'
                    : 'bg-cyan-950/40 border-cyan-500/30 text-cyan-200'
                }`}>
                  <MessageSquare className="w-4 h-4 shrink-0 mt-0.5" />
                  <p className="leading-relaxed font-medium">
                    {getStatusMessage(order.status)}
                  </p>
                </div>

                {/* Footer: View Proof Button */}
                {order.proof_url && (
                  <div className="pt-2 flex items-center justify-between text-xs border-t border-slate-800/60">
                    <span className="text-slate-400">Comprovativo anexado</span>
                    <button
                      onClick={() => setSelectedProof(order.proof_url || null)}
                      className="text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" /> Ver Comprovativo
                    </button>
                  </div>
                )}

              </div>
            ))}
          </div>
        )}

      </div>

      {/* Proof Preview Modal */}
      {selectedProof && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in"
          onClick={() => setSelectedProof(null)}
        >
          <div className="relative max-w-xl max-h-[85vh] bg-[#090e1f] border border-cyan-500/50 rounded-2xl overflow-hidden p-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                Comprovativo de Pagamento
              </span>
              <button
                onClick={() => setSelectedProof(null)}
                className="p-1.5 rounded-full bg-slate-900 text-slate-300 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="mt-3 flex items-center justify-center overflow-auto max-h-[70vh]">
              <img
                src={selectedProof}
                alt="Comprovativo ampliado"
                className="rounded-xl object-contain max-h-full"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
