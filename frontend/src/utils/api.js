import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
});

// Attach token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('rentique_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 globally
API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('rentique_token');
      localStorage.removeItem('rentique_user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// Auth
export const registerUser = (data) => API.post('/auth/register', data);
export const loginUser = (data) => API.post('/auth/login', data);
export const getMe = () => API.get('/auth/me');
export const updateProfile = (data) => API.put('/auth/profile', data);

// Items
export const getItems = (params) => API.get('/items', { params });
export const getItem = (id) => API.get(`/items/${id}`);
export const createItem = (data) => API.post('/items', data);
export const updateItem = (id, data) => API.put(`/items/${id}`, data);
export const deleteItem = (id) => API.delete(`/items/${id}`);
export const getMyListings = () => API.get('/items/my-listings');

// Shops
export const getShops = (params) => API.get('/shops', { params });
export const getShop = (id) => API.get(`/shops/${id}`);
export const createShop = (data) => API.post('/shops', data);
export const updateShop = (id, data) => API.put(`/shops/${id}`, data);
export const getMyShop = () => API.get('/shops/my-shop');

// Rentals
export const createRent = (data) => API.post('/rents', data);
export const getMyBookings = () => API.get('/rents/my-bookings');
export const getMyRequests = () => API.get('/rents/my-requests');
export const getRent = (id) => API.get(`/rents/${id}`);
export const updateRentStatus = (id, status) => API.put(`/rents/${id}/status`, { status });

// Reviews
export const createReview = (data) => API.post('/reviews', data);
export const getItemReviews = (itemId) => API.get(`/reviews/item/${itemId}`);

// Categories
export const getCategories = () => API.get('/categories');

export default API;
