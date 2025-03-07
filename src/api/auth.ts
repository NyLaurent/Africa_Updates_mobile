import { api } from '../lib/api';
import { User } from '../../types/user';

export interface LoginResponse {
  user: User;
  sessionToken: string;
  error?: string;
}

export interface SignUpResponse {
  user: User;
  sessionToken: string;
  error?: string;
}

export const authApi = {
  login: async (username: string, email: string, password: string): Promise<LoginResponse> => {
    try {
      const response = await api.post<LoginResponse>('/api/auth/mobile/login', {
        username,
        email,
        password
      });
      return response.data;
    } catch (error) {
      console.error('Login API error:', error);
      return {
        user: {} as User,
        sessionToken: '',
        error: error.response?.data?.error || 'Failed to login. Please check your credentials and try again.'
      };
    }
  },

  signUp: async (username: string, email: string, password: string): Promise<SignUpResponse> => {
    try {
      const response = await api.post<SignUpResponse>('/api/auth/mobile/signup', {
        username,
        email,
        password
      });
      return response.data;
    } catch (error) {
      console.error('Signup API error:', error);
      const errorMessage = error.response?.data?.error || 'Failed to create account. Please try again.';
      return {
        user: {} as User,
        sessionToken: '',
        error: errorMessage
      };
    }
  },

  logout: async (): Promise<void> => {
    await api.post('/api/auth/mobile/logout');
  },

  validateSession: async (): Promise<{ user: User }> => {
    const response = await api.get<{ user: User }>('/api/auth/mobile/validate-session');
    return response.data;
  },

  getMe: async (): Promise<{ user: User }> => {
    const response = await api.get<{ user: User }>('/api/auth/mobile/me');
    return response.data;
  }
}; 