<template>
  <div class="product-card">
    <div class="product-image">
      <img 
        v-if="product.Avatar" 
        :src="product.Avatar" 
        :alt="product.name"
        @error="handleImageError"
      >
      <div v-else class="image-placeholder">
        <i class="bi bi-image"></i>
      </div>
    </div>
    
    <div class="product-info">
      <h3 class="product-name">{{ product.name }}</h3>
      <p class="product-price">${{ formatPrice(product.precio) }}</p>
      <button @click="$emit('view-details', product)" class="btn-details">
        Ver Detalles
      </button>
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
  emits: ['view-details'],
  methods: {
    formatPrice(price) {
      return parseFloat(price || 0).toFixed(2);
    },
    handleImageError(event) {
      event.target.style.display = 'none';
      event.target.parentElement.innerHTML = '<div class="image-placeholder"><i class="bi bi-image"></i></div>';
    }
  }
};
</script>

<style scoped>
.product-card {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.2s;
}

.product-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
}

.product-image {
  width: 100%;
  height: 200px;
  background: #f9fafb;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  color: #d1d5db;
}

.image-placeholder i {
  font-size: 3rem;
}

.product-info {
  padding: 1rem;
}

.product-name {
  font-size: 1rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 0.5rem 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.product-price {
  font-size: 1.25rem;
  font-weight: 700;
  color: #111827;
  margin: 0 0 1rem 0;
}

.btn-details {
  width: 100%;
  padding: 0.625rem;
  background: #111827;
  color: #ffffff;
  border: none;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-details:hover {
  background: #374151;
}
</style>
