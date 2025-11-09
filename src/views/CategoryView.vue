<template>
  <div class="categories-gaming">
    <div class="page-header-gaming">
      <h1>Categorías Gaming</h1>
      <p>Explora nuestro catálogo de tecnología gaming</p>
    </div>

    <div v-if="loading" class="loading-state">
      <div class="spinner-large"></div>
      <p>Cargando categorías...</p>
    </div>

    <div v-else class="categories-grid">
      <router-link 
        v-for="(category, index) in categoriesData" 
        :key="category.slug"
        :to="`/dashboard/productos?category=${category.slug}`"
        class="category-card-gaming"
        :style="{ animationDelay: `${index * 0.1}s` }"
      >
        <div class="category-visual" :class="category.class">
          <i :class="category.icon"></i>
          <div class="category-glow"></div>
        </div>
        <div class="category-info">
          <h3>{{ category.name }}</h3>
          <p>{{ category.description }}</p>
          <div class="category-count">
            <span>Ver productos</span>
            <i class="bi bi-arrow-right"></i>
          </div>
        </div>
      </router-link>
    </div>

    <!-- Info adicional -->
    <div class="info-banner">
      <i class="bi bi-info-circle"></i>
      <div>
        <h4>Sobre las Categorías</h4>
        <p>Las categorías están optimizadas para productos gaming y tecnología. Los datos provienen de DummyJSON API.</p>
      </div>
    </div>
  </div>
</template>

<script>
import productService from '../services/api';

export default {
  name: 'CategoryView',
  data() {
    return {
      loading: false,
      categoriesData: []
    };
  },
  async mounted() {
    await this.loadCategories();
  },
  methods: {
    async loadCategories() {
      this.loading = true;
      try {
        const categories = await productService.getCategories();
        
        // Mapear categorías con información adicional
        this.categoriesData = categories.map(slug => {
          const categoryInfo = {
            'laptops': {
              name: 'Laptops Gaming',
              description: 'Portátiles de alta performance para gaming',
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
              name: 'Accesorios Gaming',
              description: 'Periféricos y accesorios para gamers',
              icon: 'bi bi-controller',
              class: 'cat-accessories'
            }
          };

          return {
            slug,
            ...categoryInfo[slug]
          };
        });

      } catch (err) {
        console.error('Error al cargar categorías:', err);
      } finally {
        this.loading = false;
      }
    }
  }
}
</script>

<style scoped>
.categories-gaming {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
  animation: fadeIn 0.4s ease-out;
}

.page-header-gaming {
  margin-bottom: 2.5rem;
}

.page-header-gaming h1 {
  font-size: 2.5rem;
  font-weight: 700;
  color: #fff;
  margin: 0 0 0.5rem 0;
  letter-spacing: -0.03em;
  background: linear-gradient(135deg, #fff 0%, #00ff88 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.page-header-gaming p {
  color: #666;
  font-size: 1.125rem;
  margin: 0;
}

.loading-state {
  text-align: center;
  padding: 4rem 2rem;
}

.spinner-large {
  width: 48px;
  height: 48px;
  border: 3px solid #1a1a1a;
  border-top-color: #00ff88;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin: 0 auto 1.5rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading-state p {
  color: #666;
  margin: 0;
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2.5rem;
}

.category-card-gaming {
  background: #0a0a0a;
  border: 1px solid #1a1a1a;
  border-radius: 16px;
  overflow: hidden;
  text-decoration: none;
  display: flex;
  flex-direction: column;
  transition: all 0.4s ease;
  animation: scaleIn 0.5s ease-out backwards;
  position: relative;
}

.category-card-gaming::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, transparent 0%, rgba(0, 255, 136, 0.05) 100%);
  opacity: 0;
  transition: opacity 0.4s ease;
}

.category-card-gaming:hover {
  border-color: #00ff88;
  transform: translateY(-8px);
  box-shadow: 0 12px 32px rgba(0, 255, 136, 0.15);
}

.category-card-gaming:hover::before {
  opacity: 1;
}

.category-visual {
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.category-visual i {
  font-size: 5rem;
  z-index: 2;
  position: relative;
  transition: all 0.4s ease;
}

.category-glow {
  position: absolute;
  width: 200px;
  height: 200px;
  border-radius: 50%;
  filter: blur(60px);
  opacity: 0.3;
  transition: all 0.4s ease;
}

.category-card-gaming:hover .category-visual i {
  transform: scale(1.1);
}

.category-card-gaming:hover .category-glow {
  opacity: 0.5;
  transform: scale(1.2);
}

.cat-laptops {
  background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%);
}

.cat-laptops i {
  color: #00ff88;
}

.cat-laptops .category-glow {
  background: #00ff88;
}

.cat-phones {
  background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%);
}

.cat-phones i {
  color: #2196f3;
}

.cat-phones .category-glow {
  background: #2196f3;
}

.cat-tablets {
  background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%);
}

.cat-tablets i {
  color: #9c27b0;
}

.cat-tablets .category-glow {
  background: #9c27b0;
}

.cat-accessories {
  background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%);
}

.cat-accessories i {
  color: #ffc107;
}

.cat-accessories .category-glow {
  background: #ffc107;
}

.category-info {
  padding: 1.5rem;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.category-info h3 {
  font-size: 1.25rem;
  font-weight: 700;
  color: #fff;
  margin: 0;
  letter-spacing: -0.02em;
}

.category-info p {
  color: #666;
  font-size: 0.9375rem;
  margin: 0;
  line-height: 1.5;
  flex: 1;
}

.category-count {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 0.75rem;
  border-top: 1px solid #1a1a1a;
  color: #00ff88;
  font-size: 0.875rem;
  font-weight: 600;
  transition: all 0.3s ease;
}

.category-card-gaming:hover .category-count {
  gap: 0.5rem;
}

.category-count i {
  font-size: 1rem;
  transition: transform 0.3s ease;
}

.category-card-gaming:hover .category-count i {
  transform: translateX(4px);
}

.info-banner {
  background: #0a0a0a;
  border: 1px solid #1a1a1a;
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  gap: 1rem;
  animation: slideInLeft 0.5s ease-out;
}

.info-banner > i {
  font-size: 1.5rem;
  color: #00ff88;
  flex-shrink: 0;
}

.info-banner h4 {
  font-size: 1rem;
  font-weight: 600;
  color: #fff;
  margin: 0 0 0.5rem 0;
}

.info-banner p {
  color: #666;
  font-size: 0.875rem;
  margin: 0;
  line-height: 1.6;
}

@media (max-width: 768px) {
  .categories-gaming {
    padding: 1.5rem;
  }

  .page-header-gaming h1 {
    font-size: 2rem;
  }

  .categories-grid {
    grid-template-columns: 1fr;
  }

  .category-visual {
    height: 160px;
  }

  .category-visual i {
    font-size: 4rem;
  }
}
</style>
