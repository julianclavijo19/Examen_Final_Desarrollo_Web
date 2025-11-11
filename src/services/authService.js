/**
 * Servicio de autenticación
 * 
 * Este servicio actúa como un wrapper que puede usar:
 * - Sistema de autenticación simplificado (desarrollo)
 * - Supabase (producción)
 * 
 * Para usar Supabase, simplemente cambia USE_SUPABASE a true
 * y configura las variables de entorno en .env
 */

import { supabaseAuth } from '../supabase/index.js';
import { SUPABASE_CONFIG } from '../supabase/config.js';

// Variable para habilitar/deshabilitar Supabase
// Se activa automáticamente si las variables de entorno están configuradas
const USE_SUPABASE = !!(SUPABASE_CONFIG.url && SUPABASE_CONFIG.anonKey && SUPABASE_CONFIG.url !== '');

class AuthService {
  constructor() {
    // Usuarios hardcodeados (solo para desarrollo, reemplazar con Supabase)
    this.usuarios = [
      {
        id: 1,
        username: 'admin',
        password: 'admin123',
        nombre: 'Administrador',
        rol: 'admin',
        email: 'admin@techstore.com'
      },
      {
        id: 2,
        username: 'vendedor',
        password: 'vendedor123',
        nombre: 'Juan Pérez',
        rol: 'vendedor',
        email: 'vendedor@techstore.com'
      },
      {
        id: 3,
        username: 'demo',
        password: 'demo123',
        nombre: 'Usuario Demo',
        rol: 'usuario',
        email: 'demo@techstore.com'
      }
    ];
  }

  /**
   * Validar credenciales de usuario
   * @param {string} username - Nombre de usuario o email
   * @param {string} password - Contraseña
   * @returns {Promise<Object|null>} Usuario si las credenciales son correctas, null en caso contrario
   */
  async login(emailOrUsername, password) {
    if (USE_SUPABASE) {
      try {
        // Intentar autenticar con email primero
        if (emailOrUsername.includes('@')) {
          return await supabaseAuth.login(emailOrUsername, password);
        } else {
          // Intentar autenticar con username
          return await supabaseAuth.loginWithUsername(emailOrUsername, password);
        }
      } catch (error) {
        console.error('Error al iniciar sesión con Supabase:', error);
        // En producción, no usar fallback local - lanzar el error
        throw error;
      }
    } else {
      // Implementación local (solo para desarrollo)
      return this.loginLocal(emailOrUsername, password);
    }
  }

  /**
   * Login con sistema local (fallback)
   * @private
   */
  loginLocal(username, password) {
    const usuario = this.usuarios.find(
      user => user.username === username && user.password === password
    );

    if (usuario) {
      // Guardar sesión en localStorage (solo para demo)
      const { password, ...userWithoutPassword } = usuario;
      localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
      return userWithoutPassword;
    }

    return null;
  }

  /**
   * Cerrar sesión del usuario actual
   */
  async logout() {
    if (USE_SUPABASE) {
      try {
        await supabaseAuth.logout();
      } catch (error) {
        console.error('Error al cerrar sesión con Supabase:', error);
        // Fallback: limpiar localStorage
        localStorage.removeItem('currentUser');
        localStorage.removeItem('supabaseSession');
      }
    } else {
      // Implementación local
      localStorage.removeItem('currentUser');
    }
  }

  /**
   * Obtener el usuario actual de la sesión
   * @returns {Object|null} Usuario actual o null
   */
  getCurrentUser() {
    if (USE_SUPABASE) {
      // Para Supabase, usar el método asíncrono getCurrentUserAsync
      // Por compatibilidad, primero intentar desde localStorage
      const userStr = localStorage.getItem('currentUser');
      if (userStr) {
        try {
          return JSON.parse(userStr);
        } catch (error) {
          return null;
        }
      }
      return null;
    } else {
      // Implementación local
      const userStr = localStorage.getItem('currentUser');
      if (userStr) {
        try {
          return JSON.parse(userStr);
        } catch (error) {
          return null;
        }
      }
      return null;
    }
  }

  /**
   * Obtener el usuario actual de forma asíncrona (recomendado para Supabase)
   * @returns {Promise<Object|null>} Usuario actual o null
   */
  async getCurrentUserAsync() {
    if (USE_SUPABASE) {
      try {
        return await supabaseAuth.getCurrentUser();
      } catch (error) {
        console.error('Error al obtener usuario de Supabase:', error);
        return this.getCurrentUser(); // Fallback a método síncrono
      }
    } else {
      return this.getCurrentUser();
    }
  }

  /**
   * Verificar si hay un usuario autenticado
   * @returns {boolean} true si hay sesión activa
   */
  isAuthenticated() {
    // Por compatibilidad, verificar localStorage
    // Para una verificación más precisa con Supabase, usar isAuthenticatedAsync
    return this.getCurrentUser() !== null;
  }

  /**
   * Verificar si hay un usuario autenticado de forma asíncrona (recomendado para Supabase)
   * @returns {Promise<boolean>} true si hay sesión activa
   */
  async isAuthenticatedAsync() {
    if (USE_SUPABASE) {
      try {
        return await supabaseAuth.isAuthenticated();
      } catch (error) {
        console.error('Error al verificar autenticación:', error);
        return this.isAuthenticated(); // Fallback
      }
    } else {
      return this.isAuthenticated();
    }
  }

  /**
   * Registrar un nuevo usuario
   * @param {Object} userData - Datos del usuario
   * @param {string} userData.email - Email del usuario
   * @param {string} userData.password - Contraseña
   * @param {string} [userData.username] - Nombre de usuario
   * @param {string} [userData.nombre] - Nombre completo
   * @param {string} [userData.rol] - Rol del usuario (default: 'usuario')
   * @returns {Promise<Object>} Usuario registrado
   */
  async register(userData) {
    if (USE_SUPABASE) {
      try {
        return await supabaseAuth.register(userData);
      } catch (error) {
        console.error('Error al registrar usuario con Supabase:', error);
        throw error;
      }
    } else {
      // Implementación local (solo para desarrollo)
      console.warn('Registro de usuarios no disponible en modo desarrollo local');
      console.warn('Para habilitar el registro, configura Supabase en .env');
      return null;
    }
  }

  /**
   * Restablecer contraseña
   * @param {string} email - Email del usuario
   * @returns {Promise<void>}
   */
  async resetPassword(email) {
    if (USE_SUPABASE) {
      try {
        return await supabaseAuth.resetPassword(email);
      } catch (error) {
        console.error('Error al restablecer contraseña:', error);
        throw error;
      }
    } else {
      console.warn('Restablecimiento de contraseña no disponible en modo desarrollo local');
      return null;
    }
  }

  /**
   * Actualizar contraseña
   * @param {string} newPassword - Nueva contraseña
   * @returns {Promise<void>}
   */
  async updatePassword(newPassword) {
    if (USE_SUPABASE) {
      try {
        return await supabaseAuth.updatePassword(newPassword);
      } catch (error) {
        console.error('Error al actualizar contraseña:', error);
        throw error;
      }
    } else {
      console.warn('Actualización de contraseña no disponible en modo desarrollo local');
      return null;
    }
  }
}

// Exportar instancia única
export default new AuthService();

