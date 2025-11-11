/**
 * Configuración de Supabase
 * 
 * Las variables de entorno se cargan desde el archivo .env
 * Asegúrate de tener configuradas:
 * - VITE_SUPABASE_URL
 * - VITE_SUPABASE_ANON_KEY
 */

/**
 * Configuración de Supabase
 */
export const SUPABASE_CONFIG = {
  url: import.meta.env.VITE_SUPABASE_URL || '',
  anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
  // URL de conexión PostgreSQL (opcional, para referencias)
  postgresUrl: import.meta.env.VITE_SUPABASE_POSTGRES_URL || ''
};

/**
 * Validar que las variables de entorno estén configuradas
 */
if (!SUPABASE_CONFIG.url || !SUPABASE_CONFIG.anonKey) {
  console.warn(
    '⚠️ Variables de entorno de Supabase no configuradas.\n' +
    'Por favor, configura VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY en tu archivo .env'
  );
}

export default SUPABASE_CONFIG;

