<template>
  <div class="login-production">
    <div class="login-container">
      <div class="login-header">
        <div class="logo-container">
          <i class="bi bi-controller"></i>
        </div>
        <h1>GamerHub Pro</h1>
        <p>Inicia sesión en tu cuenta</p>
      </div>

      <!-- Alertas -->
      <transition name="fade">
        <div v-if="error" class="alert alert-error" role="alert">
          <i class="bi bi-exclamation-circle-fill"></i>
          <span>{{ error }}</span>
          <button class="alert-close" @click="error = null" aria-label="Cerrar">
            <i class="bi bi-x"></i>
          </button>
        </div>
      </transition>

      <transition name="fade">
        <div v-if="successMessage" class="alert alert-success" role="alert">
          <i class="bi bi-check-circle-fill"></i>
          <span>{{ successMessage }}</span>
        </div>
      </transition>

      <!-- Formulario de Login -->
      <form 
        v-if="!showForgotPassword && !showResetPassword" 
        @submit.prevent="handleLogin" 
        class="login-form"
        novalidate
      >
        <div class="form-group">
          <label for="email">
            Correo electrónico
            <span class="required">*</span>
          </label>
          <div class="input-wrapper" :class="{ 'error': errors.email, 'focused': isEmailFocused }">
            <i class="bi bi-envelope input-icon"></i>
            <input
              id="email"
              type="email"
              v-model="credentials.email"
              placeholder="tu@email.com"
              required
              autocomplete="email"
              @blur="validateEmail"
              @focus="isEmailFocused = true"
              @input="clearError('email')"
              :disabled="loading"
              :class="{ 'error': errors.email }"
            >
          </div>
          <transition name="fade">
            <span v-if="errors.email" class="error-message">
              <i class="bi bi-exclamation-circle"></i>
              {{ errors.email }}
            </span>
          </transition>
        </div>

        <div class="form-group">
          <label for="password">
            Contraseña
            <span class="required">*</span>
          </label>
          <div class="input-wrapper" :class="{ 'error': errors.password, 'focused': isPasswordFocused }">
            <i class="bi bi-lock input-icon"></i>
            <input
              id="password"
              :type="showPassword ? 'text' : 'password'"
              v-model="credentials.password"
              placeholder="••••••••"
              required
              autocomplete="current-password"
              minlength="6"
              @blur="validatePassword"
              @focus="isPasswordFocused = true"
              @input="clearError('password')"
              :disabled="loading"
              :class="{ 'error': errors.password }"
            >
            <button 
              type="button" 
              class="toggle-password"
              @click="showPassword = !showPassword"
              :disabled="loading"
              tabindex="-1"
              aria-label="Mostrar contraseña"
            >
              <i class="bi" :class="showPassword ? 'bi-eye-slash' : 'bi-eye'"></i>
            </button>
          </div>
          <transition name="fade">
            <span v-if="errors.password" class="error-message">
              <i class="bi bi-exclamation-circle"></i>
              {{ errors.password }}
            </span>
          </transition>
        </div>

        <div class="form-options">
          <label class="checkbox-label">
            <input 
              type="checkbox" 
              v-model="rememberMe"
              :disabled="loading"
            >
            <span>Recordar sesión</span>
          </label>
          <button 
            type="button" 
            class="link-button"
            @click="showForgotPassword = true"
            :disabled="loading"
          >
            ¿Olvidaste tu contraseña?
          </button>
        </div>

        <button 
          type="submit" 
          class="btn-login"
          :disabled="loading || !isFormValid"
          :class="{ 'loading': loading }"
        >
          <span v-if="loading" class="button-content">
            <span class="spinner"></span>
            Iniciando sesión...
          </span>
          <span v-else class="button-content">
            <i class="bi bi-box-arrow-in-right"></i>
            Iniciar Sesión
          </span>
        </button>
      </form>

      <!-- Formulario de Olvidé mi contraseña -->
      <form 
        v-if="showForgotPassword && !showResetPassword" 
        @submit.prevent="handleForgotPassword" 
        class="login-form"
        novalidate
      >
        <div class="form-header">
          <h2>Recuperar contraseña</h2>
          <p>Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.</p>
        </div>

        <div class="form-group">
          <label for="reset-email">
            Correo electrónico
            <span class="required">*</span>
          </label>
          <div class="input-wrapper" :class="{ 'error': errors.email, 'focused': isEmailFocused }">
            <i class="bi bi-envelope input-icon"></i>
            <input
              id="reset-email"
              type="email"
              v-model="resetEmail"
              placeholder="tu@email.com"
              required
              autocomplete="email"
              @blur="validateEmail"
              @focus="isEmailFocused = true"
              @input="clearError('email')"
              :disabled="loading"
            >
          </div>
          <transition name="fade">
            <span v-if="errors.email" class="error-message">
              <i class="bi bi-exclamation-circle"></i>
              {{ errors.email }}
            </span>
          </transition>
        </div>

        <div class="form-actions">
          <button 
            type="button" 
            class="btn-secondary"
            @click="showForgotPassword = false"
            :disabled="loading"
          >
            Cancelar
          </button>
          <button 
            type="submit" 
            class="btn-login"
            :disabled="loading || !resetEmail || !isValidEmail(resetEmail) || errors.email"
            :class="{ 'loading': loading }"
          >
            <span v-if="loading" class="button-content">
              <span class="spinner"></span>
              Enviando...
            </span>
            <span v-else class="button-content">
              <i class="bi bi-send"></i>
              Enviar enlace
            </span>
          </button>
        </div>
      </form>

      <!-- Mensaje de confirmación de restablecimiento -->
      <div v-if="showResetPassword" class="reset-confirmation">
        <div class="icon-success">
          <i class="bi bi-envelope-check"></i>
        </div>
        <h2>Revisa tu correo</h2>
        <p>Hemos enviado un enlace de restablecimiento a <strong>{{ resetEmail }}</strong></p>
        <p class="text-muted">Si no recibes el correo en unos minutos, revisa tu carpeta de spam.</p>
        <button 
          class="btn-login"
          @click="showResetPassword = false; showForgotPassword = false; resetEmail = ''"
        >
          Volver al inicio de sesión
        </button>
      </div>

      <!-- Footer -->
      <div class="login-footer">
        <div class="security-info">
          <i class="bi bi-shield-lock"></i>
          <span>Conexión segura con Supabase</span>
        </div>
      </div>
    </div>

    <!-- Decoración de fondo -->
    <div class="background-decoration">
      <div class="decoration-circle circle-1"></div>
      <div class="decoration-circle circle-2"></div>
      <div class="decoration-circle circle-3"></div>
    </div>
  </div>
