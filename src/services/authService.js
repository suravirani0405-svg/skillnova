/**
 * SkillNova Real Backend Auth Service
 * Connects to the Node.js Express Server
 */

const API_BASE_URL = '/api';

// Safe JSON parser - prevents crash on empty/HTML responses
const safeJson = async (response) => {
  const text = await response.text();
  try {
    return JSON.parse(text);
  } catch (e) {
    console.error('[Auth] Non-JSON response:', text.substring(0, 200));
    throw new Error(`Server error (${response.status}): The backend returned an invalid response. Please try again.`);
  }
};

export const authService = {
  /**
   * Register a new user
   */
  async register(userData) {
    try {
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });

      const data = await safeJson(response);
      
      if (!response.ok) {
        throw new Error(data.message || "COMMUNICATION_LINK_ERROR");
      }

      // Store identity and secure token
      localStorage.setItem('skillnova_user', JSON.stringify(data.user));
      localStorage.setItem('skillnova_token', data.token);
      window.dispatchEvent(new Event("storage"));
      
      return data.user;
    } catch (error) {
      console.error("AI Scale Error:", error);
      throw error;
    }
  },

  /**
   * Login an existing user
   */
  async login(email, password) {
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await safeJson(response);

      if (!response.ok) {
        throw new Error(data.message || "AUTHENTICATION_FAILED");
      }

      // Set active session
      localStorage.setItem('skillnova_user', JSON.stringify(data.user));
      localStorage.setItem('skillnova_token', data.token);
      window.dispatchEvent(new Event("storage"));
      
      return data.user;
    } catch (error) {
      console.error("AI Uplink Error:", error);
      throw error;
    }
  },

  /**
   * Logout current user
   */
  logout() {
    localStorage.removeItem('skillnova_user');
    localStorage.removeItem('skillnova_token');
    window.dispatchEvent(new Event("storage"));
  },

  /**
   * Get current session
   */
  getCurrentUser() {
    const user = localStorage.getItem('skillnova_user');
    return user ? JSON.parse(user) : null;
  },

  /**
   * Update secure access pattern
   */
  async changePassword(email, oldPassword, newPassword) {
    try {
      const response = await fetch(`${API_BASE_URL}/change-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, oldPassword, newPassword })
      });

      const data = await safeJson(response);
      if (!response.ok) {
        throw new Error(data.message || "UPLINK_PATTERN_FAILED");
      }
      return data;
    } catch (error) {
      console.error("AI Scale Update Error:", error);
      throw error;
    }
  },

  async verifyPassword(email, password) {
    const response = await fetch(`${API_BASE_URL}/verify-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await safeJson(response);
    if (!response.ok) throw new Error(data.message);
    return data;
  },

  async sendVerification(email) {
    const response = await fetch(`${API_BASE_URL}/send-verification`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await safeJson(response);
    if (!response.ok) throw new Error(data.message);
    return data;
  },

  async verifyCode(email, code) {
    const response = await fetch(`${API_BASE_URL}/verify-code`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, code }),
    });
    const data = await safeJson(response);
    if (!response.ok) throw new Error(data.message);
    return data;
  },

  async updateProfile(email, newName) {
    const response = await fetch(`${API_BASE_URL}/update-profile`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, newName }),
    });
    const data = await safeJson(response);
    if (!response.ok) throw new Error(data.message);
    
    // Update local storage to persist the new id
    localStorage.setItem("skillnova_user", JSON.stringify(data.user));
    return data;
  },

  async resetPassword(email, code, newPassword) {
    const response = await fetch(`${API_BASE_URL}/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, code, newPassword }),
    });
    const data = await safeJson(response);
    if (!response.ok) throw new Error(data.message);
    return data;
  }
};
