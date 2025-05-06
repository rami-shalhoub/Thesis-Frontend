import axios, { AxiosResponse } from 'axios';
import { handleError } from './ErrorHandler';

// Define API base URL with proper protocol
const API_BASE_URL = 'http://localhost:5019/api/Auth';

// Define response types
export interface AuthResponse {
  token: string;
  refreshToken: string;
  expiresAt: string;
  userId: string;
  email: string;
  name: string;
  role: string;
}

export interface UserResponse {
  id: string;
  email: string;
  name: string;
  organisationID: string;
  role: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  organisationID: string;
  role: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface UpdateUserRequest {
  email?: string;
  name?: string;
  organisationID?: string;
}

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include the auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for global error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    handleError(error);
    return Promise.reject(error);
  }
);

// Auth API methods with proper typing and error handling
export const authApi = {
  // Register a new user
  register: async (data: RegisterRequest): Promise<AxiosResponse<AuthResponse>> => {
    try {
      return await api.post('/register', data);
    } catch (error) {
      handleError(error);
      throw error;
    }
  },

  // Login user
  login: async (data: LoginRequest): Promise<AxiosResponse<AuthResponse>> => {
    try {
      return await api.post('/login', data);
    } catch (error) {
      handleError(error);
      throw error;
    }
  },

  // Refresh authentication token
  refreshToken: async (data: RefreshTokenRequest): Promise<AxiosResponse<AuthResponse>> => {
    try {
      return await api.post('/refresh-token', data);
    } catch (error) {
      handleError(error);
      throw error;
    }
  },

  // Logout user
  logout: async (): Promise<AxiosResponse<void>> => {
    try {
      return await api.post('/logout');
    } catch (error) {
      handleError(error);
      throw error;
    }
  },

  // Update user information
  updateUser: async (id: string, data: UpdateUserRequest): Promise<AxiosResponse<UserResponse>> => {
    try {
      return await api.put(`/update/${id}`, data);
    } catch (error) {
      handleError(error);
      throw error;
    }
  },

  // Delete user
  deleteUser: async (id: string): Promise<AxiosResponse<void>> => {
    try {
      return await api.delete(`/delete/${id}`);
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
};
