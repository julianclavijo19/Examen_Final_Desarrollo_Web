import axios from 'axios';

/**
 * Configuración de la API
 */

// URL base de la API externa (DummyJSON)
export const API_BASE_URL = 'https://dummyjson.com';

// Crear instancia de axios con configuración base
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptores de request
apiClient.interceptors.request.use(
  (config) => {
    // Aquí se pueden agregar headers de autenticación si es necesario
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptores de response
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Manejo centralizado de errores
    console.error('Error en la API:', error);
    return Promise.reject(error);
  }
);

export default apiClient;

