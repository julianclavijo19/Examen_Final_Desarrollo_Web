<template>
  <nav class="navbar-minimal">
    <div class="container-fluid">
      <button class="menu-toggle-btn" @click="toggleSidebar" title="Toggle Menu">
        <i class="bi bi-list"></i>
      </button>
      <div class="navbar-brand">
        <i class="bi bi-controller"></i>
        <span>GamerHub Pro</span>
      </div>

      <div class="navbar-center">
        <div class="search-box">
          <i class="bi bi-search"></i>
          <input type="text" placeholder="Buscar productos, categorías...">
        </div>
      </div>

      <div class="navbar-actions">
        <div class="notification-menu">
          <button class="notification-btn" @click="toggleNotifications" title="Notificaciones">
            <i class="bi bi-bell"></i>
            <span class="notification-badge" v-if="unreadCount > 0">{{ unreadCount }}</span>
          </button>
          
          <div class="notification-dropdown" v-show="showNotifications">
            <div class="notification-header">
              <h3>Notificaciones</h3>
              <button class="mark-all-read" @click="markAllAsRead" v-if="unreadCount > 0">
                Marcar todas como leídas
              </button>
            </div>
            <div class="notification-list">
              <div 
                v-for="notification in notifications" 
                :key="notification.id"
                class="notification-item"
                :class="{ unread: !notification.read }"
                @click="handleNotificationClick(notification)"
              >
                <div class="notification-icon" :class="notification.type">
                  <i :class="notification.icon"></i>
                </div>
                <div class="notification-content">
                  <p class="notification-title">{{ notification.title }}</p>
                  <p class="notification-message">{{ notification.message }}</p>
                  <span class="notification-time">{{ notification.time }}</span>
                </div>
                <div class="notification-unread-dot" v-if="!notification.read"></div>
              </div>
              <div v-if="notifications.length === 0" class="notification-empty">
                <i class="bi bi-bell-slash"></i>
                <p>No hay notificaciones</p>
              </div>
            </div>
          </div>
        </div>

        <div class="user-menu" v-if="currentUser && currentUser.email">
          <button class="user-btn" @click="toggleMenu">
            <div class="user-avatar">
              <i class="bi bi-person-circle"></i>
            </div>
            <div class="user-info">
              <span class="user-name">{{ currentUser.nombre || currentUser.email?.split('@')[0] || 'Usuario' }}</span>
              <span class="user-role-badge">{{ getRoleName(currentUser.rol || 'usuario') }}</span>
            </div>
            <i class="bi bi-chevron-down arrow-icon"></i>
          </button>
          
          <div class="user-dropdown" v-show="showMenu">
            <div class="dropdown-header">
              <div class="user-avatar-large">
                <i class="bi bi-person-circle"></i>
              </div>
              <div class="user-details">
                <p class="user-name-large">{{ currentUser.nombre }}</p>
                <p class="user-email">{{ currentUser.email }}</p>
                <span class="user-role" :class="getRoleClass(currentUser.rol)">
                  <i :class="getRoleIcon(currentUser.rol)"></i>
                  {{ getRoleName(currentUser.rol) }}
                </span>
              </div>
            </div>
            <div class="dropdown-divider"></div>
            <button class="dropdown-item" @click="goToProfile">
              <i class="bi bi-person"></i>
              Mi Perfil
            </button>
            <button class="dropdown-item" @click="goToSettings">
              <i class="bi bi-gear"></i>
              Configuración
            </button>
            <div class="dropdown-divider" v-if="isAdmin"></div>
            <div v-if="isAdmin" class="admin-section">
              <button class="dropdown-item admin-item" @click="goToAdminPanel">
                <i class="bi bi-shield-check"></i>
                Panel de Administración
              </button>
              <button class="dropdown-item admin-item" @click="goToUsers">
                <i class="bi bi-people"></i>
                Gestión de Usuarios
              </button>
              <button class="dropdown-item admin-item" @click="goToReports">
                <i class="bi bi-graph-up"></i>
                Reportes y Estadísticas
              </button>
            </div>
            <div class="dropdown-divider"></div>
            <button class="dropdown-item logout-btn" @click="handleLogout">
              <i class="bi bi-box-arrow-right"></i>
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'NavbarComponent',
  props: {
    currentUser: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      showMenu: false,
      showNotifications: false,
      notifications: [
        {
          id: 1,
          title: 'Nuevo producto agregado',
          message: 'Se agregó un nuevo producto al catálogo',
          type: 'success',
          icon: 'bi bi-check-circle',
          read: false,
          time: 'Hace 5 minutos',
          route: '/dashboard/productos'
        },
        {
          id: 2,
          title: 'Stock bajo',
          message: 'El producto "Gaming Mouse" tiene stock bajo',
          type: 'warning',
          icon: 'bi bi-exclamation-triangle',
          read: false,
          time: 'Hace 1 hora',
          route: '/dashboard/productos'
        },
        {
          id: 3,
          title: 'Nuevo cliente registrado',
          message: 'Un nuevo cliente se registró en el sistema',
          type: 'info',
          icon: 'bi bi-person-plus',
          read: false,
          time: 'Hace 2 horas',
          route: '/dashboard/clientes'
        },
        {
          id: 4,
          title: 'Venta completada',
          message: 'Se completó una venta exitosamente',
          type: 'success',
          icon: 'bi bi-cart-check',
          read: true,
          time: 'Hace 1 día',
          route: '/dashboard'
        }
      ]
    };
  },
  computed: {
    unreadCount() {
      return this.notifications.filter(n => !n.read).length;
    },
    isAdmin() {
      return this.currentUser && this.currentUser.rol === 'admin';
    }
  },
  emits: ['logout', 'toggle-sidebar'],
  methods: {
    toggleSidebar() {
      this.$emit('toggle-sidebar');
    },
    toggleMenu() {
      this.showMenu = !this.showMenu;
      if (this.showMenu) {
        this.showNotifications = false;
      }
    },
    toggleNotifications() {
      this.showNotifications = !this.showNotifications;
      if (this.showNotifications) {
        this.showMenu = false;
      }
    },
    handleLogout() {
      this.showMenu = false;
      this.$emit('logout');
    },
    getRoleName(rol) {
      const roles = {
        'admin': 'Administrador',
        'vendedor': 'Vendedor',
        'usuario': 'Usuario'
      };
      return roles[rol] || rol;
    },
    getRoleClass(rol) {
      return `role-${rol}`;
    },
    getRoleIcon(rol) {
      const icons = {
        'admin': 'bi bi-shield-check',
        'vendedor': 'bi bi-bag-check',
        'usuario': 'bi bi-person'
      };
      return icons[rol] || 'bi bi-person';
    },
    handleNotificationClick(notification) {
      notification.read = true;
      this.showNotifications = false;
      if (notification.route) {
        this.$router.push(notification.route);
      }
    },
    markAllAsRead() {
      this.notifications.forEach(n => n.read = true);
    },
    goToProfile() {
      this.showMenu = false;
      // Implementar navegación a perfil
      console.log('Ir a perfil');
    },
    goToSettings() {
      this.showMenu = false;
      // Implementar navegación a configuración
      console.log('Ir a configuración');
    },
    goToAdminPanel() {
      this.showMenu = false;
      // Implementar navegación a panel de administración
      alert('Panel de Administración\n\nFuncionalidades disponibles:\n- Gestión de usuarios\n- Reportes y estadísticas\n- Configuración del sistema\n- Auditoría de acciones');
    },
    goToUsers() {
      this.showMenu = false;
      alert('Gestión de Usuarios\n\nFuncionalidades:\n- Listar usuarios\n- Crear nuevos usuarios\n- Editar permisos\n- Eliminar usuarios');
    },
    goToReports() {
      this.showMenu = false;
      alert('Reportes y Estadísticas\n\nDisponibles:\n- Reportes de ventas\n- Estadísticas de productos\n- Análisis de clientes\n- Gráficos y métricas');
    }
  },
  mounted() {
    // Cerrar menú al hacer clic fuera
    document.addEventListener('click', (e) => {
      if (!this.$el.contains(e.target)) {
        this.showMenu = false;
        this.showNotifications = false;
      }
    });
  }
}
</script>

