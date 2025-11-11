-- Script SQL para crear la tabla de usuarios en Supabase
-- Ejecutar este script en el SQL Editor de Supabase
-- VERSIÓN CORREGIDA - Sin referencias a OLD en políticas RLS

-- Crear tabla de usuarios
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  nombre TEXT NOT NULL,
  rol TEXT NOT NULL DEFAULT 'usuario',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT valid_rol CHECK (rol IN ('admin', 'vendedor', 'usuario'))
);

-- Crear índices para búsquedas rápidas
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_rol ON users(rol);

-- Habilitar Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Eliminar políticas existentes si existen (para poder recrearlas)
DROP POLICY IF EXISTS "Users can read own data" ON users;
DROP POLICY IF EXISTS "Users can update own data" ON users;
DROP POLICY IF EXISTS "Admins can read all data" ON users;
DROP POLICY IF EXISTS "Admins can insert users" ON users;
DROP POLICY IF EXISTS "Admins can update all data" ON users;
DROP POLICY IF EXISTS "Public can insert own user" ON users;

-- Política para que los usuarios puedan leer sus propios datos
CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  USING (auth.uid() = id);

-- Política para que los usuarios puedan actualizar sus propios datos (sin cambiar rol)
-- Los usuarios solo pueden actualizar: username, nombre, email
-- El rol se controla mediante un trigger separado
CREATE POLICY "Users can update own data"
  ON users
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id AND
    -- Los usuarios no pueden cambiar su propio rol
    -- El trigger se encargará de prevenir cambios de rol
    true
  );

-- Política para que los administradores puedan leer todos los datos
CREATE POLICY "Admins can read all data"
  ON users
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND rol = 'admin'
    )
  );

-- Política para permitir que cualquier usuario autenticado inserte su propio registro
-- Esto es necesario para el trigger que crea usuarios automáticamente
CREATE POLICY "Public can insert own user"
  ON users
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Política para que los administradores puedan insertar usuarios
CREATE POLICY "Admins can insert users"
  ON users
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND rol = 'admin'
    )
  );

-- Política para que los administradores puedan actualizar todos los datos
CREATE POLICY "Admins can update all data"
  ON users
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND rol = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND rol = 'admin'
    )
  );

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Eliminar trigger si existe
DROP TRIGGER IF EXISTS update_users_updated_at ON users;

-- Trigger para actualizar updated_at
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Función para prevenir que usuarios no-admin cambien su rol
-- Esta función se ejecuta con privilegios elevados (SECURITY DEFINER)
-- para poder verificar el rol del usuario actual
CREATE OR REPLACE FUNCTION prevent_role_change()
RETURNS TRIGGER AS $$
DECLARE
  current_user_role TEXT;
BEGIN
  -- Si el rol está cambiando
  IF OLD.rol IS DISTINCT FROM NEW.rol THEN
    -- Obtener el rol del usuario actual
    -- Usamos SECURITY DEFINER para evitar problemas con RLS
    SELECT rol INTO current_user_role
    FROM public.users
    WHERE id = auth.uid();
    
    -- Si el usuario actual no es admin, prevenir el cambio de rol
    IF current_user_role IS NULL OR current_user_role != 'admin' THEN
      -- Revertir el cambio de rol al valor anterior
      NEW.rol := OLD.rol;
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Eliminar trigger si existe
DROP TRIGGER IF EXISTS prevent_role_change_trigger ON users;

-- Trigger para prevenir cambios de rol no autorizados
CREATE TRIGGER prevent_role_change_trigger
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION prevent_role_change();

-- Función para crear un usuario en la tabla users cuando se registra en auth
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, username, nombre, rol)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'nombre', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'rol', 'usuario')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Eliminar trigger si existe
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Trigger para crear usuario automáticamente al registrarse
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();
