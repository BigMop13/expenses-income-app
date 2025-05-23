<template>
  <nav class="navbar">
    <div class="nav-brand">
      <router-link to="/dashboard">Finanse</router-link>
    </div>
    
    <div class="nav-mobile" :class="{ 'is-open': isMenuOpen }">
      <div class="nav-links">
        <router-link to="/dashboard" class="nav-link" @click="isMenuOpen = false">Panel</router-link>
        <router-link to="/budget" class="nav-link" @click="isMenuOpen = false">Budżet</router-link>
        <router-link to="/report" class="nav-link" @click="isMenuOpen = false">Raporty</router-link>
      </div>
      <div class="nav-user">
        <span v-if="user" class="user-name">{{ user.firstName }} {{ user.lastName }}</span>
        <button @click="handleLogout" class="logout-btn">Wyloguj</button>
      </div>
    </div>

    <button class="menu-toggle" @click="isMenuOpen = !isMenuOpen">
      <span class="hamburger" :class="{ 'is-active': isMenuOpen }">
        <span></span>
        <span></span>
        <span></span>
      </span>
    </button>
  </nav>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'Navbar',
  data() {
    return {
      isMenuOpen: false
    }
  },
  computed: {
    ...mapGetters('auth', ['currentUser']),
    user() {
      return this.currentUser;
    }
  },
  methods: {
    ...mapActions('auth', ['logout']),
    async handleLogout() {
      try {
        await this.logout();
        this.$router.push('/');
      } catch (error) {
        console.error('Logout failed:', error);
      }
    }
  }
}
</script>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  background-color: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 24px;
  z-index: 1000;
}

.nav-brand {
  display: flex;
  align-items: center;
  gap: 16px;
}

.nav-brand a {
  font-size: 1.5rem;
  font-weight: 600;
  color: #4CAF50;
  text-decoration: none;
}

.menu-toggle {
  display: none;
  background: none;
  border: none;
  padding: 8px;
  cursor: pointer;
}

.hamburger {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 24px;
  height: 18px;
}

.hamburger span {
  display: block;
  height: 2px;
  width: 100%;
  background-color: #2c3e50;
  transition: all 0.3s ease;
}

.hamburger.is-active span:nth-child(1) {
  transform: translateY(8px) rotate(45deg);
}

.hamburger.is-active span:nth-child(2) {
  opacity: 0;
}

.hamburger.is-active span:nth-child(3) {
  transform: translateY(-8px) rotate(-45deg);
}

.nav-mobile {
  display: flex;
  align-items: center;
  gap: 24px;
}

.nav-links {
  display: flex;
  gap: 24px;
}

.nav-link {
  color: #2c3e50;
  text-decoration: none;
  font-weight: 500;
  padding: 6px 12px;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.nav-link:hover {
  background-color: #f5f5f5;
}

.nav-link.router-link-active {
  color: #4CAF50;
  background-color: #e8f5e9;
}

.nav-user {
  display: flex;
  align-items: center;
  gap: 16px;
}

.user-name {
  color: #2c3e50;
  font-weight: 500;
}

.logout-btn {
  padding: 6px 12px;
  border: none;
  background-color: #f44336;
  color: white;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s;
}

.logout-btn:hover {
  background-color: #d32f2f;
}

@media (max-width: 768px) {
  .menu-toggle {
    display: block;
  }

  .nav-mobile {
    display: none;
    position: fixed;
    top: 60px;
    left: 0;
    right: 0;
    background: white;
    flex-direction: column;
    align-items: stretch;
    padding: 16px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .nav-mobile.is-open {
    display: flex;
  }

  .nav-links {
    flex-direction: column;
    gap: 8px;
  }

  .nav-link {
    display: block;
    padding: 12px;
  }

  .nav-user {
    flex-direction: column;
    align-items: stretch;
    gap: 8px;
    padding-top: 16px;
    border-top: 1px solid #e5e7eb;
  }

  .logout-btn {
    width: 100%;
    padding: 12px;
  }
}
</style> 