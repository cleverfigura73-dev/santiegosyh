import React, { useState } from 'react';
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
  // Navigation state within the Services Screen
  const [currentView, setCurrentView] = useState<string>('services');
  
  // Checkout flow state
  const [checkoutItem, setCheckoutItem] = useState<{
    name: string;
    packageName?: string;
    priceKz: number;
    imageUrl?: string;
  } | null>(null);

  const isAdminUser = store.isAdmin();

  // If on admin view but not admin, fallback to services
  if (currentView === 'admin' && !isAdminUser) {
    setCurrentView('services');
  }

  // Handle purchase initiation
  const handleStartPurchase = (item: {
    name: string;
    packageName?: string;
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
