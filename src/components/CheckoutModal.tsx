import React, { useState } from 'react';
import { 
  X, 
  Copy, 
  Check, 
  Upload, 
  Send, 
  Smartphone, 
  CreditCard, 
  Clock, 
  MessageCircle, 
  ShieldCheck, 
  Sparkles,
  AlertCircle,
  QrCode
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { UserProfile, PaymentDetails } from '../types';
import { store } from '../lib/store';

interface CheckoutModalProps {
  item: {
    name: string;
    packageName?: string;
    priceKz: number;
    imageUrl?: string;
  };
  currentUser: UserProfile | null;
  paymentDetails: PaymentDetails;
  onClose: () => void;
  onRequireAuth: () => void;
  onOrderCreated: (orderId: string) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  item,
  currentUser,
  paymentDetails,
  onClose,
  onRequireAuth,
  onOrderCreated,
}) => {
  // Generated Order Number for this checkout session
  const [orderNumber] = useState(() => `SHB-${Math.floor(1000 + Math.random() * 9000)}`);
  const [playerId, setPlayerId] = useState(currentUser?.player_id || '');
  const [observation, setObservation] = useState('');
  const [proofImage, setProofImage] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  // Post submission state
  const [isSuccess, setIsSuccess] = useState(false);
  const [createdOrderId, setCreatedOrderId] = useState<string>('');

  const now = new Date();
  const formattedDate = `${now.toLocaleDateString('pt-AO')} às ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMessage('Por favor, selecione um arquivo de imagem válido (JPG, PNG).');
      return;
    }

    // Convert file to base64 for persistent storage
    const reader = new FileReader();
    reader.onload = () => {
      setProofImage(reader.result as string);
      setErrorMessage('');
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!currentUser) {
      onRequireAuth();
      return;
    }

    if (!playerId.trim()) {
      setErrorMessage('Por favor, digite o seu ID de jogador Free Fire.');
      return;
    }

    if (!proofImage) {
      setErrorMessage('Por favor, faça o upload da foto do seu comprovativo de pagamento.');
      return;
    }

    setLoading(true);

    try {
      const newOrder = await store.createOrder({
        service_name: item.packageName ? `${item.name} (${item.packageName})` : item.name,
        package_name: item.packageName,
        price_kz: item.priceKz,
        player_id: playerId.trim(),
        proof_url: proofImage,
        observation: observation.trim() || undefined,
      });

      // Trigger celebration confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (err) {
        // ignore confetti errors
      }

      setCreatedOrderId(newOrder.id);
      setIsSuccess(true);
      onOrderCreated(newOrder.id);
    } catch (err: any) {
      setErrorMessage(err?.message || 'Erro ao processar o seu pedido. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  // WhatsApp acceleration redirect
  const handleOpenWhatsApp = () => {
    const phone = paymentDetails.whatsapp_support.replace(/[^0-9]/g, '');
    const userEmail = currentUser?.email || 'N/A';
    const message = `Olá suporte fiz o meu pedido no site e já enviei o comprovante agradecia que me acelerassem o meu processo!\nEmail: ${userEmail}\nPedido: #${orderNumber}\nItem: ${item.name} (${item.priceKz.toLocaleString('pt-AO')} KZ)\nID Jogador: ${playerId}`;
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div 
        className="relative w-full max-w-2xl bg-[#080d1d] border border-cyan-500/40 rounded-3xl shadow-2xl shadow-cyan-950/80 overflow-hidden my-6 text-left"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-slate-800 bg-gradient-to-r from-cyan-950/40 to-transparent">
          <div className="flex items-center gap-2.5">
            <CreditCard className="w-5 h-5 text-cyan-400" />
            <h2 className="text-xl font-bold font-display text-white">
              {isSuccess ? 'COMPRA REGISTRADA' : 'FINALIZAR PEDIDO'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-slate-900 text-slate-400 hover:text-white border border-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-5 sm:p-7 max-h-[80vh] overflow-y-auto space-y-6">
          
          {/* If SUCCESS STATE (Requirements 10 & 11) */}
          {isSuccess ? (
            <div className="text-center py-6 space-y-6 animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-full bg-cyan-950 border-2 border-cyan-400 flex items-center justify-center mx-auto text-cyan-400 shadow-lg shadow-cyan-500/30">
                <Sparkles className="w-8 h-8 animate-spin" />
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-black font-display text-white">
                  Pedido #{orderNumber} Registrado!
                </h3>
                <p className="text-slate-300 text-sm sm:text-base max-w-md mx-auto leading-relaxed">
                  Recebemos o seu comprovativo. Aguarde alguns minutos enquanto verificamos a sua compra!
                </p>
              </div>

              {/* Accelerate Prompt */}
              <div className="p-6 rounded-2xl bg-gradient-to-b from-[#0e1933] to-[#070d1d] border border-cyan-500/40 space-y-4">
                <div className="flex items-center justify-center gap-2 text-cyan-300 font-bold text-sm">
                  <Smartphone className="w-4 h-4 text-cyan-400" />
                  <span>Quer acelerar a sua compra?</span>
                </div>
                
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  Envie o comprovativo diretamente no nosso WhatsApp oficial de suporte para a equipe creditar os diamantes imediatamente no seu Free Fire.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                  <button
                    id="support-accelerate-btn"
                    onClick={handleOpenWhatsApp}
                    className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-black font-black font-display text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/30 active:scale-95 transition-all cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4 text-black" />
                    <span>SIM, FALAR COM SUPORTE</span>
                  </button>

                  <button
                    id="support-decline-btn"
                    onClick={onClose}
                    className="px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold text-xs uppercase tracking-wider border border-slate-800 transition-colors cursor-pointer"
                  >
                    NÃO, VER MEUS PEDIDOS
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* REQUIREMENT 8: RESUMO DO PEDIDO */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#0b1328] border border-cyan-500/30 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                  <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider font-tech">
                    RESUMO DO PEDIDO
                  </span>
                  <span className="text-xs font-tech text-slate-400">
                    #{orderNumber}
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  {item.imageUrl && (
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-16 h-16 rounded-xl object-cover border border-cyan-500/30 shrink-0"
                      referrerPolicy="no-referrer"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-base font-bold text-white truncate font-display">
                      {item.name}
                    </h4>
                    {item.packageName && (
                      <p className="text-xs text-cyan-300 font-medium truncate">
                        {item.packageName}
                      </p>
                    )}
                    <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-1">
                      <Clock className="w-3 h-3" />
                      <span>{formattedDate}</span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-xl font-black font-display text-cyan-400">
                      {item.priceKz.toLocaleString('pt-AO')}
                    </span>
                    <span className="text-xs font-bold text-white ml-1">KZ</span>
                  </div>
                </div>

                {currentUser && (
                  <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
                    <span>Email do Comprador:</span>
                    <span className="font-semibold text-slate-200">{currentUser.email}</span>
                  </div>
                )}
              </div>

              {/* REQUIREMENT 8: FORMAS DE PAGAMENTO COM BOTÃO DE CÓPIA */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-tech">
                    FORMAS DE PAGAMENTO
                  </h3>
                  <span className="text-[11px] text-cyan-400 font-medium">
                    Clique para copiar
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  
                  {/* MULTICAIXA EXPRESS */}
                  <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between hover:border-cyan-500/40 transition-colors">
                    <div>
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-cyan-400 block font-tech">
                        MULTICAIXA EXPRESS
                      </span>
                      <span className="text-sm font-black text-white font-mono">
                        {paymentDetails.multicaixa_express}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy(paymentDetails.multicaixa_express, 'mcx')}
                      className="p-2 rounded-lg bg-slate-800 hover:bg-cyan-950 text-slate-300 hover:text-cyan-400 border border-slate-700 transition-colors cursor-pointer"
                      title="Copiar número"
                    >
                      {copiedKey === 'mcx' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* PAY PAY */}
                  <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between hover:border-cyan-500/40 transition-colors">
                    <div>
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-400 block font-tech">
                        PAY PAY
                      </span>
                      <span className="text-sm font-black text-white font-mono">
                        {paymentDetails.pay_pay}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy(paymentDetails.pay_pay, 'paypay')}
                      className="p-2 rounded-lg bg-slate-800 hover:bg-blue-950 text-slate-300 hover:text-blue-400 border border-slate-700 transition-colors cursor-pointer"
                      title="Copiar número"
                    >
                      {copiedKey === 'paypay' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* IBAN BIC */}
                  <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between hover:border-cyan-500/40 transition-colors sm:col-span-2">
                    <div className="min-w-0 flex-1 pr-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-400 block font-tech">
                          IBAN BIC
                        </span>
                        <span className="text-[10px] text-slate-400 truncate">
                          ({paymentDetails.account_name})
                        </span>
                      </div>
                      <span className="text-xs font-black text-white font-mono break-all">
                        {paymentDetails.iban_bic}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy(paymentDetails.iban_bic, 'iban')}
                      className="p-2 rounded-lg bg-slate-800 hover:bg-emerald-950 text-slate-300 hover:text-emerald-400 border border-slate-700 transition-colors cursor-pointer shrink-0"
                      title="Copiar IBAN"
                    >
                      {copiedKey === 'iban' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* PIX */}
                  <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between hover:border-cyan-500/40 transition-colors sm:col-span-2">
                    <div>
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-yellow-400 block font-tech">
                        PIX (CHAVE)
                      </span>
                      <span className="text-sm font-black text-white font-mono">
                        {paymentDetails.pix}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy(paymentDetails.pix, 'pix')}
                      className="p-2 rounded-lg bg-slate-800 hover:bg-yellow-950 text-slate-300 hover:text-yellow-400 border border-slate-700 transition-colors cursor-pointer"
                      title="Copiar PIX"
                    >
                      {copiedKey === 'pix' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>

                </div>

                {copiedKey && (
                  <p className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Informação copiada para a área de transferência!
                  </p>
                )}
              </div>

              {/* REQUIREMENT 9: FORMULÁRIO ENVIAR COMPROVATIVO E O ID */}
              <form onSubmit={handleSubmit} className="space-y-4 pt-2 border-t border-slate-800">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-cyan-400" />
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider font-tech">
                    ENVIAR COMPROVATIVO E O ID
                  </h3>
                </div>

                {/* Free Fire Player ID */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    ID do jogador/cliente (Free Fire) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: 298174563"
                    value={playerId}
                    onChange={e => setPlayerId(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 focus:border-cyan-400 focus:outline-none text-white text-sm font-mono tracking-wider"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    Encontre seu ID no perfil dentro do jogo Free Fire (número com 8 a 10 dígitos).
                  </p>
                </div>

                {/* Proof Image Upload */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Upload do Comprovativo de Pagamento *
                  </label>
                  
                  <div className="relative border-2 border-dashed border-slate-700 hover:border-cyan-500/60 rounded-2xl p-4 text-center bg-slate-950/60 transition-colors">
                    {proofImage ? (
                      <div className="relative inline-block">
                        <img
                          src={proofImage}
                          alt="Comprovativo"
                          className="max-h-48 rounded-xl object-contain border border-cyan-500/40 shadow-lg mx-auto"
                        />
                        <button
                          type="button"
                          onClick={() => setProofImage(null)}
                          className="absolute -top-2 -right-2 p-1.5 bg-red-600 hover:bg-red-500 text-white rounded-full shadow"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <label className="cursor-pointer block py-4">
                        <Upload className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
                        <span className="text-xs font-bold text-slate-200 block">
                          Clique para selecionar ou arraste o comprovativo
                        </span>
                        <span className="text-[11px] text-slate-400 block mt-0.5">
                          Formatos aceitos: JPG, PNG, WEBP (Captura de tela do banco)
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                </div>

                {/* Optional Note */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Observação Opcional
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Ex: Nome do titular da conta bancária de onde transferiu..."
                    value={observation}
                    onChange={e => setObservation(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 focus:border-cyan-400 focus:outline-none text-white text-xs resize-none"
                  />
                </div>

                {/* Error Banner */}
                {errorMessage && (
                  <div className="p-3 rounded-xl bg-red-950/60 border border-red-600/50 text-red-300 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* Submission Button */}
                <div className="pt-2">
                  <button
                    id="submit-proof-btn"
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 disabled:opacity-50 text-black font-black font-display text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-cyan-400/30 active:scale-95 transition-all cursor-pointer"
                  >
                    {loading ? (
                      <span>Enviando Comprovativo...</span>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Enviar Comprovativo</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </>
          )}

        </div>
      </div>
    </div>
  );
};
