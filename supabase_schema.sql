-- Habilitar extensión para generar UUIDs (si no está disponible en tu proyecto Supabase)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS public.users (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre_completo text NOT NULL,
    email text UNIQUE NOT NULL,
    password_hash text NOT NULL,
    role text NOT NULL DEFAULT 'usuario', -- valores: 'usuario' o 'propietario'
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

-- Tabla de propiedades (fields observados en frontend)
CREATE TABLE IF NOT EXISTS public.properties (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id uuid REFERENCES public.users(id) ON DELETE SET NULL,
    type text,                         -- ej. 'casa', 'departamento', 'local'
    title text,
    description text,
    price numeric,                     -- precio mensual
    area numeric,                      -- m²
    bedrooms integer DEFAULT 0,
    bathrooms integer DEFAULT 0,
    garage boolean DEFAULT false,
    features jsonb DEFAULT '[]'::jsonb,   -- lista (wifi, balcón, ...)
    amenities jsonb DEFAULT '[]'::jsonb,  -- lista
    coordinates float8[],              -- [lng, lat]
    address text,
    rental_policies text,
    stars smallint DEFAULT 0,
    image_url text,
    floorplan text,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

-- Tabla para imágenes adicionales de una propiedad (opcional)
CREATE TABLE IF NOT EXISTS public.property_images (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id uuid REFERENCES public.properties(id) ON DELETE CASCADE,
    url text NOT NULL,
    metadata jsonb DEFAULT '{}'::jsonb,
    created_at timestamptz NOT NULL DEFAULT now()
);

-- Tabla de suscripciones / newsletter
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    email text UNIQUE NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now()
);

-- Índices sugeridos
CREATE INDEX IF NOT EXISTS idx_properties_owner_id ON public.properties(owner_id);
CREATE INDEX IF NOT EXISTS idx_properties_price ON public.properties(price);
-- Para búsqueda geoespacial más avanzada, habilitar PostGIS y usar geometry/geography (no creado aquí).

-- Ejemplos de inserción (puedes adaptarlos)
INSERT INTO public.users (nombre_completo, email, password_hash, role)
VALUES ('Admin Demo', 'admin@example.com', 'changeme_hash', 'propietario')
ON CONFLICT (email) DO NOTHING;

INSERT INTO public.properties (owner_id, type, title, description, price, area, bedrooms, bathrooms, features, amenities, coordinates, address, stars, image_url)
VALUES (
    (SELECT id FROM public.users WHERE email = 'admin@example.com'),
    'casa',
    'Casa de ejemplo',
    'Casa moderna de ejemplo',
    5000,
    85,
    3,
    2,
    '["WiFi","Estacionamiento"]'::jsonb,
    '["Piscina","Jardín"]'::jsonb,
    ARRAY[-116.82613, 32.45982],
    'Dirección de ejemplo, Tijuana',
    5,
    '/Frontend/Images/default-property.jpg'
)
ON CONFLICT DO NOTHING;

INSERT INTO public.subscriptions (email) VALUES ('test@correo.com') ON CONFLICT (email) DO NOTHING;

-- Notas:
-- 1) El frontend envía/espera campos como "contraseña" en algunos lugares: en tu backend/middleware adapta los nombres
--    (p.ej. mapear "contraseña" -> password) o modifica el cliente para enviar "password".
-- 2) Para búsquedas por cercanía, considera habilitar PostGIS en Supabase y cambiar "coordinates" a geography(Point,4326).
-- 3) Ajusta permisos / policies en Supabase (RLS) según tu flujo de registro/login.
