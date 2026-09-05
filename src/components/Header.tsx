import React, { useState } from 'react';
import { 
  Shield, 
  Gem, 
  ShoppingBag, 
  MessageSquare, 
  Headphones, 
  User, 
  LogOut, 
  Menu, 
  X, 
  Bell, 
  CheckCircle2, 
  Clock, 
  ChevronRight,
  Flame
} from 'lucide-react';
import { UserProfile, NotificationItem } from '../types';

interface HeaderProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  currentUser: UserProfile | null;
  isAdmin: boolean;
  onOpenAuth: () => void;
  onLogout: () => void;
  notifications: NotificationItem[];
  onMarkNotificationRead: (id: string) => void;
  onMarkAllNotificationsRead: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  setCurrentView,
  currentUser,
  isAdmin,
  onOpenAuth,
  onLogout,
  notifications,
  onMarkNotificationRead,
  onMarkAllNotificationsRead,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const handleNav = (view: string) => {
    setCurrentView(view);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-[#050814]/95 backdrop-blur-md border-b border-cyan-500/20 shadow-lg shadow-black/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo Brand */}
          <div 
            id="brand-logo-btn"
            onClick={() => handleNav('home')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="relative w-12 h-12 rounded-full overflow-hidden p-0.5 bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-500 shadow-md shadow-cyan-500/30 group-hover:scale-105 transition-transform duration-300">
              <img 
                src="/images/shibiru_logo.jpg" 
                alt="13SHIBIRU Logo" 
                className="w-full h-full object-cover rounded-full"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 rounded-full border border-cyan-400/40 pointer-events-none"></div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-extrabold tracking-wider font-display text-white group-hover:text-cyan-400 transition-colors">
                  13<span className="text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]">SHIBIRU</span>
                </span>
                <span className="px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-cyan-950 text-cyan-400 border border-cyan-500/40 rounded flex items-center gap-1">
                  <Flame className="w-2.5 h-2.5 text-orange-400 fill-orange-400" /> FF STORE
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-tech tracking-wider hidden sm:block">
                LOJA OFICIAL FREE FIRE • ANGOLA
              </p>
            </div>
          </div>

          {/* Desktop Navigation Menu */}
          <nav className="hidden lg:flex items-center gap-1">
            <button
              id="nav-home-btn"
              onClick={() => handleNav('home')}
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                currentView === 'home'
                  ? 'text-cyan-400 bg-cyan-950/60 border border-cyan-500/30 shadow-[0_0_12px_rgba(6,182,212,0.2)]'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900/60'
              }`}
            >
              INÍCIO
            </button>

            <button
              id="nav-diamonds-btn"
              onClick={() => handleNav('diamonds')}
              className={`px-3 py-2 rounded-lg text-sm font-semibold flex items-center gap-1.5 transition-all duration-200 ${
                currentView === 'diamonds'
                  ? 'text-cyan-400 bg-cyan-950/60 border border-cyan-500/30 shadow-[0_0_12px_rgba(6,182,212,0.2)]'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900/60'
              }`}
            >
              <Gem className="w-4 h-4 text-cyan-400" />
              DIAMANTES
            </button>

            <button
              id="nav-services-btn"
              onClick={() => handleNav('services')}
              className={`px-3 py-2 rounded-lg text-sm font-semibold flex items-center gap-1.5 transition-all duration-200 ${
                currentView === 'services'
                  ? 'text-cyan-400 bg-cyan-950/60 border border-cyan-500/30 shadow-[0_0_12px_rgba(6,182,212,0.2)]'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900/60'
              }`}
            >
              <ShoppingBag className="w-4 h-4 text-blue-400" />
              SERVIÇOS
            </button>

            <button
              id="nav-feedbacks-btn"
              onClick={() => handleNav('feedbacks')}
              className={`px-3 py-2 rounded-lg text-sm font-semibold flex items-center gap-1.5 transition-all duration-200 ${
                currentView === 'feedbacks'
                  ? 'text-cyan-400 bg-cyan-950/60 border border-cyan-500/30 shadow-[0_0_12px_rgba(6,182,212,0.2)]'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900/60'
              }`}
            >
              <MessageSquare className="w-4 h-4 text-emerald-400" />
              FEEDBACKS
            </button>

            {currentUser && (
              <button
                id="nav-orders-btn"
                onClick={() => handleNav('orders')}
                className={`px-3 py-2 rounded-lg text-sm font-semibold flex items-center gap-1.5 transition-all duration-200 ${
                  currentView === 'orders'
                    ? 'text-cyan-400 bg-cyan-950/60 border border-cyan-500/30 shadow-[0_0_12px_rgba(6,182,212,0.2)]'
                    : 'text-slate-300 hover:text-white hover:bg-slate-900/60'
                }`}
              >
                MEUS PEDIDOS
              </button>
            )}

            <button
              id="nav-support-btn"
              onClick={() => handleNav('support')}
              className={`px-3 py-2 rounded-lg text-sm font-semibold flex items-center gap-1.5 transition-all duration-200 ${
                currentView === 'support'
                  ? 'text-cyan-400 bg-cyan-950/60 border border-cyan-500/30 shadow-[0_0_12px_rgba(6,182,212,0.2)]'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900/60'
              }`}
            >
              <Headphones className="w-4 h-4 text-yellow-400" />
              SUPORTE
            </button>

            {/* ADMIN BUTTON - STRICTLY VISIBLE ONLY FOR AUTHENTICATED ADMIN */}
            {isAdmin && (
              <button
                id="nav-admin-btn"
                onClick={() => handleNav('admin')}
                className={`px-3 py-2 rounded-lg text-sm font-bold flex items-center gap-1.5 transition-all duration-200 ${
                  currentView === 'admin'
                    ? 'text-white bg-red-600 shadow-[0_0_15px_rgba(239,68,68,0.5)] border border-red-400'
                    : 'text-red-400 bg-red-950/50 hover:bg-red-900/60 border border-red-800/60'
                }`}
              >
                <Shield className="w-4 h-4 text-red-400" />
                ADMIN
              </button>
            )}
          </nav>

          {/* Right Action Icons & Auth */}
          <div className="flex items-center gap-3">
            {/* Notification Bell */}
            {currentUser && (
              <div className="relative">
                <button
                  id="notifications-bell-btn"
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className="relative p-2.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-cyan-400 transition-colors border border-slate-800 hover:border-cyan-500/40"
                  title="Notificações"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-cyan-500 text-black text-xs font-black rounded-full flex items-center justify-center animate-bounce shadow-md shadow-cyan-500/50">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown */}
                {notificationsOpen && (
                  <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-[#080d1e] border border-cyan-500/40 rounded-xl shadow-2xl shadow-black p-4 z-50 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                      <div className="flex items-center gap-2">
                        <Bell className="w-4 h-4 text-cyan-400" />
                        <span className="font-bold text-white text-sm">Notificações</span>
                        {unreadCount > 0 && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 font-semibold">
                            {unreadCount} novas
                          </span>
                        )}
                      </div>
                      {unreadCount > 0 && (
                        <button
                          onClick={onMarkAllNotificationsRead}
                          className="text-xs text-cyan-400 hover:underline"
                        >
                          Marcar lidas
                        </button>
                      )}
                    </div>

                    <div className="max-h-72 overflow-y-auto divide-y divide-slate-800/60 mt-2">
                      {notifications.length === 0 ? (
                        <div className="py-8 text-center text-slate-400 text-xs">
                          Nenhuma notificação recebida ainda.
                        </div>
                      ) : (
                        notifications.map(n => (
                          <div 
                            key={n.id}
                            onClick={() => {
                              onMarkNotificationRead(n.id);
                              if (n.order_id) handleNav('orders');
                              setNotificationsOpen(false);
                            }}
                            className={`p-3 text-left transition-colors cursor-pointer hover:bg-slate-900/80 rounded-lg ${
                              !n.is_read ? 'bg-cyan-950/20 border-l-2 border-cyan-400' : ''
                            }`}
                          >
                            <div className="flex items-start gap-2.5">
                              <CheckCircle2 className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" />
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-semibold text-white truncate">{n.title}</p>
                                <p className="text-[11px] text-slate-300 mt-0.5 leading-relaxed">{n.message}</p>
                                <div className="flex items-center gap-1 text-[10px] text-slate-500 mt-1.5">
                                  <Clock className="w-3 h-3" />
                                  {new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Auth Button or User Profile pill */}
            {currentUser ? (
              <div className="flex items-center gap-2">
                <button
                  id="user-profile-header-btn"
                  onClick={() => handleNav('orders')}
                  className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-slate-700/60 hover:border-cyan-500/40 text-xs font-semibold transition-colors"
                >
                  <User className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="truncate max-w-[120px]">{currentUser.email}</span>
                </button>

                <button
                  id="logout-btn"
                  onClick={onLogout}
                  className="p-2.5 rounded-lg bg-slate-900/80 hover:bg-red-950/60 text-slate-400 hover:text-red-400 border border-slate-800 hover:border-red-500/40 transition-colors"
                  title="Terminar sessão"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                id="login-trigger-btn"
                onClick={onOpenAuth}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-bold text-xs uppercase tracking-wider shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all active:scale-95"
              >
                <User className="w-4 h-4 text-black" />
                <span>Entrar</span>
              </button>
            )}

            {/* Mobile Menu Hamburger Toggle */}
            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2.5 rounded-lg bg-slate-900 text-slate-300 hover:text-cyan-400 border border-slate-800"
              aria-label="Abrir Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#070b18] border-b border-cyan-500/30 px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top-4 duration-200">
          <button
            onClick={() => handleNav('home')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-semibold ${
              currentView === 'home' ? 'bg-cyan-950 text-cyan-400 border border-cyan-600/50' : 'text-slate-300 hover:bg-slate-900'
            }`}
          >
            <span>INÍCIO</span>
            <ChevronRight className="w-4 h-4 text-slate-500" />
          </button>

          <button
            onClick={() => handleNav('diamonds')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-semibold ${
              currentView === 'diamonds' ? 'bg-cyan-950 text-cyan-400 border border-cyan-600/50' : 'text-slate-300 hover:bg-slate-900'
            }`}
          >
            <span className="flex items-center gap-2">
              <Gem className="w-4 h-4 text-cyan-400" /> DIAMANTES
            </span>
            <ChevronRight className="w-4 h-4 text-slate-500" />
          </button>

          <button
            onClick={() => handleNav('services')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-semibold ${
              currentView === 'services' ? 'bg-cyan-950 text-cyan-400 border border-cyan-600/50' : 'text-slate-300 hover:bg-slate-900'
            }`}
          >
            <span className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-blue-400" /> SERVIÇOS
            </span>
            <ChevronRight className="w-4 h-4 text-slate-500" />
          </button>

          <button
            onClick={() => handleNav('feedbacks')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-semibold ${
              currentView === 'feedbacks' ? 'bg-cyan-950 text-cyan-400 border border-cyan-600/50' : 'text-slate-300 hover:bg-slate-900'
            }`}
          >
            <span className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-emerald-400" /> FEEDBACKS
            </span>
            <ChevronRight className="w-4 h-4 text-slate-500" />
          </button>

          {currentUser && (
            <button
              onClick={() => handleNav('orders')}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-semibold ${
                currentView === 'orders' ? 'bg-cyan-950 text-cyan-400 border border-cyan-600/50' : 'text-slate-300 hover:bg-slate-900'
              }`}
            >
              <span>MEUS PEDIDOS</span>
              <ChevronRight className="w-4 h-4 text-slate-500" />
            </button>
          )}

          <button
            onClick={() => handleNav('support')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-semibold ${
              currentView === 'support' ? 'bg-cyan-950 text-cyan-400 border border-cyan-600/50' : 'text-slate-300 hover:bg-slate-900'
            }`}
          >
            <span className="flex items-center gap-2">
              <Headphones className="w-4 h-4 text-yellow-400" /> SUPORTE
            </span>
            <ChevronRight className="w-4 h-4 text-slate-500" />
          </button>

          {isAdmin && (
            <button
              onClick={() => handleNav('admin')}
              className="w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-bold bg-red-950/70 text-red-400 border border-red-800"
            >
              <span className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-red-400" /> PAINEL ADMIN
              </span>
              <ChevronRight className="w-4 h-4 text-red-400" />
            </button>
          )}

          {currentUser ? (
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-400 truncate max-w-[200px]">{currentUser.email}</span>
              <button
                onClick={onLogout}
                className="text-xs text-red-400 hover:underline flex items-center gap-1 font-semibold"
              >
                <LogOut className="w-3.5 h-3.5" /> Sair
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAuth();
              }}
              className="w-full py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-bold text-sm tracking-wider uppercase mt-2 shadow-lg shadow-cyan-500/30"
            >
              Entrar ou Criar Conta
            </button>
          )}
        </div>
      )}
    </header>
  );
};
