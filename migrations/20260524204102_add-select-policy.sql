-- Eliminar políticas si existen
DROP POLICY IF EXISTS allow_anon_select_usuario ON usuario;
DROP POLICY IF EXISTS allow_anon_update_usuario ON usuario;
DROP POLICY IF EXISTS allow_anon_delete_usuario ON usuario;

-- Crear políticas RLS para permitir operaciones en la tabla usuario

-- Política para SELECT
CREATE POLICY allow_anon_select_usuario
ON usuario
FOR SELECT
TO anon
USING (true);

-- Política para UPDATE
CREATE POLICY allow_anon_update_usuario
ON usuario
FOR UPDATE
TO anon
USING (true)
WITH CHECK (true);

-- Política para DELETE
CREATE POLICY allow_anon_delete_usuario
ON usuario
FOR DELETE
TO anon
USING (true);
