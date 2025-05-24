<template>
  <div class="login-container">
    <form @submit.prevent="handleSubmit" class="login-form">
      <h2>{{ isLogin ? 'Logowanie' : 'Rejestracja' }}</h2>
      
      <div class="form-group">
        <label for="email">Email</label>
        <input
          type="email"
          id="email"
          v-model="email"
          required
          class="form-control"
          placeholder="Wprowadź swój email"
        />
      </div>

      <div class="form-group">
        <label for="password">Hasło</label>
        <input
          type="password"
          id="password"
          v-model="password"
          required
          class="form-control"
          placeholder="Wprowadź swoje hasło"
        />
      </div>

      <!-- Confirm Password field for registration -->
      <div v-if="!isLogin" class="form-group">
        <label for="confirmPassword">Potwierdź hasło</label>
        <input
          type="password"
          id="confirmPassword"
          v-model="confirmPassword"
          required
          class="form-control"
          placeholder="Potwierdź swoje hasło"
        />
      </div>

      <!-- First Name field for registration -->
      <div v-if="!isLogin" class="form-group">
        <label for="firstName">Imię</label>
        <input
          type="text"
          id="firstName"
          v-model="firstName"
          required
          class="form-control"
          placeholder="Wprowadź swoje imię"
        />
      </div>

      <!-- Last Name field for registration -->
      <div v-if="!isLogin" class="form-group">
        <label for="lastName">Nazwisko</label>
        <input
          type="text"
          id="lastName"
          v-model="lastName"
          required
          class="form-control"
          placeholder="Wprowadź swoje nazwisko"
        />
      </div>

      <div v-if="error" class="error-message">
        {{ error }}
      </div>

      <button type="submit" class="btn btn-primary" :disabled="loading || isButtonDisabled">
        {{ getButtonText }}
      </button>

      <div class="form-switch">
        <span>{{ isLogin ? "Nie masz konta?" : "Masz już konto?" }}</span>
        <button type="button" class="btn-link" @click="toggleForm">
          {{ isLogin ? 'Zarejestruj się' : 'Zaloguj się' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'LoginPage',
  data() {
    return {
      email: '',
      password: '',
      confirmPassword: '',
      firstName: '',
      lastName: '',
      error: null,
      loading: false,
      isLogin: true
    };
  },
  computed: {
    isPasswordsMatch() {
      return this.password === this.confirmPassword;
    },
    isButtonDisabled() {
      if (this.isLogin) {
        return this.loading || !this.email || !this.password;
      }

      return this.loading || !this.email || !this.password || !this.firstName || !this.lastName || !this.isPasswordsMatch;
    },
    getButtonText() {
      if (this.loading) {
        return this.isLogin ? 'Logowanie...' : 'Rejestracja...';
      }
      return this.isLogin ? 'Zaloguj się' : 'Zarejestruj się';
    }
  },
  methods: {
    ...mapActions('auth', ['login', 'register']),
    
    async handleSubmit() {
      if (!this.isLogin && !this.isPasswordsMatch) {
        this.error = 'Hasła nie są identyczne';
        return;
      }

      this.loading = true;
      this.error = null;
      
      try {
        let response;
        if (this.isLogin) {
          response = await this.login({
            email: this.email,
            password: this.password
          });
        } else {
          response = await this.register({
            email: this.email,
            password: this.password,
            firstName: this.firstName,
            lastName: this.lastName
          });
        }
        
        if (response.status === 201 || response.status === 200) {
          this.$router.push('/dashboard');
        } else {
          throw new Error('Nieoczekiwany status odpowiedzi');
        }
      } catch (error) {
        console.error('Error:', error);
        this.error = error.response?.data?.message || 
          (this.isLogin ? 'Logowanie nie powiodło się' : 'Rejestracja nie powiodła się');
      } finally {
        this.loading = false;
      }
    },

    toggleForm() {
      this.isLogin = !this.isLogin;
      this.error = null;
      this.email = '';
      this.password = '';
      this.confirmPassword = '';
    }
  }
};
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: start;
  min-height: 100vh;
  padding: 20px;
}

.login-form {
  width: 100%;
  max-width: 400px;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  background-color: white;
}

.form-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 15px;
  justify-content: center;
  align-items: center;
  margin-left: 12px;
  margin-right: 12px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
  align-self: flex-start;
}

.form-control {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

.form-control:focus {
  outline: none;
  border-color: #4CAF50;
  box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.1);
}

.btn {
  width: 100%;
  padding: 10px;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.2s;
  margin-top: 10px;
}

.btn-primary {
  background-color: #4CAF50;
  color: white;
}

.btn-primary:hover {
  background-color: #45a049;
}

.btn-primary:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.error-message {
  color: #dc3545;
  margin-bottom: 15px;
  padding: 10px;
  border-radius: 4px;
  background-color: #f8d7da;
  border: 1px solid #f5c6cb;
  text-align: center;
  width: calc(100% - 24px);
  margin-left: 12px;
  margin-right: 12px;
}

.form-switch {
  margin-top: 20px;
  text-align: center;
  color: #666;
}

.btn-link {
  background: none;
  border: none;
  color: #4CAF50;
  text-decoration: underline;
  cursor: pointer;
  font-size: 14px;
  padding: 0;
  margin-left: 5px;
}

.btn-link:hover {
  color: #45a049;
}
</style> 