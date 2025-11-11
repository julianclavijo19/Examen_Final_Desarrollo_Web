/**
 * Exportaciones principales de Supabase
 * 
 * Este archivo centraliza todas las exportaciones relacionadas con Supabase
 * para facilitar las importaciones en otros archivos
 */

export { supabase } from './client.js';
export { SUPABASE_CONFIG, isSupabaseConfigured } from './config.js';
export { default as supabaseAuth } from './auth.js';

