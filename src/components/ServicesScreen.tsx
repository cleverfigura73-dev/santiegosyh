import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  LayoutDashboard, 
  ShoppingBag, 
  LogOut, 
  PlusCircle, 
  Sparkles 
} from 'lucide-react';
import { 
  UserProfile, 
  ServiceItem, 
  DiamondPackage, 
  OrderItem, 
  FeedbackItem, 
  NotificationItem, 
  PaymentDetails 
} from '../types';
import { store } from '../lib/store';
import { Header } from './Header';
import { Hero } from './Hero';
import { ServicesSection } from './ServicesSection';
import { DiamondsSection } from './DiamondsSection';
import { FeedbacksSection } from './FeedbacksSection';
import { SupportSection } from './SupportSection';
import { MyOrders } from './MyOrders';
import { AdminPanel } from './AdminPanel';
import { CheckoutModal } from './CheckoutModal';
import { Footer } from './Footer';

interface ServicesScreenProps {
  currentUser: UserProfile;
  onLogout: () => void;
  services: ServiceItem[];
  diamondPackages: DiamondPackage[];
  feedbacks: FeedbackItem[];
  orders: OrderItem[];
  notifications: NotificationItem[];
  paymentDetails: PaymentDetails;
  onRefreshStore: () => void;
}

