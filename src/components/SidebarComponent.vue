<template>
  <aside class="sidebar">
    <div class="sidebar-menu">
      <router-link to="/productos" class="sidebar-link">
        <i class="bi bi-box-seam"></i>
        <span>Productos</span>
      </router-link>
      
      <router-link to="/usuarios" class="sidebar-link">
        <i class="bi bi-people"></i>
        <span>Usuarios</span>
      </router-link>

      <button @click="handleLogout" class="sidebar-link logout-btn">
        <i class="bi bi-box-arrow-right"></i>
        <span>Cerrar Sesión</span>
      </button>
    </div>
  </aside>
</template>

<script>
import { authService } from '../services';

export default {
  name: 'SidebarComponent',
  methods: {
    handleLogout() {
      authService.logout();
      this.$router.push('/login');
    }
  }
};
</script>

<style scoped>
.sidebar {
  width: 240px;
  background: #ffffff;
  border-right: 1px solid #e5e7eb;
  min-height: calc(100vh - 64px);
  position: sticky;
  top: 64px;
}

.sidebar-menu {
  padding: 1.5rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.sidebar-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  color: #6b7280;
  text-decoration: none;
  border-radius: 8px;
  transition: all 0.2s;
  font-size: 0.9375rem;
  border: none;
  background: transparent;
  cursor: pointer;
  width: 100%;
  text-align: left;
}

.sidebar-link:hover {
  background: #f3f4f6;
  color: #111827;
}

.sidebar-link.router-link-active {
  background: #f3f4f6;
  color: #111827;
  font-weight: 500;
}

.sidebar-link i {
  font-size: 1.125rem;
  width: 20px;
}

.logout-btn {
  margin-top: auto;
  color: #dc2626;
}

.logout-btn:hover {
  background: #fee2e2;
  color: #b91c1c;
}

@media (max-width: 768px) {
  .sidebar {
    width: 100%;
    min-height: auto;
    position: static;
    border-right: none;
    border-bottom: 1px solid #e5e7eb;
  }

  .sidebar-menu {
    flex-direction: row;
    overflow-x: auto;
    padding: 1rem;
  }

  .sidebar-link span {
    display: none;
  }

  .sidebar-link {
    flex-shrink: 0;
    padding: 0.75rem;
  }
}
</style>
