<template>
  <div class="products-management">
    <!-- Navegación Simple -->
    <div class="simple-nav">
      <router-link to="/productos" class="nav-link active">
        <i class="bi bi-box-seam"></i> Productos
      </router-link>
      <router-link to="/usuarios" class="nav-link">
        <i class="bi bi-people"></i> Usuarios
      </router-link>
      <button @click="handleLogout" class="nav-link logout-link">
        <i class="bi bi-box-arrow-right"></i> Cerrar Sesión
      </button>
    </div>

    <div class="page-header">
      <h1>Productos</h1>
      <button class="btn-primary" @click="showCreateModal">
        <i class="bi bi-plus-lg"></i>
        Nuevo Producto
      </button>
    </div>

    <!-- Alertas -->
    <transition name="fade">
      <div v-if="error" class="alert alert-error">
        <i class="bi bi-exclamation-circle-fill"></i>
        <span>{{ error }}</span>
        <button class="alert-close" @click="error = null">
          <i class="bi bi-x"></i>
        </button>
      </div>
    </transition>

    <transition name="fade">
      <div v-if="successMessage" class="alert alert-success">
        <i class="bi bi-check-circle-fill"></i>
        <span>{{ successMessage }}</span>
      </div>
    </transition>

    <!-- Barra de búsqueda -->
    <div class="toolbar">
      <input
        type="text"
        class="search-input"
        placeholder="Buscar productos..."
        v-model="searchQuery"
      >
      <select class="select-input" v-model="selectedCategory" @change="filterByCategory">
        <option value="">Todas las categorías</option>
        <option v-for="category in categories" :key="category.id" :value="category.id">
          {{ category.name }}
        </option>
      </select>
    </div>

    <div v-if="loading" class="loading">
      <div class="spinner-large"></div>
      <p>Cargando productos...</p>
    </div>

    <div v-else-if="error && !successMessage" class="error-state">
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
                    :src="product.Avatar || 'https://via.placeholder.com/60x60/f8f9fa/6366f1?text=Sin+Imagen'" 
                    :alt="product.name"
                    @error="handleImageError"
                  >
                </div>
              </td>
              <td class="col-name">
                <div class="product-name-cell">
                  <h4>{{ product.name }}</h4>
                  <p v-if="product.descripcion">{{ truncateText(product.descripcion, 60) }}</p>
                </div>
              </td>
              <td class="col-category">
                <span class="category-badge">{{ getCategoryName(product.categoria) }}</span>
              </td>
              <td class="col-price">
                <span class="price-value">${{ product.precio }}</span>
              </td>
              <td class="col-stock">
                <span class="stock-badge" :class="getStockClass(product.cantidad)">
                  {{ product.cantidad ? product.cantidad : 'N/A' }}
                </span>
              </td>
              <td class="col-actions">
                <div class="actions-cell">
                  <button class="action-btn view" @click="viewProduct(product)" title="Ver">
                    <i class="bi bi-eye"></i>
                  </button>
                  <button 
                    class="action-btn edit" 
                    @click="editProduct(product)" 
                    title="Editar"
                  >
                    <i class="bi bi-pencil"></i>
                  </button>
                  <button 
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
    <div v-if="showModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2>{{ isEditing ? 'Editar Producto' : 'Nuevo Producto' }}</h2>
          <button class="modal-close" @click="closeModal">
            <i class="bi bi-x-lg"></i>
          </button>
        </div>

        <form @submit.prevent="saveProduct" class="modal-form">
          <div class="form-group">
            <label>Nombre completo <span class="required">*</span></label>
            <input 
              type="text" 
              v-model="currentProduct.name" 
              required
              :disabled="saving"
            >
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Precio <span class="required">*</span></label>
              <input 
                type="number" 
                v-model="currentProduct.precio" 
                step="0.01" 
                min="0" 
                required
                :disabled="saving"
              >
            </div>

            <div class="form-group">
              <label>Cantidad</label>
              <input 
                type="number" 
                v-model="currentProduct.cantidad" 
                min="0"
                :disabled="saving"
              >
            </div>
          </div>

          <div class="form-group">
            <label>Descripción</label>
            <textarea 
              v-model="currentProduct.descripcion" 
              rows="3"
              :disabled="saving"
            ></textarea>
          </div>

          <div class="form-group">
            <label>Categoría <span class="required">*</span></label>
            <select v-model="currentProduct.categoria" required :disabled="saving">
              <option value="">Seleccionar categoría</option>
              <option v-for="category in categories" :key="category" :value="category">
                {{ getCategoryName(category) }}
              </option>
            </select>
            <small class="form-hint" v-if="!currentProduct.categoria">
              Selecciona una categoría para el producto
            </small>
          </div>

          <div class="form-group">
            <label>URL de la imagen</label>
            <input 
              type="url" 
              v-model="currentProduct.Avatar" 
              placeholder="https://..."
              :disabled="saving"
            >
          </div>

          <div class="modal-actions">
            <button 
              type="button" 
              class="btn-secondary" 
              @click="closeModal"
              :disabled="saving"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              class="btn-primary" 
              :disabled="saving"
            >
              <span v-if="saving" class="button-content">
                <span class="spinner-small"></span>
                {{ isEditing ? 'Guardando...' : 'Creando...' }}
              </span>
              <span v-else class="button-content">
                <i class="bi bi-check-lg"></i>
                {{ isEditing ? 'Guardar Cambios' : 'Crear Producto' }}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal Ver -->
    <div v-if="showViewModal" class="modal-overlay" @click="closeViewModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2>Detalles del Producto</h2>
          <button class="modal-close" @click="closeViewModal">
            <i class="bi bi-x-lg"></i>
          </button>
        </div>

        <div class="modal-body" v-if="viewingProduct">
          <div class="product-detail">
            <img :src="viewingProduct.Avatar || 'https://via.placeholder.com/400x300/f8f9fa/6366f1?text=Sin+Imagen'" :alt="viewingProduct.name">
            <div class="detail-info">
              <h3>{{ viewingProduct.name }}</h3>
              <p class="description">{{ viewingProduct.descripcion }}</p>
              
              <div class="detail-grid">
                <div class="detail-item">
                  <span class="label">Precio:</span>
                  <span class="value">${{ viewingProduct.precio }}</span>
                </div>
                <div class="detail-item">
                  <span class="label">Categoría:</span>
                  <span class="value">{{ getCategoryName(viewingProduct.categoria) }}</span>
                </div>
                <div class="detail-item" v-if="viewingProduct.cantidad">
                  <span class="label">Cantidad:</span>
                  <span class="value">{{ viewingProduct.cantidad }} unidades</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de confirmación de eliminación -->
    <div v-if="showDeleteModal" class="modal-overlay" @click="showDeleteModal = false">
      <div class="modal-content modal-confirm" @click.stop>
        <div class="modal-header">
          <h2>Confirmar Eliminación</h2>
          <button class="modal-close" @click="showDeleteModal = false">
            <i class="bi bi-x-lg"></i>
          </button>
        </div>
        <div class="modal-body">
          <p>¿Estás seguro de que deseas eliminar el producto <strong>{{ productToDelete?.name }}</strong>?</p>
          <p class="text-warning">Esta acción no se puede deshacer.</p>
        </div>
        <div class="modal-actions">
          <button 
            type="button" 
            class="btn-secondary"
            @click="showDeleteModal = false"
            :disabled="deleting"
          >
            Cancelar
          </button>
          <button 
            type="button" 
            class="btn-danger"
            @click="deleteProduct"
            :disabled="deleting"
          >
            <span v-if="deleting" class="button-content">
              <span class="spinner-small"></span>
              Eliminando...
            </span>
            <span v-else class="button-content">
              <i class="bi bi-trash"></i>
              Eliminar
            </span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import productService from '../services/productService';
