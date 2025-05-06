import axios, { AxiosResponse } from 'axios';
import { handleError } from './ErrorHandler';

// Define API base URL with proper protocol
const API_BASE_URL = 'http://localhost:5019/api/Auth';

// Define response types
export interface AuthResponse {
   // The backend might be using different property names
   // Adding potential alternative property names with optional flags
   token?: string;
   accessToken?: string; // Alternative name that might be used by backend
   userId?: string;
   userID?: string; // Alternative name with different casing
   id?: string; // Another possible alternative
   name?: string;
   email?: string;
   role?: string;
   organisationID?: string;
   organizationID?: string; // Alternative spelling
   refreshToken?: string;
   tokenExpiry?: string;
   expiresAt?: string; // Alternative name
}

export interface UserResponse {
   userId: string;
   email: string;
   name: string;
   role: string;
   organisationID: string;
}

export interface RegisterRequest {
   name: string;
   email: string;
   password: string;
   role: string;
   organisationID: string;
}

export interface LoginRequest {
   email: string;
   password: string;
}

export interface RefreshTokenRequest {
   refreshToken: string;
}

export interface UpdateUserRequest {
   email: string;
   name: string;
   organisationID: string;
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
      
      // Debug token being used in requests
      console.log('Using token for request:', token);
      
      if (token) {
         config.headers.Authorization = `Bearer ${token}`;
      } else {
         console.warn('No token found in localStorage for API request');
      }
      return config;
   },
   (error) => {
      console.error('Request interceptor error:', error);
      return Promise.reject(error);
   }
);

// Add response interceptor for global error handling
api.interceptors.response.use(
   (response) => {
      // Log successful responses for debugging
      console.log(`API Response [${response.config.method?.toUpperCase()}] ${response.config.url}:`, response.status);
      return response;
   },
   async (error) => {
      // Check if error is due to token expiration (401 Unauthorized)
      if (error.response && error.response.status === 401) {
         console.warn('Received 401 Unauthorized response, attempting to refresh token');
         
         // Try to refresh the token
         const refreshToken = localStorage.getItem('refreshToken');
         if (refreshToken) {
            try {
               // Get the original request config
               const originalRequest = error.config;
               
               // Call refresh token API
               const response = await axios.post(`${API_BASE_URL}/refresh-token`, { refreshToken });
               
               // Update tokens in localStorage
               if (response.data.token) {
                  localStorage.setItem('token', response.data.token);
                  localStorage.setItem('refreshToken', response.data.refreshToken);
                  
                  // Update the Authorization header with the new token
                  originalRequest.headers.Authorization = `Bearer ${response.data.token}`;
                  
                  // Retry the original request with the new token
                  return axios(originalRequest);
               }
            } catch (refreshError) {
               console.error('Token refresh failed:', refreshError);
               // If refresh fails, redirect to login
               window.location.href = '/login';
            }
         } else {
            console.error('No refresh token available');
            // Redirect to login if no refresh token
            window.location.href = '/login';
         }
      }
      
      // Handle other errors
      handleError(error);
      return Promise.reject(error);
   }
);

// Auth API methods with proper typing and error handling
export const authApi = {
   // Register a new user
   register: async (data: RegisterRequest): Promise<AxiosResponse<AuthResponse>> => {
      try {
         console.log('Registering user:', data.email);
         const response = await api.post('/register', data);
         console.log('Registration response:', response.data);
         return response;
      } catch (error) {
         console.error('Registration error:', error);
         handleError(error);
         throw error;
      }
   },

   // Login user
   login: async (data: LoginRequest): Promise<AxiosResponse<AuthResponse>> => {
      try {
         console.log('Logging in user:', data.email);
         const response = await api.post('/login', data);
         console.log('Login response data:', response.data);
         return response;
      } catch (error) {
         console.error('Login error:', error);
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
         console.log('Updating user:', id, data);
         // Check if token exists before making the request
         const token = localStorage.getItem('token');
         if (!token) {
            console.error('No token available for updateUser request');
            throw new Error('Authentication token is missing. Please log in again.');
         }
         
         const response = await api.put(`/update/${id}`, data);
         console.log('Update user response:', response.data);
         return response;
      } catch (error) {
         console.error('Update user error:', error);
         handleError(error);
         throw error;
      }
   },

   // Delete user
   deleteUser: async (id: string): Promise<AxiosResponse<void>> => {
      try {
         console.log('Deleting user:', id);
         // Check if token exists before making the request
         const token = localStorage.getItem('token');
         if (!token) {
            console.error('No token available for deleteUser request');
            throw new Error('Authentication token is missing. Please log in again.');
         }
         
         const response = await api.delete(`/delete/${id}`);
         console.log('Delete user response:', response.status);
         return response;
      } catch (error) {
         console.error('Delete user error:', error);
         handleError(error);
         throw error;
      }
   },
};
