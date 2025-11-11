/**
 * Exportaciones principales de Supabase
 * 
 * Este archivo centraliza todas las exportaciones relacionadas con Supabase
 * para facilitar las importaciones en otros archivos
 */

export { supabase, default as supabaseClient } from './client.js';
export { SUPABASE_CONFIG, default as config } from './config.js';
export { default as supabaseAuth } from './auth.js';

// Re-exportar todo para importaciones más simples
export * from './client.js';
export * from './config.js';
export * from './auth.js';

