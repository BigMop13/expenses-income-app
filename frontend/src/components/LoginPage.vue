<template>
  <div class="login-container">
    <form @submit.prevent="handleSubmit" class="login-form">
      <h2>{{ isLogin ? 'Login' : 'Register' }}</h2>
      
      <div class="form-group">
        <label for="email">Email</label>
        <input
          type="email"
          id="email"
          v-model="email"
          required
          class="form-control"
          placeholder="Enter your email"
        />
      </div>

      <div class="form-group">
        <label for="password">Password</label>
        <input
          type="password"
          id="password"
          v-model="password"
          required
          class="form-control"
          placeholder="Enter your password"
        />
      </div>

      <!-- Confirm Password field for registration -->
      <div v-if="!isLogin" class="form-group">
        <label for="confirmPassword">Confirm Password</label>
        <input
          type="password"
          id="confirmPassword"
          v-model="confirmPassword"
          required
          class="form-control"
          placeholder="Confirm your password"
        />
      </div>

      <!-- First Name field for registration -->
      <div v-if="!isLogin" class="form-group">
        <label for="firstName">First Name</label>
        <input
          type="text"
          id="firstName"
          v-model="firstName"
          required
          class="form-control"
          placeholder="Enter your first name"
        />
      </div>

      <!-- Last Name field for registration -->
      <div v-if="!isLogin" class="form-group">
        <label for="lastName">Last Name</label>
        <input
          type="text"
          id="lastName"
          v-model="lastName"
          required
          class="form-control"
          placeholder="Enter your last name"
        />
      </div>

      <div v-if="error" class="error-message">
        {{ error }}
      </div>

      <button type="submit" class="btn btn-primary" :disabled="loading || isButtonDisabled">
        {{ getButtonText }}
      </button>

      <div class="form-switch">
        <span>{{ isLogin ? "Don't have an account?" : "Already have an account?" }}</span>
        <button type="button" class="btn-link" @click="toggleForm">
          {{ isLogin ? 'Register here' : 'Login here' }}
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
        return this.isLogin ? 'Logging in...' : 'Registering...';
      }
      return this.isLogin ? 'Login' : 'Register';
    }
  },
  methods: {
    ...mapActions('auth', ['login', 'register']),
    
    async handleSubmit() {
      console.log('submit', this.email, this.password, this.firstName, this.lastName);
      if (!this.isLogin && !this.isPasswordsMatch) {
        this.error = 'Passwords do not match';
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
        
        console.log('Response:', response);
        
        if (response.status === 201 || response.status === 200) {
          // Redirect to dashboard or home page
          this.$router.push('/dashboard');
        } else {
          throw new Error('Unexpected response status');
        }
      } catch (error) {
        console.error('Error:', error);
        this.error = error.response?.data?.message || 
          (this.isLogin ? 'Login failed' : 'Registration failed');
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