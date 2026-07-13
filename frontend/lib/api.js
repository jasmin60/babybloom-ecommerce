import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = Cookies.get('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auto-refresh access token on 401 using the SimpleJWT refresh route
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refresh = Cookies.get('refresh_token');
      if (refresh) {
        try {
          // Pointed directly to your SimpleJWT token refresh node
          const { data } = await axios.post(`${API_URL}/login/refresh/`, { refresh });
          Cookies.set('access_token', data.access, { expires: 1 });
          originalRequest.headers.Authorization = `Bearer ${data.access}`;
          return api(originalRequest);
        } catch (err) {
          Cookies.remove('access_token');
          Cookies.remove('refresh_token');
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;

// ---- 🧸 Products Modular Endpoints ----
export const getCategories = () => api.get('/subcategories/'); // Maps your live dropdown structures
export const getProducts = (params) => api.get('/products/', { params });
export const getFeaturedProducts = () => api.get('/products/', { params: { is_admin_approved: true } });
export const getProduct = (id) => api.get(`/products/${id}/`); 
export const postReview = (id, data) => api.post(`/products/${id}/reviews/`, data);

// ---- 👤 Accounts Modular Endpoints ----
export const registerUser = (data) => api.post('/register/', data);
export const loginUser = (data) => api.post('/login/', data);
export const getProfile = () => api.get('/profile/');
export const updateProfile = (data) => api.patch('/profile/', data);

// ---- 🧺 Cart Client-Backbone Bridge ----
export const getCart = () => api.get('/cart/');
export const addToCart = (productId, quantity = 1) => api.post('/cart/', { product: productId, quantity });
export const updateCartItem = (itemId, quantity) => api.patch(`/cart/items/${itemId}/`, { quantity });
export const removeCartItem = (itemId) => api.delete(`/cart/items/${itemId}/`);
export const clearCart = () => api.delete('/cart/clear/');

// ---- 📦 Orders Modular Endpoints ----
export const createOrder = (data) => api.post('/orders/', data);
export const getOrders = () => api.get('/orders/history/');
export const getOrder = (id) => api.get(`/orders/${id}/`);