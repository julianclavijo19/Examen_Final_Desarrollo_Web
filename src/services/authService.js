/**
 * Servicio de autenticación
 * Maneja login, logout y validación de usuarios
 * Conectado a MockAPI
 */

import axios from 'axios';

const BASE_URL = 'https://6937843bf8dc350aff346de2.mockapi.io/api/v1/User_login';

class AuthService {
  /**
   * Validar credenciales de usuario
   * @param {string} emailOrUsername - Email o nombre de usuario
   * @param {string} password - Contraseña
   * @returns {Object|null} Usuario si las credenciales son correctas, null en caso contrario
   */
  async login(emailOrUsername, password) {
    try {
      // Obtener todos los usuarios de MockAPI
      const response = await axios.get(BASE_URL);
      const users = response.data;

      console.log('Usuarios de MockAPI:', users);
      console.log('Intentando login con:', emailOrUsername, password);

      // Buscar usuario por email y validar contraseña
      const usuario = users.find(
        user => user.email === emailOrUsername && user.contraseña === password
      );

      console.log('Usuario encontrado:', usuario);

      if (usuario) {
        const userWithoutPassword = {
          id: usuario.id,
          name: usuario.nombre,
          email: usuario.email
        };
        localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
        localStorage.setItem('token', 'fake-token-' + Date.now());
        return userWithoutPassword;
      }

      return null;
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      throw new Error('Error al conectar con el servidor');
    }
  }

  /**
   * Cerrar sesión del usuario actual
   */
  logout() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
  }

  /**
   * Obtener el usuario actual
   * @returns {Object|null} Usuario actual o null
   */
  getCurrentUser() {
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

  /**
   * Verificar si hay un usuario autenticado
   * @returns {boolean} true si hay sesión activa
   */
  isAuthenticated() {
    return this.getCurrentUser() !== null;
  }
}

// Exportar instancia única
export default new AuthService();

