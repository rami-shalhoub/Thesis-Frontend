import axios, { AxiosResponse } from 'axios';
import { handleError } from './ErrorHandler';

// Define API base URL with proper protocol
const API_BASE_URL = 'http://localhost:5019/api/ai';

// Define response types
export interface Session {
   id: string;
   userId: string;
   createdAt: string;
   updatedAt: string;
   isActive: boolean;
}

export interface Message {
   id: string;
   sessionId: string;
   content: string;
   role: 'user' | 'assistant';
   createdAt: string;
}

export interface SessionResponse {
   session: Session;
   messages: Message[];
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

      // Only log token in development environment
      if (process.env.NODE_ENV === 'development') {
         // Uncomment for debugging
         // console.log('Using token for Chat API request:', token);
      }

      if (token) {
         config.headers.Authorization = `Bearer ${token}`;
      } else {
         console.warn('No token found in localStorage for Chat API request');
      }
      return config;
   },
   (error) => {
      console.error('Chat API request interceptor error:', error);
      return Promise.reject(error);
   }
);

// Add response interceptor for global error handling
api.interceptors.response.use(
   (response) => {
      // Only log responses in development environment
      if (process.env.NODE_ENV === 'development') {
         // Uncomment for debugging
         // console.log(`Chat API Response [${response.config.method?.toUpperCase()}] ${response.config.url}:`, response.status);
      }
      return response;
   },
   async (error) => {
      // Check if error is due to token expiration (401 Unauthorized)
      if (error.response && error.response.status === 401) {
         console.warn('Received 401 Unauthorized response in Chat API, attempting to refresh token');

         // Try to refresh the token
         const refreshToken = localStorage.getItem('refreshToken');
         if (refreshToken) {
            try {
               // Get the original request config
               const originalRequest = error.config;

               // Call refresh token API
               const response = await axios.post(`http://localhost:5019/api/Auth/refresh-token`, { refreshToken });

               // Update tokens in localStorage
               if (response.data.token || response.data.accessToken) {
                  const newToken = response.data.token || response.data.accessToken;
                  localStorage.setItem('token', newToken);
                  if (response.data.refreshToken) {
                     localStorage.setItem('refreshToken', response.data.refreshToken);
                  }

                  // Update the Authorization header with the new token
                  originalRequest.headers.Authorization = `Bearer ${newToken}`;

                  // Retry the original request with the new token
                  return axios(originalRequest);
               }
            } catch (refreshError) {
               console.error('Token refresh failed in Chat API:', refreshError);
               // If refresh fails, redirect to login
               window.location.href = '/login';
            }
         } else {
            console.error('No refresh token available for Chat API');
            // Redirect to login if no refresh token
            window.location.href = '/login';
         }
      }

      // Handle other errors
      handleError(error);
      return Promise.reject(error);
   }
);

// Chat API methods with proper typing and error handling
export const chatApi = {
   // Create a new chat session
   createSession: async (userId: string): Promise<AxiosResponse<Session>> => {
      try {
         // Only log in development environment
         if (process.env.NODE_ENV === 'development') {
            // console.log('Creating chat session for user:', userId);
         }

         // Check if token exists before making the request
         const token = localStorage.getItem('token');
         if (!token) {
            console.error('No token available for createSession request');
            throw new Error('Authentication token is missing. Please log in again.');
         }

         // Send userId as a query parameter instead of in the request body
         const response = await api.post(`/session?userId=${userId}`);
         
         // Only log in development environment
         if (process.env.NODE_ENV === 'development') {
            // console.log('Create session response:', response.data);
         }
         
         return response;
      } catch (error) {
         console.error('Create session error:', error);
         handleError(error);
         throw error;
      }
   },

   // Get a specific session by ID
   getSession: async (sessionId: string): Promise<AxiosResponse<SessionResponse>> => {
      try {
         // Only log in development environment
         if (process.env.NODE_ENV === 'development') {
            // console.log('Getting chat session:', sessionId);
         }

         // Check if token exists before making the request
         const token = localStorage.getItem('token');
         if (!token) {
            console.error('No token available for getSession request');
            throw new Error('Authentication token is missing. Please log in again.');
         }

         const response = await api.get(`/session/${sessionId}`);
         
         // Only log in development environment
         if (process.env.NODE_ENV === 'development') {
            // console.log('Get session response:', response.data);
         }
         
         return response;
      } catch (error) {
         console.error('Get session error:', error);
         handleError(error);
         throw error;
      }
   },

   // Get all sessions for a user
   getAllSessions: async (userId: string): Promise<AxiosResponse<Session[]>> => {
      try {
         return await api.get('/sessions', { params: { userId } });
      } catch (error) {
         handleError(error);
         throw error;
      }
   },

   // Close a session (mark as inactive)
   closeSession: async (sessionId: string): Promise<AxiosResponse<Session>> => {
      try {
         return await api.post(`/session/${sessionId}/close`);
      } catch (error) {
         handleError(error);
         throw error;
      }
   },

   // Delete a specific session
   deleteSession: async (sessionId: string): Promise<AxiosResponse<void>> => {
      try {
         return await api.delete(`/session/${sessionId}`);
      } catch (error) {
         handleError(error);
         throw error;
      }
   },

   // Delete all sessions for a user
   deleteAllSessions: async (userId: string): Promise<AxiosResponse<void>> => {
      try {
         return await api.delete('/sessions', { params: { userId } });
      } catch (error) {
         handleError(error);
         throw error;
      }
   },

   // Send a message in a session
   sendMessage: async (sessionId: string, prompt: string): Promise<AxiosResponse<Message>> => {
      try {
         // Only log in development environment
         if (process.env.NODE_ENV === 'development') {
            // console.log('Sending message in session:', sessionId, 'Prompt:', prompt);
         }

         // Check if token exists before making the request
         const token = localStorage.getItem('token');
         if (!token) {
            console.error('No token available for sendMessage request');
            throw new Error('Authentication token is missing. Please log in again.');
         }

         const response = await api.post(`/session/${sessionId}/messages`, { prompt });
         
         // Only log in development environment
         if (process.env.NODE_ENV === 'development') {
            // console.log('Send message response:', response.data);
         }
         
         return response;
      } catch (error) {
         console.error('Send message error:', error);
         handleError(error);
         throw error;
      }
   },
};
