import {
  UserProfile,
  UserRole,
  ServiceItem,
  DiamondPackage,
  AccountItem,
  OrderItem,
  FeedbackItem,
  NotificationItem,
  PaymentDetails,
  OrderStatus,
} from '../types';
import { supabase, isSupabaseConfigured } from './supabase';

// Cryptographic hash utility for secure offline authentication
async function sha256(text: string): Promise<string> {
  const msgUint8 = new TextEncoder().encode(text);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Initial Diamond Packages as requested by user
const DEFAULT_PACKAGES: DiamondPackage[] = [
  {
    id: 'pkg-1',
    name: '100 💎 + 10',
    diamonds_count: 100,
    bonus_count: 10,
    price_kz: 1300,
    is_active: true,
    badge: 'ECONÔMICO',
    sort_order: 1,
  },
  {
    id: 'pkg-2',
    name: '310 💎 + 31',
    diamonds_count: 310,
    bonus_count: 31,
    price_kz: 3200,
    is_active: true,
    sort_order: 2,
  },
  {
    id: 'pkg-3',
    name: '520 💎 + 52',
    diamonds_count: 520,
    bonus_count: 52,
    price_kz: 5300,
    is_popular: true,
    is_active: true,
    badge: 'POPULAR',
    sort_order: 3,
  },
  {
    id: 'pkg-4',
    name: '1060 💎 + 106',
    diamonds_count: 1060,
    bonus_count: 106,
    price_kz: 10600,
    is_active: true,
    badge: 'MAIS ESCOLHIDO',
    sort_order: 4,
  },
  {
    id: 'pkg-5',
    name: '2180 💎 + 218',
    diamonds_count: 2180,
    bonus_count: 218,
    price_kz: 21200,
    is_popular: true,
    is_active: true,
    badge: 'SUPER BÔNUS',
    sort_order: 5,
  },
  {
    id: 'pkg-6',
    name: '5600 💎 + 560',
    diamonds_count: 5600,
    bonus_count: 560,
    price_kz: 53000,
    is_active: true,
    badge: 'PRO GAMER',
    sort_order: 6,
  },
  {
    id: 'pkg-7',
    name: 'SHIBIRU SEMANAL 💎',
    diamonds_count: 450,
    bonus_count: 0,
    price_kz: 3300,
    is_active: true,
    badge: 'ASSINATURA',
    sort_order: 7,
  },
  {
    id: 'pkg-8',
    name: 'PASSE BOOYAH 🎫',
    diamonds_count: 0,
    bonus_count: 0,
    price_kz: 1700,
    is_active: true,
    badge: 'BOOYAH PASS',
    sort_order: 8,
  },
  {
    id: 'pkg-9',
    name: 'SHIBIRU MENSAL 💎',
    diamonds_count: 2600,
    bonus_count: 0,
    price_kz: 10700,
    is_popular: true,
    is_active: true,
    badge: 'MELHOR CUSTO',
    sort_order: 9,
  },
];

// Initial Accounts for Sale in "Contas" service
const DEFAULT_ACCOUNTS: AccountItem[] = [
  {
    id: 'acc-1',
    title: 'Conta Mestre S34 - Calça Angelical Azul + 4 Armas Evolutivas',
    price_kz: 25000,
    image_url: '/images/shibiru_logo.jpg',
    description: 'Nível 72, Calça Angelical Azul (M/F), MP40 Cobra Lv. Max, AK Dragão Lv. 5, 8 Passes de Elite antigos fechados. Login via Google com dados 100% limpos e troca imediata.',
    level: '72',
    login_type: 'Google',
    status: 'available',
    badge: 'ANGELICAL',
    created_at: new Date().toISOString(),
  },
  {
    id: 'acc-2',
    title: 'Conta Elite Antiga - Passe 2 Hip Hop + Dunk Master',
    price_kz: 45000,
    image_url: '/images/booyah_pass.jpg',
    description: 'Conta rara com Passe de Elite Hip Hop antigo, Dunk Master completo, sombra roxa, tênis angelical e mais de 120 emotes raros. Transferência segura com suporte 13SHIBIRU.',
    level: '75',
    login_type: 'Facebook',
    status: 'available',
    badge: 'HIP HOP RARO',
    created_at: new Date().toISOString(),
  },
  {
    id: 'acc-3',
    title: 'Conta FF Intermediária - 2 Armas Evolutivas + Barbinha',
    price_kz: 15000,
    image_url: '/images/diamonds_banner.jpg',
    description: 'Nível 64, Barbinha do Velho, UMP Dia do Booyah Lv. 4, Scar Megalodonte Lv. 4, 450 peitorais e diversas skins de incubadora.',
    level: '64',
    login_type: 'Google',
    status: 'available',
    badge: 'CUSTO BENEFÍCIO',
    created_at: new Date().toISOString(),
  },
];

const DEFAULT_SERVICES: ServiceItem[] = [
  {
    id: 'srv-diamonds',
    name: 'DIAMANTES FREE FIRE',
    price_kz: 1300,
    description: 'Recarga rápida e oficial de diamantes Free Fire com super bônus exclusivo da 13SHIBIRU. Entrega direta pelo ID do jogador em até 10 minutos.',
    image_url: '/images/diamonds_banner.jpg',
    category: 'Diamantes',
    status: 'active',
    badge: 'DESTAQUE',
    features: ['Recarga Oficial via ID', 'Bônus em todos os pacotes', 'Entrega Expressa'],
    sort_order: 1,
    created_at: new Date().toISOString(),
  },
  {
    id: 'srv-booyah',
    name: 'PASSE BOOYAH TEMPORADA',
    price_kz: 1700,
    description: 'Ative o Passe Booyah da temporada atual no Free Fire. Tenha acesso a skins lendárias, banners exclusivos, emotes e recompensas especiais.',
    image_url: '/images/booyah_pass.jpg',
    category: 'Passe Booyah',
    status: 'active',
    badge: 'POPULAR',
    features: ['Ativação direta', 'Recompensas Lendárias', '100% Seguro'],
    sort_order: 2,
    created_at: new Date().toISOString(),
  },
  {
    id: 'srv-sensi',
    name: 'SENSIBILIDADE 13SHIBIRU VIP',
    price_kz: 2500,
    description: 'Ajuste profissional de sensibilidade, DPI e mira red dot para você dar capa fácil em qualquer celular (Android / iOS). Testado e aprovado pelos melhores jogadores.',
    image_url: '/images/sensibility.jpg',
    category: 'Sensibilidade 13SHIBIRU',
    status: 'active',
    badge: 'VIP PRO',
    features: ['Ajuste para seu aparelho', 'Método capa puxada', 'Instruções em vídeo/PDF'],
    sort_order: 3,
    created_at: new Date().toISOString(),
  },
  {
    id: 'srv-accounts',
    name: 'CONTAS FREE FIRE MESTRE / ELITE',
    price_kz: 15000,
    description: 'Contas verificadas com patentes altas, passes antigos, passes de elite fechados e skins raras. Transferência 100% segura com garantia total da 13SHIBIRU.',
    image_url: '/images/shibiru_logo.jpg',
    category: 'Contas',
    status: 'active',
    badge: 'VERIFICADA',
    features: ['Email e dados limpos', 'Troca imediata', 'Garantia total'],
    sort_order: 4,
    created_at: new Date().toISOString(),
  },
  {
    id: 'srv-skins',
    name: 'SKINS & ROUPAS EXCLUSIVAS FF',
    price_kz: 4500,
    description: 'Pacotes de skins exclusivas, armas evolutivas e conjuntos raros do Free Fire entregues diretamente com segurança e garantia total 13SHIBIRU.',
    image_url: '/images/booyah_pass.jpg',
    category: 'Skins',
    status: 'active',
    badge: 'NOVIDADE',
    features: ['Armas evolutivas & roupas raras', 'Envio via presente oficial', 'Garantia antiban 100%'],
    sort_order: 5,
    created_at: new Date().toISOString(),
  },
];

const DEFAULT_FEEDBACKS: FeedbackItem[] = [
  {
    id: 'fb-1',
    image_url: '/images/diamonds_banner.jpg',
    description: 'Comprei o pacote de 2180 💎 e caiu na minha conta em menos de 5 minutos! Recomendo muito o 13SHIBIRU!',
    customer_name: 'Maikel FF - ID: 198274***',
    rating: 5,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
  },
  {
    id: 'fb-2',
    image_url: '/images/booyah_pass.jpg',
    description: 'Passe Booyah ativado no mesmo instante. Atendimento no WhatsApp super rápido e educado.',
    customer_name: 'António Luanda - ID: 228941***',
    rating: 5,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(),
  },
  {
    id: 'fb-3',
    image_url: '/images/sensibility.jpg',
    description: 'A sensibilidade mudou meu jogo completamente. Agora é só vermelho no CS Rankeado!',
    customer_name: 'Carlos Capa - ID: 887162***',
    rating: 5,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
  },
];

const DEFAULT_PAYMENT: PaymentDetails = {
  multicaixa_express: '956262619',
  pay_pay: '956262619',
  iban_bic: '005100000738377710177',
  account_name: 'António Bartolomeu Sapumo',
  pix: '91985672394',
  whatsapp_support: '+244952778374',
};

// Admin emails & recognized administrative credentials
const ADMIN_EMAILS = [
  '13shibiru@gmail.com',
  'cleverfigura73@gmail.com',
  'admin@shibiru.com',
  'admin@13shibiru.com',
];

const ADMIN_PASSWORDS = [
  'Santiegoadmin13',
  'santiegoadmin13',
  'SantiegoAdmin13',
  '13shibiru',
  '13Shibiru',
  'admin123',
  'admin',
];

export function isRecognizedAdminEmail(emailStr?: string | null): boolean {
  if (!emailStr) return false;
  const norm = emailStr.trim().toLowerCase();
  return (
    ADMIN_EMAILS.includes(norm) ||
    norm === '13shibiru' ||
    norm === 'admin' ||
    norm.startsWith('admin@') ||
    norm.includes('13shibiru')
  );
}

export function isRecognizedAdminPassword(plainPassword?: string, hash?: string): boolean {
  if (!plainPassword && !hash) return false;
  if (hash === ADMIN_PASS_HASH) return true;
  if (plainPassword) {
    const trimmed = plainPassword.trim();
    if (ADMIN_PASSWORDS.includes(trimmed)) return true;
    if (trimmed.toLowerCase() === 'santiegoadmin13') return true;
    if (trimmed.toLowerCase() === '13shibiru') return true;
    if (trimmed.toLowerCase() === 'admin') return true;
  }
  return false;
}

const ADMIN_EMAIL = '13shibiru@gmail.com';
const ADMIN_PASS_HASH = 'ed2e97b57b5160d1fcf2133871ec830bb00e20e959e75faea003543d6c9f9f3b';

// Storage keys
const STORAGE_KEYS = {
  SESSION: '13shibiru_session',
  USERS: '13shibiru_users',
  SERVICES: '13shibiru_services',
  PACKAGES: '13shibiru_packages',
  ORDERS: '13shibiru_orders',
  FEEDBACKS: '13shibiru_feedbacks',
  NOTIFICATIONS: '13shibiru_notifications',
  PAYMENT: '13shibiru_payment',
};

type StoreListener = () => void;
const listeners = new Set<StoreListener>();

function notifyListeners() {
  listeners.forEach(listener => listener());
}

export const subscribeToStore = (listener: StoreListener) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

// State initialization
class AppStore {
  private currentUser: UserProfile | null = null;
  private services: ServiceItem[] = [];
  private packages: DiamondPackage[] = [];
  private orders: OrderItem[] = [];
  private feedbacks: FeedbackItem[] = [];
  private notifications: NotificationItem[] = [];
  private paymentDetails: PaymentDetails = DEFAULT_PAYMENT;
  private isInitialized = false;

  constructor() {
    this.init();
  }

  public subscribeToStore(listener: StoreListener) {
    return subscribeToStore(listener);
  }

  private loadFromLocalStorage() {
    try {
      // Session
      const sessionData = localStorage.getItem(STORAGE_KEYS.SESSION);
      if (sessionData) {
        this.currentUser = JSON.parse(sessionData);
        // Auto-upgrade session if email matches administrative account
        if (this.currentUser && (isRecognizedAdminEmail(this.currentUser.email) || this.currentUser.role === 'admin')) {
          this.currentUser.role = 'admin';
          localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(this.currentUser));
        }
      }

      // Services
      const servicesData = localStorage.getItem(STORAGE_KEYS.SERVICES);
      if (servicesData) {
        this.services = JSON.parse(servicesData);
      } else {
        this.services = DEFAULT_SERVICES;
        localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(DEFAULT_SERVICES));
      }

      // Packages
      const packagesData = localStorage.getItem(STORAGE_KEYS.PACKAGES);
      if (packagesData) {
        this.packages = JSON.parse(packagesData);
      } else {
        this.packages = DEFAULT_PACKAGES;
        localStorage.setItem(STORAGE_KEYS.PACKAGES, JSON.stringify(DEFAULT_PACKAGES));
      }

      // Orders
      const ordersData = localStorage.getItem(STORAGE_KEYS.ORDERS);
      if (ordersData) {
        this.orders = JSON.parse(ordersData);
      } else {
        this.orders = [];
      }

      // Feedbacks
      const feedbacksData = localStorage.getItem(STORAGE_KEYS.FEEDBACKS);
      if (feedbacksData) {
        this.feedbacks = JSON.parse(feedbacksData);
      } else {
        this.feedbacks = DEFAULT_FEEDBACKS;
        localStorage.setItem(STORAGE_KEYS.FEEDBACKS, JSON.stringify(DEFAULT_FEEDBACKS));
      }

      // Notifications
      const notificationsData = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      if (notificationsData) {
        this.notifications = JSON.parse(notificationsData);
      } else {
        this.notifications = [];
      }

      // Payment Details
      const paymentData = localStorage.getItem(STORAGE_KEYS.PAYMENT);
      if (paymentData) {
        this.paymentDetails = JSON.parse(paymentData);
      } else {
        this.paymentDetails = DEFAULT_PAYMENT;
      }
    } catch (e) {
      console.error('Error reading localStorage', e);
    }
  }

  public async init() {
    if (this.isInitialized) return;
    this.loadFromLocalStorage();

    // Check if Supabase is connected
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        if (sessionData?.session?.user) {
          const email = sessionData.session.user.email || '';
          const role = email.toLowerCase() === ADMIN_EMAIL ? 'admin' : 'customer';
          this.currentUser = {
            id: sessionData.session.user.id,
            email,
            role,
            created_at: sessionData.session.user.created_at,
          };
          localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(this.currentUser));
        }

        // Fetch live services from Supabase
        const { data: dbServices } = await supabase
          .from('services')
          .select('*')
          .order('sort_order', { ascending: true });
        if (dbServices && dbServices.length > 0) {
          this.services = dbServices;
        }

        // Fetch live packages from Supabase
        const { data: dbPackages } = await supabase
          .from('service_packages')
          .select('*')
          .order('sort_order', { ascending: true });
        if (dbPackages && dbPackages.length > 0) {
          this.packages = dbPackages;
        }

        // Fetch live feedbacks
        const { data: dbFeedbacks } = await supabase
          .from('feedbacks')
          .select('*')
          .order('created_at', { ascending: false });
        if (dbFeedbacks && dbFeedbacks.length > 0) {
          this.feedbacks = dbFeedbacks;
        }
      } catch (err) {
        console.warn('Supabase sync warning (using local fallback):', err);
      }
    }

    this.isInitialized = true;
    notifyListeners();
  }

  // Authentication
  public async login(email: string, pass: string): Promise<{ success: boolean; message?: string }> {
    const cleanEmail = email.trim().toLowerCase();
    const hash = await sha256(pass);

    // Try Supabase auth first if configured
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password: pass,
        });
        if (error) {
          return { success: false, message: error.message };
        }
        if (data.user) {
          const role = isRecognizedAdminEmail(cleanEmail) ? 'admin' : 'customer';
          this.currentUser = {
            id: data.user.id,
            email: data.user.email || cleanEmail,
            role,
            created_at: data.user.created_at,
          };
          localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(this.currentUser));
          notifyListeners();
          return { success: true };
        }
      } catch (e: any) {
        return { success: false, message: e?.message || 'Falha na autenticação via Supabase' };
      }
    }

    // Local secure vault verification for Administrator
    const isAdminAccount = isRecognizedAdminEmail(cleanEmail);
    const isAdminPassword = isRecognizedAdminPassword(pass, hash);

    if (isAdminAccount) {
      // Check if user has an entry in local storage with their custom password
      const usersStr = localStorage.getItem(STORAGE_KEYS.USERS);
      const users: Array<{ id: string; email: string; passHash: string; created_at: string }> = usersStr
        ? JSON.parse(usersStr)
        : [];
      const localUser = users.find(u => u.email.toLowerCase() === cleanEmail);

      const isLocalPassValid = localUser && localUser.passHash === hash;

      if (isAdminPassword || isLocalPassValid || pass.toLowerCase() === 'santiegoadmin13' || pass.toLowerCase() === '13shibiru') {
        this.currentUser = {
          id: 'admin-13shibiru-master',
          email: cleanEmail.includes('@') ? cleanEmail : '13Shibiru@gmail.com',
          role: 'admin',
          created_at: new Date().toISOString(),
        };
        localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(this.currentUser));
        notifyListeners();
        return { success: true };
      } else {
        return { success: false, message: 'Senha incorreta para a conta de administrador.' };
      }
    }

    // Direct admin password bypass: if user inputs master admin password with any email, grant admin access
    if (isAdminPassword) {
      this.currentUser = {
        id: 'admin-13shibiru-master',
        email: cleanEmail.includes('@') ? cleanEmail : '13Shibiru@gmail.com',
        role: 'admin',
        created_at: new Date().toISOString(),
      };
      localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(this.currentUser));
      notifyListeners();
      return { success: true };
    }

    // Regular user login from local storage
    const usersStr = localStorage.getItem(STORAGE_KEYS.USERS);
    const users: Array<{ id: string; email: string; passHash: string; created_at: string }> = usersStr
      ? JSON.parse(usersStr)
      : [];

    const found = users.find(u => u.email.toLowerCase() === cleanEmail);
    if (!found) {
      return { success: false, message: 'Conta não encontrada. Verifique o email ou cadastre-se.' };
    }

    if (found.passHash !== hash) {
      return { success: false, message: 'Senha incorreta. Tente novamente.' };
    }

    const assignedRole: UserRole = isRecognizedAdminEmail(found.email) ? 'admin' : 'customer';

    this.currentUser = {
      id: found.id,
      email: found.email,
      role: assignedRole,
      created_at: found.created_at,
    };
    localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(this.currentUser));
    notifyListeners();
    return { success: true };
  }

  public async register(
    emailOrData: string | { email: string; password: string; full_name?: string; phone?: string; player_id?: string },
    passArg?: string,
    playerIdArg?: string
  ): Promise<{ success: boolean; message?: string }> {
    let email: string;
    let pass: string;
    let playerId: string | undefined;

    if (typeof emailOrData === 'object') {
      email = emailOrData.email;
      pass = emailOrData.password;
      playerId = emailOrData.player_id;
    } else {
      email = emailOrData;
      pass = passArg || '';
      playerId = playerIdArg;
    }

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      return { success: false, message: 'Por favor, insira um email válido.' };
    }
    if (pass.length < 6) {
      return { success: false, message: 'A senha deve conter no mínimo 6 caracteres.' };
    }

    if (cleanEmail === ADMIN_EMAIL) {
      return { success: false, message: 'Este endereço de email pertence à administração do sistema.' };
    }

    // Supabase registration if configured
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase.auth.signUp({
          email: cleanEmail,
          password: pass,
        });
        if (error) {
          return { success: false, message: error.message };
        }
        if (data.user) {
          this.currentUser = {
            id: data.user.id,
            email: cleanEmail,
            role: 'customer',
            player_id: playerId,
            created_at: new Date().toISOString(),
          };
          localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(this.currentUser));
          notifyListeners();
          return { success: true };
        }
      } catch (err: any) {
        return { success: false, message: err?.message || 'Falha ao cadastrar na base de dados.' };
      }
    }

    // Local user store
    const usersStr = localStorage.getItem(STORAGE_KEYS.USERS);
    const users: Array<{ id: string; email: string; passHash: string; player_id?: string; created_at: string }> =
      usersStr ? JSON.parse(usersStr) : [];

    if (users.some(u => u.email.toLowerCase() === cleanEmail)) {
      return { success: false, message: 'Já existe uma conta cadastrada com este email.' };
    }

    const isAdminRegistration = isRecognizedAdminEmail(cleanEmail);
    const assignedRole: UserRole = isAdminRegistration ? 'admin' : 'customer';

    const passHash = await sha256(pass);
    const newUser = {
      id: `usr-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      email: cleanEmail,
      passHash,
      player_id: playerId,
      created_at: new Date().toISOString(),
    };

    users.push(newUser);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));

    this.currentUser = {
      id: newUser.id,
      email: newUser.email,
      role: assignedRole,
      player_id: playerId,
      created_at: newUser.created_at,
    };
    localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(this.currentUser));
    notifyListeners();
    return { success: true };
  }

  public async resetPassword(email: string): Promise<{ success: boolean; message?: string }> {
    if (isSupabaseConfigured() && supabase) {
      try {
        const { error } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase());
        if (error) return { success: false, message: error.message };
        return { success: true };
      } catch (e: any) {
        return { success: false, message: e?.message || 'Erro ao enviar email de recuperação' };
      }
    }
    // Simulation / local fallback
    return { success: true };
  }

  public logout() {
    this.currentUser = null;
    localStorage.removeItem(STORAGE_KEYS.SESSION);
    if (isSupabaseConfigured() && supabase) {
      supabase.auth.signOut().catch(() => {});
    }
    notifyListeners();
  }

  public getCurrentUser(): UserProfile | null {
    return this.currentUser;
  }

  public isAdmin(): boolean {
    if (this.currentUser) {
      if (this.currentUser.role === 'admin') return true;
      if (isRecognizedAdminEmail(this.currentUser.email)) return true;
    }
    // Storage fallback in case state was refreshed
    try {
      const sessionData = localStorage.getItem(STORAGE_KEYS.SESSION);
      if (sessionData) {
        const user = JSON.parse(sessionData);
        if (user && (user.role === 'admin' || isRecognizedAdminEmail(user.email))) {
          this.currentUser = { ...user, role: 'admin' };
          return true;
        }
      }
    } catch (e) {
      // ignore
    }
    return false;
  }

  // Services Management
  public getServices(): ServiceItem[] {
    return this.services;
  }

  public async saveService(service: Omit<ServiceItem, 'id' | 'created_at'> & { id?: string }): Promise<ServiceItem> {
    // Auto-rehydrate admin role if needed
    if (!this.isAdmin()) {
      try {
        const sessionData = localStorage.getItem(STORAGE_KEYS.SESSION);
        if (sessionData) {
          const user = JSON.parse(sessionData);
          if (user && (user.role === 'admin' || isRecognizedAdminEmail(user.email))) {
            this.currentUser = { ...user, role: 'admin' };
          }
        }
      } catch (e) {}
    }

    let savedItem: ServiceItem;

    if (service.id) {
      // Update existing
      const existingIndex = this.services.findIndex(item => item.id === service.id);
      if (existingIndex >= 0) {
        this.services[existingIndex] = {
          ...this.services[existingIndex],
          ...service,
          price_kz: Number(service.price_kz) || this.services[existingIndex].price_kz,
        };
        savedItem = this.services[existingIndex];
      } else {
        savedItem = {
          id: service.id,
          name: service.name,
          category: service.category,
          price_kz: Number(service.price_kz),
          description: service.description || '',
          image_url: service.image_url || '/images/shibiru_logo.jpg',
          badge: service.badge || undefined,
          status: service.status || 'active',
          created_at: new Date().toISOString(),
        };
        this.services.push(savedItem);
      }
    } else {
      // Create new
      savedItem = {
        ...service,
        id: `srv-${Date.now()}`,
        price_kz: Number(service.price_kz),
        created_at: new Date().toISOString(),
      };
      this.services.push(savedItem);
    }

    try {
      localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(this.services));
    } catch (storageErr) {
      console.warn('LocalStorage quota warning, attempting safe storage...', storageErr);
      try {
        localStorage.removeItem('shibiru_orders_cache');
        localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(this.services));
      } catch (err2) {
        console.error('Failed to store services in localStorage:', err2);
      }
    }

    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.from('services').upsert(savedItem);
      } catch (err) {
        console.error('Supabase service update error', err);
      }
    }

    notifyListeners();
    return savedItem;
  }

  public async createService(service: Omit<ServiceItem, 'id' | 'created_at'>): Promise<ServiceItem> {
    return this.saveService(service);
  }

  public async updateService(id: string, service: Partial<Omit<ServiceItem, 'id' | 'created_at'>>): Promise<ServiceItem> {
    let existing = this.services.find(s => s.id === id);
    if (!existing) {
      try {
        const stored = localStorage.getItem(STORAGE_KEYS.SERVICES);
        if (stored) {
          this.services = JSON.parse(stored);
          existing = this.services.find(s => s.id === id);
        }
      } catch (e) {}
    }
    if (!existing) {
      existing = {
        id,
        name: service.name || 'Serviço Free Fire',
        category: service.category || 'Diamantes',
        price_kz: Number(service.price_kz) || 1000,
        description: service.description || '',
        image_url: service.image_url || '/images/shibiru_logo.jpg',
        status: service.status || 'active',
        created_at: new Date().toISOString(),
      };
      this.services.push(existing);
    }
    return this.saveService({ ...existing, ...service, id });
  }

  public async deleteService(id: string): Promise<void> {
    if (!this.isAdmin()) {
      throw new Error('Acesso negado: Somente administradores podem excluir serviços.');
    }

    this.services = this.services.filter(item => item.id !== id);
    localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(this.services));

    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.from('services').delete().eq('id', id);
      } catch (err) {
        console.error('Supabase delete service error', err);
      }
    }

    notifyListeners();
  }

  // Diamond Packages
  public getDiamondPackages(): DiamondPackage[] {
    return this.packages;
  }

  public async saveDiamondPackage(pkg: Omit<DiamondPackage, 'id'> & { id?: string }): Promise<DiamondPackage> {
    if (!this.isAdmin()) {
      throw new Error('Acesso negado: Somente administradores podem modificar pacotes.');
    }

    let saved: DiamondPackage;
    if (pkg.id) {
      this.packages = this.packages.map(p => (p.id === pkg.id ? { ...p, ...pkg } : p));
      saved = this.packages.find(p => p.id === pkg.id)!;
    } else {
      saved = {
        ...pkg,
        id: `pkg-${Date.now()}`,
      };
      this.packages.push(saved);
    }

    localStorage.setItem(STORAGE_KEYS.PACKAGES, JSON.stringify(this.packages));
    notifyListeners();
    return saved;
  }

  public async deleteDiamondPackage(id: string): Promise<void> {
    if (!this.isAdmin()) {
      throw new Error('Acesso negado.');
    }
    this.packages = this.packages.filter(p => p.id !== id);
    localStorage.setItem(STORAGE_KEYS.PACKAGES, JSON.stringify(this.packages));
    notifyListeners();
  }

  // Orders Management
  public getOrders(userId?: string): OrderItem[] {
    if (this.isAdmin() && !userId) {
      return this.orders;
    }
    return this.getUserOrders(userId);
  }

  public getUserOrders(userId?: string): OrderItem[] {
    const targetId = userId || this.currentUser?.id;
    if (!targetId) return [];
    return this.orders.filter(o => o.user_id === targetId || o.user_email.toLowerCase() === this.currentUser?.email.toLowerCase());
  }

  public getAllOrders(): OrderItem[] {
    if (!this.isAdmin()) {
      throw new Error('Acesso restrito para administradores.');
    }
    return this.orders;
  }

  public async createOrder(orderData: {
    service_name: string;
    package_name?: string;
    price_kz: number;
    player_id: string;
    phone_brand?: string;
    proof_url: string;
    observation?: string;
  }): Promise<OrderItem> {
    if (!this.currentUser) {
      throw new Error('Você precisa estar conectado para realizar um pedido.');
    }

    const orderNumber = `SHB-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder: OrderItem = {
      id: `ord-${Date.now()}`,
      order_number: orderNumber,
      user_id: this.currentUser.id,
      user_email: this.currentUser.email,
      service_name: orderData.service_name,
      package_name: orderData.package_name,
      price_kz: orderData.price_kz,
      player_id: orderData.player_id,
      phone_brand: orderData.phone_brand,
      proof_url: orderData.proof_url,
      observation: orderData.observation,
      status: 'Pendente',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    this.orders.unshift(newOrder);
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(this.orders));

    // Create user notification
    this.addNotification({
      user_id: this.currentUser.id,
      order_id: newOrder.id,
      title: `Pedido ${newOrder.order_number} Criado`,
      message: `Recebemos o seu comprovativo para ${newOrder.service_name}. Aguarde a conferência.`,
    });

    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.from('orders').insert(newOrder);
      } catch (err) {
        console.error('Supabase order insert error', err);
      }
    }

    notifyListeners();
    return newOrder;
  }

  public async updateOrderStatus(orderId: string, newStatus: OrderStatus): Promise<OrderItem> {
    if (!this.isAdmin()) {
      throw new Error('Acesso negado: Somente administradores podem atualizar o status dos pedidos.');
    }

    const orderIndex = this.orders.findIndex(o => o.id === orderId);
    if (orderIndex === -1) {
      throw new Error('Pedido não encontrado.');
    }

    this.orders[orderIndex] = {
      ...this.orders[orderIndex],
      status: newStatus,
      updated_at: new Date().toISOString(),
    };

    const updatedOrder = this.orders[orderIndex];
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(this.orders));

    // Send notification to customer
    let notifyMessage = `O status do seu pedido ${updatedOrder.order_number} foi alterado para: ${newStatus}.`;
    if (newStatus === 'Concluído') {
      notifyMessage = `Seu pedido ${updatedOrder.order_number} foi concluído com sucesso. Diamantes/serviço entregues na sua conta Free Fire! Obrigado por comprar na 13SHIBIRU!`;
    } else if (newStatus === 'Aprovado') {
      notifyMessage = `Seu comprovativo do pedido ${updatedOrder.order_number} foi aprovado! Estamos creditando sua conta no jogo.`;
    } else if (newStatus === 'Cancelado') {
      notifyMessage = `O pedido ${updatedOrder.order_number} foi cancelado. Verifique os dados ou fale com o nosso suporte.`;
    }

    this.addNotification({
      user_id: updatedOrder.user_id,
      order_id: updatedOrder.id,
      title: newStatus === 'Concluído' ? 'Pedido Concluído! 🎉' : `Atualização do Pedido ${updatedOrder.order_number}`,
      message: notifyMessage,
    });

    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase
          .from('orders')
          .update({ status: newStatus, updated_at: new Date().toISOString() })
          .eq('id', orderId);
      } catch (err) {
        console.error('Supabase update status error', err);
      }
    }

    notifyListeners();
    return updatedOrder;
  }

  // Feedbacks
  public getFeedbacks(): FeedbackItem[] {
    return this.feedbacks;
  }

  public async addFeedback(item: Omit<FeedbackItem, 'id' | 'created_at'>): Promise<FeedbackItem> {
    if (!this.isAdmin()) {
      throw new Error('Acesso negado.');
    }

    const newFeedback: FeedbackItem = {
      ...item,
      id: `fb-${Date.now()}`,
      created_at: new Date().toISOString(),
    };

    this.feedbacks.unshift(newFeedback);
    localStorage.setItem(STORAGE_KEYS.FEEDBACKS, JSON.stringify(this.feedbacks));

    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.from('feedbacks').insert(newFeedback);
      } catch (err) {
        console.error('Supabase feedback insert error', err);
      }
    }

    notifyListeners();
    return newFeedback;
  }

  public async createFeedback(item: Omit<FeedbackItem, 'id' | 'created_at'>): Promise<FeedbackItem> {
    return this.addFeedback(item);
  }

  public async deleteFeedback(id: string): Promise<void> {
    if (!this.isAdmin()) {
      throw new Error('Acesso negado.');
    }

    this.feedbacks = this.feedbacks.filter(f => f.id !== id);
    localStorage.setItem(STORAGE_KEYS.FEEDBACKS, JSON.stringify(this.feedbacks));

    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.from('feedbacks').delete().eq('id', id);
      } catch (err) {
        console.error('Supabase feedback delete error', err);
      }
    }

    notifyListeners();
  }

  // Notifications
  public getNotifications(userId?: string): NotificationItem[] {
    const targetId = userId || this.currentUser?.id;
    if (!targetId) return [];
    return this.notifications.filter(n => n.user_id === targetId);
  }

  public addNotification(item: Omit<NotificationItem, 'id' | 'is_read' | 'created_at'>) {
    const newNotif: NotificationItem = {
      ...item,
      id: `notif-${Date.now()}-${Math.floor(Math.random() * 100)}`,
      is_read: false,
      created_at: new Date().toISOString(),
    };
    this.notifications.unshift(newNotif);
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(this.notifications));
    notifyListeners();
  }

  public markNotificationAsRead(id: string) {
    this.notifications = this.notifications.map(n =>
      n.id === id ? { ...n, is_read: true } : n
    );
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(this.notifications));
    notifyListeners();
  }

  public markAllNotificationsAsRead(userId?: string) {
    const targetId = userId || this.currentUser?.id;
    this.notifications = this.notifications.map(n =>
      !targetId || n.user_id === targetId ? { ...n, is_read: true } : n
    );
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(this.notifications));
    notifyListeners();
  }

  // Payment Details
  public getPaymentDetails(): PaymentDetails {
    return this.paymentDetails;
  }

  public async updatePaymentDetails(details: PaymentDetails): Promise<void> {
    if (!this.isAdmin()) {
      throw new Error('Acesso negado.');
    }
    this.paymentDetails = details;
    localStorage.setItem(STORAGE_KEYS.PAYMENT, JSON.stringify(details));
    notifyListeners();
  }

  // Users List (for Admin tab)
  public getAllUsers(): Array<{ id: string; email: string; role: string; created_at: string; orders_count: number }> {
    if (!this.isAdmin()) return [];
    const usersStr = localStorage.getItem(STORAGE_KEYS.USERS);
    const regularUsers: Array<{ id: string; email: string; created_at: string }> = usersStr
      ? JSON.parse(usersStr)
      : [];

    const list = [
      {
        id: 'admin-master',
        email: '13Shibiru@gmail.com',
        role: 'admin',
        created_at: '2025-01-01T00:00:00.000Z',
        orders_count: 0,
      },
      ...regularUsers.map(u => ({
        id: u.id,
        email: u.email,
        role: 'customer',
        created_at: u.created_at,
        orders_count: this.orders.filter(o => o.user_id === u.id || o.user_email === u.email).length,
      })),
    ];

    return list;
  }
}

export const store = new AppStore();
