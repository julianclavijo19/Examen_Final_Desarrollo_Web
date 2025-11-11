-- Script SQL SIMPLIFICADO para crear la tabla de usuarios en Supabase
-- Esta versión es más simple y evita problemas con triggers complejos
-- Ejecutar este script en el SQL Editor de Supabase

-- Paso 1: Crear tabla de usuarios
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

-- Paso 2: Crear índices
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_rol ON users(rol);

-- Paso 3: Habilitar Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Paso 4: Crear políticas RLS

-- Política 1: Los usuarios pueden leer sus propios datos
CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  USING (auth.uid() = id);

-- Política 2: Los usuarios pueden actualizar sus propios datos
-- (El control de cambios de rol se hace en la aplicación)
CREATE POLICY "Users can update own data"
  ON users
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Política 3: Permitir inserción de usuarios propios (para el trigger)
CREATE POLICY "Users can insert own data"
  ON users
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Política 4: Los administradores pueden leer todos los datos
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

-- Política 5: Los administradores pueden insertar usuarios
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

-- Política 6: Los administradores pueden actualizar todos los datos
CREATE POLICY "Admins can update all data"
  ON users
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND rol = 'admin'
    )
  );

-- Paso 5: Función para actualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Paso 6: Trigger para updated_at
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Paso 7: Función para crear usuario automáticamente al registrarse
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

-- Paso 8: Trigger para crear usuario al registrarse
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- ✅ Script completado
-- Nota: El control de cambios de rol se hace en la aplicación (authService.js)
-- Los usuarios solo pueden actualizar sus propios datos, pero no pueden cambiar su rol
-- Solo los administradores pueden cambiar roles mediante la política "Admins can update all data"

