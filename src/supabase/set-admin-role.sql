-- Script para asignar rol de administrador a un usuario en Supabase
-- Ejecutar este script en el SQL Editor de Supabase
--
-- INSTRUCCIONES:
-- 1. Reemplaza 'TU_EMAIL@example.com' con el email del usuario que quieres hacer admin
-- 2. Ejecuta el script
-- 3. El usuario tendrá rol de administrador

-- Opción 1: Actualizar el rol directamente en la tabla users
UPDATE public.users
SET rol = 'admin'
WHERE email = 'TU_EMAIL@example.com';

-- Verificar que el cambio se aplicó correctamente
SELECT id, email, username, nombre, rol, created_at
FROM public.users
WHERE email = 'TU_EMAIL@example.com';

-- Opción 2: Si necesitas hacer admin a un usuario por su ID
-- UPDATE public.users
-- SET rol = 'admin'
-- WHERE id = 'USER_ID_AQUI';

-- Opción 3: Si necesitas ver todos los usuarios y sus roles
-- SELECT id, email, username, nombre, rol, created_at
-- FROM public.users
-- ORDER BY created_at DESC;

