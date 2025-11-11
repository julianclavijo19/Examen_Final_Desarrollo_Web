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
 * Verificar si Supabase está configurado
 */
export const isSupabaseConfigured = () => {
  return !!(SUPABASE_CONFIG.url && SUPABASE_CONFIG.anonKey && SUPABASE_CONFIG.url !== '' && SUPABASE_CONFIG.anonKey !== '');
};

/**
 * Validar que las variables de entorno estén configuradas
 */
if (!isSupabaseConfigured()) {
  console.warn(
    '⚠️ Variables de entorno de Supabase no configuradas.\n' +
    'Por favor, configura VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY en las variables de entorno de Vercel'
  );
} else {
  console.log('✅ Configuración de Supabase cargada correctamente');
}

export default SUPABASE_CONFIG;

