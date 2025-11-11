/**
 * Cliente de Supabase
 * 
 * Este archivo configura y exporta el cliente de Supabase
 * para ser usado en toda la aplicación
 */

import { createClient } from '@supabase/supabase-js';
import { SUPABASE_CONFIG } from './config.js';

/**
 * Cliente de Supabase
 * Se conecta automáticamente usando las variables de entorno
 */
export const supabase = createClient(
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

export default supabase;

