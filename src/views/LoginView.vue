<template>
  <div class="container">
    <div class="row justify-content-center align-items-center min-vh-100">
      <div class="col-md-5 col-lg-4">
        <div class="card shadow-sm">
          <div class="card-body p-4">
            <!-- Header -->
            <div class="text-center mb-4">
              <i class="bi bi-box-seam fs-1 text-primary"></i>
              <h3 class="mt-2 mb-1">Sistema de Gestión</h3>
              <p class="text-muted">Inicia sesión para continuar</p>
            </div>

            <!-- Alertas Bootstrap -->
            <div v-if="error" class="alert alert-danger alert-dismissible fade show" role="alert">
              <i class="bi bi-exclamation-circle-fill me-2"></i>
              {{ error }}
              <button type="button" class="btn-close" @click="error = null" aria-label="Close"></button>
            </div>

            <div v-if="successMessage" class="alert alert-success fade show" role="alert">
              <i class="bi bi-check-circle-fill me-2"></i>
              {{ successMessage }}
            </div>

            <!-- Formulario -->
            <form @submit.prevent="handleLogin">
              <div class="mb-3">
                <label for="email" class="form-label">Email</label>
                <div class="input-group">
                  <span class="input-group-text">
                    <i class="bi bi-envelope"></i>
                  </span>
                  <input
                    id="email"
                    type="email"
                    class="form-control"
                    v-model="credentials.email"
                    placeholder="tu@email.com"
                    required
                    :disabled="loading"
                  >
                </div>
              </div>

              <div class="mb-3">
                <label for="password" class="form-label">Contraseña</label>
                <div class="input-group">
                  <span class="input-group-text">
                    <i class="bi bi-lock"></i>
                  </span>
                  <input
                    id="password"
                    :type="showPassword ? 'text' : 'password'"
                    class="form-control"
                    v-model="credentials.password"
                    placeholder="••••••••"
                    required
                    :disabled="loading"
                  >
                  <button 
                    class="btn btn-outline-secondary" 
                    type="button"
                    @click="showPassword = !showPassword"
                    :disabled="loading"
                  >
                    <i class="bi" :class="showPassword ? 'bi-eye-slash' : 'bi-eye'"></i>
                  </button>
                </div>
              </div>

              <button 
                type="submit" 
                class="btn btn-primary w-100"
                :disabled="loading"
              >
                <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status"></span>
                {{ loading ? 'Iniciando sesión...' : 'Iniciar Sesión' }}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import authService from '../services/authService';

/**
 * Vista de inicio de sesión
 * Valida credenciales contra MockAPI y gestiona tokens
 */
export default {
  name: 'LoginView',
  data() {
    return {
      credentials: {
        email: '',
        password: ''
      },
      error: null,
      successMessage: null,
      loading: false,
      showPassword: false
    };
  },
  async mounted() {
    if (authService.isAuthenticated()) {
      this.$router.push('/productos');
    }
  },
  methods: {
    async handleLogin() {
      this.error = null;
      this.successMessage = null;
      this.loading = true;

      try {
        const user = await authService.login(this.credentials.email, this.credentials.password);

        if (user) {
          this.$router.push('/productos');
        } else {
          this.error = 'Credenciales incorrectas. Verifica tu correo y contraseña.';
          this.credentials.password = '';
        }
      } catch (err) {
        console.error('Error al iniciar sesión:', err);
        this.error = err.message || 'Error al iniciar sesión. Por favor, intenta de nuevo.';
        this.credentials.password = '';
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>

<style scoped>
/* Sin estilos personalizados, solo Bootstrap */
</style>
