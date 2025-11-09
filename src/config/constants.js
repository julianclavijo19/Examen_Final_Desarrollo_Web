/**
 * Constantes de la aplicación
 */

// Categorías gaming/tech permitidas
export const GAMING_CATEGORIES = [
  'laptops',
  'smartphones',
  'tablets',
  'mobile-accessories'
];

// Mapeo de nombres de categorías
export const CATEGORY_NAMES = {
  'laptops': 'Laptops',
  'smartphones': 'Smartphones',
  'tablets': 'Tablets',
  'mobile-accessories': 'Accesorios'
};

// Información de categorías para UI
export const CATEGORY_INFO = {
  'laptops': {
    name: 'Laptops',
    description: 'Portátiles de alta performance',
    icon: 'bi bi-laptop',
    class: 'cat-laptops'
  },
  'smartphones': {
    name: 'Smartphones',
    description: 'Teléfonos inteligentes de última generación',
    icon: 'bi bi-phone',
    class: 'cat-phones'
  },
  'tablets': {
    name: 'Tablets',
    description: 'Tablets para trabajo y entretenimiento',
    icon: 'bi bi-tablet',
    class: 'cat-tablets'
  },
  'mobile-accessories': {
    name: 'Accesorios',
    description: 'Periféricos y accesorios móviles',
    icon: 'bi bi-controller',
    class: 'cat-accessories'
  }
};

// Roles de usuario
export const USER_ROLES = {
  ADMIN: 'admin',
  VENDEDOR: 'vendedor',
  USUARIO: 'usuario'
};

// Rutas de la aplicación
export const ROUTES = {
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  HOME: '/dashboard/home',
  PRODUCTS: '/dashboard/productos',
  CATEGORIES: '/dashboard/categorias',
  CLIENTS: '/dashboard/clientes',
  STATISTICS: '/dashboard/estadisticas'
};

// Configuración de paginación
export const PAGINATION = {
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100
};

// Configuración de moneda
export const CURRENCY = {
  CODE: 'USD',
  LOCALE: 'es-ES'
};

