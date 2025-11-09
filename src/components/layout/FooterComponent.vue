<template>
  <footer class="footer-minimal">
    <div class="footer-content">
      <div class="footer-brand">
        <i class="bi bi-controller"></i>
        <span>GamerHub Pro</span>
      </div>
      <p class="footer-text">
        © {{ currentYear }} GamerHub Pro. Proyecto educativo - Desarrollo Web.
      </p>
      <div class="footer-links">
        <a href="#" class="footer-link">
          <i class="bi bi-github"></i>
        </a>
        <a href="#" class="footer-link">
          <i class="bi bi-linkedin"></i>
        </a>
        <a href="#" class="footer-link">
          <i class="bi bi-twitter"></i>
        </a>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'FooterComponent',
  computed: {
    currentYear() {
      return new Date().getFullYear();
    }
  }
}
</script>

<style scoped>
.footer-minimal {
  background: #ffffff;
  border-top: 1px solid #dee2e6;
  padding: 2rem 2rem;
  margin-top: auto;
}

.footer-content {
  max-width: 1600px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 2rem;
  flex-wrap: wrap;
}

.footer-brand {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  color: #212529;
  font-size: 1.125rem;
  font-weight: 700;
  letter-spacing: -0.02em;
}

.footer-brand i {
  font-size: 1.375rem;
  color: #6366f1;
}

.footer-text {
  color: #6c757d;
  font-size: 0.875rem;
  margin: 0;
  text-align: center;
  flex: 1;
}

.footer-links {
  display: flex;
  gap: 0.75rem;
}

.footer-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  color: #6c757d;
  text-decoration: none;
  transition: all 0.3s ease;
}

.footer-link:hover {
  background: #e9ecef;
  border-color: #6366f1;
  color: #6366f1;
  transform: translateY(-2px);
}

.footer-link i {
  font-size: 1rem;
}

@media (max-width: 768px) {
  .footer-minimal {
    padding: 1.5rem 1rem;
  }

  .footer-content {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }
  
  .footer-brand {
    justify-content: center;
  }

  .footer-text {
    font-size: 0.8125rem;
  }

  .footer-links {
    justify-content: center;
  }
}
</style>
