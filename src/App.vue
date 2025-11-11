<template>
  <div id="app">
    <router-view v-if="appReady"></router-view>
    <div v-else class="loading-screen">
      <div class="spinner-large"></div>
      <p>Cargando aplicación...</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      appReady: false
    };
  },
  mounted() {
    console.log('%c🎮 GamerHub Pro Dashboard', 'color: #00ff88; font-size: 20px; font-weight: bold;');
    console.log('%c⚡ Dashboard Minimalista para PC Gaming', 'color: #666; font-size: 14px;');
    
    // Marcar la app como lista después de un breve delay para asegurar que todo esté cargado
    setTimeout(() => {
      this.appReady = true;
    }, 100);
  },
  errorCaptured(err, instance, info) {
    console.error('Error capturado en App:', err, info);
    // No prevenir el error, solo loguearlo
    return false;
  }
}
</script>

<style>
/* Importar Bootstrap y Bootstrap Icons */
@import 'bootstrap/dist/css/bootstrap.min.css';
@import 'bootstrap-icons/font/bootstrap-icons.css';

/* Variables globales - Tema Claro Minimalista */
:root {
  --color-bg-primary: #ffffff;
  --color-bg-secondary: #f8f9fa;
  --color-bg-tertiary: #f1f3f5;
  --color-border: #e9ecef;
  --color-border-hover: #dee2e6;
  --color-text-primary: #212529;
  --color-text-secondary: #495057;
  --color-text-tertiary: #6c757d;
  --color-text-muted: #adb5bd;
  --color-primary: #6366f1;
  --color-primary-hover: #4f46e5;
  --color-primary-light: #eef2ff;
  --color-warning: #f59e0b;
  --color-danger: #ef4444;
  --color-info: #3b82f6;
  --color-success: #10b981;
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}

/* Reset global */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  font-size: 16px;
  scroll-behavior: smooth;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif;
  background: var(--color-bg-primary);
  color: var(--color-text-primary);
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  overflow-x: hidden;
}

#app {
  min-height: 100vh;
}

/* Loading screen */
.loading-screen {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 100vh;
  background: var(--color-bg-primary);
}

.spinner-large {
  width: 50px;
  height: 50px;
  border: 4px solid var(--color-border);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Scrollbar personalizado */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: var(--color-bg-secondary);
}

::-webkit-scrollbar-thumb {
  background: var(--color-border-hover);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--color-text-tertiary);
}

/* Selección de texto */
::selection {
  background: var(--color-primary);
  color: #ffffff;
}

/* Tipografía */
h1, h2, h3, h4, h5, h6 {
  font-weight: 600;
  letter-spacing: -0.02em;
  line-height: 1.2;
}

/* Links */
a {
  color: var(--color-primary);
  text-decoration: none;
  transition: color 0.2s;
}

a:hover {
  color: var(--color-primary-hover);
}

/* Inputs y formularios */
input,
textarea,
select {
  font-family: inherit;
}

input::placeholder,
textarea::placeholder {
  color: var(--color-text-tertiary);
}

/* Buttons reset */
button {
  font-family: inherit;
  cursor: pointer;
}

/* Utilidades de color */
.text-primary {
  color: var(--color-primary) !important;
}

.text-warning {
  color: var(--color-warning) !important;
}

.bg-primary {
  background-color: var(--color-primary) !important;
}

/* Animaciones sutiles */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
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

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.fade-in {
  animation: fadeIn 0.4s ease-out;
}

.slide-in-left {
  animation: slideInLeft 0.4s ease-out;
}

.slide-in-right {
  animation: slideInRight 0.4s ease-out;
}

.scale-in {
  animation: scaleIn 0.3s ease-out;
}

/* Responsive */
@media (max-width: 768px) {
  html {
    font-size: 14px;
  }
}

@media (max-width: 480px) {
  html {
    font-size: 13px;
  }
}

/* Modo impresión */
@media print {
  body {
    background: white;
    color: black;
  }
}
</style>
