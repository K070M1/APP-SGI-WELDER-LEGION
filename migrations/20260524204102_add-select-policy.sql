-- =====================================================
-- Políticas RLS para USUARIO
-- =====================================================
DROP POLICY IF EXISTS allow_anon_select_usuario ON usuario;
DROP POLICY IF EXISTS allow_anon_update_usuario ON usuario;
DROP POLICY IF EXISTS allow_anon_delete_usuario ON usuario;

CREATE POLICY allow_anon_select_usuario
ON usuario
FOR SELECT
TO anon
USING (true);

CREATE POLICY allow_anon_update_usuario
ON usuario
FOR UPDATE
TO anon
USING (true)
WITH CHECK (true);

CREATE POLICY allow_anon_delete_usuario
ON usuario
FOR DELETE
TO anon
USING (true);