<style scoped>
.navbar-minimal {
  background: #ffffff;
  border-bottom: 1px solid #dee2e6;
  padding: 0.75rem 2rem;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  height: 70px;
  backdrop-filter: blur(10px);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}

.container-fluid {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 100%;
  padding: 0;
  height: 100%;
}

.navbar-brand {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #212529;
  font-size: 1.35rem;
  font-weight: 700;
  letter-spacing: -0.03em;
  cursor: pointer;
  transition: all 0.3s ease;
}

.navbar-brand:hover {
  transform: scale(1.02);
}

.navbar-brand i {
  font-size: 1.75rem;
  color: #6366f1;
}

.navbar-center {
  flex: 1;
  max-width: 500px;
  margin: 0 2rem;
}

.search-box {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 10px;
  padding: 0.625rem 1rem;
  transition: all 0.3s ease;
}

.search-box:focus-within {
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
  background: #ffffff;
}

.search-box i {
  color: #6c757d;
  font-size: 1rem;
}

.search-box input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  color: #212529;
  font-size: 0.9375rem;
}

.search-box input::placeholder {
  color: #adb5bd;
}

.navbar-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.notification-menu {
  position: relative;
}

.notification-btn {
  position: relative;
  background: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 10px;
  width: 42px;
  height: 42px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #495057;
  cursor: pointer;
  transition: all 0.3s ease;
}

