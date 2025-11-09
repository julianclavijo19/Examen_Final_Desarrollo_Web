<template>
  <div class="home-gaming">
    <!-- Hero Section -->
    <div class="hero-section">
      <div class="hero-content">
        <div class="welcome-text">
          <h1 class="hero-title">Dashboard</h1>
          <p class="hero-subtitle">{{ greeting }}, <span class="user-highlight">{{ currentUser?.nombre }}</span></p>
        </div>
        <div class="hero-stats">
          <div class="time-display">
            <i class="bi bi-clock"></i>
            <span>{{ currentTime }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Stats Grid - Horizontal -->
    <div class="stats-container">
      <div class="stat-card-gaming" v-for="(stat, index) in stats" :key="index" :style="{ animationDelay: `${index * 0.1}s` }">
        <div class="stat-header">
          <div class="stat-icon" :class="stat.class">
            <i :class="stat.icon"></i>
          </div>
          <span class="stat-trend" :class="stat.trend">
            <i :class="stat.trendIcon"></i>
            {{ stat.change }}
          </span>
        </div>
        <div class="stat-body">
          <h3 class="stat-value">{{ stat.value }}</h3>
          <p class="stat-label">{{ stat.label }}</p>
        </div>
      </div>
    </div>

    <!-- Main Content Grid -->
    <div class="content-grid-gaming">
      <!-- Quick Actions -->
      <div class="card-gaming card-actions">
        <div class="card-header-gaming">
          <h2>
            <i class="bi bi-lightning-charge"></i>
            Acciones Rápidas
          </h2>
        </div>
        <div class="actions-grid">
          <router-link to="/dashboard/productos" class="action-item">
            <div class="action-icon products">
              <i class="bi bi-box-seam"></i>
            </div>
            <div class="action-info">
              <h4>Productos</h4>
              <p>Gestionar inventario</p>
            </div>
            <i class="bi bi-arrow-right action-arrow"></i>
          </router-link>

          <router-link to="/dashboard/categorias" class="action-item">
            <div class="action-icon categories">
              <i class="bi bi-grid-3x3-gap"></i>
            </div>
            <div class="action-info">
              <h4>Categorías</h4>
              <p>Explorar gaming</p>
            </div>
            <i class="bi bi-arrow-right action-arrow"></i>
          </router-link>

          <router-link to="/dashboard/clientes" class="action-item">
            <div class="action-icon clients">
              <i class="bi bi-people"></i>
            </div>
            <div class="action-info">
              <h4>Clientes</h4>
              <p>Base de datos</p>
            </div>
            <i class="bi bi-arrow-right action-arrow"></i>
          </router-link>
        </div>
      </div>

      <!-- System Info -->
      <div class="card-gaming card-system">
        <div class="card-header-gaming">
          <h2>
            <i class="bi bi-gear"></i>
            Sistema
          </h2>
          <span class="status-indicator">
            <span class="status-dot"></span>
            Operativo
          </span>
        </div>
        <div class="system-info">
          <div class="info-item">
            <i class="bi bi-person-circle"></i>
            <div class="info-content">
              <span class="info-label">Usuario</span>
              <span class="info-value">{{ currentUser?.username }}</span>
            </div>
          </div>
          <div class="info-item">
            <i class="bi bi-envelope"></i>
            <div class="info-content">
              <span class="info-label">Email</span>
              <span class="info-value">{{ currentUser?.email }}</span>
            </div>
          </div>
          <div class="info-item">
            <i class="bi bi-shield-check"></i>
            <div class="info-content">
              <span class="info-label">Rol</span>
              <span class="role-badge">{{ currentUser?.rol }}</span>
            </div>
          </div>
          <div class="info-item">
            <i class="bi bi-cloud"></i>
            <div class="info-content">
              <span class="info-label">API</span>
              <span class="info-value">DummyJSON</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Activity -->
      <div class="card-gaming card-activity">
        <div class="card-header-gaming">
          <h2>
            <i class="bi bi-activity"></i>
            Actividad Reciente
          </h2>
        </div>
        <div class="activity-list">
          <div class="activity-item" v-for="(activity, index) in recentActivity" :key="index">
            <div class="activity-icon" :class="activity.type">
              <i :class="activity.icon"></i>
            </div>
            <div class="activity-content">
              <p class="activity-text">{{ activity.text }}</p>
              <span class="activity-time">{{ activity.time }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import authService from '../services/authService';

export default {
  name: 'HomeView',
  data() {
    return {
      currentUser: null,
      currentTime: '',
      stats: [
        {
          value: '156',
          label: 'Productos',
          icon: 'bi bi-box-seam',
          class: 'products',
          change: '+12%',
          trend: 'up',
          trendIcon: 'bi bi-arrow-up'
        },
        {
          value: '4',
          label: 'Categorías Gaming',
          icon: 'bi bi-grid-3x3-gap',
          class: 'categories',
          change: '+2',
          trend: 'up',
          trendIcon: 'bi bi-arrow-up'
        },
        {
          value: '342',
          label: 'Clientes Activos',
          icon: 'bi bi-people',
          class: 'clients',
          change: '+28',
          trend: 'up',
          trendIcon: 'bi bi-arrow-up'
        },
        {
          value: '$86.5K',
          label: 'Ventas del Mes',
          icon: 'bi bi-graph-up-arrow',
          class: 'revenue',
          change: '+18%',
          trend: 'up',
          trendIcon: 'bi bi-arrow-up'
        }
      ],
      recentActivity: [
        { text: 'Nuevo producto agregado: ROG Strix Laptop', time: 'Hace 5 min', type: 'new', icon: 'bi bi-plus-circle' },
        { text: 'Producto actualizado: Razer Mouse Gaming', time: 'Hace 15 min', type: 'update', icon: 'bi bi-pencil' },
        { text: 'Cliente registrado: John Doe', time: 'Hace 1 hora', type: 'user', icon: 'bi bi-person-plus' },
        { text: 'Venta completada: HyperX Headset', time: 'Hace 2 horas', type: 'sale', icon: 'bi bi-check-circle' }
      ]
    };
  },
  computed: {
    greeting() {
      const hour = new Date().getHours();
      if (hour < 12) return 'Buenos días';
      if (hour < 19) return 'Buenas tardes';
      return 'Buenas noches';
    }
  },
  mounted() {
    this.currentUser = authService.getCurrentUser();
    this.updateTime();
    setInterval(this.updateTime, 1000);
  },
  methods: {
    updateTime() {
      const now = new Date();
      this.currentTime = now.toLocaleTimeString('es-ES', { 
        hour: '2-digit', 
        minute: '2-digit'
      });
    }
  }
}
</script>

<style scoped>
.home-gaming {
  padding: 2rem;
  max-width: 1600px;
  margin: 0 auto;
  animation: fadeIn 0.4s ease-out;
}

/* Hero Section */
.hero-section {
  background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%);
  border: 1px solid #00ff88;
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 2rem;
  position: relative;
  overflow: hidden;
}

.hero-section::before {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, rgba(0, 255, 136, 0.1) 0%, transparent 70%);
  pointer-events: none;
}

