import { ref, computed } from 'vue';
import { productService } from '../services/api';
import { categoryService } from '../services/api';

/**
 * Composable para manejar productos
 */
export function useProducts() {
  const products = ref([]);
  const categories = ref([]);
  const loading = ref(false);
  const error = ref(null);
  const searchQuery = ref('');
  const selectedCategory = ref('');

  const filteredProducts = computed(() => {
    let filtered = products.value;

    // Filtrar por categoría
    if (selectedCategory.value) {
      filtered = filtered.filter(p => p.category === selectedCategory.value);
    }

    // Filtrar por búsqueda
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase();
      filtered = filtered.filter(p =>
        p.title.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.brand?.toLowerCase().includes(query)
      );
    }

    return filtered;
  });

  const loadProducts = async (limit = 100) => {
    loading.value = true;
    error.value = null;
    
    try {
      products.value = await productService.getAllProducts(limit);
    } catch (err) {
      error.value = err.message || 'Error al cargar productos';
      console.error('Error al cargar productos:', err);
    } finally {
      loading.value = false;
    }
  };

  const loadCategories = async () => {
    try {
      const categorySlugs = await categoryService.getCategories();
      categories.value = categoryService.mapCategories(categorySlugs);
    } catch (err) {
      error.value = err.message || 'Error al cargar categorías';
      console.error('Error al cargar categorías:', err);
    }
  };

  const searchProducts = async (query) => {
    loading.value = true;
    error.value = null;
    
    try {
      if (query.trim()) {
        products.value = await productService.searchProducts(query);
      } else {
        await loadProducts();
      }
    } catch (err) {
      error.value = err.message || 'Error al buscar productos';
      console.error('Error al buscar productos:', err);
    } finally {
      loading.value = false;
    }
  };

  const getProductById = async (id) => {
    loading.value = true;
    error.value = null;
    
    try {
      return await productService.getProductById(id);
    } catch (err) {
      error.value = err.message || 'Error al obtener producto';
      console.error('Error al obtener producto:', err);
      return null;
    } finally {
      loading.value = false;
    }
  };

  const createProduct = async (productData) => {
    loading.value = true;
    error.value = null;
    
    try {
      const newProduct = await productService.createProduct(productData);
      products.value.push(newProduct);
      return { success: true, product: newProduct };
    } catch (err) {
      error.value = err.message || 'Error al crear producto';
      return { success: false, error: error.value };
    } finally {
      loading.value = false;
    }
  };

  const updateProduct = async (id, productData) => {
    loading.value = true;
    error.value = null;
    
    try {
      const updatedProduct = await productService.updateProduct(id, productData);
      const index = products.value.findIndex(p => p.id === id);
      if (index !== -1) {
        products.value[index] = updatedProduct;
      }
      return { success: true, product: updatedProduct };
    } catch (err) {
      error.value = err.message || 'Error al actualizar producto';
      return { success: false, error: error.value };
    } finally {
      loading.value = false;
    }
  };

  const deleteProduct = async (id) => {
    loading.value = true;
    error.value = null;
    
    try {
      await productService.deleteProduct(id);
      products.value = products.value.filter(p => p.id !== id);
      return { success: true };
    } catch (err) {
      error.value = err.message || 'Error al eliminar producto';
      return { success: false, error: error.value };
    } finally {
      loading.value = false;
    }
  };

  return {
    products,
    categories,
    loading,
    error,
    searchQuery,
    selectedCategory,
    filteredProducts,
    loadProducts,
    loadCategories,
    searchProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
  };
}

