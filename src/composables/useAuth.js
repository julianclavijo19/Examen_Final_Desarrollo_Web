import { ref, computed } from 'vue';
import authService from '../services/authService';

/**
 * Composable para manejar autenticación
 */
export function useAuth() {
  const currentUser = ref(authService.getCurrentUser());
  const isLoading = ref(false);
  const error = ref(null);

  const isAuthenticated = computed(() => {
    return currentUser.value !== null;
  });

  const login = async (username, password) => {
    isLoading.value = true;
    error.value = null;
    
    try {
      const user = await authService.login(username, password);
      if (user) {
        currentUser.value = user;
        return { success: true, user };
      } else {
        error.value = 'Credenciales inválidas';
        return { success: false, error: error.value };
      }
    } catch (err) {
      error.value = err.message || 'Error al iniciar sesión';
      return { success: false, error: error.value };
    } finally {
      isLoading.value = false;
    }
  };

  const logout = async () => {
    await authService.logout();
    currentUser.value = null;
    error.value = null;
  };

  const refreshUser = () => {
    currentUser.value = authService.getCurrentUser();
  };

  return {
    currentUser,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
    refreshUser
  };
}

