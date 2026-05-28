-- Tabla de usuarios (maneja autenticación y datos básicos)
CREATE TABLE IF NOT EXISTS public.usuarios (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre_completo text NOT NULL,
    email text UNIQUE NOT NULL,
    contraseña_hash text NOT NULL,
    verificado boolean DEFAULT false,
    rol text DEFAULT 'usuario',
    reset_token text,
    reset_token_expira timestamp with time zone,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Tabla de perfiles (información adicional del usuario)
CREATE TABLE IF NOT EXISTS public.profiles (
    id uuid PRIMARY KEY REFERENCES public.usuarios(id),
    rol text DEFAULT 'usuario',
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Tabla de propiedades
CREATE TABLE IF NOT EXISTS public.properties (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id uuid REFERENCES public.usuarios(id),
    type text NOT NULL,
    title text NOT NULL,
    description text,
    price numeric NOT NULL,
    features jsonb DEFAULT '{}'::jsonb,
    amenities jsonb DEFAULT '[]'::jsonb,
    coordinates float8[] NOT NULL,
    address text,
    rental_policies text,
    stars integer DEFAULT 0,
    imageUrl text,
    floorplan text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Tabla de fotos de propiedades
CREATE TABLE IF NOT EXISTS public.property_photos (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id uuid REFERENCES public.properties(id) ON DELETE CASCADE,
    photo_url text NOT NULL,
    is_main boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now()
);

-- Tabla de suscriptores (newsletter)
CREATE TABLE IF NOT EXISTS public.subscribers (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    email text UNIQUE NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);

-- Índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_properties_owner ON public.properties(owner_id);
CREATE INDEX IF NOT EXISTS idx_property_photos_property ON public.property_photos(property_id);
CREATE INDEX IF NOT EXISTS idx_usuarios_email ON public.usuarios(email);

-- Políticas RLS básicas (ajustar según necesidades)
ALTER TABLE public.usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;

-- Política para usuarios autenticados
CREATE POLICY "Usuarios pueden ver sus propios datos" ON public.usuarios
    FOR SELECT USING (auth.uid() = id);

-- Política para propiedades públicas
CREATE POLICY "Propiedades son visibles para todos" ON public.properties
    FOR SELECT USING (true);

-- Política para crear propiedades
CREATE POLICY "Usuarios autenticados pueden crear propiedades" ON public.properties
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Triggers para updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_usuarios_updated_at
    BEFORE UPDATE ON public.usuarios
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_properties_updated_at
    BEFORE UPDATE ON public.properties
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
