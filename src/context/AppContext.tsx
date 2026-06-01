import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { mockApps, mockCategories } from '../data/mockApps';
import { App, Category } from '../types';

const API_BASE_URL = '/api';

interface AppContextType {
  apps: App[];
  categories: Category[];
  loading: boolean;
  error: string | null;
  refreshApps: () => Promise<void>;
  updateApp: (appId: string, updates: Partial<App>) => void;
  addApp: (app: App) => void;
  deleteApp: (appId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [apps, setApps] = useState<App[]>(mockApps);
  const [categories, setCategories] = useState<Category[]>(mockCategories);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshApps = async () => {
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

  useEffect(() => {
    refreshApps();
  }, []);

  const updateApp = (appId: string, updates: Partial<App>) => {
    setApps(prev => prev.map(app => 
      app.id === appId ? { ...app, ...updates } : app
    ));
  };

  const addApp = (app: App) => {
    setApps(prev => [app, ...prev]);
  };

  const deleteApp = (appId: string) => {
    setApps(prev => prev.filter(app => app.id !== appId));
  };

  return (
    <AppContext.Provider value={{
      apps,
      categories,
      loading,
      error,
      refreshApps,
      updateApp,
      addApp,
      deleteApp,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
