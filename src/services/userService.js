/**
 * Servicio para gestionar usuarios
 * Conectado a MockAPI
 */

import axios from 'axios';

const BASE_URL = 'https://6937843bf8dc350aff346de2.mockapi.io/api/v1/User_login';

class UserService {
  /**
   * Obtener todos los usuarios
   * @returns {Promise<Array>} Lista de usuarios
   */
  async getAllUsers() {
    try {
      const response = await axios.get(BASE_URL);
      console.log('Datos crudos de MockAPI:', response.data);
      console.log('Primer usuario:', response.data[0]);
      // Devolver usuarios sin contraseña
      const usuarios = response.data.map(user => ({
        id: user.id,
        name: user.nombre,
        email: user.email
      }));
      console.log('Usuarios mapeados:', usuarios);
      return usuarios;
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
      throw error;
    }
  }

  /**
   * Crear un nuevo usuario
   * @param {Object} userData - Datos del usuario
   * @returns {Promise<Object>} Usuario creado
   */
  async createUser(userData) {
    try {
      const newUser = {
        nombre: userData.name,
        email: userData.email,
        contraseña: userData.password || '123456'
      };
      const response = await axios.post(BASE_URL, newUser);
      return {
        id: response.data.id,
        name: response.data.nombre,
        email: response.data.email
      };
    } catch (error) {
      console.error('Error al crear usuario:', error);
      throw error;
    }
  }

  /**
   * Actualizar un usuario
   * @param {number} id - ID del usuario
   * @param {Object} userData - Datos actualizados
   * @returns {Promise<Object>} Usuario actualizado
   */
  async updateUser(id, userData) {
    try {
      const updateData = {
        name: userData.name,
        email: userData.email
      };
      if (userData.password) {
        updateData.contraseña = userData.password;
      }
      const response = await axios.put(`${BASE_URL}/${id}`, updateData);
      return {
        id: response.data.id,
        name: response.data.name,
        email: response.data.email
      };
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      throw error;
    }
  }

  /**
   * Eliminar un usuario
   * @param {number} id - ID del usuario
   * @returns {Promise<void>}
   */
  async deleteUser(id) {
    try {
      await axios.delete(`${BASE_URL}/${id}`);
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      throw error;
    }
  }
}

export default new UserService();

