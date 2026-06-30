ALTER TABLE public.producto
ADD COLUMN IF NOT EXISTS activo boolean NOT NULL DEFAULT true;
