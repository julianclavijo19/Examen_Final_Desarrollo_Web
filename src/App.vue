<template>
  <div id="app">
    <NavbarComponent v-if="!isLoginPage" />
    <div class="app-layout" v-if="!isLoginPage">
      <SidebarComponent />
      <main class="main-content">
        <router-view></router-view>
      </main>
    </div>
    <router-view v-else></router-view>
    <FooterComponent v-if="!isLoginPage" />
  </div>
</template>

<script>
import NavbarComponent from './components/NavbarComponent.vue';
import SidebarComponent from './components/SidebarComponent.vue';
import FooterComponent from './components/FooterComponent.vue';

export default {
  name: 'App',
  components: {
    NavbarComponent,
    SidebarComponent,
    FooterComponent
  },
  computed: {
    isLoginPage() {
      return this.$route.path === '/login';
    }
  }
}
</script>

<style>
/* Importar Bootstrap y Bootstrap Icons */
@import 'bootstrap/dist/css/bootstrap.min.css';
@import 'bootstrap-icons/font/bootstrap-icons.css';

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  font-size: 16px;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
  background-color: #f8f9fa;
  color: #212529;
  line-height: 1.6;
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-layout {
  display: flex;
  flex: 1;
}

.main-content {
  flex: 1;
  background: #f9fafb;
}

a {
  color: #6366f1;
  text-decoration: none;
}

a:hover {
  color: #4f46e5;
}
</style>
