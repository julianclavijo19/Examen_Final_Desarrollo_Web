-- Script para habilitar la creación automática de usuarios sin confirmación de email
-- Ejecutar este script en el SQL Editor de Supabase
-- 
-- IMPORTANTE: Esto permite que los usuarios creados por administradores
-- no requieran confirmación de email. Úsalo con precaución en producción.

-- Función para confirmar automáticamente el email de usuarios creados
CREATE OR REPLACE FUNCTION auto_confirm_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Confirmar el email automáticamente
  UPDATE auth.users
  SET email_confirmed_at = NOW()
  WHERE id = NEW.id AND email_confirmed_at IS NULL;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para confirmar automáticamente usuarios creados
-- Nota: Este trigger solo funciona si el usuario se crea desde el cliente
-- Para usuarios creados desde el panel de administración, se confirman automáticamente
DROP TRIGGER IF EXISTS on_user_created_confirm ON auth.users;

CREATE TRIGGER on_user_created_confirm
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION auto_confirm_user();

-- Alternativa: Configurar Supabase para que no requiera confirmación de email
-- Esto se hace desde el panel de Supabase:
-- Authentication > Settings > Email Auth > "Enable email confirmations" (desactivar)
--
-- O usar la API de administración con service_role key (recomendado para producción)

