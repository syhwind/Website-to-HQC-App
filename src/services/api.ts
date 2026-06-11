const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

interface AppQueryParams {
  page?: number;
  pageSize?: number;
  category?: string;
  keyword?: string;
  sortBy?: string;
}

// 简单的 fetch 封装
const fetchApi = async (url: string, options?: RequestInit) => {
  // 构建完整的 URL
  let fullUrl: string;
  if (url.startsWith('http')) {
    fullUrl = url;
  } else if (url.startsWith('/api')) {
    fullUrl = url;
  } else {
    fullUrl = `${API_BASE_URL}${url.startsWith('/') ? '' : '/'}${url}`;
  }
  
  try {
    const response = await fetch(fullUrl, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  } catch (error) {
    console.error('API 请求失败:', error);
    // 给调用者返回一个包含错误信息的对象，而不是抛出错误
    return {
      success: false,
      error: {
        code: 'NETWORK_ERROR',
        message: '网络请求失败，请稍后重试',
      },
    };
  }
};

export const appService = {
  getApps: async (params: AppQueryParams = {}) => {
    const { page = 1, pageSize = 12, category, keyword, sortBy } = params;
    const queryParams = new URLSearchParams();
    
    queryParams.append('page', page.toString());
    queryParams.append('pageSize', pageSize.toString());
    
    if (category) queryParams.append('category', category);
    if (keyword) queryParams.append('keyword', keyword);
    if (sortBy) queryParams.append('sortBy', sortBy);
    
    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
    return fetchApi(`/apps${queryString}`);
  },
  
  getAppById: (id: string) => {
    return fetchApi(`/apps/${id}`);
  },
  
  createApp: (data: any) => {
    return fetchApi('/apps', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  
  updateApp: (id: string, data: any) => {
    return fetchApi(`/apps/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
  
  deleteApp: (id: string) => {
    return fetchApi(`/apps/${id}`, {
      method: 'DELETE',
    });
  },
  
  updateStatus: (id: string, status: string) => {
    return fetchApi(`/apps/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },
};

export const categoryService = {
  getAll: () => {
    return fetchApi('/categories');
  },
  
  getById: (id: string) => {
    return fetchApi(`/categories/${id}`);
  },
};

export const favoriteService = {
  getByUser: (userId: string) => {
    return fetchApi(`/favorites?userId=${userId}`);
  },
  
  add: (userId: string, appId: string) => {
    return fetchApi('/favorites', {
      method: 'POST',
      body: JSON.stringify({ userId, appId }),
    });
  },
  
  remove: (userId: string, appId: string) => {
    return fetchApi(`/favorites?userId=${userId}&appId=${appId}`, {
      method: 'DELETE',
    });
  },
};

export const reviewService = {
  getByApp: (appId: string) => {
    return fetchApi(`/apps/${appId}/reviews`);
  },
  
  create: (appId: string, data: any) => {
    return fetchApi(`/apps/${appId}/reviews`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};
