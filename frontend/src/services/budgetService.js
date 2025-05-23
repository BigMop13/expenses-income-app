import axios from 'axios';

// Interceptor dodający token JWT do każdego żądania
axios.interceptors.request.use(config => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default {
  async getBudgets() {
    const res = await axios.get('/api/budgets/get');
    return res.data;
  },
  async addBudget(budget) {
    const res = await axios.post('/api/budgets/add', budget);
    return res.data;
  }
} 