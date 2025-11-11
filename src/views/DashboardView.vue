<template>
  <div class="dashboard-minimal">
    <NavbarComponent :currentUser="currentUser" @logout="handleLogout" @toggle-sidebar="toggleSidebar" />
    <SidebarComponent :currentUser="currentUser" :isVisible="sidebarVisible" @close="closeSidebar" />
    
    <main class="main-content">
      <router-view></router-view>
      <FooterComponent />
    </main>
  </div>
</template>

<script>
import NavbarComponent from '../components/layout/NavbarComponent.vue';
import SidebarComponent from '../components/layout/SidebarComponent.vue';
import FooterComponent from '../components/layout/FooterComponent.vue';
import authService from '../services/authService';
import { supabase } from '../supabase/index.js';

export default {
  name: 'DashboardView',
  components: {
    NavbarComponent,
    SidebarComponent,
    FooterComponent
  },
  data() {
    return {
      currentUser: null,
      sidebarVisible: false,
      authListener: null
    };
  },
  async mounted() {
    console.log('🚀 DashboardView montado, verificando autenticación...');
    
    // Verificar autenticación de forma asíncrona
    try {
      const isAuth = await authService.isAuthenticatedAsync();
      console.log('🔐 Estado de autenticación:', isAuth);
      
      if (!isAuth) {
        console.warn('⚠️ Usuario no autenticado, redirigiendo a login');
        this.$router.push('/login');
        return;
      }
      
      // Obtener usuario actual - forzar actualización desde Supabase
      console.log('👤 Obteniendo usuario actual...');
      this.currentUser = await authService.getCurrentUserAsync();
      
      // Si no se obtuvo de forma asíncrona, intentar desde localStorage
      if (!this.currentUser) {
        console.log('⚠️ No se obtuvo usuario de forma asíncrona, intentando desde localStorage...');
        this.currentUser = authService.getCurrentUser();
      }
      
      if (!this.currentUser) {
        console.error('❌ No se pudo obtener el usuario actual');
        this.$router.push('/login');
        return;
      }
      
      // Log para debugging
      console.log('✅ Usuario actual en Dashboard:', this.currentUser);
      console.log('📋 Rol del usuario:', this.currentUser.rol);
      console.log('📧 Email del usuario:', this.currentUser.email);
      
      // Verificar si el rol necesita actualizarse
      // Si el usuario tiene sesión activa, verificar que el rol esté actualizado
      if (supabase && supabase.auth) {
        this.verifyAndRefreshUserRole();
      }
    } catch (error) {
      console.error('❌ Error al verificar autenticación en DashboardView:', error);
      this.$router.push('/login');
      return;
    }
    
    // En desktop, el sidebar siempre está visible
    this.sidebarVisible = window.innerWidth > 768;
    
    // Escuchar cambios de tamaño de ventana
    window.addEventListener('resize', this.handleResize);
    
    // Escuchar cambios en el estado de autenticación de Supabase (solo si está configurado)
    try {
      if (supabase && supabase.auth) {
        this.authListener = supabase.auth.onAuthStateChange(async (event, session) => {
          if (event === 'SIGNED_OUT' || !session) {
            this.currentUser = null;
            this.$router.push('/login');
          } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
            // Actualizar usuario actual - forzar actualización desde Supabase
            try {
              this.currentUser = await authService.getCurrentUserAsync();
              if (!this.currentUser) {
                this.currentUser = authService.getCurrentUser();
              }
              console.log('Usuario actualizado después de cambio de autenticación:', this.currentUser);
              console.log('Rol del usuario:', this.currentUser?.rol);
            } catch (error) {
              console.error('Error al obtener usuario después de autenticación:', error);
            }
          }
        });
      }
    } catch (error) {
      console.warn('No se pudo configurar el listener de autenticación de Supabase:', error);
    }
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.handleResize);
    
    // Remover listener de autenticación
    if (this.authListener && this.authListener.data && this.authListener.data.subscription) {
      this.authListener.data.subscription.unsubscribe();
    }
  },
  methods: {
    async handleLogout() {
      try {
        await authService.logout();
        this.currentUser = null;
        this.$router.push('/login');
      } catch (error) {
        console.error('Error al cerrar sesión:', error);
        // Forzar logout local
        this.currentUser = null;
        this.$router.push('/login');
      }
    },
    toggleSidebar() {
      this.sidebarVisible = !this.sidebarVisible;
    },
    closeSidebar() {
      // Solo cerrar en móvil
      if (window.innerWidth <= 768) {
        this.sidebarVisible = false;
      }
    },
    handleResize() {
      // En desktop, el sidebar siempre está visible
      if (window.innerWidth > 768) {
        this.sidebarVisible = true;
      }
    },
    async verifyAndRefreshUserRole() {
      try {
        // Obtener usuario actualizado desde Supabase
        const { data: { session } } = await supabase.auth.getSession();
        if (!session || !session.user) return;
        
        const { data: userData, error } = await supabase
          .from('users')
          .select('rol')
          .eq('email', session.user.email)
          .maybeSingle();
        
        if (error || !userData) {
          console.warn('⚠️ No se pudo verificar el rol del usuario:', error);
          return;
        }
        
        // Si el rol en Supabase es diferente al del estado actual, actualizar
        if (this.currentUser && this.currentUser.rol !== userData.rol) {
          console.warn('⚠️ El rol del usuario ha cambiado en Supabase');
          console.warn('   Rol actual en app:', this.currentUser.rol);
          console.warn('   Rol en Supabase:', userData.rol);
          console.warn('   Actualizando usuario...');
          
          // Actualizar usuario
          this.currentUser = await authService.getCurrentUserAsync();
          
          if (this.currentUser) {
            console.log('✅ Usuario actualizado:', this.currentUser);
            console.log('📋 Nuevo rol:', this.currentUser.rol);
          }
        }
      } catch (error) {
        console.error('❌ Error al verificar rol del usuario:', error);
      }
    }
  }
}
</script>

<style scoped>
.dashboard-minimal {
  min-height: 100vh;
  background: #ffffff;
  display: flex;
  flex-direction: column;
}

.main-content {
  margin-left: 240px;
  margin-top: 70px;
  min-height: calc(100vh - 70px);
  display: flex;
  flex-direction: column;
  background: #f8f9fa;
  transition: margin-left 0.3s ease;
}

@media (max-width: 768px) {
  .main-content {
    margin-left: 0;
    margin-top: 60px;
    min-height: calc(100vh - 60px);
  }
}
</style>
