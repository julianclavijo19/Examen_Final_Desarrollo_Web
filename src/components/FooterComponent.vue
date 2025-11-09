<template>
  <footer class="footer bg-dark text-white py-4 mt-auto">
    <div class="container-fluid">
      <div class="row">
        <div class="col-md-4 mb-3 mb-md-0">
          <h5 class="fw-bold">
            <i class="bi bi-cpu me-2 text-warning"></i>
            TechStore Pro
          </h5>
          <p class="text-muted mb-0">
            Tu destino para la mejor tecnología y electrónica
          </p>
        </div>

        <div class="col-md-4 mb-3 mb-md-0">
          <h6 class="fw-bold mb-3">Enlaces Rápidos</h6>
          <ul class="list-unstyled">
            <li><a href="#" class="text-muted text-decoration-none">Sobre Nosotros</a></li>
            <li><a href="#" class="text-muted text-decoration-none">Términos y Condiciones</a></li>
            <li><a href="#" class="text-muted text-decoration-none">Política de Privacidad</a></li>
            <li><a href="#" class="text-muted text-decoration-none">Contacto</a></li>
          </ul>
        </div>

        <div class="col-md-4">
          <h6 class="fw-bold mb-3">Síguenos</h6>
          <div class="social-links">
            <a href="#" class="text-white me-3">
              <i class="bi bi-facebook fs-4"></i>
            </a>
            <a href="#" class="text-white me-3">
              <i class="bi bi-twitter fs-4"></i>
            </a>
            <a href="#" class="text-white me-3">
              <i class="bi bi-instagram fs-4"></i>
            </a>
            <a href="#" class="text-white">
              <i class="bi bi-linkedin fs-4"></i>
            </a>
          </div>
        </div>
      </div>

      <hr class="border-secondary my-3">

      <div class="row">
        <div class="col-12 text-center">
          <p class="mb-0 text-muted">
            &copy; {{ currentYear }} TechStore Pro. Todos los derechos reservados.
            <span class="d-block d-sm-inline-block mt-2 mt-sm-0">
              | Desarrollado para propósitos educativos
            </span>
          </p>
        </div>
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
.footer {
  margin-top: auto;
  border-top: 3px solid #0d6efd;
}

.footer a {
  transition: all 0.3s ease;
}

.footer a:hover {
  color: #ffc107 !important;
  transform: translateY(-2px);
}

.social-links a {
  display: inline-block;
  transition: all 0.3s ease;
}

.social-links a:hover {
  transform: scale(1.2);
}
</style>

