-- ============================================
-- SCRIPT DEFINITIVO PARA CORREGIR POLÍTICAS RLS
-- Ejecutar este script en el SQL Editor de Supabase
-- IMPORTANTE: Este script corrige el problema de auth.uid() NULL
-- ============================================

-- ============================================
-- PASO 1: Eliminar TODAS las políticas existentes
-- ============================================
DO $$ 
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'users') 
    LOOP
        EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(r.policyname) || ' ON users';
    END LOOP;
END $$;

-- ============================================
-- PASO 2: Asegurar que RLS está habilitado
-- ============================================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- ============================================
-- PASO 3: Crear función is_admin() mejorada
-- Esta función funciona correctamente con el contexto de autenticación de Supabase
-- ============================================
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
DECLARE
  user_role TEXT;
  current_user_id UUID;
BEGIN
  -- Obtener el ID del usuario actual desde auth.uid()
  -- En el SQL Editor esto será NULL, pero en la aplicación funcionará correctamente
  current_user_id := auth.uid();
  
  -- Si no hay usuario autenticado, retornar false
  IF current_user_id IS NULL THEN
    RETURN FALSE;
  END IF;
  
  -- Intentar obtener el rol del usuario desde la tabla users
  -- SECURITY DEFINER permite que esta consulta ignore las políticas RLS
  BEGIN
    SELECT rol INTO user_role
    FROM public.users
    WHERE id = current_user_id
    LIMIT 1;
    
    -- Si no se encontró el usuario, retornar false
    IF user_role IS NULL THEN
      RETURN FALSE;
    END IF;
    
    -- Retornar true si el rol es 'admin'
    RETURN LOWER(TRIM(user_role)) = 'admin';
  EXCEPTION
    WHEN OTHERS THEN
      -- Si hay algún error, retornar false por seguridad
      RETURN FALSE;
  END;
END;
$$;

-- ============================================
-- PASO 4: Crear políticas básicas para usuarios (sus propios datos)
-- ============================================

-- Política 1: Los usuarios pueden leer sus propios datos
CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  USING (auth.uid() = id);

-- Política 2: Los usuarios pueden actualizar sus propios datos
CREATE POLICY "Users can update own data"
  ON users
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Política 3: Los usuarios pueden insertar sus propios datos (para el trigger)
CREATE POLICY "Users can insert own data"
  ON users
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- ============================================
-- PASO 5: Crear políticas para administradores
-- Estas políticas permiten a los administradores hacer operaciones en todos los usuarios
-- ============================================

-- Política 4: Los administradores pueden leer TODOS los datos
CREATE POLICY "Admins can read all data"
  ON users
  FOR SELECT
  USING (is_admin() = true);

-- Política 5: Los administradores pueden insertar usuarios
CREATE POLICY "Admins can insert users"
  ON users
  FOR INSERT
  WITH CHECK (is_admin() = true);

-- Política 6: Los administradores pueden actualizar TODOS los datos
CREATE POLICY "Admins can update all data"
  ON users
  FOR UPDATE
  USING (is_admin() = true)
  WITH CHECK (is_admin() = true);

-- Política 7: Los administradores pueden eliminar usuarios
CREATE POLICY "Admins can delete users"
  ON users
  FOR DELETE
  USING (is_admin() = true);

-- ============================================
-- PASO 6: Verificar que las políticas se crearon correctamente
-- ============================================
SELECT 
  policyname,
  cmd,
  permissive
FROM pg_policies
WHERE tablename = 'users'
ORDER BY policyname;

-- ============================================
-- PASO 7: Verificar que la función se creó correctamente
-- ============================================
SELECT 
  proname as function_name,
  prosecdef as is_security_definer
FROM pg_proc
WHERE proname = 'is_admin';

-- ============================================
-- PASO 8: Verificar usuarios y sus roles
-- ============================================
SELECT 
  id,
  email,
  rol,
  created_at
FROM users
ORDER BY created_at DESC;

-- ============================================
-- PASO 9: IMPORTANTE - Verificar que el usuario admin tiene el rol correcto
-- ============================================
-- Ejecuta esto y verifica que el usuario admin@techstore.com tenga rol = 'admin'
SELECT 
  id,
  email,
  rol,
  CASE 
    WHEN rol = 'admin' THEN '✅ Es administrador'
    ELSE '❌ NO es administrador - Ejecuta: UPDATE users SET rol = ''admin'' WHERE email = ''admin@techstore.com'''
  END as status
FROM users
WHERE email = 'admin@techstore.com';

-- ============================================
-- NOTAS IMPORTANTES:
-- ============================================
-- 1. auth.uid() retornará NULL en el SQL Editor porque no hay sesión autenticada
-- 2. En la aplicación Vue.js, auth.uid() funcionará correctamente porque hay una sesión activa
-- 3. La función is_admin() usa SECURITY DEFINER para evitar problemas circulares con RLS
-- 4. Las políticas se combinan usando OR, por lo que si una es verdadera, el acceso se permite
-- 5. Si el usuario admin no tiene rol 'admin', ejecuta:
--    UPDATE users SET rol = 'admin' WHERE email = 'admin@techstore.com';
-- ============================================

-- ============================================
-- SOLUCIÓN AL PROBLEMA: Si auth.uid() es NULL en el SQL Editor
-- ============================================
-- Esto es NORMAL. El SQL Editor no tiene una sesión de autenticación activa.
-- Cuando la aplicación Vue.js hace consultas a través del cliente de Supabase,
-- auth.uid() funcionará correctamente porque hay una sesión JWT activa.
--
-- Para probar que las políticas funcionan desde la aplicación:
-- 1. Abre la aplicación Vue.js
-- 2. Inicia sesión como admin@techstore.com
-- 3. Ve a la sección de usuarios
-- 4. Deberías ver todos los usuarios
-- ============================================

