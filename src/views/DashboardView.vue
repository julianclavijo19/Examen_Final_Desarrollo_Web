<template>
  <div class="dashboard-minimal">
    <NavbarComponent :currentUser="currentUser" @logout="handleLogout" />
    <SidebarComponent :currentUser="currentUser" />
    
    <main class="main-content">
      <router-view></router-view>
      <FooterComponent />
    </main>
  </div>
</template>

<script>
import NavbarComponent from '../components/layout/NavbarComponent.vue';
import SidebarComponent from '../components/layout/SidebarComponent.vue';
import FooterComponent from '../components/layout/FooterComponent.vue';
import authService from '../services/authService';

export default {
  name: 'DashboardView',
  components: {
    NavbarComponent,
    SidebarComponent,
    FooterComponent
  },
  data() {
    return {
      currentUser: null
    };
  },
  mounted() {
    this.currentUser = authService.getCurrentUser();
    
    if (!this.currentUser) {
      this.$router.push('/login');
    }
  },
  methods: {
    handleLogout() {
      authService.logout();
      this.$router.push('/login');
    }
  }
}
</script>

<style scoped>
.dashboard-minimal {
  min-height: 100vh;
  background: #ffffff;
  display: flex;
  flex-direction: column;
}

.main-content {
  margin-left: 240px;
  margin-top: 70px;
  min-height: calc(100vh - 70px);
  display: flex;
  flex-direction: column;
  background: #f8f9fa;
}

@media (max-width: 768px) {
  .main-content {
    margin-left: 0;
    margin-top: 60px;
    min-height: calc(100vh - 60px);
  }
}
</style>