.hero-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  z-index: 1;
}

.hero-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
  background: linear-gradient(135deg, #fff 0%, #00ff88 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: -0.03em;
}

.hero-subtitle {
  font-size: 1.125rem;
  color: #666;
  margin: 0;
}

.user-highlight {
  color: #00ff88;
  font-weight: 600;
}

.time-display {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 2rem;
  font-weight: 700;
  color: #00ff88;
  font-variant-numeric: tabular-nums;
}

.time-display i {
  font-size: 1.5rem;
}

/* Stats Container - Horizontal */
.stats-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card-gaming {
  background: #0a0a0a;
  border: 1px solid #1a1a1a;
  border-radius: 12px;
  padding: 1.5rem;
  transition: all 0.3s ease;
  animation: scaleIn 0.4s ease-out backwards;
  cursor: pointer;
}

.stat-card-gaming:hover {
  border-color: #00ff88;
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 255, 136, 0.1);
}

.stat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
}

.stat-icon.products {
  background: linear-gradient(135deg, rgba(0, 255, 136, 0.2) 0%, rgba(0, 255, 136, 0.05) 100%);
  color: #00ff88;
}

.stat-icon.categories {
  background: linear-gradient(135deg, rgba(255, 193, 7, 0.2) 0%, rgba(255, 193, 7, 0.05) 100%);
  color: #ffc107;
}

.stat-icon.clients {
  background: linear-gradient(135deg, rgba(33, 150, 243, 0.2) 0%, rgba(33, 150, 243, 0.05) 100%);
  color: #2196f3;
}

.stat-icon.revenue {
  background: linear-gradient(135deg, rgba(156, 39, 176, 0.2) 0%, rgba(156, 39, 176, 0.05) 100%);
  color: #9c27b0;
}

.stat-trend {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.875rem;
  font-weight: 600;
  padding: 0.25rem 0.75rem;
  border-radius: 6px;
}

