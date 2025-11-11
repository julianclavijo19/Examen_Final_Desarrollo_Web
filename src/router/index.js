import { createRouter, createWebHistory } from 'vue-router';
import authService from '../services/authService';

// Importar vistas
import LoginView from '../views/LoginView.vue';
import DashboardView from '../views/DashboardView.vue';
import HomeView from '../views/HomeView.vue';
import ProductView from '../views/ProductView.vue';
import CategoryView from '../views/CategoryView.vue';
import ClientView from '../views/ClientView.vue';
import StatisticsView from '../views/StatisticsView.vue';

/**
 * Configuración de rutas de la aplicación
 * Se utiliza vue-router para gestionar la navegación entre vistas
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
      requiresAuth: false,
      title: 'Iniciar Sesión'
    }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: DashboardView,
    meta: {
      requiresAuth: true,
      title: 'Dashboard'
    },
    children: [
      {
        path: '',
        name: 'Home',
        component: HomeView,
        meta: {
          requiresAuth: true,
          title: 'Inicio'
        }
      },
      {
        path: 'productos',
        name: 'Products',
        component: ProductView,
        meta: {
          requiresAuth: true,
          title: 'Productos'
        }
      },
      {
        path: 'categorias',
        name: 'Categories',
        component: CategoryView,
        meta: {
          requiresAuth: true,
          title: 'Categorías'
        }
      },
      {
        path: 'clientes',
        name: 'Clients',
        component: ClientView,
        meta: {
          requiresAuth: true,
          title: 'Clientes'
        }
      },
      {
        path: 'estadisticas',
        name: 'Statistics',
        component: StatisticsView,
        meta: {
          requiresAuth: true,
          title: 'Estadísticas'
        }
      },
      {
        path: 'usuarios',
        name: 'Users',
        component: () => import('../views/UsersView.vue'),
        meta: {
          requiresAuth: true,
          requiresAdmin: true,
          title: 'Gestión de Usuarios'
        }
      }
    ]
  },
  {
    // Ruta 404 - No encontrada
    path: '/:pathMatch(.*)*',
    redirect: '/login'
  }
];

/**
 * Crear instancia del router
 */
const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  }
});

/**
 * Guard de navegación global
 * Protege las rutas que requieren autenticación
 */
router.beforeEach(async (to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const requiresAdmin = to.matched.some(record => record.meta.requiresAdmin);

  // Actualizar título de la página
  document.title = `GamerHub Pro - ${to.meta.title || 'Dashboard'}`;

  // Si la ruta requiere autenticación, verificar de forma asíncrona
  if (requiresAuth || requiresAdmin) {
    try {
      // Verificar autenticación de forma asíncrona
      const isAuthenticated = await authService.isAuthenticatedAsync();
      
      if (!isAuthenticated) {
        // Redirigir al login si la ruta requiere autenticación y no está autenticado
        if (requiresAuth) {
          next('/login');
          return;
        }
      }

      // Si la ruta requiere admin, verificar el rol
      if (requiresAdmin) {
        const currentUser = await authService.getCurrentUserAsync() || authService.getCurrentUser();
        
        if (!currentUser || currentUser.rol !== 'admin') {
          // Redirigir al dashboard si la ruta requiere admin y el usuario no es admin
          console.warn('Acceso denegado: Se requiere rol de administrador');
          next('/dashboard');
          return;
        }
      }
    } catch (error) {
      console.error('Error en el guard de navegación:', error);
      // En caso de error, redirigir al login
      if (requiresAuth) {
        next('/login');
        return;
      }
    }
  }

  // Si intenta ir al login y ya está autenticado, redirigir al dashboard
  if (to.path === '/login') {
    try {
      const isAuthenticated = await authService.isAuthenticatedAsync();
      if (isAuthenticated) {
        next('/dashboard');
        return;
      }
    } catch (error) {
      // Si hay error, permitir acceso al login
      console.error('Error al verificar autenticación:', error);
    }
  }

  // Permitir navegación
  next();
});

export default router;

