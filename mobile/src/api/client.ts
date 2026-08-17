import axios from 'axios';
import { Platform } from 'react-native';
import { useAuthStore } from '../store/useAuthStore';


// const API_URL = 'https://ecom-app-s20s.onrender.com/api'; //production
const API_URL = 'http://192.168.17.222:3000/api';


const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 15000,
});

// Request interceptor — attaches auth headers
apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor — centralised error logging
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Use warn instead of error to prevent Expo red-screens for handled API errors
    console.warn('[API Error]', error?.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const fetchProducts = async (params: Record<string, any> = {}) => {
  const response = await apiClient.get('/products', { params });
  return response.data;
};

export const fetchProductById = async (id: string | string[]) => {
  const response = await apiClient.get(`/products/${id}`);
  return response.data;
};

export default apiClient;
