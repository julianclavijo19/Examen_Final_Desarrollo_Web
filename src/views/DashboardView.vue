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
    // Verificar autenticación de forma asíncrona
    try {
      const isAuth = await authService.isAuthenticatedAsync();
      if (!isAuth) {
        this.$router.push('/login');
        return;
      }
      
      // Obtener usuario actual
      this.currentUser = await authService.getCurrentUserAsync() || authService.getCurrentUser();
      
      if (!this.currentUser) {
        this.$router.push('/login');
        return;
      }
    } catch (error) {
      console.error('Error al verificar autenticación:', error);
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
            // Actualizar usuario actual
            try {
              this.currentUser = await authService.getCurrentUserAsync() || authService.getCurrentUser();
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