.notification-btn:hover {
  background: #e9ecef;
  border-color: #6366f1;
  color: #6366f1;
  transform: scale(1.05);
}

.notification-btn i {
  font-size: 1.125rem;
}

.notification-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  background: #ef4444;
  color: #ffffff;
  font-size: 0.625rem;
  font-weight: 700;
  padding: 0.125rem 0.375rem;
  border-radius: 10px;
  border: 2px solid #ffffff;
  min-width: 18px;
  text-align: center;
  animation: pulse 2s ease-in-out infinite;
}

.notification-dropdown {
  position: absolute;
  top: calc(100% + 0.5rem);
  right: 0;
  background: #ffffff;
  border: 1px solid #dee2e6;
  border-radius: 12px;
  min-width: 360px;
  max-width: 400px;
  max-height: 500px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  animation: slideDown 0.3s ease;
  z-index: 1001;
}

.notification-header {
  padding: 1.25rem;
  border-bottom: 1px solid #dee2e6;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f8f9fa;
}

.notification-header h3 {
  color: #212529;
  font-size: 1rem;
  font-weight: 700;
  margin: 0;
}

.mark-all-read {
  background: transparent;
  border: none;
  color: #6366f1;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.mark-all-read:hover {
  background: #eef2ff;
}

.notification-list {
  max-height: 400px;
  overflow-y: auto;
}

.notification-item {
  display: flex;
  gap: 1rem;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid #dee2e6;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
}

.notification-item:hover {
  background: #f8f9fa;
}

.notification-item.unread {
  background: #eef2ff;
}

.notification-item.unread:hover {
  background: #e0e7ff;
}

.notification-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.125rem;
  flex-shrink: 0;
}

.notification-icon.success {
  background: #d1fae5;
  color: #10b981;
}

.notification-icon.warning {
  background: #fef3c7;
  color: #f59e0b;
}

.notification-icon.info {
  background: #dbeafe;
  color: #3b82f6;
}

.notification-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.notification-title {
  color: #212529;
  font-size: 0.875rem;
  font-weight: 600;
  margin: 0;
}

.notification-message {
  color: #6c757d;
  font-size: 0.8125rem;
  margin: 0;
  line-height: 1.4;
}

.notification-time {
  color: #adb5bd;
  font-size: 0.75rem;
  margin-top: 0.25rem;
}

.notification-unread-dot {
  width: 8px;
  height: 8px;
  background: #6366f1;
  border-radius: 50%;
  flex-shrink: 0;
  align-self: center;
  animation: pulse 2s ease-in-out infinite;
}

.notification-empty {
  padding: 3rem 2rem;
  text-align: center;
  color: #adb5bd;
}

.notification-empty i {
  font-size: 3rem;
  margin-bottom: 1rem;
  opacity: 0.3;
}

.notification-empty p {
  margin: 0;
  font-size: 0.875rem;
}

.user-menu {
  position: relative;
}

.user-btn {
  background: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 10px;
  padding: 0.375rem 0.75rem;
  color: #212529;
  display: flex;
  align-items: center;
  gap: 0.625rem;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 200px;
}

.user-btn:hover {
  background: #e9ecef;
  border-color: #6366f1;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(99, 102, 241, 0.15);
}

