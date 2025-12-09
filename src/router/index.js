import { createRouter, createWebHistory } from 'vue-router';
import authService from '../services/authService';

// Importar vistas
import LoginView from '../views/LoginView.vue';
import ProductView from '../views/ProductView.vue';
import UsersView from '../views/UsersView.vue';

/**
 * Configuración de rutas de la aplicación
 */
const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
    meta: {
      requiresAuth: false
    }
  },
  {
    path: '/productos',
    name: 'Products',
    component: ProductView,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/usuarios',
    name: 'Users',
    component: UsersView,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/login'
  }
];

/**
 * Crear instancia del router
 */
const router = createRouter({
  history: createWebHistory(),
  routes
});

/**
 * Guard de navegación global - Protege rutas que requieren autenticación
 */
router.beforeEach((to, from, next) => {
  const isAuthenticated = authService.isAuthenticated();
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

  if (requiresAuth && !isAuthenticated) {
    // Si la ruta requiere auth y no está autenticado, ir a login
    next('/login');
  } else if (to.path === '/login' && isAuthenticated) {
    // Si está en login y ya está autenticado, ir a productos
    next('/productos');
  } else {
    // Permitir navegación
    next();
  }
});

export default router;
