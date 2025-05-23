<template>
  <div class="dashboard-container">
    <h2>Witaj, {{ user?.firstName }} {{ user?.lastName }}</h2>
    <p>Email: {{ user?.email }}</p>
    <div class="dashboard-actions">
      <router-link to="/budget"><button>Budżetowanie</button></router-link>
      <router-link to="/report"><button>Raportowanie</button></router-link>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
export default {
  name: 'Dashboard',
  computed: {
    ...mapGetters('auth', ['currentUser']),
    user() {
      return this.currentUser;
    }
  }
}
</script>
<style scoped>
.dashboard-container { max-width: 500px; margin: 40px auto; padding: 24px; background: #fff; border-radius: 8px; box-shadow: 0 2px 8px #eee; text-align: center; }
.dashboard-actions { margin-top: 32px; display: flex; gap: 24px; justify-content: center; }
button { padding: 12px 24px; border-radius: 6px; border: none; background: #4CAF50; color: #fff; font-size: 16px; cursor: pointer; }
button:hover { background: #388e3c; }
</style> 