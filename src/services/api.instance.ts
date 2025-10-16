/**
 * Axios Instance Configuration
 * Centralized HTTP client with interceptors and error handling
 */

import axios from 'axios';
import type { AxiosResponse } from 'axios';
import { API_CONFIG } from './api.config';

// Create axios instance with default config
export const apiInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding common headers or logging
// Request interceptor
apiInstance.interceptors.request.use(
  config => {
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiInstance.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    return Promise.reject(error);
  }
);

// Type definitions for API responses
export interface ApiResponse<T = unknown> {
  status: number;
  success: boolean;
  message: string;
  data: T | null;
}

export interface ApiError {
  status: number;
  success: false;
  message: string;
  data: null;
}

// Helper function to extract data from API response
export const extractData = <T>(response: AxiosResponse<ApiResponse<T>>): T => {
  if (!response.data.success) {
    throw new Error(response.data.message);
  }
  return response.data.data as T;
};
