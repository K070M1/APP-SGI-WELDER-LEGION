-- Políticas RLS para el bucket "profile" en storage.objects
-- Permite a usuarios anónimos y autenticados subir, leer, actualizar y eliminar archivos

-- Eliminar políticas existentes si existen
DROP POLICY IF EXISTS allow_public_read_profile ON storage.objects;
DROP POLICY IF EXISTS allow_anon_insert_profile ON storage.objects;
DROP POLICY IF EXISTS allow_anon_update_profile ON storage.objects;
DROP POLICY IF EXISTS allow_anon_delete_profile ON storage.objects;

-- Permitir SELECT (leer archivos) - bucket público
CREATE POLICY allow_public_read_profile
ON storage.objects
FOR SELECT
TO anon, authenticated
USING (bucket = 'profile');

-- Permitir INSERT (subir archivos)
CREATE POLICY allow_anon_insert_profile
ON storage.objects
FOR INSERT
TO anon, authenticated
WITH CHECK (bucket = 'profile');

-- Permitir UPDATE (actualizar metadata de archivos)
CREATE POLICY allow_anon_update_profile
ON storage.objects
FOR UPDATE
TO anon, authenticated
USING (bucket = 'profile')
WITH CHECK (bucket = 'profile');

-- Permitir DELETE (eliminar archivos)
CREATE POLICY allow_anon_delete_profile
ON storage.objects
FOR DELETE
TO anon, authenticated
USING (bucket = 'profile');