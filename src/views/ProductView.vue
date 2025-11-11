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

<style>
@import '../styles/views/product.css';
</style>
