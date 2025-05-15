const TOKEN_KEY = 'auth_token';
const USER_KEY = 'user_data';

// class responsible for interaction with local storage
class AuthService {
  static setAuthData(user, token) {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  static getToken() {
    return localStorage.getItem(TOKEN_KEY);
  }

  static getUser() {
    const userData = localStorage.getItem(USER_KEY);
    return userData ? JSON.parse(userData) : null;
  }

  static isAuthenticated() {
    return !!this.getToken();
  }

  static clearAuthData() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }

  static getAuthHeaders() {
    const token = this.getToken();
    return {
      'Authorization': token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json'
    };
  }
}

export default AuthService; 