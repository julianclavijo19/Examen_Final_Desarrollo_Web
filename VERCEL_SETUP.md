# Configuración para Vercel

## ⚠️ IMPORTANTE: Variables de Entorno

**DEBES configurar las variables de entorno en Vercel para que la aplicación funcione:**

1. Ve a tu proyecto en Vercel
2. Ve a **Settings > Environment Variables**
3. Agrega las siguientes variables:

   - **VITE_SUPABASE_URL**
     - Valor: `https://cettyprzybivywqakeym.supabase.co`
   
   - **VITE_SUPABASE_ANON_KEY**
     - Valor: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNldHR5cHJ6eWJpdnl3cWFrZXltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI4MDQ3NTksImV4cCI6MjA3ODM4MDc1OX0.XpmzE8jrqX_ujSKG79Do0EPC6sHeDZ_k3zWRrsEq00I`

4. **IMPORTANTE**: Después de agregar las variables, haz un nuevo deployment

## Configuración del Proyecto

- **Framework**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

## Solución a Pantalla Blanca

Si ves una pantalla blanca en Vercel:

1. **VERIFICA LAS VARIABLES DE ENTORNO** - Este es el problema más común
2. Revisa los logs de build en Vercel (Deployments > Click en el deployment > View Function Logs)
3. Abre la consola del navegador (F12) y revisa los errores
4. Verifica que el build se complete sin errores
5. Asegúrate de que las variables de entorno estén configuradas para **Production**, **Preview** y **Development**

## Verificar que las Variables Están Configuradas

1. Ve a Vercel > Tu Proyecto > Settings > Environment Variables
2. Verifica que aparezcan `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`
3. Asegúrate de que estén habilitadas para **Production**
4. Si las agregaste después del deployment, haz un nuevo deployment

## Despliegue

Vercel detectará automáticamente los cambios en GitHub y desplegará automáticamente.

**NOTA**: Si cambias las variables de entorno, necesitas hacer un nuevo deployment manual o esperar al próximo push.

