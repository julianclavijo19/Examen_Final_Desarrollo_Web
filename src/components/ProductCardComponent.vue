<template>
  <div class="card product-card h-100 shadow-sm">
    <div class="card-img-container">
      <img 
        :src="product.image" 
        :alt="product.title" 
        class="card-img-top"
        @error="handleImageError"
      >
      <div class="product-badge">
        <span class="badge bg-primary">{{ product.category }}</span>
      </div>
    </div>

    <div class="card-body d-flex flex-column">
      <h5 class="card-title text-truncate" :title="product.title">
        {{ product.title }}
      </h5>
      
      <p class="card-text text-muted small flex-grow-1">
        {{ truncatedDescription }}
      </p>

      <div class="rating mb-2">
        <i 
          v-for="star in 5" 
          :key="star"
          class="bi"
          :class="star <= Math.round(product.rating?.rate || 0) ? 'bi-star-fill text-warning' : 'bi-star text-muted'"
        ></i>
        <span class="text-muted ms-2 small">
          ({{ product.rating?.count || 0 }} reseñas)
        </span>
      </div>

      <div class="d-flex justify-content-between align-items-center mb-3">
        <span class="price text-primary fw-bold fs-4">
          ${{ formatPrice(product.price) }}
        </span>
        <span class="text-muted small">
          ID: #{{ product.id }}
        </span>
      </div>

      <div class="btn-group w-100" role="group">
        <button 
          class="btn btn-outline-primary btn-sm"
          @click="$emit('view', product)"
          title="Ver detalles"
        >
          <i class="bi bi-eye"></i>
        </button>
        <button 
          class="btn btn-outline-success btn-sm"
          @click="$emit('edit', product)"
          title="Editar"
        >
          <i class="bi bi-pencil"></i>
        </button>
        <button 
          class="btn btn-outline-danger btn-sm"
          @click="$emit('delete', product)"
          title="Eliminar"
        >
          <i class="bi bi-trash"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProductCardComponent',
  props: {
    product: {
      type: Object,
      required: true
    }
  },
  emits: ['view', 'edit', 'delete'],
  computed: {
    truncatedDescription() {
      const maxLength = 100;
      if (!this.product.description) return '';
      
      return this.product.description.length > maxLength
        ? this.product.description.substring(0, maxLength) + '...'
        : this.product.description;
    }
  },
  methods: {
    formatPrice(price) {
      return Number(price).toFixed(2);
    },
    handleImageError(event) {
      event.target.src = 'https://via.placeholder.com/300x300?text=Sin+Imagen';
    }
  }
}
</script>

<style scoped>
.product-card {
  transition: all 0.3s ease;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0,0,0,0.15) !important;
  border-color: #0d6efd;
}

.card-img-container {
  position: relative;
  height: 250px;
  background-color: #f8f9fa;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 15px;
}

.card-img-top {
  max-height: 100%;
  max-width: 100%;
  object-fit: contain;
}

.product-badge {
  position: absolute;
  top: 10px;
  right: 10px;
}

.product-badge .badge {
  text-transform: capitalize;
  font-size: 0.7rem;
  padding: 5px 10px;
}

.card-title {
  font-size: 1rem;
  font-weight: 600;
  color: #212529;
  margin-bottom: 10px;
  min-height: 2.5rem;
}

.card-text {
  font-size: 0.85rem;
  line-height: 1.4;
  min-height: 3rem;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}

.rating {
  font-size: 0.9rem;
}

.price {
  font-size: 1.5rem !important;
}

.btn-group .btn {
  flex: 1;
  transition: all 0.2s ease;
}

.btn-group .btn:hover {
  transform: scale(1.05);
}

.btn i {
  font-size: 1rem;
}
</style>