import authService from '../services/authService';

/**
 * Vista de gestión de productos
 * Implementa CRUD completo con modales y alertas
 */
export default {
  name: 'ProductView',
  data() {
    return {
      products: [],
      categories: [],
      loading: false,
      error: null,
      successMessage: null,
      searchQuery: '',
      selectedCategory: '',
      isEditing: false,
      saving: false,
      deleting: false,
      showModal: false,
      showViewModal: false,
      showDeleteModal: false,
      currentProduct: this.getEmptyProduct(),
      viewingProduct: null,
      productToDelete: null,
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
        filtered = filtered.filter(product => {
          const productCategoryId = typeof product.categoria === 'object' 
            ? product.categoria.id 
            : product.categoria;
          return productCategoryId === this.selectedCategory;
        });
      }

      // Luego filtrar por búsqueda
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        return filtered.filter(product => {
          const categoryName = this.getCategoryName(product.categoria).toLowerCase();
          return (
            product.name.toLowerCase().includes(query) ||
            (product.descripcion && product.descripcion.toLowerCase().includes(query)) ||
            (product.categoria && product.categoria.toLowerCase().includes(query)) ||
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
        name: '',
        precio: 0,
        descripcion: '',
        categoria: '',
        cantidad: 10,
        Avatar: ''
      };
    },

    getCategoryName(category) {
      if (!category) return 'Sin categoría';
      
      // Si category es un objeto, extraer el nombre
      if (typeof category === 'object' && category.name) {
        return category.name;
      }
      
      // Si es un string (id), buscar en el array de categorías
      const cat = this.categories.find(c => c.id === category);
      return cat ? cat.name : category;
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
      // Categorías hardcodeadas temporalmente
      this.categories = [
        { id: 'electronics', name: 'Electrónica' },
        { id: 'clothing', name: 'Ropa' },
        { id: 'food', name: 'Alimentos' },
        { id: 'other', name: 'Otros' }
      ];
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
      if (!this.currentProduct.categoria) {
        this.error = 'Por favor selecciona una categoría';
        setTimeout(() => this.error = null, 3000);
        return;
      }

      this.saving = true;
      this.error = null;
      this.successMessage = null;
      
      try {
        if (this.isEditing) {
          await productService.updateProduct(this.currentProduct.id, this.currentProduct);
          const index = this.products.findIndex(p => p.id === this.currentProduct.id);
          if (index !== -1) {
            this.products[index] = { ...this.currentProduct };
          }
          this.successMessage = `Producto "${this.currentProduct.name}" actualizado exitosamente`;
        } else {
          const newProduct = await productService.createProduct(this.currentProduct);
          this.products.unshift({ ...this.currentProduct, id: newProduct.id });
          this.successMessage = `Producto "${this.currentProduct.name}" creado exitosamente`;
        }
        this.closeModal();
        setTimeout(() => this.successMessage = null, 5000);
      } catch (err) {
        console.error(err);
        this.error = 'Error al guardar el producto';
        setTimeout(() => this.error = null, 5000);
      } finally {
        this.saving = false;
      }
    },

    confirmDelete(product) {
      this.productToDelete = product;
      this.showDeleteModal = true;
    },

    async deleteProduct() {
      if (!this.productToDelete) return;
      
      this.deleting = true;
      this.error = null;
      this.successMessage = null;
      
      try {
        await productService.deleteProduct(this.productToDelete.id);
        this.products = this.products.filter(p => p.id !== this.productToDelete.id);
        this.successMessage = `Producto "${this.productToDelete.name}" eliminado exitosamente`;
        this.showDeleteModal = false;
        this.productToDelete = null;
        setTimeout(() => this.successMessage = null, 5000);
      } catch (err) {
        console.error(err);
        this.error = 'Error al eliminar el producto';
        setTimeout(() => this.error = null, 5000);
      } finally {
        this.deleting = false;
      }
    },
    truncateText(text, maxLength) {
      if (!text) return '';
      return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    },
    getStockClass(stock) {
      if (!stock) return 'stock-na';
      if (stock > 10) return 'stock-high';
      if (stock > 0) return 'stock-low';
      return 'stock-out';
    },
    handleImageError(event) {
      event.target.src = 'https://via.placeholder.com/60x60/f8f9fa/6366f1?text=Sin+Imagen';
    },
    handleLogout() {
      authService.logout();
      this.$router.push('/login');
    }
  }
}
</script>

<style scoped src="../styles/products.css" />

