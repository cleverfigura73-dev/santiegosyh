-- ================================================================
-- 13SHIBIRU STORE - SUPABASE DATABASE SCHEMA & RLS POLICIES
-- ================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. ENUMS & TYPES
DO $$ BEGIN
    CREATE TYPE order_status AS ENUM ('Pendente', 'Aprovado', 'Concluído', 'Cancelado');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. PROFILES / USERS EXTENSION (Links to auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    role TEXT DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
    player_id TEXT,
    full_name TEXT,
    phone TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. SERVICES CATALOG TABLE
CREATE TABLE IF NOT EXISTS public.services (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    price_kz NUMERIC NOT NULL,
    description TEXT,
    image_url TEXT,
    category TEXT DEFAULT 'Geral',
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    badge TEXT,
    features JSONB DEFAULT '[]'::jsonb,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. SERVICE / DIAMOND PACKAGES TABLE
CREATE TABLE IF NOT EXISTS public.service_packages (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    diamonds_count INT DEFAULT 0,
    bonus_count INT DEFAULT 0,
    price_kz NUMERIC NOT NULL,
    is_popular BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    badge TEXT,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. ORDERS TABLE
CREATE TABLE IF NOT EXISTS public.orders (
    id TEXT PRIMARY KEY,
    order_number TEXT UNIQUE NOT NULL,
    user_id TEXT NOT NULL,
    user_email TEXT NOT NULL,
    service_name TEXT NOT NULL,
    package_name TEXT,
    price_kz NUMERIC NOT NULL,
    player_id TEXT NOT NULL,
    phone_brand TEXT,
    proof_url TEXT NOT NULL,
    observation TEXT,
    status order_status DEFAULT 'Pendente',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. FEEDBACKS / TESTIMONIALS TABLE
CREATE TABLE IF NOT EXISTS public.feedbacks (
    id TEXT PRIMARY KEY,
    client_name TEXT NOT NULL,
    rating INT DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
    comment TEXT NOT NULL,
    service_bought TEXT NOT NULL,
    verified BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. PAYMENT & STORE SETTINGS TABLE
CREATE TABLE IF NOT EXISTS public.payment_settings (
    id INT PRIMARY KEY DEFAULT 1,
    multicaixa_express TEXT NOT NULL DEFAULT '956262619',
    pay_pay TEXT NOT NULL DEFAULT '956262619',
    iban_bic TEXT NOT NULL DEFAULT '005100000738377710177',
    account_name TEXT NOT NULL DEFAULT 'António Bartolomeu Sapumo',
    pix TEXT NOT NULL DEFAULT '91985672394',
    whatsapp_support TEXT NOT NULL DEFAULT '+244952778374',
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedbacks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_settings ENABLE ROW LEVEL SECURITY;

-- Helper function to check if current user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN (
        auth.jwt() ->> 'email' = '13shibiru@gmail.com' OR
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Profiles Policies
CREATE POLICY "Public profiles are viewable by owner or admin"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id OR public.is_admin());

CREATE POLICY "Users can update own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

-- Services Policies: Anyone can view active services, admin can edit
CREATE POLICY "Allow public read on services"
    ON public.services FOR SELECT
    USING (true);

CREATE POLICY "Allow admin to manage services"
    ON public.services FOR ALL
    USING (public.is_admin());

-- Diamond Packages Policies: Anyone can view packages, admin can edit
CREATE POLICY "Allow public read on service packages"
    ON public.service_packages FOR SELECT
    USING (true);

CREATE POLICY "Allow admin to manage service packages"
    ON public.service_packages FOR ALL
    USING (public.is_admin());

-- Orders Policies: Customer can view their own, Admin can view and update all
CREATE POLICY "Users can view their own orders or admin view all"
    ON public.orders FOR SELECT
    USING (
        auth.uid()::text = user_id OR 
        auth.jwt() ->> 'email' = user_email OR
        public.is_admin()
    );

CREATE POLICY "Users can create orders"
    ON public.orders FOR INSERT
    WITH CHECK (auth.uid()::text = user_id OR auth.uid() IS NOT NULL);

CREATE POLICY "Admin can update orders"
    ON public.orders FOR UPDATE
    USING (public.is_admin());

-- Feedbacks Policies: Anyone can view, admin can insert/delete
CREATE POLICY "Allow public read on feedbacks"
    ON public.feedbacks FOR SELECT
    USING (true);

CREATE POLICY "Allow admin to manage feedbacks"
    ON public.feedbacks FOR ALL
    USING (public.is_admin());

-- Payment Settings Policies: Anyone can view, admin can update
CREATE POLICY "Allow public read on payment settings"
    ON public.payment_settings FOR SELECT
    USING (true);

CREATE POLICY "Allow admin to update payment settings"
    ON public.payment_settings FOR ALL
    USING (public.is_admin());

-- ================================================================
-- STORAGE BUCKETS (run in Supabase dashboard or via API)
-- ================================================================
-- INSERT INTO storage.buckets (id, name, public) VALUES ('proofs', 'proofs', true);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('services', 'services', true);
