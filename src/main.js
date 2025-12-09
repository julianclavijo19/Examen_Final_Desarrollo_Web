import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

// Importar Bootstrap JavaScript
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

// Crear y montar la aplicación
const app = createApp(App);
app.use(router);
app.mount('#app');

console.log('✅ Aplicación iniciada correctamente');
