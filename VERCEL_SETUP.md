# Configuración para Vercel

## Variables de Entorno Requeridas

En Vercel, ve a **Settings > Environment Variables** y agrega:

1. **VITE_SUPABASE_URL**
   - Valor: Tu URL de Supabase (ej: `https://xxxxx.supabase.co`)

2. **VITE_SUPABASE_ANON_KEY**
   - Valor: Tu clave anónima de Supabase

3. **VITE_SUPABASE_POSTGRES_URL** (Opcional)
   - Valor: Tu URL de PostgreSQL de Supabase

## Configuración del Proyecto

- **Framework**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

## Solución a Pantalla Blanca

Si ves una pantalla blanca en Vercel:

1. Verifica que las variables de entorno estén configuradas correctamente
2. Revisa los logs de build en Vercel para ver errores
3. Asegúrate de que el build se complete sin errores
4. Verifica que la ruta base esté configurada como `/` en `vite.config.js`

## Despliegue

Vercel detectará automáticamente los cambios en GitHub y desplegará automáticamente.

