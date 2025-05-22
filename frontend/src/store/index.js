import { createStore } from 'vuex';
import axios from 'axios';
import auth from './modules/auth';

// Configure axios
axios.defaults.baseURL = 'http://localhost:3000'; // Adjust this to match your backend URL

export default createStore({
  modules: {
    auth
  }
}); 