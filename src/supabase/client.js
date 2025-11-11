/**
 * Cliente de Supabase
 * 
 * Este archivo configura y exporta el cliente de Supabase
 * para ser usado en toda la aplicación
 */

import { createClient } from '@supabase/supabase-js';
import { SUPABASE_CONFIG, isSupabaseConfigured } from './config.js';

/**
 * Cliente de Supabase
 * Se conecta automáticamente usando las variables de entorno
 * Si no hay configuración, crea un cliente dummy para evitar errores
 */
let supabase = null;

try {
  if (isSupabaseConfigured()) {
    supabase = createClient(
      SUPABASE_CONFIG.url,
      SUPABASE_CONFIG.anonKey,
      {
        auth: {
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: true
        }
      }
    );
    console.log('✅ Cliente de Supabase inicializado correctamente');
  } else {
    console.warn('⚠️ Supabase no está configurado. Creando cliente dummy.');
    // Crear un cliente dummy para evitar errores
    // Usar valores dummy que no causen errores
    supabase = createClient(
      'https://dummy.supabase.co',
      'dummy-key',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
          detectSessionInUrl: false
        }
      }
    );
  }
} catch (error) {
  console.error('❌ Error al inicializar cliente de Supabase:', error);
  // Crear un cliente dummy como fallback
  supabase = createClient(
    'https://dummy.supabase.co',
    'dummy-key',
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
        detectSessionInUrl: false
      }
    }
  );
}

export { supabase };
export default supabase;

