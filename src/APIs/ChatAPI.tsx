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

// Chat API methods with proper typing and error handling
export const chatApi = {
  // Create a new chat session
  createSession: async (userId: string): Promise<AxiosResponse<Session>> => {
    try {
      return await api.post('/session', { userId });
    } catch (error) {
      handleError(error);
      throw error;
    }
  },

  // Get a specific session by ID
  getSession: async (sessionId: string): Promise<AxiosResponse<SessionResponse>> => {
    try {
      return await api.get(`/session/${sessionId}`);
    } catch (error) {
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
      return await api.post(`/session/${sessionId}/messages`, { prompt });
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
};
