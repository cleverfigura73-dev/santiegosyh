import React from 'react';
import { 
  Headphones, 
  MessageCircle, 
  Clock, 
  ShieldCheck, 
  HelpCircle, 
  ChevronDown 
} from 'lucide-react';
import { UserProfile, OrderItem } from '../types';

interface SupportSectionProps {
  currentUser: UserProfile | null;
  latestOrder?: OrderItem;
  whatsappNumber: string;
}

export const SupportSection: React.FC<SupportSectionProps> = ({
  currentUser,
  latestOrder,
  whatsappNumber,
}) => {
  const cleanPhone = whatsappNumber.replace(/[^0-9]/g, '');

  const handleOpenWhatsApp = () => {
    let message = 'Olá suporte, preciso de ajuda com o meu pedido no site.';
    if (currentUser) {
      message += `\nEmail: ${currentUser.email}`;
    }
    if (latestOrder) {
      message += `\nID: #${latestOrder.order_number} (Jogador: ${latestOrder.player_id})`;
    } else if (currentUser?.player_id) {
      message += `\nID: ${currentUser.player_id}`;
    }

    const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const FAQS = [
    {
      q: 'Quanto tempo demora para os diamantes caírem na minha conta Free Fire?',
      a: 'Assim que o comprovativo for conferido pela nossa equipe, o envio é realizado em média entre 3 a 15 minutos diretamente pelo seu ID do jogo.',
    },
    {
      q: 'Onde encontro o meu ID do Free Fire?',
      a: 'Abra o Free Fire, toque na sua foto de perfil no canto superior esquerdo da tela inicial. O seu ID é a sequência numérica localizada logo abaixo do seu apelido.',
    },
    {
      q: 'Existe algum risco da minha conta ser banida?',
      a: 'Não! Todas as recargas da 13SHIBIRU são 100% oficiais e feitas de forma legal através dos canais autorizados da Garena. Não pedimos senha nem dados de acesso da sua conta.',
    },
    {
      q: 'Quais métodos de pagamento são aceitos?',
      a: 'Aceitamos Multicaixa Express, Pay Pay, Transferência bancária IBAN BIC (Banco BIC) e PIX.',
    },
  ];

  return (
    <section id="support-section" className="py-14 sm:py-20 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Support Card Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-950/70 border border-cyan-500/30 text-cyan-400 text-xs font-bold uppercase tracking-wider">
            <Headphones className="w-3.5 h-3.5 text-cyan-400" />
            CENTRAL DE AJUDA
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-white tracking-tight">
            SUPORTE <span className="text-cyan-400 drop-shadow-[0_0_12px_rgba(6,182,212,0.6)]">13SHIBIRU</span>
          </h2>
          <p className="text-slate-300 text-sm sm:text-base">
            Estamos online todos os dias para esclarecer dúvidas, agilizar entregas e prestar assistência completa.
          </p>
        </div>

        {/* Big WhatsApp CTA Card (Requirement 12) */}
        <div className="relative rounded-3xl p-8 sm:p-10 bg-gradient-to-br from-[#0c1836] via-[#081024] to-[#040813] border-2 border-cyan-500/40 shadow-2xl shadow-cyan-950/80 text-center space-y-6 overflow-hidden">
          
          {/* Ambient Glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-emerald-500 to-green-600 flex items-center justify-center mx-auto text-black shadow-lg shadow-emerald-500/30">
            <MessageCircle className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <h3 className="text-2xl sm:text-3xl font-black font-display text-white">
              Precisa de ajuda com o seu pedido?
            </h3>
            <p className="text-slate-300 text-sm sm:text-base max-w-md mx-auto leading-relaxed">
              Fale agora com a nossa equipe de atendimento oficial através do WhatsApp e receba suporte imediato.
            </p>
          </div>

          {/* User Details Notice */}
          {currentUser && (
            <div className="p-3 max-w-md mx-auto rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-400">
              Sua mensagem será enviada associada ao email: <strong className="text-white">{currentUser.email}</strong>
              {latestOrder && <span> • Pedido recente: <strong className="text-cyan-400">#{latestOrder.order_number}</strong></span>}
            </div>
          )}

          {/* Action Button (Requirement 12) */}
          <div>
            <button
              id="whatsapp-support-main-btn"
              onClick={handleOpenWhatsApp}
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-emerald-400 to-green-500 hover:from-emerald-300 hover:to-green-400 text-black font-black font-display tracking-wider text-sm sm:text-base uppercase flex items-center justify-center gap-3 mx-auto shadow-xl shadow-emerald-500/30 active:scale-95 transition-all cursor-pointer"
            >
              <MessageCircle className="w-5 h-5 text-black" />
              <span>FALAR COM SUPORTE NO WHATSAPP</span>
            </button>
            <p className="text-xs text-slate-400 mt-2 font-mono">
              Número: {whatsappNumber}
            </p>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-slate-800 text-xs text-slate-300">
            <div className="flex items-center justify-center gap-2">
              <Clock className="w-4 h-4 text-cyan-400" />
              <span>Tempo médio: ~5 minutos</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <span>Atendimento Oficial e Seguro</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <HelpCircle className="w-4 h-4 text-cyan-400" />
              <span>Dúvidas sobre ID e Recargas</span>
            </div>
          </div>
        </div>

        {/* FAQs */}
        <div className="mt-14 space-y-4">
          <h3 className="text-lg font-bold font-display text-white text-center sm:text-left mb-4">
            Perguntas Frequentes
          </h3>

          <div className="space-y-3">
            {FAQS.map((faq, index) => (
              <details
                key={index}
                className="group rounded-xl bg-slate-900/60 border border-slate-800 p-4 transition-all duration-200 open:border-cyan-500/40 open:bg-slate-900"
              >
                <summary className="flex items-center justify-between cursor-pointer font-semibold text-sm text-white list-none">
                  <span>{faq.q}</span>
                  <ChevronDown className="w-4 h-4 text-slate-400 group-open:rotate-180 transition-transform" />
                </summary>
                <p className="text-xs sm:text-sm text-slate-300 mt-3 leading-relaxed pt-2 border-t border-slate-800/80">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