.user-avatar {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  font-size: 1.25rem;
  flex-shrink: 0;
}

.user-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
  text-align: left;
}

.user-name {
  font-size: 0.875rem;
  font-weight: 600;
  color: #212529;
  line-height: 1.2;
}

.user-role-badge {
  font-size: 0.6875rem;
  color: #6366f1;
  font-weight: 500;
}

.arrow-icon {
  font-size: 0.75rem;
  opacity: 0.5;
  transition: all 0.3s ease;
}

.user-btn:hover .arrow-icon {
  opacity: 1;
  transform: translateY(2px);
}

.user-dropdown {
  position: absolute;
  top: calc(100% + 0.5rem);
  right: 0;
  background: #ffffff;
  border: 1px solid #dee2e6;
  border-radius: 12px;
  min-width: 280px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  animation: slideDown 0.3s ease;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.dropdown-header {
  padding: 1.25rem;
  background: #f8f9fa;
  display: flex;
  gap: 1rem;
}

.user-avatar-large {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  font-size: 2rem;
  flex-shrink: 0;
}

.user-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.user-name-large {
  color: #212529;
  font-size: 0.9375rem;
  font-weight: 600;
  margin: 0;
  line-height: 1.3;
}

.user-email {
  color: #6c757d;
  font-size: 0.8125rem;
  margin: 0;
  line-height: 1.3;
}

.user-role {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.75rem;
  padding: 0.25rem 0.625rem;
  border-radius: 6px;
  font-weight: 600;
  margin-top: 0.25rem;
  width: fit-content;
}

.user-role.role-admin {
  background: #eef2ff;
  color: #6366f1;
  border: 1px solid #c7d2fe;
}

.user-role.role-vendedor {
  background: #fef3c7;
  color: #f59e0b;
  border: 1px solid #fde68a;
}

.user-role.role-usuario {
  background: #dbeafe;
  color: #3b82f6;
  border: 1px solid #bfdbfe;
}

.dropdown-divider {
  height: 1px;
  background: #dee2e6;
  margin: 0.5rem 0;
}

.dropdown-item {
  width: 100%;
  background: transparent;
  border: none;
  padding: 0.875rem 1.25rem;
  color: #495057;
  text-align: left;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.875rem;
  font-weight: 500;
}

.dropdown-item:hover {
  background: #f8f9fa;
  color: #212529;
  padding-left: 1.5rem;
}

.dropdown-item i {
  font-size: 1.125rem;
  width: 20px;
  text-align: center;
}

.logout-btn {
  color: #ef4444;
}

.logout-btn:hover {
  background: #fee2e2;
  color: #ef4444;
}

.admin-section {
  background: #eef2ff;
  border-left: 3px solid #6366f1;
  margin: 0.5rem 0;
  padding: 0.5rem 0;
}

.dropdown-item.admin-item {
  color: #6366f1;
  font-weight: 600;
}

.dropdown-item.admin-item:hover {
  background: #e0e7ff;
  color: #6366f1;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

@media (max-width: 1024px) {
  .navbar-center {
    max-width: 300px;
    margin: 0 1rem;
  }
}

.menu-toggle-btn {
  display: none;
  background: transparent;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  width: 40px;
  height: 40px;
  align-items: center;
  justify-content: center;
  color: #495057;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-right: 1rem;
}

.menu-toggle-btn:hover {
  background: #f8f9fa;
  border-color: #6366f1;
  color: #6366f1;
}

.menu-toggle-btn i {
  font-size: 1.25rem;
}

@media (max-width: 768px) {
  .menu-toggle-btn {
    display: flex;
  }

  .navbar-minimal {
    padding: 0.75rem 1rem;
    height: 60px;
  }

  .navbar-center {
    display: none;
  }
  
  .user-info {
    display: none;
  }

  .user-btn {
    min-width: auto;
    padding: 0.375rem;
  }

  .notification-btn {
    width: 38px;
    height: 38px;
  }

  .notification-dropdown {
    min-width: 320px;
    max-width: calc(100vw - 2rem);
    right: -1rem;
  }

  .user-dropdown {
    min-width: 260px;
    right: -1rem;
  }

  .notification-item {
    padding: 0.875rem 1rem;
  }

  .notification-icon {
    width: 36px;
    height: 36px;
    font-size: 1rem;
  }
}
</style>
