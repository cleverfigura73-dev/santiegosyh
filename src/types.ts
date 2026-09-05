export type UserRole = 'customer' | 'admin';

export interface UserProfile {
  id: string;
  email: string;
  role: UserRole;
  player_id?: string;
  created_at: string;
}

export type ServiceCategory = 
  | 'Diamantes'
  | 'Passe Booyah'
  | 'Skins'
  | 'Contas'
  | 'Sensibilidade 13SHIBIRU'
  | 'Outros';

export interface ServiceItem {
  id: string;
  name: string;
  price_kz: number;
  description: string;
  image_url: string;
  category: ServiceCategory;
  status: 'active' | 'inactive';
  badge?: string;
  features?: string[];
  sort_order?: number;
  created_at: string;
}

export interface DiamondPackage {
  id: string;
  service_id?: string;
  name: string;
  diamonds_count: number;
  bonus_count: number;
  price_kz: number;
  is_popular?: boolean;
  is_active: boolean;
  badge?: string;
  sort_order?: number;
}

export type OrderStatus = 
  | 'Pendente' 
  | 'Em análise' 
  | 'Aprovado' 
  | 'Concluído' 
  | 'Cancelado';

export interface OrderItem {
  id: string;
  order_number: string;
  user_id: string;
  user_email: string;
  service_name: string;
  package_name?: string;
  price_kz: number;
  player_id: string;
  phone_brand?: string;
  proof_url?: string;
  observation?: string;
  status: OrderStatus;
  created_at: string;
  updated_at: string;
}

export interface FeedbackItem {
  id: string;
  image_url: string;
  description?: string;
  customer_name?: string;
  rating?: number;
  created_at: string;
}

export interface NotificationItem {
  id: string;
  user_id: string;
  order_id?: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface PaymentDetails {
  multicaixa_express: string;
  pay_pay: string;
  iban_bic: string;
  account_name: string;
  pix: string;
  whatsapp_support: string;
}
