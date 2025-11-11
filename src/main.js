import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { supabase } from './supabase/index.js';

// Importar Bootstrap JavaScript (para componentes interactivos)
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

/**
 * Crear y montar la aplicación Vue
 */
const app = createApp(App);

// Usar el router
app.use(router);

// Montar la aplicación en el elemento con id="app"
app.mount('#app');

// Funciones de utilidad para la consola del navegador
if (typeof window !== 'undefined') {
  // Función para forzar actualización del usuario
  window.forceRefreshUser = async function() {
    try {
      console.log('🔄 Forzando actualización del usuario...');
      
      // Limpiar localStorage
      console.log('🧹 Limpiando localStorage...');
      localStorage.removeItem('currentUser');
      localStorage.removeItem('supabaseSession');
      
      // Obtener sesión actual de Supabase
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session) {
        console.error('❌ No hay sesión activa:', sessionError);
        return null;
      }
      
      console.log('✅ Sesión activa encontrada:', session.user.email);
      
      // Obtener usuario desde la tabla users
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('email', session.user.email)
        .maybeSingle();
      
      if (userError) {
        console.error('❌ Error al obtener usuario:', userError);
        return null;
      }
      
      if (!userData) {
        console.error('❌ Usuario no encontrado en la tabla users');
        return null;
      }
      
      console.log('✅ Usuario obtenido desde Supabase:', userData);
      console.log('📋 Rol del usuario:', userData.rol);
      
      // Construir objeto de usuario
      const user = {
        id: userData.id,
        username: userData.username || userData.email?.split('@')[0],
        email: userData.email,
        nombre: userData.nombre || userData.email?.split('@')[0] || 'Usuario',
        rol: userData.rol
      };
      
      // Guardar en localStorage
      localStorage.setItem('currentUser', JSON.stringify(user));
      console.log('💾 Usuario guardado en localStorage:', user);
      
      // Recargar la página para aplicar los cambios
      console.log('🔄 Recargando la página en 1 segundo...');
      setTimeout(() => {
        window.location.reload();
      }, 1000);
      
      return user;
    } catch (error) {
      console.error('❌ Error al forzar actualización:', error);
      return null;
    }
  };

  // Función para verificar el estado del usuario
  window.checkUserStatus = async function() {
    console.log('🔍 Verificando estado del usuario...');
    
    // Verificar localStorage
    const localUserStr = localStorage.getItem('currentUser');
    if (localUserStr) {
      try {
        const localUser = JSON.parse(localUserStr);
        console.log('📦 Usuario en localStorage:', localUser);
        console.log('📦 Rol en localStorage:', localUser.rol);
      } catch (error) {
        console.error('❌ Error al parsear usuario de localStorage:', error);
      }
    } else {
      console.log('⚠️ No hay usuario en localStorage');
    }
    
    // Verificar Supabase
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !session) {
      console.error('❌ No hay sesión activa en Supabase:', sessionError);
      return;
    }
    
    console.log('✅ Sesión activa en Supabase:', session.user.email);
    
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('email', session.user.email)
      .maybeSingle();
    
    if (userError) {
      console.error('❌ Error al obtener usuario de Supabase:', userError);
      return;
    }
    
    if (!userData) {
      console.error('❌ Usuario no encontrado en la tabla users');
      return;
    }
    
    console.log('✅ Usuario en Supabase:', userData);
    console.log('📋 Rol en Supabase:', userData.rol);
    
    // Comparar roles
    if (localUserStr) {
      const localUser = JSON.parse(localUserStr);
      if (localUser.rol !== userData.rol) {
        console.warn('⚠️ ADVERTENCIA: El rol en localStorage no coincide con el de Supabase!');
        console.warn('   localStorage:', localUser.rol);
        console.warn('   Supabase:', userData.rol);
        console.warn('   Ejecuta forceRefreshUser() para actualizar');
      } else {
        console.log('✅ Los roles coinciden:', userData.rol);
      }
    }
  };
  
  // Hacer supabase disponible globalmente para debugging
  window.supabase = supabase;
  
  console.log('✅ Funciones de utilidad cargadas:');
  console.log('   - forceRefreshUser() - Forzar actualización del usuario');
  console.log('   - checkUserStatus() - Verificar estado del usuario');
  console.log('   - window.supabase - Cliente de Supabase disponible para debugging');
}

// Log de inicio
console.log('✅ Aplicación GamerHub Pro iniciada correctamente');

// Manejo de errores global
window.addEventListener('error', (event) => {
  console.error('❌ Error global:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('❌ Promise rechazada:', event.reason);
});
