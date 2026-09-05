import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Package, 
  MessageSquare, 
  Settings, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  Eye, 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  DollarSign, 
  TrendingUp, 
  Users, 
  Search, 
  Upload, 
  ShieldCheck, 
  AlertCircle,
  Gem,
  Tag
} from 'lucide-react';
import { 
  OrderItem, 
  ServiceItem, 
  FeedbackItem, 
  PaymentDetails, 
  OrderStatus, 
  ServiceCategory 
} from '../types';
import { store } from '../lib/store';

interface AdminPanelProps {
  orders: OrderItem[];
  services: ServiceItem[];
  feedbacks: FeedbackItem[];
  paymentDetails: PaymentDetails;
  onRefresh: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  orders,
  services,
  feedbacks,
  paymentDetails,
  onRefresh,
}) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'services' | 'orders' | 'feedbacks' | 'settings'>('dashboard');
  
  // Orders State
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');
  const [selectedProofOrder, setSelectedProofOrder] = useState<OrderItem | null>(null);

  // Services Modal State
  const [serviceModalOpen, setServiceModalOpen] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState<ServiceItem | null>(null);
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);
  const [serviceForm, setServiceForm] = useState({
    name: '',
    category: 'Diamantes' as ServiceCategory,
    price_kz: 1000,
    description: '',
    image_url: '',
    badge: '',
    status: 'active' as 'active' | 'inactive',
  });

  // Feedback Form State
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [feedbackForm, setFeedbackForm] = useState({
    customer_name: '',
    image_url: '',
    description: '',
    rating: 5,
  });

  // Settings State
  const [settingsForm, setSettingsForm] = useState<PaymentDetails>({ ...paymentDetails });
  const [settingsSuccess, setSettingsSuccess] = useState(false);

  // Dashboard Stats Calculations
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => o.status === 'Pendente' || o.status === 'Em análise').length;
  const completedOrders = orders.filter(o => o.status === 'Concluído' || o.status === 'Aprovado').length;
  const totalRevenue = orders
    .filter(o => o.status === 'Concluído' || o.status === 'Aprovado')
    .reduce((sum, o) => sum + (o.price_kz || 0), 0);

  // Filtered Orders
  const filteredOrders = orders.filter(o => {
    const matchesFilter = orderStatusFilter === 'all' || o.status === orderStatusFilter;
    const matchesSearch = 
      o.order_number.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.user_email.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.player_id.includes(orderSearch) ||
      o.service_name.toLowerCase().includes(orderSearch.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Handlers for Orders
  const handleUpdateOrderStatus = async (orderId: string, status: OrderStatus) => {
    await store.updateOrderStatus(orderId, status);
    onRefresh();
  };

  // Handlers for Services
  const handleOpenAddService = () => {
    setEditingService(null);
    setServiceForm({
      name: '',
      category: 'Diamantes',
      price_kz: 2000,
      description: '',
      image_url: '/images/shibiru_logo.jpg',
      badge: '',
      status: 'active',
    });
    setServiceModalOpen(true);
  };

  const handleOpenEditService = (service: ServiceItem) => {
    setEditingService(service);
    setServiceForm({
      name: service.name,
      category: service.category,
      price_kz: service.price_kz,
      description: service.description,
      image_url: service.image_url || '',
      badge: service.badge || '',
      status: service.status,
    });
    setServiceModalOpen(true);
  };

  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!serviceForm.name.trim() || serviceForm.price_kz <= 0) return;

    if (editingService) {
      await store.updateService(editingService.id, {
        name: serviceForm.name,
        category: serviceForm.category,
        price_kz: Number(serviceForm.price_kz),
        description: serviceForm.description,
        image_url: serviceForm.image_url,
        badge: serviceForm.badge || undefined,
        status: serviceForm.status,
      });
    } else {
      await store.createService({
        name: serviceForm.name,
        category: serviceForm.category,
        price_kz: Number(serviceForm.price_kz),
        description: serviceForm.description,
        image_url: serviceForm.image_url,
        badge: serviceForm.badge || undefined,
        status: serviceForm.status,
      });
    }
    setServiceModalOpen(false);
    onRefresh();
  };

  const handleConfirmDeleteService = async () => {
    if (!serviceToDelete) return;
    try {
      await store.deleteService(serviceToDelete.id);
      setServiceToDelete(null);
      onRefresh();
    } catch (e: any) {
      console.error(e);
    }
  };

  const handleToggleServiceStatus = async (service: ServiceItem) => {
    const newStatus = service.status === 'active' ? 'inactive' : 'active';
    await store.updateService(service.id, { status: newStatus });
    onRefresh();
  };

  // Handlers for Feedback
  const handleSaveFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackForm.image_url.trim()) return;

    await store.createFeedback({
      customer_name: feedbackForm.customer_name || 'Jogador FF',
      image_url: feedbackForm.image_url,
      description: feedbackForm.description,
      rating: feedbackForm.rating,
    });

    setFeedbackModalOpen(false);
    setFeedbackForm({ customer_name: '', image_url: '', description: '', rating: 5 });
    onRefresh();
  };

  const handleDeleteFeedback = async (id: string) => {
    if (window.confirm('Deseja remover este feedback?')) {
      await store.deleteFeedback(id);
      onRefresh();
    }
  };

  // Handlers for Settings
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    store.updatePaymentDetails(settingsForm);
    setSettingsSuccess(true);
    setTimeout(() => setSettingsSuccess(false), 3000);
    onRefresh();
  };

  return (
    <section className="py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Admin Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-red-950/40 via-slate-900 to-slate-950 border border-red-500/30 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950 text-red-400 text-xs font-bold uppercase tracking-wider mb-2 border border-red-800">
              <ShieldCheck className="w-3.5 h-3.5" /> ACESSO RESTRITO ADMINISTRATIVO
            </div>
            <h1 className="text-2xl sm:text-3xl font-black font-display text-white">
              PAINEL DE CONTROLE <span className="text-red-400">13SHIBIRU</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Conectado como Administrador: 13Shibiru@gmail.com
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-xl bg-emerald-950 text-emerald-400 border border-emerald-800 text-xs font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Sistema Operacional
            </span>
          </div>
        </div>

        {/* Tab Navigation Menu */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'dashboard'
                ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/25'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            1. Dashboard
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'orders'
                ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/25'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Package className="w-4 h-4" />
            2. Pedidos ({orders.length})
            {pendingOrders > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-amber-500 text-black text-[10px] font-black">
                {pendingOrders}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('services')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'services'
                ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/25'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            3. Serviços ({services.length})
          </button>

          <button
            onClick={() => setActiveTab('feedbacks')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'feedbacks'
                ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/25'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            4. Feedbacks ({feedbacks.length})
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'settings'
                ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/25'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Settings className="w-4 h-4" />
            5. Configurações
          </button>
        </div>

        {/* 1. DASHBOARD TAB */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8 animate-in fade-in duration-150">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-[#091024] border border-slate-800 shadow-md">
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider font-tech">Total de Pedidos</span>
                  <Package className="w-4 h-4 text-cyan-400" />
                </div>
                <div className="text-3xl font-black font-display text-white">{totalOrders}</div>
                <p className="text-[11px] text-slate-500 mt-1">Todas as compras realizadas</p>
              </div>

              <div className="p-5 rounded-2xl bg-[#091024] border border-slate-800 shadow-md">
                <div className="flex items-center justify-between text-amber-400 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider font-tech">Pedidos Pendentes</span>
                  <Clock className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-3xl font-black font-display text-amber-300">{pendingOrders}</div>
                <p className="text-[11px] text-slate-500 mt-1">Aguardando conferência</p>
              </div>

              <div className="p-5 rounded-2xl bg-[#091024] border border-slate-800 shadow-md">
                <div className="flex items-center justify-between text-emerald-400 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider font-tech">Pedidos Concluídos</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-3xl font-black font-display text-emerald-300">{completedOrders}</div>
                <p className="text-[11px] text-slate-500 mt-1">Diamantes e itens entregues</p>
              </div>

              <div className="p-5 rounded-2xl bg-[#091024] border border-slate-800 shadow-md">
                <div className="flex items-center justify-between text-cyan-400 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider font-tech">Total Faturado</span>
                  <DollarSign className="w-4 h-4 text-cyan-400" />
                </div>
                <div className="text-2xl sm:text-3xl font-black font-display text-cyan-300">
                  {totalRevenue.toLocaleString('pt-AO')} <span className="text-xs text-white">KZ</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">Receita total confirmada</p>
              </div>
            </div>

            {/* Recent Orders Overview */}
            <div className="p-6 rounded-2xl bg-[#080e20] border border-slate-800">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold font-display text-white">
                  Últimos Pedidos Recebidos
                </h3>
                <button
                  onClick={() => setActiveTab('orders')}
                  className="text-xs text-cyan-400 hover:underline font-semibold"
                >
                  Ver Todos os Pedidos →
                </button>
              </div>

              {orders.slice(0, 5).map(order => (
                <div
                  key={order.id}
                  className="py-3 border-b border-slate-800/80 last:border-0 flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-bold text-white block">
                      #{order.order_number} - {order.service_name}
                    </span>
                    <span className="text-slate-400 text-[11px]">
                      {order.user_email} • ID Free Fire: {order.player_id}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="font-black text-cyan-400 block font-display">
                      {order.price_kz.toLocaleString('pt-AO')} KZ
                    </span>
                    <span className={`text-[10px] font-bold uppercase ${
                      order.status === 'Concluído' ? 'text-emerald-400' : 'text-amber-400'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 2. ORDERS TAB (REQUIREMENT 13.3) */}
        {activeTab === 'orders' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-3 justify-between items-center">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Buscar por #pedido, email ou ID FF..."
                  value={orderSearch}
                  onChange={e => setOrderSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <select
                value={orderStatusFilter}
                onChange={e => setOrderStatusFilter(e.target.value)}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-cyan-400"
              >
                <option value="all">Todos os Status</option>
                <option value="Pendente">Pendente</option>
                <option value="Em análise">Em análise</option>
                <option value="Aprovado">Aprovado</option>
                <option value="Concluído">Concluído</option>
                <option value="Cancelado">Cancelado</option>
              </select>
            </div>

            {/* Orders Table */}
            <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-[#080e20]">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900/90 text-slate-400 uppercase tracking-wider font-tech border-b border-slate-800">
                  <tr>
                    <th className="py-3.5 px-4">Pedido</th>
                    <th className="py-3.5 px-4">Cliente (Email)</th>
                    <th className="py-3.5 px-4">ID Free Fire</th>
                    <th className="py-3.5 px-4">Serviço</th>
                    <th className="py-3.5 px-4">Preço</th>
                    <th className="py-3.5 px-4">Data/Hora</th>
                    <th className="py-3.5 px-4">Comprovativo</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Ações do Admin</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="py-8 text-center text-slate-500">
                        Nenhum pedido encontrado.
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map(order => (
                      <tr key={order.id} className="hover:bg-slate-900/50 transition-colors">
                        <td className="py-3.5 px-4 font-mono font-bold text-white">
                          #{order.order_number}
                        </td>
                        <td className="py-3.5 px-4 font-medium text-slate-200">
                          {order.user_email}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="font-mono bg-cyan-950/60 px-2 py-0.5 rounded text-cyan-300 border border-cyan-800/40">
                            {order.player_id}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-white">
                          {order.service_name}
                        </td>
                        <td className="py-3.5 px-4 font-bold text-cyan-400">
                          {order.price_kz.toLocaleString('pt-AO')} KZ
                        </td>
                        <td className="py-3.5 px-4 text-slate-400">
                          {new Date(order.created_at).toLocaleDateString('pt-AO')} {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </td>
                        <td className="py-3.5 px-4">
                          {order.proof_url ? (
                            <button
                              onClick={() => setSelectedProofOrder(order)}
                              className="px-2.5 py-1 rounded bg-slate-800 hover:bg-cyan-950 text-cyan-400 border border-cyan-500/30 flex items-center gap-1 transition-colors cursor-pointer"
                            >
                              <Eye className="w-3.5 h-3.5" /> Ver Imagem
                            </button>
                          ) : (
                            <span className="text-slate-500">Sem imagem</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                            order.status === 'Concluído'
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                              : order.status === 'Aprovado'
                              ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/40'
                              : order.status === 'Cancelado'
                              ? 'bg-red-950 text-red-300 border border-red-500/40'
                              : 'bg-amber-950 text-amber-300 border border-amber-500/40'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Aprovar */}
                            <button
                              onClick={() => handleUpdateOrderStatus(order.id, 'Aprovado')}
                              className="p-1.5 rounded bg-cyan-950 hover:bg-cyan-900 text-cyan-400 border border-cyan-700/50"
                              title="Aprovar Comprovativo"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                            </button>
                            {/* Concluir */}
                            <button
                              onClick={() => handleUpdateOrderStatus(order.id, 'Concluído')}
                              className="p-1.5 rounded bg-emerald-950 hover:bg-emerald-900 text-emerald-400 border border-emerald-700/50"
                              title="Marcar como Concluído"
                            >
                              <DollarSign className="w-3.5 h-3.5" />
                            </button>
                            {/* Cancelar */}
                            <button
                              onClick={() => handleUpdateOrderStatus(order.id, 'Cancelado')}
                              className="p-1.5 rounded bg-red-950 hover:bg-red-900 text-red-400 border border-red-700/50"
                              title="Cancelar Pedido"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 3. SERVICES TAB (REQUIREMENT 13.2) */}
        {activeTab === 'services' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold font-display text-white">
                  Catálogo de Serviços da Loja
                </h3>
                <p className="text-xs text-slate-400">
                  Adicione novos pacotes, skins, passes, contas ou sensibilidade.
                </p>
              </div>

              <button
                onClick={handleOpenAddService}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-md shadow-cyan-400/20 active:scale-95 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Adicionar Novo Serviço</span>
              </button>
            </div>

            {/* Services List Table */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {services.map(service => (
                <div
                  key={service.id}
                  className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                    service.status === 'active'
                      ? 'bg-[#091122] border-slate-800'
                      : 'bg-slate-950/80 border-red-900/40 opacity-70'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-950 text-cyan-400 border border-cyan-800">
                        {service.category}
                      </span>
                      <button
                        onClick={() => handleToggleServiceStatus(service)}
                        className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                          service.status === 'active'
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                            : 'bg-red-950 text-red-400 border border-red-800'
                        }`}
                      >
                        {service.status === 'active' ? 'Ativo' : 'Inativo'}
                      </button>
                    </div>

                    <div className="flex gap-3 mb-3">
                      <img
                        src={service.image_url || '/images/shibiru_logo.jpg'}
                        alt={service.name}
                        className="w-16 h-16 rounded-xl object-cover border border-slate-800 shrink-0"
                        referrerPolicy="no-referrer"
                      />
                      <div className="min-w-0">
                        <h4 className="text-sm font-bold text-white truncate font-display">
                          {service.name}
                        </h4>
                        <p className="text-xs text-cyan-400 font-bold mt-1">
                          {service.price_kz.toLocaleString('pt-AO')} KZ
                        </p>
                      </div>
                    </div>

                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-4">
                      {service.description}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                    <button
                      onClick={() => handleOpenEditService(service)}
                      className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1"
                    >
                      <Edit className="w-3.5 h-3.5" /> Editar
                    </button>

                    <button
                      onClick={() => setServiceToDelete(service)}
                      className="text-xs text-red-400 hover:text-red-300 font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Excluir
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. FEEDBACKS TAB (REQUIREMENT 15) */}
        {activeTab === 'feedbacks' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold font-display text-white">
                  Gerenciamento de Feedbacks dos Clientes
                </h3>
                <p className="text-xs text-slate-400">
                  Adicione capturas de comprovativos reais para fortalecer a credibilidade da loja.
                </p>
              </div>

              <button
                onClick={() => setFeedbackModalOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-400 to-green-500 text-black font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-md active:scale-95 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Adicionar Feedback</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {feedbacks.map(fb => (
                <div
                  key={fb.id}
                  className="rounded-2xl bg-[#091122] border border-slate-800 overflow-hidden flex flex-col justify-between"
                >
                  <div className="h-44 bg-black relative">
                    <img
                      src={fb.image_url}
                      alt={fb.description}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  <div className="p-4 space-y-2">
                    <p className="text-xs text-slate-200 italic line-clamp-2">
                      "{fb.description}"
                    </p>
                    <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs text-slate-400">
                      <span className="font-semibold text-cyan-400">{fb.customer_name}</span>
                      <button
                        onClick={() => handleDeleteFeedback(fb.id)}
                        className="text-red-400 hover:text-red-300 font-semibold flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Remover
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5. CONFIGURAÇÕES TAB (REQUIREMENT 13.5) */}
        {activeTab === 'settings' && (
          <div className="max-w-2xl mx-auto bg-[#080d1e] border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 animate-in fade-in duration-150">
            <div>
              <h3 className="text-xl font-bold font-display text-white">
                Configurações de Pagamento e Atendimento
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Atualize os números de transferência bancária, IBAN e WhatsApp de atendimento oficial.
              </p>
            </div>

            <form onSubmit={handleSaveSettings} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Multicaixa Express (Número)
                </label>
                <input
                  type="text"
                  required
                  value={settingsForm.multicaixa_express}
                  onChange={e => setSettingsForm({ ...settingsForm, multicaixa_express: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Pay Pay (Número)
                </label>
                <input
                  type="text"
                  required
                  value={settingsForm.pay_pay}
                  onChange={e => setSettingsForm({ ...settingsForm, pay_pay: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  IBAN BIC (Número completo)
                </label>
                <input
                  type="text"
                  required
                  value={settingsForm.iban_bic}
                  onChange={e => setSettingsForm({ ...settingsForm, iban_bic: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Nome da Conta Bancária (Titular)
                </label>
                <input
                  type="text"
                  required
                  value={settingsForm.account_name}
                  onChange={e => setSettingsForm({ ...settingsForm, account_name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Chave PIX
                </label>
                <input
                  type="text"
                  required
                  value={settingsForm.pix}
                  onChange={e => setSettingsForm({ ...settingsForm, pix: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  WhatsApp de Suporte Oficial
                </label>
                <input
                  type="text"
                  required
                  value={settingsForm.whatsapp_support}
                  onChange={e => setSettingsForm({ ...settingsForm, whatsapp_support: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white font-mono"
                />
              </div>

              {settingsSuccess && (
                <div className="p-3 rounded-xl bg-emerald-950 text-emerald-300 text-xs border border-emerald-700 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Dados de pagamento atualizados com sucesso!</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-black font-display text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25 active:scale-95 transition-all cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Salvar Alterações</span>
              </button>
            </form>
          </div>
        )}

      </div>

      {/* Proof Preview Modal for Admin */}
      {selectedProofOrder && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in"
          onClick={() => setSelectedProofOrder(null)}
        >
          <div 
            className="relative max-w-xl max-h-[90vh] bg-[#090e1f] border border-cyan-500/50 rounded-2xl overflow-hidden p-5 shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider font-tech">
                  Comprovativo: #{selectedProofOrder.order_number}
                </span>
                <p className="text-[11px] text-slate-400">
                  {selectedProofOrder.user_email} • {selectedProofOrder.price_kz.toLocaleString('pt-AO')} KZ
                </p>
              </div>
              <button
                onClick={() => setSelectedProofOrder(null)}
                className="p-1.5 rounded-full bg-slate-900 text-slate-300 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-3 flex items-center justify-center overflow-auto max-h-[60vh]">
              <img
                src={selectedProofOrder.proof_url}
                alt="Comprovativo"
                className="rounded-xl object-contain max-h-full"
              />
            </div>

            {/* Quick Action buttons right in preview */}
            <div className="flex gap-2 pt-4 border-t border-slate-800 mt-4">
              <button
                onClick={() => {
                  handleUpdateOrderStatus(selectedProofOrder.id, 'Concluído');
                  setSelectedProofOrder(null);
                }}
                className="flex-1 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs uppercase tracking-wider"
              >
                Marcar como Concluído
              </button>
              <button
                onClick={() => {
                  handleUpdateOrderStatus(selectedProofOrder.id, 'Cancelado');
                  setSelectedProofOrder(null);
                }}
                className="px-4 py-2 rounded-xl bg-red-950 text-red-400 hover:bg-red-900 font-bold text-xs uppercase tracking-wider"
              >
                Recusar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Service Modal (Add / Edit) */}
      {serviceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
          <div 
            className="relative w-full max-w-lg bg-[#080d1e] border border-cyan-500/40 rounded-3xl shadow-2xl p-6 space-y-4 my-6 text-left"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold font-display text-white">
                {editingService ? 'Editar Serviço' : 'Novo Serviço Free Fire'}
              </h3>
              <button onClick={() => setServiceModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveService} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Nome do Serviço *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Passe Booyah Premium Plus"
                  value={serviceForm.name}
                  onChange={e => setServiceForm({ ...serviceForm, name: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Categoria *</label>
                  <select
                    value={serviceForm.category}
                    onChange={e => setServiceForm({ ...serviceForm, category: e.target.value as ServiceCategory })}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                  >
                    <option value="Diamantes">Diamantes</option>
                    <option value="Passe Booyah">Passe Booyah</option>
                    <option value="Skins">Skins</option>
                    <option value="Contas">Contas</option>
                    <option value="Sensibilidade 13SHIBIRU">Sensibilidade 13SHIBIRU</option>
                    <option value="Outros">Outros</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Preço em KZ *</label>
                  <input
                    type="number"
                    required
                    min={100}
                    step={50}
                    value={serviceForm.price_kz}
                    onChange={e => setServiceForm({ ...serviceForm, price_kz: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">URL da Imagem</label>
                <input
                  type="text"
                  placeholder="/images/shibiru_logo.jpg ou link externo"
                  value={serviceForm.image_url}
                  onChange={e => setServiceForm({ ...serviceForm, image_url: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Etiqueta / Badge (Opcional)</label>
                <input
                  type="text"
                  placeholder="Ex: VIP, LANÇAMENTO, + PROCURADO"
                  value={serviceForm.badge}
                  onChange={e => setServiceForm({ ...serviceForm, badge: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Descrição Detalhada</label>
                <textarea
                  rows={3}
                  required
                  value={serviceForm.description}
                  onChange={e => setServiceForm({ ...serviceForm, description: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white resize-none"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setServiceModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-900 text-slate-400 font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold uppercase tracking-wider"
                >
                  Salvar Serviço
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Feedback Modal */}
      {feedbackModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
          <div 
            className="relative w-full max-w-md bg-[#080d1e] border border-cyan-500/40 rounded-3xl shadow-2xl p-6 space-y-4 my-6 text-left"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold font-display text-white">
                Adicionar Novo Feedback
              </h3>
              <button onClick={() => setFeedbackModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveFeedback} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Nome do Cliente</label>
                <input
                  type="text"
                  placeholder="Ex: @jogador_angola"
                  value={feedbackForm.customer_name}
                  onChange={e => setFeedbackForm({ ...feedbackForm, customer_name: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">URL da Captura / Imagem *</label>
                <input
                  type="text"
                  required
                  placeholder="Link da imagem ou upload"
                  value={feedbackForm.image_url}
                  onChange={e => setFeedbackForm({ ...feedbackForm, image_url: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Depoimento do Cliente</label>
                <textarea
                  rows={2}
                  placeholder="Ex: Recarga rápida demais, caiu em 2 minutos no ID!"
                  value={feedbackForm.description}
                  onChange={e => setFeedbackForm({ ...feedbackForm, description: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white resize-none"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setFeedbackModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-900 text-slate-400 font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold uppercase tracking-wider"
                >
                  Publicar Feedback
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Service Confirmation Modal (Guarantees smooth removal in any browser or iframe) */}
      {serviceToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-sm bg-[#080d1d] border border-red-500/40 rounded-2xl p-6 shadow-2xl shadow-red-950 text-left">
            <div className="flex items-center gap-3 text-red-400 mb-3">
              <div className="p-2.5 rounded-full bg-red-950 border border-red-800">
                <Trash2 className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white font-display">Remover Serviço</h3>
                <p className="text-xs text-slate-400">Esta ação é irreversível</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 mb-5 leading-relaxed">
              Tem certeza que deseja excluir o serviço <span className="font-bold text-white">"{serviceToDelete.name}"</span> do catálogo da 13SHIBIRU STORE?
            </p>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setServiceToDelete(null)}
                className="flex-1 py-2.5 rounded-xl bg-slate-900 text-slate-400 hover:text-white font-bold text-xs transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteService}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs tracking-wider uppercase transition-colors shadow-lg shadow-red-900/50"
              >
                Sim, Remover
              </button>
            </div>
          </div>
        </div>
      )}

    </section>
  );
};
