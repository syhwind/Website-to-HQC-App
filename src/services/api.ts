import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    if (error.response) {
      const errorData = error.response.data;
      const errorMessage = errorData?.error?.message || '请求失败';
      
      switch (error.response.status) {
        case 400:
          console.error('请求参数错误:', errorMessage);
          break;
        case 401:
          console.error('未授权访问');
          break;
        case 403:
          console.error('无权限访问');
          break;
        case 404:
          console.error('资源不存在');
          break;
        case 500:
          console.error('服务器内部错误');
          break;
        default:
          console.error('请求失败:', errorMessage);
      }
      
      return Promise.reject({
        code: errorData?.error?.code || 'REQUEST_ERROR',
        message: errorMessage,
        status: error.response.status,
      });
    } else if (error.request) {
      console.error('网络错误，请检查网络连接');
      return Promise.reject({
        code: 'NETWORK_ERROR',
        message: '网络错误，请检查网络连接',
      });
    } else {
      console.error('请求配置错误:', error.message);
      return Promise.reject({
        code: 'CONFIG_ERROR',
        message: error.message,
      });
    }
  }
);

export const appService = {
  getApps: (params = {}) => {
    const { page = 1, pageSize = 12, category, keyword, sortBy } = params;
    const queryParams = new URLSearchParams();
    
    queryParams.append('page', page.toString());
    queryParams.append('pageSize', pageSize.toString());
    
    if (category) queryParams.append('category', category);
    if (keyword) queryParams.append('keyword', keyword);
    if (sortBy) queryParams.append('sortBy', sortBy);
    
    return apiClient.get(`/apps?${queryParams.toString()}`);
  },
  
  getAppById: (id) => {
    return apiClient.get(`/apps/${id}`);
  },
  
  createApp: (data) => {
    return apiClient.post('/apps', data);
  },
  
  updateApp: (id, data) => {
    return apiClient.put(`/apps/${id}`, data);
  },
  
  deleteApp: (id) => {
    return apiClient.delete(`/apps/${id}`);
  },
  
  updateStatus: (id, status) => {
    return apiClient.patch(`/apps/${id}/status`, { status });
  },
};

export const uploadService = {
  uploadIcon: (appId, file, onProgress) => {
    const formData = new FormData();
    formData.append('file', file);
    
    return apiClient.post(`/uploads/icon/${appId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(percentCompleted);
        }
      },
    });
  },
  
  uploadScreenshots: (appId, files, onProgress) => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file);
    });
    
    return apiClient.post(`/uploads/screenshots/${appId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(percentCompleted);
        }
      },
    });
  },
  
  uploadVideo: (appId, file, onProgress) => {
    const formData = new FormData();
    formData.append('file', file);
    
    return apiClient.post(`/uploads/video/${appId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(percentCompleted);
        }
      },
    });
  },
  
  deleteFile: (filepath) => {
    return apiClient.delete(`/uploads/${filepath}`);
  },
};

export const categoryService = {
  getAll: () => {
    return apiClient.get('/categories');
  },
  
  getById: (id) => {
    return apiClient.get(`/categories/${id}`);
  },
  
  create: (data) => {
    return apiClient.post('/categories', data);
  },
  
  update: (id, data) => {
    return apiClient.put(`/categories/${id}`, data);
  },
  
  delete: (id) => {
    return apiClient.delete(`/categories/${id}`);
  },
};

export const favoriteService = {
  getByUser: (userId) => {
    return apiClient.get('/favorites', { params: { userId } });
  },
  
  add: (userId, appId) => {
    return apiClient.post('/favorites', { userId, appId });
  },
  
  remove: (userId, appId) => {
    return apiClient.delete('/favorites', { params: { userId, appId } });
  },
};

export const reviewService = {
  getByApp: (appId, params = {}) => {
    const { page = 1, pageSize = 10 } = params;
    return apiClient.get(`/apps/${appId}/reviews`, {
      params: { page, pageSize },
    });
  },
  
  create: (appId, data) => {
    return apiClient.post(`/apps/${appId}/reviews`, data);
  },
};

export default apiClient;
