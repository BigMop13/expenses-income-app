import axios from 'axios';
import AuthService from './authService';

// Add auth token to requests
axios.interceptors.request.use(config => {
  const token = AuthService.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default {
  async getTransactions() {
    const response = await axios.get('/api/transactions/get');
    return response.data;
  },

  async addTransaction(transaction) {
    const response = await axios.post('/api/transactions/add', transaction);
    return response.data;
  },
  
  async getDashboardStats() {
    const response = await axios.get('/api/transactions/stats');
    return response.data;
  }
}; 