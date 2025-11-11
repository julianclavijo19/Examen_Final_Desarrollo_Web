<template>
  <div class="products-minimal">
    <div class="page-header">
      <h1>Productos</h1>
      <button 
        v-if="isAdmin" 
        class="btn-primary" 
        @click="showCreateModal"
      >
        <i class="bi bi-plus-lg"></i>
        Nuevo Producto
      </button>
    </div>

    <div class="toolbar">
      <input
        type="text"
        class="search-input"
        placeholder="Buscar productos..."
        v-model="searchQuery"
      >
      <select class="select-input" v-model="selectedCategory" @change="filterByCategory">
        <option value="">Todas las categorías</option>
        <option v-for="category in categories" :key="category" :value="category">
          {{ getCategoryName(category) }}
        </option>
      </select>
    </div>

    <div v-if="loading" class="loading">
      <div class="spinner-large"></div>
      <p>Cargando productos...</p>
    </div>

    <div v-else-if="error" class="error-state">
      <i class="bi bi-exclamation-triangle"></i>
      <p>{{ error }}</p>
    </div>

    <div v-else>
      <div class="products-table-container">
        <table class="products-table">
          <thead>
            <tr>
              <th class="col-image">Imagen</th>
              <th class="col-name">Producto</th>
              <th class="col-category">Categoría</th>
              <th class="col-price">Precio</th>
              <th class="col-stock">Stock</th>
              <th class="col-rating">Rating</th>
              <th class="col-actions">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr 
              v-for="product in filteredProducts" 
              :key="product.id"
              class="product-row"
            >
              <td class="col-image">
                <div class="product-image-cell">
                  <img 
                    :src="product.thumbnail || product.image" 
                    :alt="product.title"
                    @error="handleImageError"
                  >
                </div>
              </td>
              <td class="col-name">
                <div class="product-name-cell">
                  <h4>{{ product.title }}</h4>
                  <p v-if="product.description">{{ truncateText(product.description, 60) }}</p>
                </div>
              </td>
              <td class="col-category">
                <span class="category-badge">{{ getCategoryName(product.category) }}</span>
              </td>
              <td class="col-price">
                <span class="price-value">${{ product.price }}</span>
              </td>
              <td class="col-stock">
                <span class="stock-badge" :class="getStockClass(product.stock)">
                  {{ product.stock ? product.stock : 'N/A' }}
                </span>
              </td>
              <td class="col-rating">
                <div class="rating-cell" v-if="product.rating">
                  <i class="bi bi-star-fill"></i>
                  <span>{{ product.rating }}</span>
                </div>
                <span v-else class="no-rating">-</span>
              </td>
              <td class="col-actions">
                <div class="actions-cell">
                  <button class="action-btn view" @click="viewProduct(product)" title="Ver">
                    <i class="bi bi-eye"></i>
                  </button>
                  <button 
                    v-if="isAdmin" 
                    class="action-btn edit" 
                    @click="editProduct(product)" 
                    title="Editar"
                  >
                    <i class="bi bi-pencil"></i>
                  </button>
                  <button 
                    v-if="isAdmin" 
                    class="action-btn delete" 
                    @click="confirmDelete(product)" 
                    title="Eliminar"
                  >
                    <i class="bi bi-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <div v-if="filteredProducts.length === 0" class="empty-state">
          <i class="bi bi-inbox"></i>
          <h3>No se encontraron productos</h3>
          <p>Intenta con otra búsqueda o categoría</p>
        </div>
      </div>
    </div>

    <!-- Modal Crear/Editar -->
    <div class="modal-overlay" v-if="showModal" @click.self="closeModal">
      <div class="modal-content">
        <div class="modal-header">
          <h2>{{ isEditing ? 'Editar Producto' : 'Nuevo Producto' }}</h2>
          <button class="btn-close" @click="closeModal">
            <i class="bi bi-x-lg"></i>
          </button>
        </div>

        <form @submit.prevent="saveProduct" class="modal-body">
          <div class="form-group">
            <label>Título *</label>
            <input type="text" v-model="currentProduct.title" required>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Precio *</label>
              <input 
                type="number" 
                v-model="currentProduct.price" 
                step="0.01" 
                min="0" 
                required
              >
            </div>

            <div class="form-group">
              <label>Stock</label>
              <input 
                type="number" 
                v-model="currentProduct.stock" 
                min="0"
              >
            </div>
          </div>

          <div class="form-group">
            <label>Descripción</label>
            <textarea v-model="currentProduct.description" rows="3"></textarea>
          </div>

          <div class="form-group">
            <label>Categoría *</label>
            <select v-model="currentProduct.category" required>
              <option value="">Seleccionar categoría</option>
              <option v-for="category in categories" :key="category" :value="category">
                {{ getCategoryName(category) }}
              </option>
            </select>
            <small v-if="!currentProduct.category" style="color: #6c757d; margin-top: 0.25rem; display: block;">
              Selecciona una categoría para el producto
            </small>
          </div>

          <div class="form-group">
            <label>URL de la imagen</label>
            <input type="url" v-model="currentProduct.thumbnail" placeholder="https://...">
          </div>

          <div class="modal-footer">
            <button type="button" class="btn-secondary" @click="closeModal">
              Cancelar
            </button>
            <button type="submit" class="btn-primary" :disabled="saving">
              {{ saving ? 'Guardando...' : 'Guardar' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal Ver -->
    <div class="modal-overlay" v-if="showViewModal" @click.self="closeViewModal">
      <div class="modal-content">
        <div class="modal-header">
          <h2>Detalles del Producto</h2>
          <button class="btn-close" @click="closeViewModal">
            <i class="bi bi-x-lg"></i>
          </button>
        </div>

        <div class="modal-body" v-if="viewingProduct">
          <div class="product-detail">
            <img :src="viewingProduct.thumbnail || viewingProduct.image" :alt="viewingProduct.title">
            <div class="detail-info">
              <h3>{{ viewingProduct.title }}</h3>
              <p class="description">{{ viewingProduct.description }}</p>
              
              <div class="detail-grid">
                <div class="detail-item">
                  <span class="label">Precio:</span>
                  <span class="value">${{ viewingProduct.price }}</span>
                </div>
                <div class="detail-item">
                  <span class="label">Categoría:</span>
                  <span class="value">{{ getCategoryName(viewingProduct.category) }}</span>
                </div>
                <div class="detail-item" v-if="viewingProduct.stock">
                  <span class="label">Stock:</span>
                  <span class="value">{{ viewingProduct.stock }} unidades</span>
                </div>
                <div class="detail-item" v-if="viewingProduct.rating">
                  <span class="label">Rating:</span>
                  <span class="value">
                    <i class="bi bi-star-fill text-warning"></i>
                    {{ viewingProduct.rating }}/5
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { productService, categoryService } from '../services/api';
import authService from '../services/authService';

export default {
  name: 'ProductView',
  data() {
    return {
      products: [],
      categories: [],
      loading: false,
      error: null,
      searchQuery: '',
      selectedCategory: '',
      isEditing: false,
      saving: false,
      showModal: false,
      showViewModal: false,
      currentProduct: this.getEmptyProduct(),
      viewingProduct: null,
      currentUser: null
    };
  },
  computed: {
    isAdmin() {
      return this.currentUser && this.currentUser.rol === 'admin';
    },
    filteredProducts() {
      let filtered = this.products;

      // Filtrar por categoría primero
      if (this.selectedCategory) {
        filtered = filtered.filter(product => 
          product.category === this.selectedCategory
        );
      }

      // Luego filtrar por búsqueda
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        filtered = filtered.filter(product => {
          const categoryName = this.getCategoryName(product.category).toLowerCase();
          return (
            product.title.toLowerCase().includes(query) ||
            (product.description && product.description.toLowerCase().includes(query)) ||
            (product.category && product.category.toLowerCase().includes(query)) ||
            categoryName.includes(query)
          );
        });
      }

      return filtered;
    }
  },
  async mounted() {
    // Obtener usuario actual
    this.currentUser = authService.getCurrentUser();
    
    await this.loadProducts();
    await this.loadCategories();
    
    // Leer parámetro de categoría de la URL
    const categoryParam = this.$route.query.category;
    if (categoryParam) {
      this.selectedCategory = categoryParam;
    }
  },
  methods: {
    getEmptyProduct() {
      return {
        title: '',
        price: 0,
        description: '',
        category: '',
        thumbnail: 'https://via.placeholder.com/300x300/f8f9fa/6366f1?text=Producto',
        stock: 10,
        rating: 4.5
      };
    },

    getCategoryName(category) {
      return categoryService.getCategoryName(category);
    },

    async loadProducts() {
      this.loading = true;
      this.error = null;
      try {
        this.products = await productService.getAllProducts();
      } catch (err) {
        this.error = 'Error al cargar los productos';
        console.error(err);
      } finally {
        this.loading = false;
      }
    },

    async loadCategories() {
      try {
        this.categories = await categoryService.getCategories();
      } catch (err) {
        console.error('Error al cargar categorías:', err);
      }
    },

    async filterByCategory() {
      // Si no hay categoría seleccionada, cargar todos los productos
      if (!this.selectedCategory) {
        await this.loadProducts();
      }
      // El filtrado se hace en computed filteredProducts
      // No necesitamos recargar productos desde la API
    },

    showCreateModal() {
      this.isEditing = false;
      this.currentProduct = this.getEmptyProduct();
      this.showModal = true;
    },

    editProduct(product) {
      this.isEditing = true;
      this.currentProduct = { ...product };
      this.showModal = true;
    },

    viewProduct(product) {
      this.viewingProduct = product;
      this.showViewModal = true;
    },

    closeModal() {
      this.showModal = false;
    },

    closeViewModal() {
      this.showViewModal = false;
    },

    async saveProduct() {
      // Validar que la categoría esté seleccionada
      if (!this.currentProduct.category) {
        alert('Por favor selecciona una categoría');
        return;
      }

      this.saving = true;
      try {
        if (this.isEditing) {
          await productService.updateProduct(this.currentProduct.id, this.currentProduct);
          const index = this.products.findIndex(p => p.id === this.currentProduct.id);
          if (index !== -1) {
            this.products[index] = { ...this.currentProduct };
          }
        } else {
          const newProduct = await productService.createProduct(this.currentProduct);
          this.products.unshift({ ...this.currentProduct, id: newProduct.id });
        }
        this.closeModal();
      } catch (err) {
        console.error(err);
        alert('Error al guardar el producto');
      } finally {
        this.saving = false;
      }
    },

    async confirmDelete(product) {
      if (confirm(`¿Eliminar "${product.title}"?`)) {
        try {
          await productService.deleteProduct(product.id);
          this.products = this.products.filter(p => p.id !== product.id);
        } catch (err) {
          console.error(err);
          alert('Error al eliminar el producto');
        }
      }
    },
    truncateText(text, maxLength) {
      if (!text) return '';
      return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    },
    getStockClass(stock) {
      if (!stock) return 'no-stock';
      if (stock > 10) return 'in-stock';
      if (stock > 0) return 'low-stock';
      return 'out-stock';
    },
    handleImageError(event) {
      event.target.src = 'https://via.placeholder.com/300x300/f8f9fa/6366f1?text=Sin+Imagen';
    }
  }
}
</script>

<style scoped>
.products-minimal {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
  animation: fadeIn 0.4s ease-out;
  background: #f8f9fa;
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
}

.page-header h1 {
  color: #212529;
  font-size: 2rem;
  font-weight: 700;
  margin: 0;
}

.toolbar {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
}

.search-input,
.select-input {
  background: #ffffff;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  padding: 0.75rem 1rem;
  color: #212529;
  font-size: 0.9375rem;
  transition: all 0.2s;
}

.search-input {
  flex: 1;
}

.select-input {
  min-width: 200px;
}

.search-input:focus,
.select-input:focus {
  outline: none;
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.btn-primary {
  background: #6366f1;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  padding: 0.75rem 1.5rem;
  font-size: 0.9375rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-primary:hover:not(:disabled) {
  background: #4f46e5;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-secondary {
  background: transparent;
  color: #6c757d;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  padding: 0.75rem 1.5rem;
  font-size: 0.9375rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-secondary:hover {
  border-color: #6366f1;
  color: #6366f1;
  background: #f8f9fa;
}

.loading,
.error-state,
.empty-state {
  text-align: center;
  padding: 4rem 2rem;
}

.spinner-large {
  width: 40px;
  height: 40px;
  border: 3px solid #e9ecef;
  border-top-color: #6366f1;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.loading p,
.error-state p,
.empty-state p {
  color: #6c757d;
  margin: 0.5rem 0 0 0;
}

.error-state i,
.empty-state i {
  font-size: 3rem;
  color: #adb5bd;
  margin-bottom: 1rem;
}

.empty-state h3 {
  color: #212529;
  font-size: 1.25rem;
  margin: 1rem 0 0.5rem 0;
}

.products-table-container {
  background: #ffffff;
  border: 1px solid #dee2e6;
  border-radius: 16px;
  overflow: hidden;
  overflow-x: auto;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}

.products-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 1000px;
}

.products-table thead {
  background: #f8f9fa;
  border-bottom: 2px solid #dee2e6;
}

.products-table th {
  padding: 1.25rem 1rem;
  text-align: left;
  color: #6c757d;
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.products-table th.col-image {
  width: 80px;
}

.products-table th.col-name {
  min-width: 250px;
}

.products-table th.col-category {
  width: 140px;
}

.products-table th.col-price {
  width: 100px;
}

.products-table th.col-stock {
  width: 100px;
}

.products-table th.col-rating {
  width: 100px;
}

.products-table th.col-actions {
  width: 140px;
  text-align: center;
}

.product-row {
  border-bottom: 1px solid #dee2e6;
  transition: all 0.3s ease;
  animation: slideInLeft 0.4s ease-out backwards;
}

.product-row:nth-child(1) { animation-delay: 0.05s; }
.product-row:nth-child(2) { animation-delay: 0.1s; }
.product-row:nth-child(3) { animation-delay: 0.15s; }
.product-row:nth-child(4) { animation-delay: 0.2s; }
.product-row:nth-child(5) { animation-delay: 0.25s; }
.product-row:nth-child(6) { animation-delay: 0.3s; }

.product-row:hover {
  background: #f8f9fa;
  border-color: #6366f1;
}

.product-row td {
  padding: 1.25rem 1rem;
  vertical-align: middle;
}

.product-image-cell {
  width: 60px;
  height: 60px;
  border-radius: 8px;
  overflow: hidden;
  background: #f8f9fa;
  border: 1px solid #dee2e6;
}

.product-image-cell img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.product-row:hover .product-image-cell img {
  transform: scale(1.1);
}

.product-name-cell h4 {
  color: #212529;
  font-size: 0.9375rem;
  font-weight: 600;
  margin: 0 0 0.375rem 0;
  line-height: 1.4;
}

.product-name-cell p {
  color: #6c757d;
  font-size: 0.8125rem;
  margin: 0;
  line-height: 1.4;
}

.category-badge {
  display: inline-block;
  background: #eef2ff;
  color: #6366f1;
  padding: 0.375rem 0.75rem;
  border-radius: 6px;
  font-size: 0.8125rem;
  font-weight: 600;
  border: 1px solid #c7d2fe;
}

.price-value {
  color: #6366f1;
  font-size: 1.125rem;
  font-weight: 700;
}

.stock-badge {
  display: inline-block;
  padding: 0.375rem 0.75rem;
  border-radius: 6px;
  font-size: 0.8125rem;
  font-weight: 600;
}

.stock-badge.in-stock {
  background: #d1fae5;
  color: #10b981;
  border: 1px solid #86efac;
}

.stock-badge.low-stock {
  background: #fef3c7;
  color: #f59e0b;
  border: 1px solid #fde68a;
}

.stock-badge.out-stock {
  background: #fee2e2;
  color: #ef4444;
  border: 1px solid #fca5a5;
}

.stock-badge.no-stock {
  background: #f3f4f6;
  color: #6b7280;
  border: 1px solid #d1d5db;
}

.rating-cell {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  color: #f59e0b;
  font-size: 0.875rem;
  font-weight: 600;
}

.rating-cell i {
  font-size: 1rem;
}

.no-rating {
  color: #adb5bd;
  font-size: 0.875rem;
}

.actions-cell {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.actions-cell .action-btn {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  border: 1px solid #dee2e6;
  background: transparent;
  color: #6c757d;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  font-size: 0.9375rem;
}

.actions-cell .action-btn.view:hover {
  background: #dbeafe;
  border-color: #3b82f6;
  color: #3b82f6;
  transform: translateY(-2px);
}

.actions-cell .action-btn.edit:hover {
  background: #fef3c7;
  border-color: #f59e0b;
  color: #f59e0b;
  transform: translateY(-2px);
}

.actions-cell .action-btn.delete:hover {
  background: #fee2e2;
  border-color: #ef4444;
  color: #ef4444;
  transform: translateY(-2px);
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 2rem;
  animation: fadeIn 0.3s ease-out;
}

.modal-content {
  background: #ffffff;
  border: 1px solid #dee2e6;
  border-radius: 12px;
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow: auto;
  animation: scaleIn 0.3s ease-out;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
}

.modal-header {
  padding: 1.5rem;
  border-bottom: 1px solid #dee2e6;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #f8f9fa;
}

.modal-header h2 {
  color: #212529;
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
}

.btn-close {
  background: transparent;
  border: none;
  color: #6c757d;
  cursor: pointer;
  padding: 0.5rem;
  transition: color 0.2s;
}

.btn-close:hover {
  color: #212529;
}

.modal-body {
  padding: 1.5rem;
}

.form-group {
  margin-bottom: 1.25rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-group label {
  display: block;
  color: #495057;
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.form-group input,
.form-group textarea,
.form-group select {
  width: 100%;
  background: #ffffff;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  padding: 0.75rem;
  color: #212529;
  font-size: 0.9375rem;
  transition: all 0.2s;
}

.form-group input:focus,
.form-group textarea:focus,
.form-group select:focus {
  outline: none;
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.modal-footer {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
}

.product-detail {
  display: grid;
  gap: 1.5rem;
}

.product-detail img {
  width: 100%;
  border-radius: 8px;
}

.detail-info h3 {
  color: #212529;
  font-size: 1.5rem;
  margin: 0 0 1rem 0;
}

.description {
  color: #6c757d;
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

.detail-grid {
  display: grid;
  gap: 1rem;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  padding: 0.75rem;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #dee2e6;
}

.detail-item .label {
  color: #6c757d;
  font-size: 0.875rem;
}

.detail-item .value {
  color: #212529;
  font-weight: 600;
  font-size: 0.875rem;
}

@media (max-width: 768px) {
  .products-minimal {
    padding: 1.5rem;
  }
  
  .toolbar {
    flex-direction: column;
  }
  
  .products-table-container {
    border-radius: 12px;
  }
  
  .products-table {
    min-width: 800px;
  }
  
  .products-table th,
  .products-table td {
    padding: 0.875rem 0.75rem;
    font-size: 0.875rem;
  }
  
  .actions-cell {
    flex-direction: column;
    gap: 0.25rem;
  }
  
  .actions-cell .action-btn {
    width: 32px;
    height: 32px;
    font-size: 0.875rem;
  }
}
</style>
