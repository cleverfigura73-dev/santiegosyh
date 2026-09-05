import React, { useState } from 'react';
import { 
  Mail, 
  Lock, 
  User, 
  Phone, 
  ArrowRight, 
  AlertCircle, 
  CheckCircle2, 
  Gamepad2, 
  KeyRound, 
  ShieldCheck, 
  Eye, 
  EyeOff
} from 'lucide-react';
import { store } from '../lib/store';
import { UserProfile } from '../types';

interface LoginScreenProps {
  onLoginSuccess: (user: UserProfile) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess }) => {
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>('login');
  
  // Form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [playerId, setPlayerId] = useState('');
  
  // UI states
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Handle Login / Register / Forgot Password
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (mode === 'login') {
      if (!email.trim() || !password) {
        setErrorMessage('Por favor, informe seu usuário/email e senha.');
        return;
      }

      setLoading(true);
      try {
        const res = await store.login(email.trim(), password);
        if (res.success) {
          const user = store.getCurrentUser();
          if (user) {
            onLoginSuccess(user);
          } else {
            setErrorMessage('Erro ao carregar os dados da sessão.');
          }
        } else {
          setErrorMessage(res.message || 'Credenciais inválidas. Verifique seus dados.');
        }
      } catch (err: any) {
        setErrorMessage(err?.message || 'Email ou senha inválidos.');
      } finally {
        setLoading(false);
      }
    } else if (mode === 'register') {
      if (!fullName.trim() || !email.trim() || !password) {
        setErrorMessage('Por favor, preencha seu nome, email e senha.');
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
        const res = await store.register({
          email: email.trim(),
          password,
          full_name: fullName.trim(),
          phone: phone.trim() || undefined,
          player_id: playerId.trim() || undefined,
        });

        if (res.success) {
          setSuccessMessage('Conta criada com sucesso! Acessando a loja...');
          setTimeout(() => {
            const user = store.getCurrentUser();
            if (user) onLoginSuccess(user);
          }, 800);
        } else {
          setErrorMessage(res.message || 'Falha ao criar conta. Tente novamente.');
        }
      } catch (err: any) {
        setErrorMessage(err?.message || 'Erro ao registrar usuário.');
      } finally {
        setLoading(false);
      }
    } else if (mode === 'forgot') {
      if (!email.trim()) {
        setErrorMessage('Informe seu email cadastrado para recuperação.');
        return;
      }

      setLoading(true);
      try {
        const res = await store.resetPassword(email.trim());
        if (res.success) {
          setSuccessMessage('Instruções de recuperação enviadas para o seu email.');
        } else {
          setErrorMessage(res.message || 'Erro ao enviar instruções de recuperação.');
        }
      } catch (err: any) {
        setErrorMessage(err?.message || 'Não foi possível processar a recuperação.');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-[100dvh] w-full flex flex-col justify-center items-center p-4 sm:p-6 bg-[#030611] text-slate-100 relative overflow-x-hidden selection:bg-cyan-500 selection:text-black">
      
      {/* Ambient background glow & gamer grid lines */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-cyan-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-[350px] h-[350px] bg-blue-600/10 rounded-full blur-3xl" />
        <div 
          className="absolute inset-0 opacity-[0.03]" 
          style={{
            backgroundImage: `linear-gradient(to right, #06b6d4 1px, transparent 1px), linear-gradient(to bottom, #06b6d4 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      {/* Main Login Card - Occupies the viewport cleanly, zero services underneath */}
      <div className="w-full max-w-md bg-[#070d1e]/95 backdrop-blur-2xl border border-cyan-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-cyan-950/80 relative z-10 my-auto">
        
        {/* Brand Header */}
        <div className="text-center pb-5 border-b border-slate-800/80">
          <div className="relative inline-block mb-3">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden p-1 bg-gradient-to-tr from-cyan-400 via-blue-500 to-indigo-600 shadow-xl shadow-cyan-500/25 mx-auto">
              <img 
                src="/images/shibiru_logo.jpg" 
                alt="13SHIBIRU" 
                className="w-full h-full object-cover rounded-xl"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute -bottom-1 -right-1 px-2 py-0.5 rounded-md bg-cyan-500 text-black font-black text-[10px] tracking-wider uppercase shadow-md">
              OFICIAL
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black font-display text-white tracking-wide">
            13<span className="text-cyan-400 drop-shadow-[0_0_15px_rgba(6,182,212,0.8)]">SHIBIRU</span> STORE
          </h1>
          <p className="text-xs text-slate-400 mt-1 font-medium">
            Loja Oficial de Diamantes, Passes e Serviços Free Fire em Angola
          </p>

          <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 text-[11px] font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span>Acesso Seguro & Criptografado</span>
          </div>
        </div>

        {/* Mode Selector (Tabs) */}
        <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-900/90 rounded-2xl border border-slate-800 my-5">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setErrorMessage('');
              setSuccessMessage('');
            }}
            className={`py-2 rounded-xl text-xs font-bold transition-all ${
              mode === 'login'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-black shadow-md shadow-cyan-500/25 font-black'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            ENTRAR
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('register');
              setErrorMessage('');
              setSuccessMessage('');
            }}
            className={`py-2 rounded-xl text-xs font-bold transition-all ${
              mode === 'register'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-black shadow-md shadow-cyan-500/25 font-black'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            CRIAR CONTA
          </button>
        </div>

        {/* Feedback Messages */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-red-950/70 border border-red-500/40 text-red-200 text-xs flex items-start gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-950/70 border border-emerald-500/40 text-emerald-200 text-xs flex items-start gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          
          {/* Register: Full Name */}
          {mode === 'register' && (
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Nome Completo *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  placeholder="Ex: António Silva"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-900/90 border border-slate-800 focus:border-cyan-400 focus:outline-none text-xs text-white placeholder-slate-500 transition-colors"
                />
              </div>
            </div>
          )}

          {/* Email / User Field */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              Email de Acesso *
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="seuemail@exemplo.com"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-900/90 border border-slate-800 focus:border-cyan-400 focus:outline-none text-xs text-white placeholder-slate-500 transition-colors"
              />
            </div>
          </div>

          {/* Register: Phone / WhatsApp */}
          {mode === 'register' && (
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                WhatsApp / Telefone (Opcional)
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="+244 9..."
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-900/90 border border-slate-800 focus:border-cyan-400 focus:outline-none text-xs text-white placeholder-slate-500 transition-colors"
                />
              </div>
            </div>
          )}

          {/* Register: Free Fire Player ID */}
          {mode === 'register' && (
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                ID do Jogador Free Fire (Opcional)
              </label>
              <div className="relative">
                <Gamepad2 className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={playerId}
                  onChange={e => setPlayerId(e.target.value)}
                  placeholder="Ex: 248910283"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-900/90 border border-slate-800 focus:border-cyan-400 focus:outline-none text-xs text-white placeholder-slate-500 transition-colors"
                />
              </div>
            </div>
          )}

          {/* Password Field (Shown in login & register) */}
          {mode !== 'forgot' && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-300">
                  Senha *
                </label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => {
                      setMode('forgot');
                      setErrorMessage('');
                      setSuccessMessage('');
                    }}
                    className="text-[11px] text-cyan-400 hover:underline"
                  >
                    Esqueceu a senha?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder={mode === 'register' ? 'Mínimo de 6 caracteres' : '••••••••'}
                  className="w-full pl-9 pr-10 py-2.5 rounded-xl bg-slate-900/90 border border-slate-800 focus:border-cyan-400 focus:outline-none text-xs text-white placeholder-slate-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}

          {/* Confirm Password (Register mode) */}
          {mode === 'register' && (
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Confirmar Senha *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="Repita sua senha"
                  className="w-full pl-9 pr-10 py-2.5 rounded-xl bg-slate-900/90 border border-slate-800 focus:border-cyan-400 focus:outline-none text-xs text-white placeholder-slate-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}

          {/* Forgot Password Mode Helper */}
          {mode === 'forgot' && (
            <p className="text-xs text-slate-400 leading-relaxed">
              Enviaremos um link para você redefinir sua senha com segurança.
            </p>
          )}

          {/* Main Action Button - ENTRAR */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 rounded-xl font-display font-black text-sm uppercase tracking-wider bg-gradient-to-r from-cyan-400 via-cyan-500 to-blue-600 text-black hover:brightness-110 active:scale-[0.98] transition-all shadow-lg shadow-cyan-500/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                VALIDANDO ACESSO...
              </span>
            ) : mode === 'login' ? (
              <>
                <span>ENTRAR</span>
                <ArrowRight className="w-4 h-4" />
              </>
            ) : mode === 'register' ? (
              <>
                <span>CRIAR CONTA & ENTRAR</span>
                <ArrowRight className="w-4 h-4" />
              </>
            ) : (
              <>
                <span>ENVIAR RECUPERAÇÃO</span>
                <KeyRound className="w-4 h-4" />
              </>
            )}
          </button>

          {/* Back to login if in forgot mode */}
          {mode === 'forgot' && (
            <button
              type="button"
              onClick={() => setMode('login')}
              className="w-full text-center text-xs text-slate-400 hover:text-cyan-400 py-1"
            >
              ← Voltar para o Login
            </button>
          )}

        </form>

      </div>

      {/* Footer copyright */}
      <div className="relative z-10 text-center py-4 text-[11px] text-slate-400">
        <p>© {new Date().getFullYear()} 13SHIBIRU STORE • Todos os direitos reservados.</p>
        <p className="text-[10px] text-slate-400 mt-0.5">
          Conexão Segura SSL • Entrega Direta de Diamantes via ID
        </p>
      </div>

    </div>
  );
};
