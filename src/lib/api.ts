import axios from 'axios';

const rawUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
const API_BASE_URL = rawUrl.endsWith('/') ? rawUrl.slice(0, -1) : rawUrl;

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
  return config;
}, (error) => {
  return Promise.reject(error);
});

api.interceptors.response.use((response) => {
  return response;
}, (error) => {
  const status = error.response?.status;
  const url = error.config?.url;
  const method = error.config?.method?.toUpperCase();
  const data = error.response?.data;
  
  console.error(`❌ API Error: [${method} ${url}] [Status: ${status || 'Network'}]`, data || error.message);
  return Promise.reject(error);
});

export const getStoreInfo = async () => {
  const response = await api.get('api/store-info');
  return response.data;
};

export const updateStoreInfo = async (storeData: any) => {
  const response = await api.post('api/store-info', storeData);
  return response.data;
};

export const getOrders = async () => {
  const response = await api.get(`api/orders`);
  return response.data;
};

export const getProducts = async () => {
  const response = await api.get(`api/products`);
  return response.data;
};

export const getDashboardStats = async () => {
  const response = await api.get(`api/dashboard-stats`);
  return response.data;
};

export const createProduct = async (productData: any) => {
  const response = await api.post(`api/products`, productData);
  return response.data;
};

export const updateProduct = async (productId: string, productData: any) => {
  const response = await api.patch(`api/products/${productId}`, productData);
  return response.data;
};

export const deleteProduct = async (productId: string) => {
  const response = await api.delete(`api/products/${productId}`);
  return response.data;
};

export const updateOrderStatus = async (orderId: string, updateData: string | object) => {
  const payload = typeof updateData === 'string' ? { status: updateData } : updateData;
  const response = await api.patch(`api/orders/${orderId}`, payload);
  return response.data;
};

export const getCustomers = async () => {
  const response = await api.get('api/customers');
  return response.data;
};

export const searchData = async (query: string) => {
  const response = await api.get(`api/search?q=${query}`);
  return response.data;
};

export const createCampaign = async (campaignData: any) => {
  const response = await api.post(`api/marketing/campaign`, campaignData);
  return response.data;
};

export const getSupportRequests = async () => {
  const response = await api.get('api/support-requests');
  return response.data;
};

export const updateSupportStatus = async (requestId: string, status: string) => {
  const response = await api.patch(`api/support-requests/${requestId}`, { status });
  return response.data;
};

export const uploadImage = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await api.post('upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const exportReport = async () => {
  const response = await api.get('api/orders/export-report');
  return response.data;
};

export default api;
