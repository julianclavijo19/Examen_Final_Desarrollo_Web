/**
 * Servicio para gestionar productos
 * Conectado a MockAPI
 */

import axios from 'axios';

const BASE_URL = 'https://6937843bf8dc350aff346de2.mockapi.io/api/v1/Products';

class ProductService {
  /**
   * Obtener todos los productos
   * @returns {Promise<Array>} Lista de productos
   */
  async getAllProducts() {
    try {
      const response = await axios.get(BASE_URL);
      return response.data;
    } catch (error) {
      console.error('Error al obtener productos:', error);
      throw error;
    }
  }

  /**
   * Obtener un producto por ID
   * @param {number} id - ID del producto
   * @returns {Promise<Object>} Producto
   */
  async getProductById(id) {
    try {
      const response = await axios.get(`${BASE_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener producto ${id}:`, error);
      throw error;
    }
  }

  /**
   * Crear un nuevo producto
   * @param {Object} product - Datos del producto
   * @returns {Promise<Object>} Producto creado
   */
  async createProduct(product) {
    try {
      const response = await axios.post(BASE_URL, product);
      return response.data;
    } catch (error) {
      console.error('Error al crear producto:', error);
      throw error;
    }
  }

  /**
   * Actualizar un producto
   * @param {number} id - ID del producto
   * @param {Object} product - Datos actualizados
   * @returns {Promise<Object>} Producto actualizado
   */
  async updateProduct(id, product) {
    try {
      const response = await axios.put(`${BASE_URL}/${id}`, product);
      return response.data;
    } catch (error) {
      console.error('Error al actualizar producto:', error);
      throw error;
    }
  }

  /**
   * Eliminar un producto
   * @param {number} id - ID del producto
   * @returns {Promise<void>}
   */
  async deleteProduct(id) {
    try {
      await axios.delete(`${BASE_URL}/${id}`);
    } catch (error) {
      console.error('Error al eliminar producto:', error);
      throw error;
    }
  }

  /**
   * Buscar productos
   * @param {string} query - Término de búsqueda
   * @returns {Promise<Array>} Lista de productos encontrados
   */
  async searchProducts(query) {
    try {
      const products = await this.getAllProducts();
      return products.filter(p => 
        p.name?.toLowerCase().includes(query.toLowerCase()) ||
        p.descripcion?.toLowerCase().includes(query.toLowerCase())
      );
    } catch (error) {
      console.error('Error al buscar productos:', error);
      throw error;
    }
  }
}

export default new ProductService();