export const ServicesScreen: React.FC<ServicesScreenProps> = ({
  currentUser,
  onLogout,
  services,
  diamondPackages,
  feedbacks,
  orders,
  notifications,
  paymentDetails,
  onRefreshStore,
}) => {
  const isAdminUser = Boolean(currentUser?.role === 'admin' || store.isAdmin());

  // Navigation state within the Services Screen:
  // When an Administrator logs in, start DIRECTLY inside the 'admin' panel with all controls!
  const [currentView, setCurrentView] = useState<string>(() => (isAdminUser ? 'admin' : 'services'));

  // Ensure if an administrator logs in, we prioritize opening the Admin Panel
  useEffect(() => {
    if (isAdminUser) {
      setCurrentView('admin');
    }
  }, [isAdminUser, currentUser.id, currentUser.email]);
  
  // Checkout flow state
  const [checkoutItem, setCheckoutItem] = useState<{
    name: string;
    packageName?: string;
    category?: string;
    priceKz: number;
    imageUrl?: string;
  } | null>(null);

  // If on admin view but not admin, fallback to services
  if (currentView === 'admin' && !isAdminUser) {
    setCurrentView('services');
  }

  // Handle purchase initiation
  const handleStartPurchase = (item: {
    name: string;
    packageName?: string;
    category?: string;
    priceKz: number;
    imageUrl?: string;
  }) => {
    setCheckoutItem(item);
  };

  return (
    <div className="min-h-screen bg-[#040714] text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-black animate-in fade-in duration-300">
      
      {/* Services Screen Dedicated Header */}
      <Header
        currentView={currentView}
        setCurrentView={setCurrentView}
        currentUser={currentUser}
        isAdmin={isAdminUser}
        onOpenAuth={() => {}}
        onLogout={onLogout}
        notifications={notifications}
        onMarkNotificationRead={(id) => store.markNotificationAsRead(id)}
        onMarkAllNotificationsRead={() => store.markAllNotificationsAsRead()}
      />

      {/* EXECUTIVE ADMIN BAR - Exclusively visible when Administrator is authenticated */}
      {isAdminUser && (
        <div className="bg-gradient-to-r from-red-950 via-[#0a0f24] to-red-950 border-b border-red-500/40 px-4 py-2.5 shadow-xl shadow-red-950/30 sticky top-20 z-30 backdrop-blur-md">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2.5">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-md bg-red-600 text-white shadow-md shadow-red-600/50 flex items-center justify-center">
                <Shield className="w-4 h-4" />
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-white text-xs sm:text-sm tracking-wide font-display">
                    PAINEL DO ADMINISTRADOR
                  </span>
                  <span className="px-2 py-0.2 rounded-full text-[10px] font-black uppercase bg-red-500/20 text-red-400 border border-red-500/40 animate-pulse">
                    ATIVO
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 font-mono hidden sm:block">
                  Sessão: {currentUser.email} • Postar serviços, aprovar pedidos e comprovativos
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentView('admin')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  currentView === 'admin'
                    ? 'bg-red-600 text-white shadow-md shadow-red-600/50 font-black ring-1 ring-red-400'
                    : 'bg-slate-900 text-red-300 hover:bg-slate-800 border border-red-800/60'
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>Painel Admin</span>
              </button>

              <button
                onClick={() => setCurrentView('services')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  currentView === 'services'
                    ? 'bg-cyan-500 text-black shadow-md shadow-cyan-500/30 font-black'
                    : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-700'
                }`}
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Ver Loja (Modo Cliente)</span>
              </button>

              <button
                onClick={onLogout}
                className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-red-400 hover:bg-red-950/40 border border-transparent hover:border-red-800/40 flex items-center gap-1 transition-all cursor-pointer"
                title="Encerrar Sessão de Administrador"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sair</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area for Services & Store */}
      <main className="flex-1">
        
        {/* 1. TELA PRINCIPAL DE SERVIÇOS (Default: BOOYAH, CONTAS, SKINS, SENSIBILIDADE, etc.) */}
        {(currentView === 'services' || currentView === 'home') && (
          <div className="animate-in fade-in duration-200">
            <Hero
              onGoToDiamonds={() => setCurrentView('diamonds')}
              onGoToServices={() => {
                const el = document.getElementById('services-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
            />

            {/* Services Section with All Categories: BOOYAH, CONTAS, SKINS, SENSIBILIDADE, etc. */}
            <ServicesSection
              services={services}
              onBuyService={(service) => {
                handleStartPurchase({
                  name: service.name,
                  category: service.category,
                  priceKz: service.price_kz,
                  imageUrl: service.image_url,
                });
              }}
            />

            {/* Diamonds Section embedded for easy access */}
            <div className="border-t border-cyan-500/10">
              <DiamondsSection
                packages={diamondPackages}
                onSelectPackage={(pkg) => {
                  handleStartPurchase({
                    name: pkg.name,
                    category: 'Diamantes',
                    packageName: pkg.diamonds_count > 0 ? `${pkg.diamonds_count} Diamantes` : undefined,
                    priceKz: pkg.price_kz,
                    imageUrl: '/images/diamonds_banner.jpg',
                  });
                }}
              />
            </div>

            {/* Customer Feedbacks */}
            <FeedbacksSection feedbacks={feedbacks} />

            {/* Support section */}
            <SupportSection
              currentUser={currentUser}
              latestOrder={orders[0]}
              whatsappNumber={paymentDetails.whatsapp_support}
            />
          </div>
        )}

        {/* 2. TABELA EXCLUSIVA DE DIAMANTES */}
        {currentView === 'diamonds' && (
          <div className="pt-6 animate-in fade-in duration-200">
            <DiamondsSection
              packages={diamondPackages}
              onSelectPackage={(pkg) => {
                handleStartPurchase({
                  name: pkg.name,
                  packageName: pkg.diamonds_count > 0 ? `${pkg.diamonds_count} Diamantes` : undefined,
                  priceKz: pkg.price_kz,
                  imageUrl: '/images/diamonds_banner.jpg',
                });
              }}
            />
          </div>
        )}

        {/* 3. HISTÓRICO DE PEDIDOS DO CLIENTE */}
        {currentView === 'orders' && (
          <div className="animate-in fade-in duration-200">
            <MyOrders
              orders={orders}
              onGoToStore={() => setCurrentView('services')}
            />
          </div>
        )}

        {/* 4. FEEDBACKS DOS CLIENTES */}
        {currentView === 'feedbacks' && (
          <div className="pt-6 animate-in fade-in duration-200">
            <FeedbacksSection feedbacks={feedbacks} />
          </div>
        )}

        {/* 5. SUPORTE OFICIAL WHATSAPP */}
        {currentView === 'support' && (
          <div className="pt-6 animate-in fade-in duration-200">
            <SupportSection
              currentUser={currentUser}
              latestOrder={orders[0]}
              whatsappNumber={paymentDetails.whatsapp_support}
            />
          </div>
        )}

        {/* 6. PAINEL ADMIN (GERENCIAMENTO, ADIÇÃO E EXCLUSÃO DE SERVIÇOS) */}
        {currentView === 'admin' && isAdminUser && (
          <div className="animate-in fade-in duration-200">
            <AdminPanel
              orders={orders}
              services={services}
              feedbacks={feedbacks}
              paymentDetails={paymentDetails}
              onRefresh={onRefreshStore}
            />
          </div>
        )}

      </main>

      {/* Services Screen Footer */}
      <Footer
        onGoToDiamonds={() => setCurrentView('diamonds')}
        onGoToServices={() => setCurrentView('services')}
        onGoToFeedbacks={() => setCurrentView('feedbacks')}
        onGoToSupport={() => setCurrentView('support')}
        whatsappNumber={paymentDetails.whatsapp_support}
      />

      {/* Checkout & Payment Modal */}
      {checkoutItem && (
        <CheckoutModal
          item={checkoutItem}
          currentUser={currentUser}
          paymentDetails={paymentDetails}
          onClose={() => setCheckoutItem(null)}
          onRequireAuth={() => {}}
          onOrderCreated={() => {
            onRefreshStore();
          }}
        />
      )}

    </div>
  );
};
