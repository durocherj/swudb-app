import { apiClient } from './client';

// User data structure from SWUDB API
export interface SwudbUser {
  userId: string;
  userName: string;
  email: string;
  roles: string[];
  givenName: string;
  familyName: string;
  ffgUserId: string;
  pronouns: string;
  patreonTier: string | null;
}

// Login request body
interface LoginRequest {
  username: string;
  password: string;
}

// Login response (the API sets a session cookie)
interface LoginResponse {
  success: boolean;
  message?: string;
}

export const authApi = {
  // Login with username and password
  async login(username: string, password: string): Promise<{ success: boolean; user?: SwudbUser; error?: string }> {
    try {
      // Call the login endpoint
      await apiClient.post<LoginResponse>('/auth/login', {
        username,
        password,
      });

      // If login successful, get user data
      const user = await this.getUser();
      if (user) {
        return { success: true, user };
      }
      
      return { success: false, error: 'Login failed' };
    } catch (error: any) {
      // Check for specific error messages
      if (error.response?.status === 401) {
        return { success: false, error: 'Invalid username or password' };
      }
      return { success: false, error: 'Network error. Please try again.' };
    }
  },

  // Get current logged in user
  async getUser(): Promise<SwudbUser | null> {
    try {
      const user = await apiClient.get<SwudbUser>('/auth/getUser');
      return user;
    } catch (error) {
      // Not logged in or session expired
      return null;
    }
  },

  // Logout (clear session)
  async logout(): Promise<void> {
    try {
      // Try to call logout endpoint if it exists
      await apiClient.post('/auth/logout', {});
    } catch (error) {
      // Ignore errors - we'll clear local state anyway
    }
  },
};







