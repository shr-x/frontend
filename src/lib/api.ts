import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const getStoreInfo = async () => {
  const response = await api.get('/api/store-info');
  return response.data;
};

export const getOrders = async () => {
  const response = await api.get(`/api/orders`);
  return response.data;
};

export const getProducts = async () => {
  const response = await api.get(`/api/products`);
  return response.data;
};

export const updateOrderStatus = async (orderId: string, status: string) => {
  const response = await api.patch(`/api/orders/${orderId}`, { status });
  return response.data;
};

export default api;
