import React from 'react';
import { 
  ShieldCheck, 
  Flame, 
  MessageCircle, 
  Gem, 
  Lock, 
  Smartphone, 
  CreditCard 
} from 'lucide-react';

interface FooterProps {
  onGoToDiamonds: () => void;
  onGoToServices: () => void;
  onGoToFeedbacks: () => void;
  onGoToSupport: () => void;
  whatsappNumber: string;
}

export const Footer: React.FC<FooterProps> = ({
  onGoToDiamonds,
  onGoToServices,
  onGoToFeedbacks,
  onGoToSupport,
  whatsappNumber,
}) => {
  return (
    <footer className="bg-[#03060f] border-t border-cyan-500/20 pt-16 pb-12 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-900">
          
          {/* Brand & Mission */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden p-0.5 bg-gradient-to-tr from-cyan-400 to-blue-600 shadow-md">
                <img 
                  src="/images/shibiru_logo.jpg" 
                  alt="13SHIBIRU" 
                  className="w-full h-full object-cover rounded-full"
                  referrerPolicy="no-referrer"
                />
              </div>
              <span className="text-xl font-black font-display text-white">
                13<span className="text-cyan-400">SHIBIRU</span>
              </span>
            </div>

            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              A loja gamer pioneira em Angola especializada em recargas diretas de diamantes Free Fire, Passes Booyah, Skins e configurações de sensibilidade VIP com máxima segurança e agilidade.
            </p>

            <div className="flex items-center gap-2 text-cyan-400 font-semibold text-xs pt-1">
              <ShieldCheck className="w-4 h-4" />
              <span>Garantia de entrega 100% oficial via ID</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-tech">
              Navegação
            </h4>
            <ul className="space-y-2">
              <li>
                <button onClick={onGoToDiamonds} className="hover:text-cyan-400 transition-colors">
                  Tabela de Diamantes
                </button>
              </li>
              <li>
                <button onClick={onGoToServices} className="hover:text-cyan-400 transition-colors">
                  Catálogo de Serviços
                </button>
              </li>
              <li>
                <button onClick={onGoToFeedbacks} className="hover:text-cyan-400 transition-colors">
                  Feedbacks de Clientes
                </button>
              </li>
              <li>
                <button onClick={onGoToSupport} className="hover:text-cyan-400 transition-colors">
                  Suporte Oficial
                </button>
              </li>
            </ul>
          </div>

          {/* Payment Methods */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-tech">
              Pagamentos Aceitos
            </h4>
            <ul className="space-y-2 text-slate-300">
              <li className="flex items-center gap-1.5">
                <Smartphone className="w-3.5 h-3.5 text-cyan-400" />
                <span>Multicaixa Express</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Smartphone className="w-3.5 h-3.5 text-blue-400" />
                <span>Pay Pay Angola</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-emerald-400" />
                <span>IBAN BIC</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-yellow-400" />
                <span>PIX</span>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-tech">
              Atendimento WhatsApp
            </h4>
            <p className="text-xs text-slate-400">
              Segunda a Domingo, das 07h às 23h.
            </p>
            <a
              href={`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-950 text-emerald-400 border border-emerald-800 hover:bg-emerald-900 transition-colors font-bold text-xs"
            >
              <MessageCircle className="w-4 h-4" />
              <span>{whatsappNumber}</span>
            </a>
          </div>

        </div>

        {/* Bottom copyright and disclaimer */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left text-[11px] text-slate-500">
          <p>© {new Date().getFullYear()} 13SHIBIRU STORE. Todos os direitos reservados.</p>
          <p className="flex items-center gap-1">
            <Lock className="w-3 h-3 text-cyan-500" />
            Conexão Segura & Banco de Dados Criptografado
          </p>
        </div>

      </div>
    </footer>
  );
};
