<template>
  <div class="login-minimal">
    <div class="login-container">
      <div class="login-header">
        <i class="bi bi-controller"></i>
        <h1>GamerHub Pro</h1>
        <p>Dashboard Administrativo</p>
      </div>

      <div v-if="error" class="alert-error">
        <i class="bi bi-exclamation-circle"></i>
        <span>{{ error }}</span>
      </div>

      <div class="info-badge">
        <i class="bi bi-info-circle"></i>
        <div>
          <strong>Demo:</strong> admin / admin123
        </div>
      </div>

      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label>Usuario</label>
          <input
            type="text"
            v-model="credentials.username"
            placeholder="Ingresa tu usuario"
            required
            autocomplete="username"
          >
        </div>

        <div class="form-group">
          <label>Contraseña</label>
          <div class="password-input">
            <input
              :type="showPassword ? 'text' : 'password'"
              v-model="credentials.password"
              placeholder="Ingresa tu contraseña"
              required
              autocomplete="current-password"
            >
            <button 
              type="button" 
              class="toggle-password"
              @click="showPassword = !showPassword"
            >
              <i class="bi" :class="showPassword ? 'bi-eye-slash' : 'bi-eye'"></i>
            </button>
          </div>
        </div>

        <button 
          type="submit" 
          class="btn-login"
          :disabled="loading"
        >
          <span v-if="loading">
            <span class="spinner"></span>
            Ingresando...
          </span>
          <span v-else>
            Iniciar Sesión
          </span>
        </button>
      </form>

      <div class="login-footer">
        <i class="bi bi-shield-check"></i>
        <span>Sistema educativo - No usar en producción</span>
      </div>
    </div>
  </div>
</template>

<script>
import authService from '../services/authService';

export default {
  name: 'LoginView',
  data() {
    return {
      credentials: {
        username: '',
        password: ''
      },
      error: null,
      loading: false,
      showPassword: false
    };
  },
  mounted() {
    if (authService.isAuthenticated()) {
      this.$router.push('/dashboard');
    }
  },
  methods: {
    async handleLogin() {
      this.error = null;
      this.loading = true;

      await new Promise(resolve => setTimeout(resolve, 600));

      const user = authService.login(
        this.credentials.username,
        this.credentials.password
      );

      if (user) {
        this.$router.push('/dashboard');
      } else {
        this.error = 'Usuario o contraseña incorrectos';
        this.credentials.password = '';
      }

      this.loading = false;
    }
  }
}
</script>

<style scoped>
.login-minimal {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  position: relative;
  overflow: hidden;
}

.login-minimal::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, rgba(99, 102, 241, 0.08) 0%, transparent 70%);
  transform: translate(-50%, -50%);
  animation: pulse 4s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0.5;
  }
  50% {
    transform: translate(-50%, -50%) scale(1.2);
    opacity: 0.3;
  }
}

.login-container {
  width: 100%;
  max-width: 400px;
  position: relative;
  z-index: 1;
  animation: slideInLeft 0.6s ease-out;
  background: #ffffff;
  border-radius: 16px;
  padding: 2.5rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  border: 1px solid #e9ecef;
}

.login-header {
  text-align: center;
  margin-bottom: 2rem;
}

.login-header i {
  font-size: 3rem;
  color: #6366f1;
  margin-bottom: 1rem;
  animation: float 3s ease-in-out infinite;
  display: inline-block;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.login-header h1 {
  color: #212529;
  font-size: 1.75rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
  letter-spacing: -0.02em;
}

.login-header p {
  color: #6c757d;
  font-size: 0.9375rem;
  margin: 0;
}

.alert-error {
  background: #fee2e2;
  border: 1px solid #ef4444;
  border-radius: 8px;
  padding: 0.75rem 1rem;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #ef4444;
  font-size: 0.875rem;
}

.alert-error i {
  font-size: 1.125rem;
}

.info-badge {
  background: #eef2ff;
  border: 1px solid #c7d2fe;
  border-radius: 8px;
  padding: 0.75rem 1rem;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #6366f1;
  font-size: 0.875rem;
}

.info-badge i {
  font-size: 1.125rem;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  color: #495057;
  font-size: 0.875rem;
  font-weight: 500;
}

.form-group input {
  background: #ffffff;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 0.875rem 1rem;
  color: #212529;
  font-size: 0.9375rem;
  transition: all 0.2s;
}

.form-group input:focus {
  outline: none;
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.form-group input::placeholder {
  color: #adb5bd;
}

.password-input {
  position: relative;
  display: flex;
  align-items: center;
}

.password-input input {
  flex: 1;
  padding-right: 3rem;
}

.toggle-password {
  position: absolute;
  right: 0.75rem;
  background: transparent;
  border: none;
  color: #6c757d;
  cursor: pointer;
  padding: 0.5rem;
  transition: color 0.2s;
}

.toggle-password:hover {
  color: #6366f1;
}

.btn-login {
  background: #6366f1;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  padding: 0.875rem;
  font-size: 0.9375rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  margin-top: 0.5rem;
  position: relative;
  overflow: hidden;
}

.btn-login::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
  transition: left 0.5s;
}

.btn-login:hover:not(:disabled) {
  background: #4f46e5;
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(99, 102, 241, 0.3);
}

.btn-login:hover::before {
  left: 100%;
}

.btn-login:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.spinner {
  display: inline-block;
  width: 14px;
  height: 14px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: #ffffff;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
  margin-right: 0.5rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.login-footer {
  margin-top: 2rem;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  color: #6c757d;
  font-size: 0.8125rem;
}

.login-footer i {
  font-size: 1rem;
  color: #6366f1;
}

@media (max-width: 480px) {
  .login-minimal {
    padding: 1.5rem;
  }
  
  .login-header h1 {
    font-size: 1.5rem;
  }
}
</style>
