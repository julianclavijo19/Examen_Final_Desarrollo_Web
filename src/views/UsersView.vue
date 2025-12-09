<template>
  <div class="users-management">
    <div class="page-header">
      <div>
        <h1>Gestión de Usuarios</h1>
        <p class="page-subtitle">Administra los usuarios del sistema</p>
      </div>
      <button 
        class="btn-primary"
        @click="showCreateModal = true"
      >
        <i class="bi bi-person-plus"></i>
        Nuevo Usuario
      </button>
    </div>

    <!-- Alertas -->
    <transition name="fade">
      <div v-if="error" class="alert alert-error" style="white-space: pre-line;">
        <i class="bi bi-exclamation-circle-fill"></i>
        <div style="flex: 1;">
          <strong>Error:</strong><br>
          <span>{{ error }}</span>
        </div>
        <button class="alert-close" @click="error = null">
          <i class="bi bi-x"></i>
        </button>
      </div>
    </transition>

    <transition name="fade">
      <div v-if="successMessage" class="alert alert-success">
        <i class="bi bi-check-circle-fill"></i>
        <span>{{ successMessage }}</span>
      </div>
    </transition>

    <!-- Tabla de usuarios -->
    <div class="table-container">
      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
        <p>Cargando usuarios...</p>
      </div>

      <div v-else-if="users.length === 0 && !error" class="empty-state">
        <i class="bi bi-people"></i>
        <p>No hay usuarios registrados</p>
      </div>

      <table v-else class="users-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Email</th>
            <th class="col-actions">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id">
            <td>
              <div class="user-info">
                <div class="user-avatar">
                  <i class="bi bi-person-circle"></i>
                </div>
                <span class="user-name">{{ user.name }}</span>
              </div>
            </td>
            <td>{{ user.email }}</td>
            <td class="col-actions">
              <div class="actions-cell">
                <button 
                  class="action-btn edit" 
                  @click="editUser(user)"
                  title="Editar"
                >
                  <i class="bi bi-pencil"></i>
                </button>
                <button 
                  class="action-btn delete" 
                  @click="confirmDelete(user)"
                  title="Eliminar"
                >
                  <i class="bi bi-trash"></i>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal para crear/editar usuario -->
    <div v-if="showCreateModal || showEditModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2>{{ showEditModal ? 'Editar Usuario' : 'Nuevo Usuario' }}</h2>
          <button class="modal-close" @click="closeModal">
            <i class="bi bi-x"></i>
          </button>
        </div>

        <form @submit.prevent="showEditModal ? updateUser() : createUser()" class="modal-form">
          <div class="form-group">
            <label>
              Nombre completo
              <span class="required">*</span>
            </label>
            <input
              type="text"
              v-model="formData.name"
              placeholder="Juan Pérez"
              required
              :disabled="loading"
            >
          </div>

          <div class="form-group">
            <label>
              Correo electrónico
              <span class="required">*</span>
            </label>
            <input
              type="email"
              v-model="formData.email"
              placeholder="juan@example.com"
              required
              :disabled="loading || showEditModal"
            >
          </div>

          <div class="form-group" v-if="!showEditModal">
            <label>
              Contraseña
              <span class="required">*</span>
            </label>
            <div class="password-input">
              <input
                :type="showPassword ? 'text' : 'password'"
                v-model="formData.password"
                placeholder="••••••••"
                required
                minlength="6"
                :disabled="loading"
              >
              <button 
                type="button" 
                class="toggle-password"
                @click="showPassword = !showPassword"
                tabindex="-1"
              >
                <i class="bi" :class="showPassword ? 'bi-eye-slash' : 'bi-eye'"></i>
              </button>
            </div>
            <small class="form-hint">Mínimo 6 caracteres</small>
          </div>

          <div class="modal-actions">
            <button 
              type="button" 
              class="btn-secondary"
              @click="closeModal"
              :disabled="loading"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              class="btn-primary"
              :disabled="loading || !isFormValid"
            >
              <span v-if="loading" class="button-content">
                <span class="spinner-small"></span>
                {{ showEditModal ? 'Guardando...' : 'Creando...' }}
              </span>
              <span v-else class="button-content">
                <i class="bi bi-check-lg"></i>
                {{ showEditModal ? 'Guardar Cambios' : 'Crear Usuario' }}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal de confirmación de eliminación -->
    <div v-if="showDeleteModal" class="modal-overlay" @click="showDeleteModal = false">
      <div class="modal-content modal-confirm" @click.stop>
        <div class="modal-header">
          <h2>Confirmar Eliminación</h2>
        </div>
        <div class="modal-body">
          <p>¿Estás seguro de que deseas eliminar al usuario <strong>{{ userToDelete?.nombre }}</strong>?</p>
          <p class="text-warning">Esta acción no se puede deshacer.</p>
        </div>
        <div class="modal-actions">
          <button 
            type="button" 
            class="btn-secondary"
            @click="showDeleteModal = false"
            :disabled="loading"
          >
            Cancelar
          </button>
          <button 
            type="button" 
            class="btn-danger"
            @click="deleteUser"
            :disabled="loading"
          >
            <span v-if="loading" class="button-content">
              <span class="spinner-small"></span>
              Eliminando...
            </span>
            <span v-else class="button-content">
              <i class="bi bi-trash"></i>
              Eliminar
            </span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import userService from '../services/userService';
