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
  console.log('🔍 Router guard - Navegando a:', to.path);
  
  try {
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
    const requiresAdmin = to.matched.some(record => record.meta.requiresAdmin);

    // Actualizar título de la página de forma segura
    try {
      if (typeof document !== 'undefined' && document.title !== undefined) {
        document.title = `GamerHub Pro - ${to.meta.title || 'Dashboard'}`;
      }
    } catch (titleError) {
      console.warn('Error al actualizar título:', titleError);
    }

    // Si la ruta NO requiere autenticación (como /login), permitir acceso directamente
    if (!requiresAuth && !requiresAdmin) {
      // Si es /login, verificar si ya está autenticado y redirigir al dashboard
      if (to.path === '/login') {
        try {
          const isAuthenticated = await Promise.race([
            authService.isAuthenticatedAsync().catch(() => false),
            new Promise(resolve => setTimeout(() => resolve(false), 1500))
          ]);
          
          if (isAuthenticated) {
            console.log('✅ Usuario ya autenticado, redirigiendo al dashboard');
            next('/dashboard');
            return;
          } else {
            console.log('ℹ️ Usuario no autenticado, permitiendo acceso al login');
            next();
            return;
          }
        } catch (error) {
          console.warn('Error al verificar autenticación en login (permitiendo acceso):', error);
          next();
          return;
        }
      }
      
      // Para otras rutas públicas, permitir acceso
      next();
      return;
    }

    // Si la ruta requiere autenticación o admin, verificar sesión
    console.log('🔐 Ruta requiere autenticación, verificando sesión...');
    
    try {
      // Verificar autenticación con timeout más corto
      let isAuthenticated = false;
      try {
        const authCheck = authService.isAuthenticatedAsync().catch(() => false);
        const timeout = new Promise(resolve => setTimeout(() => {
          console.warn('⏱️ Timeout al verificar autenticación');
          resolve(false);
        }, 2000));
        
        isAuthenticated = await Promise.race([authCheck, timeout]);
        console.log('🔐 Resultado de autenticación:', isAuthenticated);
      } catch (authError) {
        console.error('❌ Error al verificar autenticación:', authError);
        isAuthenticated = false;
      }
      
      // Si no está autenticado, redirigir al login
      if (!isAuthenticated) {
        console.log('❌ Usuario no autenticado, redirigiendo a login');
        next('/login');
        return;
      }

      // Si la ruta requiere admin, verificar el rol
      if (requiresAdmin) {
        try {
          const userCheck = authService.getCurrentUserAsync().catch(() => null);
          const timeout = new Promise(resolve => setTimeout(() => resolve(null), 2000));
          
          const currentUser = await Promise.race([userCheck, timeout]) || authService.getCurrentUser();
          
          if (!currentUser || currentUser.rol !== 'admin') {
            console.warn('⚠️ Acceso denegado: Se requiere rol de administrador');
            next('/dashboard');
            return;
          }
          
          console.log('✅ Usuario es administrador, permitiendo acceso');
        } catch (adminError) {
          console.error('❌ Error al verificar rol de administrador:', adminError);
          next('/dashboard');
          return;
        }
      }

      // Si todo está bien, permitir navegación
      console.log('✅ Autenticación verificada, permitiendo acceso');
      next();
    } catch (error) {
      console.error('❌ Error en el guard de navegación:', error);
      // En caso de error, redirigir al login
      if (requiresAuth) {
        next('/login');
        return;
      }
      next();
    }
  } catch (error) {
    console.error('❌ Error crítico en el router:', error);
    // En caso de error crítico, redirigir al login (excepto si ya está en login)
    if (to.path !== '/login') {
      next('/login');
    } else {
      next();
    }
  }
});

export default router;
