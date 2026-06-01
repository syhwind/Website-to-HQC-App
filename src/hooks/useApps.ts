import { useState, useEffect } from 'react';
import { appService } from '../services/api';
import { App } from '../types';

interface AppQueryParams {
  page?: number;
  pageSize?: number;
  category?: string;
  keyword?: string;
  sortBy?: string;
}

export function useApps(params: AppQueryParams = {}) {
  const [apps, setApps] = useState<App[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    pageSize: 12,
    totalPages: 0,
  });

  const fetchApps = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await appService.getApps(params);
      
      if (response.success) {
        setApps(response.data.items);
        setPagination({
          total: response.data.total,
          page: response.data.page,
          pageSize: response.data.pageSize,
          totalPages: response.data.totalPages,
        });
      } else {
        throw new Error(response.error?.message || '获取应用列表失败');
      }
    } catch (err) {
      setError(err as Error);
      console.error('获取应用列表失败:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApps();
  }, [params.page, params.category, params.keyword, params.sortBy]);

  const refetch = () => {
    fetchApps();
  };

  return { apps, loading, error, pagination, refetch };
}

export function useAppDetail(id) {
  const [app, setApp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAppDetail = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await appService.getAppById(id);
      
      if (response.success) {
        setApp(response.data);
      } else {
        throw new Error(response.error?.message || '获取应用详情失败');
      }
    } catch (err) {
      setError(err);
      console.error('获取应用详情失败:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppDetail();
  }, [id]);

  return { app, loading, error, refetch: fetchAppDetail };
}

export function useFeaturedApps() {
  const { apps, loading, error, refetch } = useApps({
    sortBy: 'featured',
    pageSize: 6,
  });

  return { apps, loading, error, refetch };
}

export function usePopularApps() {
  const { apps, loading, error, refetch } = useApps({
    sortBy: 'popular',
    pageSize: 8,
  });

  return { apps, loading, error, refetch };
}

export function useLatestApps() {
  const { apps, loading, error, refetch } = useApps({
    sortBy: 'latest',
    pageSize: 8,
  });

  return { apps, loading, error, refetch };
}