</template>

<script>
import authService from '../services/authService';
import { isValidEmail } from '../utils/validators';

export default {
  name: 'LoginView',
  data() {
    return {
      credentials: {
        email: '',
        password: ''
      },
      resetEmail: '',
      errors: {},
      error: null,
      successMessage: null,
      loading: false,
      showPassword: false,
      showForgotPassword: false,
      showResetPassword: false,
      rememberMe: false,
      isEmailFocused: false,
      isPasswordFocused: false
    };
  },
  computed: {
    isFormValid() {
      return (
        this.credentials.email &&
        isValidEmail(this.credentials.email) &&
        this.credentials.password &&
        this.credentials.password.length >= 6 &&
        !this.errors.email &&
        !this.errors.password
      );
    }
  },
  async mounted() {
    // Verificar si ya está autenticado
    const isAuth = await authService.isAuthenticatedAsync();
    if (isAuth) {
      this.$router.push('/dashboard');
      return;
    }

    // Intentar obtener usuario desde localStorage
    const user = authService.getCurrentUser();
    if (user) {
      // Verificar si la sesión sigue siendo válida
      const isValid = await authService.isAuthenticatedAsync();
      if (isValid) {
        this.$router.push('/dashboard');
      }
    }

    // Cargar email guardado si existe
    const savedEmail = localStorage.getItem('rememberedEmail');
    if (savedEmail) {
      this.credentials.email = savedEmail;
      this.rememberMe = true;
    }
  },
  methods: {

    validateEmail() {
      this.isEmailFocused = false;
      if (!this.credentials.email) {
        this.errors.email = 'El correo electrónico es requerido';
        return false;
      }
      if (!isValidEmail(this.credentials.email)) {
        this.errors.email = 'Ingresa un correo electrónico válido';
        return false;
      }
      delete this.errors.email;
      return true;
    },

    validatePassword() {
      this.isPasswordFocused = false;
      if (!this.credentials.password) {
        this.errors.password = 'La contraseña es requerida';
        return false;
      }
      if (this.credentials.password.length < 6) {
        this.errors.password = 'La contraseña debe tener al menos 6 caracteres';
        return false;
      }
      delete this.errors.password;
      return true;
    },

    clearError(field) {
      delete this.errors[field];
      if (this.error) {
        this.error = null;
      }
    },

    async handleLogin() {
      // Limpiar mensajes anteriores
      this.error = null;
      this.successMessage = null;

      // Validar formulario
      const isEmailValid = this.validateEmail();
      const isPasswordValid = this.validatePassword();

      if (!isEmailValid || !isPasswordValid) {
        this.error = 'Por favor, completa todos los campos correctamente';
        return;
      }

      this.loading = true;

      try {
        // Intentar iniciar sesión con Supabase
        const user = await authService.login(this.credentials.email, this.credentials.password);

        if (user) {
          // Guardar email si "recordar sesión" está activado
          if (this.rememberMe) {
            localStorage.setItem('rememberedEmail', this.credentials.email);
          } else {
            localStorage.removeItem('rememberedEmail');
          }

          // Redirigir al dashboard
          this.$router.push('/dashboard');
        } else {
          this.error = 'Credenciales incorrectas. Verifica tu correo y contraseña.';
          this.credentials.password = '';
        }
      } catch (err) {
        console.error('Error al iniciar sesión:', err);
        
        // Manejar errores específicos de Supabase
        if (err.message) {
          if (err.message.includes('Invalid login credentials') || 
              err.message.includes('Email not confirmed')) {
            this.error = 'Correo o contraseña incorrectos. Verifica tus credenciales.';
          } else if (err.message.includes('Email rate limit exceeded')) {
            this.error = 'Demasiados intentos. Por favor, espera unos minutos.';
          } else if (err.message.includes('User not found')) {
            this.error = 'No existe una cuenta con este correo electrónico.';
          } else {
            this.error = err.message || 'Error al iniciar sesión. Por favor, intenta de nuevo.';
          }
        } else {
          this.error = 'Error al conectar con el servidor. Verifica tu conexión a internet.';
        }
        
        this.credentials.password = '';
      } finally {
        this.loading = false;
      }
    },

    async handleForgotPassword() {
      this.error = null;
      this.successMessage = null;

      // Validar email
      if (!this.resetEmail) {
        this.errors.email = 'El correo electrónico es requerido';
        return;
      }

      if (!isValidEmail(this.resetEmail)) {
        this.errors.email = 'Ingresa un correo electrónico válido';
        return;
      }

      this.loading = true;

      try {
        await authService.resetPassword(this.resetEmail);
        this.showResetPassword = true;
        this.successMessage = `Se ha enviado un enlace de restablecimiento a ${this.resetEmail}`;
      } catch (err) {
        console.error('Error al restablecer contraseña:', err);
        
        if (err.message) {
          if (err.message.includes('User not found')) {
            this.error = 'No existe una cuenta con este correo electrónico.';
          } else if (err.message.includes('rate limit')) {
            this.error = 'Demasiados intentos. Por favor, espera unos minutos.';
          } else {
            this.error = err.message || 'Error al enviar el correo de restablecimiento.';
          }
        } else {
          this.error = 'Error al conectar con el servidor. Por favor, intenta de nuevo.';
        }
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>

<style scoped>
.login-production {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  position: relative;
  overflow: hidden;
}

.background-decoration {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  pointer-events: none;
  z-index: 0;
}

.decoration-circle {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  animation: float 20s ease-in-out infinite;
}

.circle-1 {
  width: 300px;
  height: 300px;
  top: -100px;
  right: -100px;
  animation-delay: 0s;
}

.circle-2 {
  width: 200px;
  height: 200px;
  bottom: -50px;
  left: -50px;
  animation-delay: 5s;
}

.circle-3 {
  width: 150px;
  height: 150px;
  top: 50%;
  left: 10%;
  animation-delay: 10s;
}

@keyframes float {
  0%, 100% {
    transform: translate(0, 0) scale(1);
    opacity: 0.3;
  }
  33% {
    transform: translate(30px, -30px) scale(1.1);
    opacity: 0.5;
  }
  66% {
    transform: translate(-20px, 20px) scale(0.9);
    opacity: 0.4;
  }
}

.login-container {
  width: 100%;
  max-width: 440px;
  position: relative;
  z-index: 1;
  animation: slideUp 0.6s ease-out;
  background: #ffffff;
  border-radius: 20px;
  padding: 3rem;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.login-header {
  text-align: center;
  margin-bottom: 2.5rem;
}

.logo-container {
  width: 80px;
  height: 80px;
  margin: 0 auto 1.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
}

.logo-container i {
  font-size: 2.5rem;
  color: #ffffff;
}

.login-header h1 {
  color: #212529;
  font-size: 2rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
  letter-spacing: -0.02em;
}

.login-header p {
  color: #6c757d;
  font-size: 0.9375rem;
  margin: 0;
}

/* Alertas */
.alert {
  padding: 1rem;
  border-radius: 10px;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  font-size: 0.875rem;
  line-height: 1.5;
  position: relative;
  animation: slideDown 0.3s ease-out;
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

.alert-error {
  background: #fee2e2;
  border: 1px solid #fca5a5;
  color: #991b1b;
}

.alert-success {
  background: #d1fae5;
  border: 1px solid #86efac;
  color: #065f46;
}

.alert i {
  font-size: 1.25rem;
  flex-shrink: 0;
  margin-top: 0.125rem;
}

.alert-close {
  margin-left: auto;
  background: transparent;
  border: none;
  color: inherit;
  cursor: pointer;
  padding: 0.25rem;
  opacity: 0.7;
  transition: opacity 0.2s;
  flex-shrink: 0;
}

.alert-close:hover {
  opacity: 1;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

/* Formulario */
.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-header {
  text-align: center;
  margin-bottom: 1.5rem;
}

.form-header h2 {
  color: #212529;
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
}

.form-header p {
  color: #6c757d;
  font-size: 0.875rem;
  margin: 0;
  line-height: 1.6;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  color: #495057;
  font-size: 0.875rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.required {
  color: #ef4444;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  background: #ffffff;
  border: 2px solid #e9ecef;
  border-radius: 10px;
  transition: all 0.3s ease;
}

.input-wrapper.focused {
  border-color: #667eea;
  box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
}

.input-wrapper.error {
  border-color: #ef4444;
  box-shadow: 0 0 0 4px rgba(239, 68, 68, 0.1);
}

.input-icon {
  position: absolute;
  left: 1rem;
  color: #6c757d;
  font-size: 1.125rem;
  pointer-events: none;
  transition: color 0.3s ease;
}

.input-wrapper.focused .input-icon {
  color: #667eea;
}

.input-wrapper.error .input-icon {
  color: #ef4444;
}

.input-wrapper input {
  flex: 1;
  background: transparent;
  border: none;
  padding: 1rem 1rem 1rem 3rem;
  color: #212529;
  font-size: 0.9375rem;
  outline: none;
  transition: all 0.2s;
}

.input-wrapper input::placeholder {
  color: #adb5bd;
}

.input-wrapper input:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.input-wrapper input.error {
  color: #ef4444;
}

.toggle-password {
  position: absolute;
  right: 1rem;
  background: transparent;
  border: none;
  color: #6c757d;
  cursor: pointer;
  padding: 0.5rem;
  transition: color 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.toggle-password:hover:not(:disabled) {
  color: #667eea;
}

.toggle-password:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.toggle-password i {
  font-size: 1.125rem;
}

.error-message {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #ef4444;
  font-size: 0.8125rem;
  margin-top: 0.25rem;
}

.error-message i {
  font-size: 0.875rem;
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.875rem;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #495057;
  cursor: pointer;
  user-select: none;
}

.checkbox-label input[type="checkbox"] {
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: #667eea;
}

.checkbox-label input[type="checkbox"]:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.link-button {
  background: transparent;
  border: none;
  color: #667eea;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  padding: 0;
  text-decoration: none;
  transition: color 0.2s;
}

.link-button:hover:not(:disabled) {
  color: #764ba2;
  text-decoration: underline;
}

.link-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-login {
  width: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #ffffff;
  border: none;
  border-radius: 10px;
  padding: 1rem;
  font-size: 0.9375rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 0.5rem;
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

.btn-login:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.5);
}

.btn-login:active:not(:disabled) {
  transform: translateY(0);
}

.btn-login:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

.btn-login.loading {
  pointer-events: none;
}

.button-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.button-content i {
  font-size: 1.125rem;
}

.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: #ffffff;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.btn-secondary {
  background: #f8f9fa;
  color: #495057;
  border: 2px solid #e9ecef;
  border-radius: 10px;
  padding: 1rem;
  font-size: 0.9375rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  flex: 1;
}

.btn-secondary:hover:not(:disabled) {
  background: #e9ecef;
  border-color: #dee2e6;
}

.btn-secondary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 0.5rem;
}

.reset-confirmation {
  text-align: center;
  padding: 2rem 0;
}

.icon-success {
  width: 80px;
  height: 80px;
  margin: 0 auto 1.5rem;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 10px 30px rgba(16, 185, 129, 0.3);
}

.icon-success i {
  font-size: 2.5rem;
  color: #ffffff;
}

.reset-confirmation h2 {
  color: #212529;
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0 0 1rem 0;
}

.reset-confirmation p {
  color: #6c757d;
  font-size: 0.9375rem;
  margin: 0 0 1rem 0;
  line-height: 1.6;
}

.reset-confirmation p strong {
  color: #212529;
  font-weight: 600;
}

.text-muted {
  color: #adb5bd;
  font-size: 0.875rem;
}

.login-footer {
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid #e9ecef;
  text-align: center;
}

.security-info {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  color: #6c757d;
  font-size: 0.8125rem;
}

.security-info i {
  font-size: 1rem;
  color: #10b981;
}

/* Responsive */
@media (max-width: 768px) {
  .login-production {
    padding: 1rem;
  }

  .login-container {
    padding: 2rem 1.5rem;
    border-radius: 16px;
  }

  .login-header h1 {
    font-size: 1.75rem;
  }

  .logo-container {
    width: 60px;
    height: 60px;
  }

  .logo-container i {
    font-size: 2rem;
  }

  .form-options {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .form-actions {
    flex-direction: column;
  }

  .btn-secondary {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .login-container {
    padding: 1.5rem 1rem;
  }

  .login-header h1 {
    font-size: 1.5rem;
  }
}
</style>
