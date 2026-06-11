import { useState, useEffect } from 'react';
import { mockApps, mockCategories } from '../data/mockApps';
import { App, Category } from '../types';

const API_BASE_URL = '/api';

export const useApps = () => {
  const [apps, setApps] = useState<App[]>(mockApps);
  const [categories, setCategories] = useState<Category[]>(mockCategories);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 从API加载数据
  const loadFromAPI = async () => {
    setLoading(true);
    try {
      const [appsRes, categoriesRes] = await Promise.all([
        fetch(`${API_BASE_URL}/apps?page=1&pageSize=50`),
        fetch(`${API_BASE_URL}/categories`),
      ]);

      if (appsRes.ok && categoriesRes.ok) {
        const appsData = await appsRes.json();
        const categoriesData = await categoriesRes.json();
        
        if (appsData.success && appsData.data) {
          setApps(appsData.data);
        }
        if (categoriesData.success && categoriesData.data) {
          setCategories(categoriesData.data);
        }
      }
    } catch (err) {
      console.log('API加载失败，使用模拟数据');
    } finally {
      setLoading(false);
    }
  };

  // 初始化时从API加载
  useEffect(() => {
    loadFromAPI();
  }, []);

  // 更新单个应用
  const updateApp = (appId: string, updates: Partial<App>) => {
    setApps(prev => prev.map(app => 
      app.id === appId ? { ...app, ...updates } : app
    ));
  };

  // 添加新应用
  const addApp = (app: App) => {
    setApps(prev => [app, ...prev]);
  };

  // 删除应用
  const deleteApp = (appId: string) => {
    setApps(prev => prev.filter(app => app.id !== appId));
  };

  return {
    apps,
    categories,
    loading,
    error,
    setApps,
    updateApp,
    addApp,
    deleteApp,
    refresh: loadFromAPI,
  };
};
