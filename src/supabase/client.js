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
    console.warn('⚠️ Supabase no está configurado. Variables de entorno faltantes.');
    console.warn('⚠️ La aplicación funcionará en modo limitado hasta que se configuren las variables de entorno.');
    // Crear un cliente con valores por defecto para evitar errores
    // Estos valores no funcionarán pero evitarán que la app se rompa
    const dummyUrl = SUPABASE_CONFIG.url || 'https://placeholder.supabase.co';
    const dummyKey = SUPABASE_CONFIG.anonKey || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0';
    
    supabase = createClient(
      dummyUrl,
      dummyKey,
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
  // Crear un cliente mínimo como fallback para que la app no se rompa
  try {
    const dummyUrl = 'https://placeholder.supabase.co';
    const dummyKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0';
    supabase = createClient(dummyUrl, dummyKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
        detectSessionInUrl: false
      }
    });
  } catch (fallbackError) {
    console.error('❌ Error crítico al crear cliente de fallback:', fallbackError);
    // Si todo falla, crear un objeto mínimo para evitar errores de importación
    supabase = {
      auth: {
        getSession: () => Promise.resolve({ data: { session: null }, error: null }),
        signInWithPassword: () => Promise.resolve({ data: null, error: { message: 'Supabase no configurado' } }),
        signOut: () => Promise.resolve({ error: null }),
        onAuthStateChange: () => ({ data: { subscription: null }, unsubscribe: () => {} })
      },
      from: () => ({
        select: () => ({
          eq: () => ({
            maybeSingle: () => Promise.resolve({ data: null, error: { message: 'Supabase no configurado' } }),
            single: () => Promise.resolve({ data: null, error: { message: 'Supabase no configurado' } })
          })
        }),
        insert: () => Promise.resolve({ data: null, error: { message: 'Supabase no configurado' } }),
        update: () => ({
          eq: () => ({
            select: () => ({
              single: () => Promise.resolve({ data: null, error: { message: 'Supabase no configurado' } })
            })
          })
        }),
        delete: () => ({
          eq: () => Promise.resolve({ error: { message: 'Supabase no configurado' } })
        })
      })
    };
  }
}

export { supabase };
export default supabase;

