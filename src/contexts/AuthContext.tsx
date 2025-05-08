import React, { createContext, useState, useEffect, useContext } from 'react';
import { authApi, AuthResponse, UpdateUserRequest } from '../APIs/AuthAPI';
import { useErrorHandler } from '../APIs/ErrorHandler';

interface AuthContextType {
   isAuthenticated: boolean;
   user: {
      userId: string;
      email: string;
      name: string;
      role: string;
      organisationID: string;
   } | null;
   login: (email: string, password: string) => Promise<void>;
   register: (email: string, password: string, name: string, organisationID: string, role: string) => Promise<void>;
   logout: () => Promise<void>;
   updateUser: (id: string, data: UpdateUserRequest) => Promise<void>;
   deleteUser: (id: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
   const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
   const [user, setUser] = useState<AuthContextType['user']>(null);
   const [refreshTimerId, setRefreshTimerId] = useState<NodeJS.Timeout | null>(null);
   const { showToast, ErrorToastComponent } = useErrorHandler();

   // Function to save auth data to localStorage and state
   const saveAuthData = (data: AuthResponse) => {
      // Debug the response data to see what's being received
      console.log('Auth response data:', data);
      
      // Handle different possible token property names
      const token = data.token || data.accessToken;
      if (token) {
         localStorage.setItem('token', token);
      } else {
         console.error('Token is missing in the response');
      }
      
      // Handle different possible userId property names
      const userId = data.userId || data.userID || data.id;
      if (userId) {
         localStorage.setItem('userId', userId);
      } else {
         console.error('User ID is missing in the response');
      }
      
      // Handle refreshToken
      if (data.refreshToken) {
         localStorage.setItem('refreshToken', data.refreshToken);
      }
      
      // Handle expiry time
      if (data.tokenExpiry || data.expiresAt) {
         localStorage.setItem('expiresAt', data.tokenExpiry || data.expiresAt || '');
      }
      
      // Handle email
      if (data.email) {
         localStorage.setItem('email', data.email);
      }
      
      // Handle name
      if (data.name) {
         localStorage.setItem('name', data.name);
      }
      
      // Handle role
      if (data.role) {
         localStorage.setItem('role', data.role);
      }
      
      // Handle organization ID with different possible spellings
      const orgId = data.organisationID || data.organizationID || '';
      localStorage.setItem('organisationID', orgId);

      // Only set user and authentication state if we have the essential data
      if (userId && data.email && data.name && data.role) {
         setUser({
            userId,
            email: data.email,
            name: data.name,
            role: data.role,
            organisationID: orgId
         });
         setIsAuthenticated(true);
      } else {
         console.error('Missing essential user data in the response');
      }
   };

   // Function to clear auth data from localStorage and state
   const clearAuthData = () => {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('expiresAt');
      localStorage.removeItem('userId');
      localStorage.removeItem('email');
      localStorage.removeItem('name');
      localStorage.removeItem('role');
      localStorage.removeItem('organisationID');

      setUser(null);
      setIsAuthenticated(false);

      // Clear any existing refresh timer
      if (refreshTimerId) {
         clearInterval(refreshTimerId);
         setRefreshTimerId(null);
      }
   };

   // Function to set up token refresh - refresh every 120 minutes
   const setupTokenRefresh = () => {
      // Clear any existing refresh timer
      if (refreshTimerId) {
         clearInterval(refreshTimerId);
      }

      // Refresh token every 120 minutes (access token expiration time)
      const refreshInterval = 120 * 60 * 1000; // 120 minutes in milliseconds
      
      // Set timer to refresh token
      const timerId = setInterval(() => {
         refreshAuthToken();
      }, refreshInterval);

      setRefreshTimerId(timerId as unknown as NodeJS.Timeout);
   };

   // Function to refresh the auth token
   const refreshAuthToken = async () => {
      const refreshToken = localStorage.getItem('refreshToken');

      if (!refreshToken) {
         clearAuthData();
         return;
      }

      try {
         const response = await authApi.refreshToken({ refreshToken });
         saveAuthData(response.data);
      } catch (error) {
         console.error('Failed to refresh token:', error);
         clearAuthData();
      }
   };

   // Check for existing token on app load
   useEffect(() => {
      const token = localStorage.getItem('token');
      const refreshToken = localStorage.getItem('refreshToken');
      const userId = localStorage.getItem('userId');
      const email = localStorage.getItem('email');
      const name = localStorage.getItem('name');
      const role = localStorage.getItem('role');
      const organisationID = localStorage.getItem('organisationID');

      if (token && refreshToken && userId && email && name && role) {
         // Set up auth state
         setUser({
            userId,
            email,
            name,
            role,
            organisationID: organisationID || ''
         });
         setIsAuthenticated(true);
         
         // Set up refresh timer
         setupTokenRefresh();
      }

      // Cleanup function to clear any timers when component unmounts
      return () => {
         if (refreshTimerId) {
            clearInterval(refreshTimerId);
         }
      };
   }, []);

   // Login function
   const login = async (email: string, password: string) => {
      try {
         const response = await authApi.login({ email, password });
         
         // Log the full response to debug
         console.log('Login response:', response);
         
         // Save the auth data
         saveAuthData(response.data);
         
         // Verify token was saved correctly
         const savedToken = localStorage.getItem('token');
         console.log('Saved token:', savedToken);
         
         setupTokenRefresh();
         showToast('Login successful');
      } catch (error) {
         console.error('Login failed:', error);
         throw error;
      }
   };

   // Register function
   const register = async (email: string, password: string, name: string, organisationID: string, role: string) => {
      try {
         const response = await authApi.register({ email, password, name, organisationID, role });
         saveAuthData(response.data);
         setupTokenRefresh();
         showToast('Registration successful');
      } catch (error) {
         console.error('Registration failed:', error);
         throw error;
      }
   };

   // Logout function
   const logout = async () => {
      try {
         await authApi.logout();
         clearAuthData();
         showToast('Logged out successfully');
      } catch (error) {
         console.error('Logout failed:', error);
         // Still clear auth data even if API call fails
         clearAuthData();
         throw error;
      }
   };

   // Update user function
   const updateUser = async (id: string, data: UpdateUserRequest) => {
      try {
         await authApi.updateUser(id, data);

         // Update local user data
         if (user) {
            setUser({
               ...user,
               name: data.name || user.name,
               email: data.email || user.email,
               organisationID: data.organisationID || user.organisationID
            });
         }

         showToast('User information updated successfully');
      } catch (error) {
         console.error('Update user failed:', error);
         throw error;
      }
   };

   // Delete user function
   const deleteUser = async (id: string) => {
      try {
         await authApi.deleteUser(id);
         clearAuthData();
         showToast('Account deleted successfully');
      } catch (error) {
         console.error('Delete user failed:', error);
         throw error;
      }
   };

   return (
      <AuthContext.Provider
         value={{
            isAuthenticated,
            user,
            login,
            register,
            logout,
            updateUser,
            deleteUser
         }}
      >
         {children}
         <ErrorToastComponent />
      </AuthContext.Provider>
   );
};

export const useAuth = () => {
   const context = useContext(AuthContext);
   if (!context) {
      throw new Error('useAuth must be used within an AuthProvider');
   }
   return context;
};
