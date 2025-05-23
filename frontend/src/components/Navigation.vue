<template>
  <nav class="navbar">
    <div class="nav-brand">
      <router-link to="/" class="brand">Finanse</router-link>
    </div>
    <div class="nav-links">
      <router-link to="/" class="nav-link" :class="{ active: $route.path === '/' }">
        Panel główny
      </router-link>
      <router-link to="/reports" class="nav-link" :class="{ active: $route.path === '/reports' }">
        Raporty
      </router-link>
      <button @click="logout" class="logout-button">
        Wyloguj się
      </button>
    </div>
  </nav>
</template>

<script>
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

export default {
  name: 'Navigation',
  setup() {
    const router = useRouter();
    const store = useStore();

    const logout = async () => {
      await store.dispatch('auth/logout');
      router.push('/login');
    };

    return {
      logout
    };
  }
};
</script>

<style scoped>
.navbar {
  background-color: white;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.nav-brand {
  display: flex;
  align-items: center;
}

.brand {
  font-size: 1.5rem;
  font-weight: 600;
  color: #2c3e50;
  text-decoration: none;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.nav-link {
  color: #64748b;
  text-decoration: none;
  font-weight: 500;
  padding: 0.5rem 0;
  transition: color 0.2s;
  position: relative;
}

.nav-link:hover {
  color: #2c3e50;
}

.nav-link.active {
  color: #3b82f6;
}

.nav-link.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  background-color: #3b82f6;
  border-radius: 2px;
}

.logout-button {
  padding: 0.5rem 1rem;
  background-color: #ef4444;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s;
}

.logout-button:hover {
  background-color: #dc2626;
}

@media (max-width: 768px) {
  .navbar {
    padding: 1rem;
    flex-direction: column;
    gap: 1rem;
  }

  .nav-links {
    width: 100%;
    justify-content: center;
    flex-wrap: wrap;
    gap: 1rem;
  }
}
</style> 