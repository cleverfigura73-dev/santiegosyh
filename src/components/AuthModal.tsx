import React, { useState } from 'react';
import { 
  X, 
  Mail, 
  Lock, 
  User, 
  Phone, 
  ArrowRight, 
  AlertCircle, 
  CheckCircle2,
  Gamepad2,
  KeyRound
} from 'lucide-react';
import { store } from '../lib/store';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialMode?: 'login' | 'register';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialMode = 'login',
}) => {
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [playerId, setPlayerId] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (mode === 'register') {
      if (!fullName.trim() || !email.trim() || !password) {
        setErrorMessage('Por favor, preencha todos os campos obrigatórios.');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMessage('As senhas não coincidem.');
        return;
      }
      if (password.length < 6) {
        setErrorMessage('A senha deve conter no mínimo 6 caracteres.');
        return;
      }

      setLoading(true);
      try {
        await store.register({
          email: email.trim(),
          password,
          full_name: fullName.trim(),
          phone: phone.trim() || undefined,
          player_id: playerId.trim() || undefined,
        });
        setSuccessMessage('Conta criada com sucesso! Você já está conectado.');
        setTimeout(() => {
          onSuccess();
          onClose();
        }, 1000);
      } catch (err: any) {
        setErrorMessage(err?.message || 'Falha ao criar conta. Verifique os dados e tente novamente.');
      } finally {
        setLoading(false);
      }
    } else if (mode === 'login') {
      if (!email.trim() || !password) {
        setErrorMessage('Por favor, informe seu email e senha.');
        return;
      }

      setLoading(true);
      try {
        await store.login(email.trim(), password);
        onSuccess();
        onClose();
      } catch (err: any) {
        setErrorMessage(err?.message || 'Email ou senha inválidos.');
      } finally {
        setLoading(false);
      }
    } else if (mode === 'forgot') {
      if (!email.trim()) {
        setErrorMessage('Informe seu email para recuperação.');
        return;
      }
      setLoading(true);
      try {
        await store.resetPassword(email.trim());
        setSuccessMessage('Instruções de recuperação enviadas para o seu email.');
      } catch (err: any) {
        setErrorMessage(err?.message || 'Não foi possível enviar recuperação de senha.');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-md bg-[#080d1d] border border-cyan-500/40 rounded-3xl shadow-2xl shadow-cyan-950 overflow-hidden my-6 text-left animate-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-slate-900 text-slate-400 hover:text-white border border-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header with 13SHIBIRU logo */}
        <div className="p-6 sm:p-8 pb-4 text-center border-b border-slate-800 bg-gradient-to-b from-cyan-950/30 to-transparent">
          <div className="w-14 h-14 rounded-full overflow-hidden p-0.5 bg-gradient-to-tr from-cyan-400 to-blue-600 mx-auto mb-3 shadow-lg shadow-cyan-500/30">
            <img 
              src="/images/shibiru_logo.jpg" 
              alt="13SHIBIRU" 
              className="w-full h-full object-cover rounded-full"
              referrerPolicy="no-referrer"
            />
          </div>

          <h3 className="text-2xl font-black font-display text-white">
            13<span className="text-cyan-400">SHIBIRU</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            {mode === 'login' && 'Faça login para realizar recargas e acompanhar pedidos'}
            {mode === 'register' && 'Crie sua conta para comprar diamantes no Free Fire'}
            {mode === 'forgot' && 'Recuperação de acesso da sua conta'}
          </p>
        </div>

        {/* Tab switch */}
        {mode !== 'forgot' && (
          <div className="flex border-b border-slate-800">
            <button
              onClick={() => {
                setMode('login');
                setErrorMessage('');
              }}
              className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-colors ${
                mode === 'login'
                  ? 'text-cyan-400 border-b-2 border-cyan-400 bg-cyan-950/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Entrar
            </button>
            <button
              onClick={() => {
                setMode('register');
                setErrorMessage('');
              }}
              className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-colors ${
                mode === 'register'
                  ? 'text-cyan-400 border-b-2 border-cyan-400 bg-cyan-950/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Criar Conta
            </button>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-4">
          
          {/* Register: Full Name */}
          {mode === 'register' && (
            <div>
              <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                Nome Completo *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="Ex: Bartolomeu Silva"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>
          )}

          {/* Email */}
          <div>
            <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
              Email *
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="seuemail@exemplo.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          {/* Register: Phone and Player ID */}
          {mode === 'register' && (
            <>
              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Telefone / WhatsApp (Opcional)
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    placeholder="+244 952 778 374"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                  ID do Free Fire (Opcional)
                </label>
                <div className="relative">
                  <Gamepad2 className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Ex: 298174563"
                    value={playerId}
                    onChange={e => setPlayerId(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-mono"
                  />
                </div>
              </div>
            </>
          )}

          {/* Password (if not forgot mode) */}
          {mode !== 'forgot' && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                  Senha *
                </label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => {
                      setMode('forgot');
                      setErrorMessage('');
                    }}
                    className="text-[11px] text-cyan-400 hover:underline"
                  >
                    Esqueceu a senha?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>
          )}

          {/* Confirm Password (register only) */}
          {mode === 'register' && (
            <div>
              <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                Confirmar Senha *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>
          )}

          {/* Messages */}
          {errorMessage && (
            <div className="p-3 rounded-xl bg-red-950/60 border border-red-600/50 text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-600/50 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Submit Button */}
          <button
            id="auth-submit-btn"
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 disabled:opacity-50 text-black font-black font-display text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-cyan-400/25 active:scale-95 transition-all cursor-pointer"
          >
            {loading ? (
              <span>Processando...</span>
            ) : mode === 'login' ? (
              <>
                <span>Entrar na Conta</span>
                <ArrowRight className="w-4 h-4" />
              </>
            ) : mode === 'register' ? (
              <>
                <span>Criar Minha Conta</span>
                <ArrowRight className="w-4 h-4" />
              </>
            ) : (
              <>
                <KeyRound className="w-4 h-4" />
                <span>Enviar Instruções</span>
              </>
            )}
          </button>

          {mode === 'forgot' && (
            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setMode('login')}
                className="text-xs text-slate-400 hover:text-white"
              >
                Voltar para o Login
              </button>
            </div>
          )}

        </form>
      </div>
    </div>
  );
};