import authService from '../services/authService';
import { isValidEmail } from '../utils/validators';

/**
 * Vista de gestión de usuarios
 * Implementa CRUD completo con modales Bootstrap y validaciones
 */
export default {
  name: 'UsersView',
  data() {
    return {
      users: [],
      loading: false,
      error: null,
      successMessage: null,
      currentUser: null,
      showCreateModal: false,
      showEditModal: false,
      showDeleteModal: false,
      showPassword: false,
      userToDelete: null,
      formData: {
        name: '',
        email: '',
        password: ''
      }
    };
  },
  computed: {
    isFormValid() {
      if (this.showEditModal) {
        return this.formData.name && 
               this.formData.email && 
               isValidEmail(this.formData.email);
      } else {
        return this.formData.name && 
               this.formData.email && 
               isValidEmail(this.formData.email) &&
               this.formData.password && 
               this.formData.password.length >= 6;
      }
    }
  },
  async mounted() {
    // Obtener usuario actual
    try {
      this.currentUser = authService.getCurrentUser();
      
      if (!this.currentUser) {
        console.error('❌ No se pudo obtener el usuario actual');
        this.$router.push('/login');
        return;
      }
      
      console.log('✅ Usuario actual:', this.currentUser);
      await this.loadUsers();
    } catch (error) {
      console.error('❌ Error al cargar usuarios:', error);
      this.error = 'Error al cargar usuarios. Por favor, inicia sesión nuevamente.';
      setTimeout(() => {
        this.$router.push('/login');
      }, 2000);
    }
  },
  methods: {
    async loadUsers() {
      this.loading = true;
      this.error = null;
      this.successMessage = null;

      try {
        console.log('🔍 Cargando usuarios...');
        this.users = await userService.getAllUsers();
        console.log(`✅ ${this.users.length} usuarios cargados`);
        
        if (this.users.length === 0) {
          console.log('⚠️ No hay usuarios en la base de datos o no se pudieron cargar');
          this.error = 'No se encontraron usuarios.';
        }
      } catch (error) {
        console.error('❌ Error al cargar usuarios:', error);
        this.error = error.message || 'Error al cargar usuarios';
        this.users = [];
      } finally {
        // Asegurar que el loading se detenga siempre
        this.loading = false;
        console.log('✅ Loading detenido');
      }
    },

    async createUser() {
      // Validar formulario antes de enviar
      if (!this.isFormValid) {
        this.error = 'Por favor, completa todos los campos requeridos correctamente';
        return;
      }

      this.loading = true;
      this.error = null;
      this.successMessage = null;

      try {
        console.log('🔄 Creando usuario:', this.formData.email);
        
        // Agregar timeout para evitar que se quede cargando indefinidamente
        const createPromise = userService.createUser(this.formData);
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Timeout: La creación del usuario tardó demasiado tiempo')), 15000);
        });
        
        const newUser = await Promise.race([createPromise, timeoutPromise]);
        console.log('✅ Usuario creado:', newUser);
        
        this.successMessage = `Usuario "${newUser.nombre || newUser.email}" creado exitosamente`;
        
        // Cerrar el modal antes de recargar
        this.closeModal();
        
        // Recargar la lista de usuarios después de un breve delay
        console.log('🔄 Recargando lista de usuarios...');
        await new Promise(resolve => setTimeout(resolve, 500));
        await this.loadUsers();
        
        // Verificar que el nuevo usuario está en la lista (con múltiples intentos)
        let newUserInList = null;
        let attempts = 0;
        const maxAttempts = 5;
        
        while (!newUserInList && attempts < maxAttempts) {
          await new Promise(resolve => setTimeout(resolve, 500));
          await this.loadUsers();
          
          newUserInList = this.users.find(u => 
            u.id === newUser.id || 
            (u.email && newUser.email && u.email.toLowerCase() === newUser.email.toLowerCase())
          );
          
          if (newUserInList) {
            console.log('✅ Nuevo usuario encontrado en la lista (intento', attempts + 1, ')');
            break;
          }
          
          attempts++;
          console.log('⚠️ Usuario no encontrado, intentando nuevamente... (intento', attempts, 'de', maxAttempts, ')');
        }
        
        if (!newUserInList) {
          console.warn('⚠️ El nuevo usuario no apareció después de', maxAttempts, 'intentos');
          this.error = 'El usuario fue creado pero no aparece en la lista. Por favor, recarga la página.';
        }
        
        // Limpiar mensaje después de 5 segundos
        setTimeout(() => {
          this.successMessage = null;
        }, 5000);
      } catch (error) {
        console.error('❌ Error al crear usuario:', error);
        
        // Proporcionar mensajes de error más específicos
        let errorMessage = error.message || 'Error al crear usuario';
        
        if (error.message && error.message.includes('Timeout')) {
          errorMessage = 'La creación del usuario tardó demasiado tiempo. El usuario puede haber sido creado. Por favor, recarga la página para verificar.';
          // Cerrar el modal y recargar la lista
          this.closeModal();
          await this.loadUsers();
        } else if (error.message && error.message.includes('Ya existe')) {
          errorMessage = error.message;
        } else if (error.message && error.message.includes('permisos')) {
          errorMessage = error.message + '\n\nVerifica que tengas el rol de administrador.';
        }
        
        this.error = errorMessage;
        
        // Mantener el modal abierto solo si no es un error de timeout
        if (!error.message || !error.message.includes('Timeout')) {
          // Mantener el modal abierto para que el usuario pueda corregir los errores
        } else {
          // Cerrar el modal si es timeout (puede que el usuario haya sido creado)
          this.closeModal();
        }
      } finally {
        // Asegurar que el loading se detenga siempre
        this.loading = false;
        console.log('✅ Loading detenido en createUser');
      }
    },

    editUser(user) {
      this.formData = {
        name: user.name,
        email: user.email,
        password: ''
      };
      this.userToDelete = user;
      this.showEditModal = true;
    },

    async updateUser() {
      // Validar formulario antes de enviar
      if (!this.isFormValid) {
        this.error = 'Por favor, completa todos los campos requeridos correctamente';
        return;
      }

      this.loading = true;
      this.error = null;
      this.successMessage = null;

      try {
        console.log('🔄 Actualizando usuario:', this.userToDelete.id);
        const updatedUser = await userService.updateUser(this.userToDelete.id, {
          nombre: this.formData.nombre,
          username: this.formData.username,
          email: this.formData.email,
          rol: this.formData.rol
        });
        console.log('✅ Usuario actualizado:', updatedUser);
        
        this.successMessage = `Usuario "${updatedUser.nombre || updatedUser.email}" actualizado exitosamente`;
        this.closeModal();
        
        // Recargar la lista de usuarios
        await this.loadUsers();
        
        // Si el usuario actualizado es el usuario actual, refrescar su sesión
        if (this.currentUser && this.currentUser.id === updatedUser.id) {
          console.log('⚠️ El usuario actualizado es el usuario actual, refrescando sesión...');
          try {
            await authService.refreshUser();
            // Recargar la página para actualizar el estado
            window.location.reload();
          } catch (refreshError) {
            console.error('Error al refrescar sesión:', refreshError);
          }
        }
        
        // Limpiar mensaje después de 5 segundos
        setTimeout(() => {
          this.successMessage = null;
        }, 5000);
      } catch (error) {
        console.error('❌ Error al actualizar usuario:', error);
        this.error = error.message || 'Error al actualizar usuario';
        
        // Mantener el modal abierto para que el usuario pueda corregir los errores
        // No cerrar el modal en caso de error
      } finally {
        this.loading = false;
      }
    },

    confirmDelete(user) {
      this.userToDelete = user;
      this.showDeleteModal = true;
    },

    async deleteUser() {
      if (!this.userToDelete) {
        console.error('❌ No hay usuario seleccionado para eliminar');
        this.error = 'No hay usuario seleccionado para eliminar';
        return;
      }

      this.loading = true;
      this.error = null;
      this.successMessage = null;

      try {
        const userToDeleteId = this.userToDelete.id;
        const userToDeleteName = this.userToDelete.nombre || this.userToDelete.email;
        
        console.log('🗑️ Iniciando eliminación de usuario:', userToDeleteId, userToDeleteName);
        
        // Agregar timeout para evitar que se quede cargando indefinidamente
        const deletePromise = userService.deleteUser(userToDeleteId);
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Timeout: La eliminación tardó demasiado tiempo')), 10000);
        });
        
        await Promise.race([deletePromise, timeoutPromise]);
        
        console.log('✅ Usuario eliminado exitosamente:', userToDeleteId);
        
        this.successMessage = `Usuario "${userToDeleteName}" eliminado exitosamente`;
        
        // Cerrar el modal antes de recargar
        this.showDeleteModal = false;
        const deletedUser = this.userToDelete;
        this.userToDelete = null;
        
        // Recargar la lista de usuarios después de un breve delay
        console.log('🔄 Recargando lista de usuarios...');
        await new Promise(resolve => setTimeout(resolve, 300));
        await this.loadUsers();
        
        // Verificar que el usuario fue eliminado de la lista
        const userStillExists = this.users.find(u => u.id === deletedUser.id);
        if (userStillExists) {
          console.warn('⚠️ El usuario aún aparece en la lista, recargando nuevamente...');
          await new Promise(resolve => setTimeout(resolve, 500));
          await this.loadUsers();
        }
        
        // Limpiar mensaje después de 5 segundos
        setTimeout(() => {
          this.successMessage = null;
        }, 5000);
      } catch (error) {
        console.error('❌ Error al eliminar usuario:', error);
        
        // Proporcionar mensajes de error más específicos
        let errorMessage = error.message || 'Error al eliminar usuario';
        
        if (error.message && error.message.includes('Timeout')) {
          errorMessage = 'La eliminación tardó demasiado tiempo. El usuario puede haber sido eliminado. Por favor, recarga la página.';
          // Cerrar el modal y recargar la lista
          this.showDeleteModal = false;
          this.userToDelete = null;
          await this.loadUsers();
        } else if (error.message && error.message.includes('permisos')) {
          errorMessage = error.message + '\n\nVerifica que tengas el rol de administrador.';
        }
        
        this.error = errorMessage;
        
        // Mantener el modal abierto solo si no es un error de timeout
        if (!error.message || !error.message.includes('Timeout')) {
          // Mantener el modal abierto para que el usuario vea el error
        } else {
          // Cerrar el modal si es timeout (puede que el usuario haya sido eliminado)
          this.showDeleteModal = false;
          this.userToDelete = null;
        }
      } finally {
        // Asegurar que el loading se detenga siempre
        this.loading = false;
        console.log('✅ Loading detenido en deleteUser');
      }
    },

    closeModal() {
      this.showCreateModal = false;
      this.showEditModal = false;
      this.formData = {
        name: '',
        email: '',
        password: ''
      };
      this.userToDelete = null;
      this.error = null;
      this.showPassword = false;
    },

    formatDate(dateString) {
      if (!dateString) return '-';
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    },

    handleLogout() {
      authService.logout();
      this.$router.push('/login');
    }
  }
};
</script>

<style scoped src="../styles/users.css" />

