import AuthService from '@/services/authService';
import axios from 'axios';

const state = {
  user: AuthService.getUser(),
  token: AuthService.getToken(),
  isAuthenticated: AuthService.isAuthenticated()
};

const mutations = {
  SET_USER(state, user) {
    state.user = user;
  },
  SET_TOKEN(state, token) {
    state.token = token;
  },
  SET_AUTHENTICATED(state, isAuthenticated) {
    state.isAuthenticated = isAuthenticated;
  },
  CLEAR_AUTH(state) {
    state.user = null;
    state.token = null;
    state.isAuthenticated = false;
  }
};

const actions = {
  async login({ commit }, credentials) {
    try {
      const response = await axios.post('/api/auth/login', credentials);
      const { user, token } = response.data;
      
      // saving to local storage
      AuthService.setAuthData(user, token);
      
      commit('SET_USER', user);
      commit('SET_TOKEN', token);
      commit('SET_AUTHENTICATED', true);
      
      return response;
    } catch (error) {
      throw error;
    }
  },

  async register({ commit }, userData) {
    try {
      const response = await axios.post('/api/auth/register', userData);
      console.log('Register response:', response);
      
      if (response.status === 201 || response.status === 200) {
        const { user, token } = response.data;
        
        if (!user || !token) {
          throw new Error('Invalid response data: missing user or token');
        }
        
        // saving to local storage
        AuthService.setAuthData(user, token);
        
        commit('SET_USER', user);
        commit('SET_TOKEN', token);
        commit('SET_AUTHENTICATED', true);
      }
      
      return response;
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  },

  async logout({ commit }) {
    try {
      await axios.post('/api/auth/logout', {}, {
        headers: AuthService.getAuthHeaders()
      });
      
      // clear Local Storage
      AuthService.clearAuthData();
      
      commit('CLEAR_AUTH');
    } catch (error) {
      throw error;
    }
  },

  async getProfile({ commit }) {
    try {
      const response = await axios.get('/api/auth/profile', {
        headers: AuthService.getAuthHeaders()
      });
      
      const user = response.data;
      
      // update Local Storage
      AuthService.setAuthData(user, state.token);
      
      commit('SET_USER', user);
      
      return response;
    } catch (error) {
      throw error;
    }
  }
};

const getters = {
  isAuthenticated: state => state.isAuthenticated,
  currentUser: state => state.user,
  authToken: state => state.token
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}; 
