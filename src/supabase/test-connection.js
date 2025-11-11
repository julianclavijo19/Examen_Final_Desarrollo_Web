/**
 * Script de prueba para verificar la conexión con Supabase
 * 
 * Ejecutar con: node src/supabase/test-connection.js
 * O importar en la aplicación para verificar la conexión
 */

import { supabase } from './client.js';
import { SUPABASE_CONFIG } from './config.js';

/**
 * Verificar conexión con Supabase
 */
export async function testConnection() {
  console.log('🔍 Verificando conexión con Supabase...');
  console.log('📡 URL:', SUPABASE_CONFIG.url);
  console.log('🔑 Anon Key:', SUPABASE_CONFIG.anonKey ? '✅ Configurada' : '❌ No configurada');
  
  if (!SUPABASE_CONFIG.url || !SUPABASE_CONFIG.anonKey) {
    console.error('❌ Error: Variables de entorno no configuradas');
    return false;
  }

  try {
    // Intentar obtener la sesión actual (esto verifica la conexión)
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('❌ Error al conectar con Supabase:', error.message);
      return false;
    }

    console.log('✅ Conexión exitosa con Supabase');
    console.log('📊 Sesión:', data.session ? 'Activa' : 'Inactiva');
    return true;
  } catch (error) {
    console.error('❌ Error inesperado:', error.message);
    return false;
  }
}

/**
 * Verificar que la tabla users existe
 */
export async function testUsersTable() {
  console.log('🔍 Verificando tabla users...');
  
  try {
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1);
    
    if (error) {
      if (error.code === 'PGRST116') {
        console.error('❌ Error: La tabla "users" no existe');
        console.log('💡 Solución: Ejecuta el script SQL en src/supabase/database.sql');
        return false;
      }
      console.error('❌ Error al verificar tabla users:', error.message);
      return false;
    }

    console.log('✅ Tabla users existe y es accesible');
    return true;
  } catch (error) {
    console.error('❌ Error inesperado:', error.message);
    return false;
  }
}

// Si se ejecuta directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  (async () => {
    const connectionOk = await testConnection();
    if (connectionOk) {
      await testUsersTable();
    }
  })();
}