.stat-trend.up {
  background: rgba(0, 255, 136, 0.1);
  color: #00ff88;
}

.stat-value {
  font-size: 2rem;
  font-weight: 700;
  color: #fff;
  margin: 0 0 0.25rem 0;
  font-variant-numeric: tabular-nums;
}

.stat-label {
  font-size: 0.875rem;
  color: #666;
  margin: 0;
}

/* Content Grid */
.content-grid-gaming {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(380px, 1fr));
  gap: 1.5rem;
}

.card-gaming {
  background: #0a0a0a;
  border: 1px solid #1a1a1a;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
  animation: slideInLeft 0.5s ease-out;
}

.card-gaming:hover {
  border-color: #333;
}

.card-header-gaming {
  padding: 1.5rem;
  border-bottom: 1px solid #1a1a1a;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header-gaming h2 {
  font-size: 1.125rem;
  font-weight: 600;
  color: #fff;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.card-header-gaming i {
  color: #00ff88;
}

.status-indicator {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #00ff88;
  font-weight: 600;
}

.status-dot {
  width: 8px;
  height: 8px;
  background: #00ff88;
  border-radius: 50%;
  animation: pulse 2s ease-in-out infinite;
}

/* Actions Grid */
.actions-grid {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.action-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #000;
  border: 1px solid #1a1a1a;
  border-radius: 10px;
  text-decoration: none;
  transition: all 0.3s ease;
}

.action-item:hover {
  border-color: #00ff88;
  transform: translateX(4px);
  box-shadow: 0 4px 12px rgba(0, 255, 136, 0.1);
}

.action-icon {
  width: 48px;
  height: 48px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  flex-shrink: 0;
}

.action-icon.products {
  background: rgba(0, 255, 136, 0.1);
  color: #00ff88;
}

.action-icon.categories {
  background: rgba(255, 193, 7, 0.1);
  color: #ffc107;
}

.action-icon.clients {
  background: rgba(33, 150, 243, 0.1);
  color: #2196f3;
}

.action-info {
  flex: 1;
}

.action-info h4 {
  font-size: 0.9375rem;
  font-weight: 600;
  color: #fff;
  margin: 0 0 0.25rem 0;
}

.action-info p {
  font-size: 0.8125rem;
  color: #666;
  margin: 0;
}

.action-arrow {
  color: #333;
  font-size: 1.25rem;
  transition: all 0.3s ease;
}

.action-item:hover .action-arrow {
  color: #00ff88;
  transform: translateX(4px);
}

/* System Info */
.system-info {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #000;
  border: 1px solid #1a1a1a;
  border-radius: 10px;
  transition: all 0.3s ease;
}

.info-item:hover {
  border-color: #333;
  background: #0a0a0a;
}

.info-item > i {
  font-size: 1.25rem;
  color: #00ff88;
  width: 24px;
  text-align: center;
}

.info-content {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.info-label {
  font-size: 0.875rem;
  color: #666;
}

.info-value {
  font-size: 0.875rem;
  color: #fff;
  font-weight: 600;
}

.role-badge {
  background: rgba(0, 255, 136, 0.1);
  color: #00ff88;
  padding: 0.25rem 0.75rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Activity List */
.activity-list {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.activity-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1rem;
  background: #000;
  border: 1px solid #1a1a1a;
  border-radius: 10px;
  transition: all 0.3s ease;
}

.activity-item:hover {
  border-color: #333;
  background: #0a0a0a;
}

.activity-icon {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  flex-shrink: 0;
}

.activity-icon.new {
  background: rgba(0, 255, 136, 0.1);
  color: #00ff88;
}

.activity-icon.update {
  background: rgba(255, 193, 7, 0.1);
  color: #ffc107;
}

.activity-icon.user {
  background: rgba(33, 150, 243, 0.1);
  color: #2196f3;
}

.activity-icon.sale {
  background: rgba(156, 39, 176, 0.1);
  color: #9c27b0;
}

.activity-content {
  flex: 1;
}

.activity-text {
  font-size: 0.875rem;
  color: #fff;
  margin: 0 0 0.25rem 0;
  line-height: 1.4;
}

.activity-time {
  font-size: 0.75rem;
  color: #666;
}

/* Responsive */
@media (max-width: 1200px) {
  .content-grid-gaming {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .home-gaming {
    padding: 1.5rem;
  }

  .hero-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 1.5rem;
  }

  .hero-title {
    font-size: 2rem;
  }

  .stats-container {
    grid-template-columns: 1fr;
  }

  .content-grid-gaming {
    grid-template-columns: 1fr;
  }
}
</style>
