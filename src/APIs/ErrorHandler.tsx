import { IonToast } from "@ionic/react";
import axios, { AxiosError } from "axios";
import React, { useState } from "react";

// Define error response types
export interface ApiErrorResponse {
  errors?: string[] | Record<string, string[]>;
  message?: string;
  error?: string;
}

// Toast component that can be used across the application
export const ErrorToast: React.FC<{
  isOpen: boolean;
  message: string;
  onDidDismiss: () => void;
}> = ({ isOpen, message, onDidDismiss }) => {
  return (
    <IonToast
      isOpen={isOpen}
      message={message}
      duration={3000}
      position="top"
      color="danger"
      buttons={[
        {
          text: 'Dismiss',
          role: 'cancel',
          handler: onDidDismiss
        }
      ]}
      onDidDismiss={onDidDismiss}
    />
  );
};

// Hook to manage error state and toast display
export const useErrorHandler = () => {
  const [isToastOpen, setIsToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const showToast = (message: string) => {
    setToastMessage(message);
    setIsToastOpen(true);
  };

  const hideToast = () => {
    setIsToastOpen(false);
  };

  const handleError = (error: unknown) => {
    if (axios.isAxiosError(error)) {
      const err = error as AxiosError<ApiErrorResponse>;
      const response = err.response;
      
      // Log the full error for debugging
      console.error("Axios Error in useErrorHandler:", {
        status: response?.status,
        statusText: response?.statusText,
        data: response?.data,
        headers: response?.headers,
        config: err.config
      });

      // Handle different error formats
      if (Array.isArray(response?.data?.errors)) {
        showToast(response.data.errors[0] || "An error occurred");
      } else if (typeof response?.data?.errors === "object" && response?.data?.errors !== null) {
        const errorObj = response.data.errors as Record<string, string[]>;
        const firstErrorKey = Object.keys(errorObj)[0];
        if (firstErrorKey && Array.isArray(errorObj[firstErrorKey])) {
          showToast(errorObj[firstErrorKey][0] || "An error occurred");
        } else {
          showToast("Validation error occurred");
        }
      } else if (response?.data?.message) {
        showToast(response.data.message);
      } else if (response?.data?.error) {
        showToast(response.data.error);
      } else if (typeof response?.data === "string") {
        showToast(response.data);
      } else if (response?.status === 401) {
        // Check if token exists but is invalid/expired
        const token = localStorage.getItem('token');
        if (token) {
          showToast("Your session has expired. Please login again");
          
          // Clear only the token but keep the refresh token for potential auto-refresh
          localStorage.removeItem('token');
        } else {
          showToast("Authentication required. Please login to continue");
        }
        
        // Only redirect if we're not already on the login page
        if (!window.location.pathname.includes('login')) {
          window.history.pushState({}, "LoginPage", "/login");
        }
      } else if (response?.status === 403) {
        showToast("You don't have permission to perform this action");
      } else if (response?.status === 404) {
        showToast("Resource not found");
      } else if (response?.status === 500) {
        showToast("Server error. Please try again later");
      } else {
        showToast(error.message || "An unexpected error occurred");
      }
    } else if (error instanceof Error) {
      console.error("Non-Axios Error in useErrorHandler:", error);
      showToast(error.message);
    } else {
      console.error("Unknown Error Type in useErrorHandler:", error);
      showToast("An unexpected error occurred");
    }

    // Return the error for further handling if needed
    return error;
  };

  // Toast component to be rendered in the component
  const ErrorToastComponent = () => (
    <ErrorToast
      isOpen={isToastOpen}
      message={toastMessage}
      onDidDismiss={hideToast}
    />
  );

  return {
    handleError,
    ErrorToastComponent,
    showToast,
    hideToast,
    isToastOpen,
    toastMessage
  };
};

// Simple error handler function for non-component contexts
export const handleError = (error: unknown): string => {
  let errorMessage = "An unexpected error occurred";
  
  if (axios.isAxiosError(error)) {
    const err = error as AxiosError<ApiErrorResponse>;
    const response = err.response;
    
    // Log the full error for debugging
    console.error("Axios Error:", {
      status: response?.status,
      statusText: response?.statusText,
      data: response?.data,
      headers: response?.headers,
      config: err.config
    });

    if (Array.isArray(response?.data?.errors) && response.data.errors.length > 0) {
      errorMessage = response.data.errors[0];
    } else if (typeof response?.data?.errors === "object" && response?.data?.errors !== null) {
      const errorObj = response.data.errors as Record<string, string[]>;
      const firstErrorKey = Object.keys(errorObj)[0];
      if (firstErrorKey && Array.isArray(errorObj[firstErrorKey])) {
        errorMessage = errorObj[firstErrorKey][0];
      } else {
        errorMessage = "Validation error occurred";
      }
    } else if (response?.data?.message) {
      errorMessage = response.data.message;
    } else if (response?.data?.error) {
      errorMessage = response.data.error;
    } else if (typeof response?.data === "string") {
      errorMessage = response.data;
    } else if (response?.status === 401) {
      errorMessage = "Authentication required. Please login to continue";
      
      // Check if token exists but is invalid/expired
      const token = localStorage.getItem('token');
      if (token) {
        errorMessage = "Your session has expired. Please login again";
        
        // Clear only the token but keep the refresh token for potential auto-refresh
        localStorage.removeItem('token');
      }
      
      // Only redirect if we're not already on the login page
      if (!window.location.pathname.includes('login')) {
        window.history.pushState({}, "LoginPage", "/login");
      }
    } else if (response?.status === 403) {
      errorMessage = "You don't have permission to perform this action";
    } else if (response?.status === 404) {
      errorMessage = "Resource not found";
    } else if (response?.status === 500) {
      errorMessage = "Server error. Please try again later";
    } else {
      errorMessage = error.message || "An unexpected error occurred";
    }
  } else if (error instanceof Error) {
    console.error("Non-Axios Error:", error);
    errorMessage = error.message;
  } else {
    console.error("Unknown Error Type:", error);
  }

  console.error("API Error:", errorMessage);
  return errorMessage;
};
