<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
    <div class="container-fluid">
      <a class="navbar-brand d-flex align-items-center" href="#">
        <i class="bi bi-cpu me-2 fs-4"></i>
        <span class="fw-bold">TechStore Pro</span>
      </a>
      
      <button 
        class="navbar-toggler" 
        type="button" 
        data-bs-toggle="collapse" 
        data-bs-target="#navbarContent"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarContent">
        <ul class="navbar-nav ms-auto align-items-center">
          <li class="nav-item dropdown" v-if="currentUser">
            <a 
              class="nav-link dropdown-toggle d-flex align-items-center" 
              href="#" 
              role="button" 
              data-bs-toggle="dropdown"
            >
              <i class="bi bi-person-circle me-2 fs-5"></i>
              <span>{{ currentUser.nombre }}</span>
            </a>
            <ul class="dropdown-menu dropdown-menu-end">
              <li>
                <a class="dropdown-item" href="#">
                  <i class="bi bi-gear me-2"></i>Configuración
                </a>
              </li>
              <li>
                <a class="dropdown-item" href="#">
                  <i class="bi bi-person me-2"></i>Mi Perfil
                </a>
              </li>
              <li><hr class="dropdown-divider"></li>
              <li>
                <a class="dropdown-item text-danger" href="#" @click.prevent="handleLogout">
                  <i class="bi bi-box-arrow-right me-2"></i>Cerrar Sesión
                </a>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
import authService from '../services/authService';

export default {
  name: 'NavbarComponent',
  props: {
    currentUser: {
      type: Object,
      default: null
    }
  },
  emits: ['logout'],
  methods: {
    handleLogout() {
      this.$emit('logout');
    }
  }
}
</script>

<style scoped>
.navbar {
  border-bottom: 3px solid #0056b3;
}

.navbar-brand {
  font-size: 1.5rem;
  letter-spacing: 0.5px;
}

.navbar-brand i {
  color: #ffc107;
}

.nav-link {
  transition: all 0.3s ease;
}

.nav-link:hover {
  color: #ffc107 !important;
}

.dropdown-item:hover {
  background-color: #0d6efd;
  color: white;
}

.dropdown-item.text-danger:hover {
  background-color: #dc3545;
  color: white !important;
}
</style>

