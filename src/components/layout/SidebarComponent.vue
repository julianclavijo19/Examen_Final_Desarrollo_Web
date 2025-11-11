<template>
  <aside class="sidebar-minimal" :class="{ 'show': isVisible }">
    <div class="sidebar-overlay" @click="closeSidebar" v-if="isVisible"></div>
    <nav class="sidebar-nav">
      <router-link 
        to="/dashboard" 
        class="nav-item"
        exact-active-class="active"
      >
        <i class="bi bi-grid-1x2"></i>
        <span>Dashboard</span>
      </router-link>
      
      <router-link 
        to="/dashboard/productos" 
        class="nav-item"
        active-class="active"
      >
        <i class="bi bi-box-seam"></i>
        <span>Productos</span>
      </router-link>

      <router-link 
        to="/dashboard/categorias" 
        class="nav-item"
        active-class="active"
      >
        <i class="bi bi-tags"></i>
        <span>Categorías</span>
      </router-link>

      <router-link 
        to="/dashboard/clientes" 
        class="nav-item"
        active-class="active"
      >
        <i class="bi bi-people"></i>
        <span>Clientes</span>
      </router-link>

      <router-link 
        to="/dashboard/estadisticas" 
        class="nav-item"
        active-class="active"
      >
        <i class="bi bi-bar-chart"></i>
        <span>Estadísticas</span>
      </router-link>

      <router-link 
        v-if="currentUser && currentUser.rol === 'admin'"
        to="/dashboard/usuarios" 
        class="nav-item"
        active-class="active"
      >
        <i class="bi bi-person-gear"></i>
        <span>Gestión de Usuarios</span>
      </router-link>
    </nav>
  </aside>
</template>

<script>
export default {
  name: 'SidebarComponent',
  props: {
    currentUser: {
      type: Object,
      default: null
    },
    isVisible: {
      type: Boolean,
      default: false
    }
  },
  emits: ['close'],
  methods: {
    closeSidebar() {
      this.$emit('close');
    }
  }
}
</script>

<style scoped>
.sidebar-minimal {
  position: fixed;
  left: 0;
  top: 70px;
  width: 240px;
  height: calc(100vh - 70px);
  background: #ffffff;
  border-right: 1px solid #dee2e6;
  padding: 2rem 0;
  z-index: 900;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s ease;
  transform: translateX(0);
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0 1rem;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.25rem;
  color: #6c757d;
  text-decoration: none;
  border-radius: 12px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-size: 0.9375rem;
  font-weight: 500;
  position: relative;
  overflow: hidden;
}

.nav-item::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  width: 3px;
  height: 100%;
  background: #6366f1;
  transform: scaleY(0);
  transition: transform 0.3s ease;
}

.nav-item i {
  font-size: 1.25rem;
  width: 24px;
  text-align: center;
  transition: all 0.3s ease;
  color: #adb5bd;
}

.nav-item:hover {
  background: #f8f9fa;
  color: #212529;
  transform: translateX(4px);
  padding-left: 1.5rem;
}

.nav-item:hover i {
  color: #6366f1;
  transform: scale(1.1);
}

.nav-item.active {
  background: #eef2ff;
  color: #6366f1;
  border: 1px solid #c7d2fe;
  box-shadow: 0 2px 4px rgba(99, 102, 241, 0.1);
}

.nav-item.active::before {
  transform: scaleY(1);
}

.nav-item.active i {
  color: #6366f1;
  transform: scale(1.1);
}

.sidebar-overlay {
  display: none;
}

@media (max-width: 768px) {
  .sidebar-overlay {
    display: block;
    position: fixed;
    top: 60px;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 899;
    animation: fadeIn 0.3s ease;
  }

  .sidebar-minimal {
    top: 60px;
    height: calc(100vh - 60px);
    transform: translateX(-100%);
    transition: transform 0.3s ease;
    z-index: 900;
  }
  
  .sidebar-minimal.show {
    transform: translateX(0);
  }
}

@media (min-width: 769px) {
  .sidebar-minimal {
    transform: translateX(0) !important;
  }
  
  .sidebar-overlay {
    display: none !important;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
