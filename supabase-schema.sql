-- ================================================================
-- 13SHIBIRU - SUPABASE PRODUCTION DATABASE SCHEMA & RLS POLICIES
-- ================================================================
-- Execute this script in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/_/sql

-- Enable UUID generation extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
    player_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

CREATE POLICY "Admins can read all profiles"
    ON public.profiles FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- 2. SERVICES TABLE
CREATE TABLE IF NOT EXISTS public.services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    price_kz NUMERIC NOT NULL DEFAULT 0,
    description TEXT,
    image_url TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('Diamantes', 'Passe Booyah', 'Skins', 'Contas', 'Sensibilidade 13SHIBIRU', 'Outros')),
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    badge TEXT,
    features JSONB DEFAULT '[]'::jsonb,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active services"
    ON public.services FOR SELECT
    USING (status = 'active');

CREATE POLICY "Admins can view all services"
    ON public.services FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Admins can insert services"
    ON public.services FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Admins can update services"
    ON public.services FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Admins can delete services"
    ON public.services FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- 3. DIAMOND PACKAGES TABLE
CREATE TABLE IF NOT EXISTS public.service_packages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    service_id UUID REFERENCES public.services(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    diamonds_count INT DEFAULT 0,
    bonus_count INT DEFAULT 0,
    price_kz NUMERIC NOT NULL,
    is_popular BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    badge TEXT,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.service_packages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active packages"
    ON public.service_packages FOR SELECT
    USING (is_active = true);

CREATE POLICY "Admins can manage packages"
    ON public.service_packages FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- 4. ORDERS TABLE
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number TEXT NOT NULL UNIQUE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    user_email TEXT NOT NULL,
    service_name TEXT NOT NULL,
    package_name TEXT,
    price_kz NUMERIC NOT NULL,
    player_id TEXT NOT NULL,
    proof_url TEXT,
    observation TEXT,
    status TEXT NOT NULL DEFAULT 'Pendente' CHECK (status IN ('Pendente', 'Em análise', 'Aprovado', 'Concluído', 'Cancelado')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own orders"
    ON public.orders FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own orders"
    ON public.orders FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all orders"
    ON public.orders FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Admins can update orders"
    ON public.orders FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- 5. FEEDBACKS TABLE
CREATE TABLE IF NOT EXISTS public.feedbacks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    image_url TEXT NOT NULL,
    description TEXT,
    customer_name TEXT DEFAULT 'Cliente 13SHIBIRU',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.feedbacks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view feedbacks"
    ON public.feedbacks FOR SELECT
    TO anon, authenticated
    USING (true);

CREATE POLICY "Admins can insert feedbacks"
    ON public.feedbacks FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Admins can delete feedbacks"
    ON public.feedbacks FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- 6. NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own notifications"
    ON public.notifications FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications"
    ON public.notifications FOR UPDATE
    USING (auth.uid() = user_id);

-- 7. AUTOMATIC USER PROFILE TRIGGER
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, role)
    VALUES (
        NEW.id,
        NEW.email,
        CASE 
            WHEN LOWER(NEW.email) = '13shibiru@gmail.com' THEN 'admin'
            ELSE 'customer'
        END
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 8. STORAGE BUCKETS SETUP
-- Run in Supabase Storage UI or via SQL:
INSERT INTO storage.buckets (id, name, public) 
VALUES ('proofs', 'proofs', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public) 
VALUES ('feedbacks', 'feedbacks', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public) 
VALUES ('services', 'services', true)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS Policies:
CREATE POLICY "Public Access Feedbacks" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'feedbacks' OR bucket_id = 'services' OR bucket_id = 'proofs');

CREATE POLICY "Authenticated Users Upload Proofs" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'proofs' AND auth.role() = 'authenticated');

CREATE POLICY "Admin Upload Feedbacks & Services" 
ON storage.objects FOR INSERT 
WITH CHECK (
    (bucket_id = 'feedbacks' OR bucket_id = 'services') 
    AND EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'admin'
    )
);

-- ================================================================
-- INITIAL SEED DATA
-- ================================================================

-- Seed Initial Diamantes Service
INSERT INTO public.services (id, name, price_kz, description, image_url, category, status, badge, sort_order)
VALUES (
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'DIAMANTES FREE FIRE',
    1300,
    'Recarga oficial e instantânea de diamantes Free Fire com super bônus exclusivo 13SHIBIRU.',
    '/images/diamonds_banner.jpg',
    'Diamantes',
    'active',
    'MAIS VENDIDO',
    1
) ON CONFLICT (id) DO NOTHING;

-- Seed Diamonds Packages
INSERT INTO public.service_packages (service_id, name, diamonds_count, bonus_count, price_kz, is_popular, sort_order)
VALUES
    ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '100 💎 + 20 de bônus', 100, 20, 1300, false, 1),
    ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '310 💎 + 52 de bônus', 310, 52, 3750, false, 2),
    ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '520 💎 + 104 de bônus', 520, 104, 5300, true, 3),
    ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '1060 💎 + 212 de bônus', 1060, 212, 11000, false, 4),
    ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '2180 💎 + 436 de bônus', 2180, 436, 22300, true, 5),
    ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '5600 💎 + 1120 de bônus', 5600, 1120, 52000, false, 6),
    ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'SHIBIRU SEMANAL 💎', 450, 0, 3300, false, 7),
    ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'PASSE 🎫', 0, 0, 1700, false, 8),
    ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'SHIBIRU MENSAL 💎', 2600, 0, 10700, true, 9)
ON CONFLICT DO NOTHING;

-- Seed Other Initial Categories / Services
INSERT INTO public.services (id, name, price_kz, description, image_url, category, status, badge, sort_order)
VALUES
    ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'PASSE BOOYAH FREE FIRE', 1700, 'Desbloqueie o Passe Booyah da temporada com todas as recompensas lendárias.', '/images/booyah_pass.jpg', 'Passe Booyah', 'active', 'POPULAR', 2),
    ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'SENSIBILIDADE 13SHIBIRU VIP', 2500, 'Configuração profissional VIP de sensibilidade, DPI e mira para subir capa em todos os dispositivos.', '/images/sensibility.jpg', 'Sensibilidade 13SHIBIRU', 'active', 'EXCLUSIVO', 3)
ON CONFLICT (id) DO NOTHING;
