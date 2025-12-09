<template>
  <footer class="footer">
    <div class="footer-container">
      <p>&copy; {{ currentYear }} Sistema de Gestión. Todos los derechos reservados.</p>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'FooterComponent',
  data() {
    return {
      currentYear: new Date().getFullYear()
    };
  }
};
</script>

<style scoped>
.footer {
  background: #ffffff;
  border-top: 1px solid #e5e7eb;
  margin-top: auto;
}

.footer-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 1.5rem 2rem;
  text-align: center;
}

.footer-container p {
  margin: 0;
  color: #6b7280;
  font-size: 0.875rem;
}
</style>
