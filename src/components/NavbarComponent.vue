<template>
  <nav class="navbar">
    <div class="navbar-container">
      <div class="navbar-brand">
        <i class="bi bi-shop"></i>
        <span>Sistema de Gestión</span>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'NavbarComponent'
};
</script>

<style scoped>
.navbar {
  background: #ffffff;
  border-bottom: 1px solid #e5e7eb;
  padding: 1rem 0;
  position: sticky;
  top: 0;
  z-index: 100;
}

.navbar-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
}

.navbar-brand {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #111827;
  font-size: 1.25rem;
  font-weight: 600;
}

.navbar-brand i {
  font-size: 1.5rem;
  color: #6b7280;
}
</style>
