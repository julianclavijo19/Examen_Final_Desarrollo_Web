<template>
  <div class="sidebar bg-dark text-white d-flex flex-column">
    <div class="sidebar-header p-3 border-bottom border-secondary">
      <h5 class="mb-0">
        <i class="bi bi-grid-fill me-2"></i>
        Panel de Control
      </h5>
    </div>

    <nav class="flex-grow-1 py-3">
      <ul class="nav flex-column">
        <li class="nav-item">
          <router-link 
            to="/dashboard" 
            class="nav-link text-white d-flex align-items-center"
            exact-active-class="active"
          >
            <i class="bi bi-speedometer2 me-3"></i>
            <span>Dashboard</span>
          </router-link>
        </li>
        
        <li class="nav-item">
          <router-link 
            to="/dashboard/productos" 
            class="nav-link text-white d-flex align-items-center"
            active-class="active"
          >
            <i class="bi bi-box-seam me-3"></i>
            <span>Productos</span>
          </router-link>
        </li>

        <li class="nav-item">
          <router-link 
            to="/dashboard/categorias" 
            class="nav-link text-white d-flex align-items-center"
            active-class="active"
          >
            <i class="bi bi-tags me-3"></i>
            <span>Categorías</span>
          </router-link>
        </li>

        <li class="nav-item">
          <router-link 
            to="/dashboard/clientes" 
            class="nav-link text-white d-flex align-items-center"
            active-class="active"
          >
            <i class="bi bi-people me-3"></i>
            <span>Clientes</span>
          </router-link>
        </li>

        <li class="nav-item">
          <a href="#" class="nav-link text-white d-flex align-items-center">
            <i class="bi bi-graph-up me-3"></i>
            <span>Reportes</span>
          </a>
        </li>

        <li class="nav-item">
          <a href="#" class="nav-link text-white d-flex align-items-center">
            <i class="bi bi-gear me-3"></i>
            <span>Configuración</span>
          </a>
        </li>
      </ul>
    </nav>

    <div class="sidebar-footer p-3 border-top border-secondary">
      <div class="d-flex align-items-center">
        <div class="flex-shrink-0">
          <i class="bi bi-person-circle fs-3"></i>
        </div>
        <div class="flex-grow-1 ms-3">
          <small class="d-block text-muted">Bienvenido</small>
          <strong class="d-block">{{ currentUser?.nombre || 'Usuario' }}</strong>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SidebarComponent',
  props: {
    currentUser: {
      type: Object,
      default: null
    }
  }
}
</script>

<style scoped>
.sidebar {
  width: 250px;
  height: 100vh;
  position: fixed;
  left: 0;
  top: 56px;
  overflow-y: auto;
  z-index: 100;
  box-shadow: 2px 0 5px rgba(0,0,0,0.1);
}

.sidebar-header {
  background-color: #1a1d20;
}

.nav-link {
  padding: 12px 20px;
  border-radius: 0;
  transition: all 0.3s ease;
  border-left: 3px solid transparent;
}

.nav-link:hover {
  background-color: #495057;
  border-left-color: #0d6efd;
  padding-left: 25px;
}

.nav-link.active {
  background-color: #0d6efd;
  border-left-color: #ffc107;
  font-weight: 500;
}

.nav-link i {
  font-size: 1.2rem;
  width: 24px;
}

.sidebar-footer {
  background-color: #1a1d20;
}

/* Scrollbar personalizado */
.sidebar::-webkit-scrollbar {
  width: 6px;
}

.sidebar::-webkit-scrollbar-track {
  background: #212529;
}

.sidebar::-webkit-scrollbar-thumb {
  background: #495057;
  border-radius: 3px;
}

.sidebar::-webkit-scrollbar-thumb:hover {
  background: #6c757d;
}

/* Responsive */
@media (max-width: 768px) {
  .sidebar {
    width: 100%;
    height: auto;
    position: relative;
    top: 0;
  }
}
</style>

