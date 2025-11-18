// API Service for SafeLinkEdu Frontend Integration
// Copy this file to your frontend project's services/ directory

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Generic request method
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // URL Scanning Methods
  async scanUrl(url) {
    return this.request('/api/scan', {
      method: 'POST',
      body: JSON.stringify({ url }),
    });
  }

  async getScanHistory(limit = 10, offset = 0) {
    return this.request(`/api/scan/history?limit=${limit}&offset=${offset}`);
  }

  async getPublicStats() {
    return this.request('/api/scan/stats');
  }

  // Authentication Methods
  async login(email, password) {
    const response = await this.request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (response.success && response.token) {
      localStorage.setItem('safelinkedu_token', response.token);
      localStorage.setItem('safelinkedu_user', JSON.stringify(response.user));
    }

    return response;
  }

  async verifyToken(token) {
    return this.request('/api/auth/verify', {
      method: 'POST',
      body: JSON.stringify({ token }),
    });
  }

  async logout() {
    localStorage.removeItem('safelinkedu_token');
    localStorage.removeItem('safelinkedu_user');
  }

  async createAdminUser(email, password) {
    return this.request('/api/auth/setup', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  // Admin Dashboard Methods (require authentication)
  async getDashboardData() {
    return this.request('/api/admin/dashboard', {
      headers: {
        ...this.getAuthHeaders(),
      },
    });
  }

  async getAllScans(limit = 20, offset = 0, status = null) {
    let url = `/api/admin/scans?limit=${limit}&offset=${offset}`;
    if (status) {
      url += `&status=${status}`;
    }

    return this.request(url, {
      headers: {
        ...this.getAuthHeaders(),
      },
    });
  }

  async getScanDetails(scanId) {
    return this.request(`/api/admin/scans/${scanId}`, {
      headers: {
        ...this.getAuthHeaders(),
      },
    });
  }

  async deleteScan(scanId) {
    return this.request(`/api/admin/scans/${scanId}`, {
      method: 'DELETE',
      headers: {
        ...this.getAuthHeaders(),
      },
    });
  }

  async getDetailedStats(days = 30) {
    return this.request(`/api/admin/stats?days=${days}`, {
      headers: {
        ...this.getAuthHeaders(),
      },
    });
  }

  // Helper Methods
  getAuthHeaders() {
    const token = localStorage.getItem('safelinkedu_token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  isAuthenticated() {
    const token = localStorage.getItem('safelinkedu_token');
    const user = localStorage.getItem('safelinkedu_user');
    return !!(token && user);
  }

  getCurrentUser() {
    const user = localStorage.getItem('safelinkedu_user');
    return user ? JSON.parse(user) : null;
  }

  // Health check
  async healthCheck() {
    return this.request('/health');
  }
}

// Create singleton instance
const apiService = new ApiService();

export default apiService;

// React Hook for API calls (if using React)
export const useApi = () => {
  return apiService;
};

// Example usage in React components:

/*
// Scanning a URL
const handleScan = async (url) => {
  try {
    const result = await apiService.scanUrl(url);
    console.log('Scan result:', result.data);
    setScanResult(result.data);
  } catch (error) {
    console.error('Scan failed:', error);
    setError(error.message);
  }
};

// Admin login
const handleLogin = async (email, password) => {
  try {
    const result = await apiService.login(email, password);
    if (result.success) {
      // Redirect to admin dashboard
      window.location.href = '/admin';
    }
  } catch (error) {
    console.error('Login failed:', error);
  }
};

// Getting dashboard data
const loadDashboardData = async () => {
  try {
    const data = await apiService.getDashboardData();
    setDashboardData(data.data);
  } catch (error) {
    console.error('Failed to load dashboard:', error);
  }
};
*/
