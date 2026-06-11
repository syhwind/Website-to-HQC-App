import { useState, useEffect } from 'react';
import { reviewService } from '../services/api';
import { Review } from '../types';

interface ReviewQueryParams {
  page?: number;
  pageSize?: number;
}

export function useReviews(appId: string, params: ReviewQueryParams = {}) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [stats, setStats] = useState({
    total: 0,
    averageRating: 0,
    page: 1,
    pageSize: 10,
    totalPages: 0,
  });

  const fetchReviews = async () => {
    if (!appId) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await reviewService.getByApp(appId);
      
      if (response.success) {
        setReviews(response.data.items);
        setStats({
          total: response.data.total,
          averageRating: response.data.averageRating,
          page: response.data.page,
          pageSize: response.data.pageSize,
          totalPages: response.data.totalPages,
        });
      } else {
        throw new Error(response.error?.message || '获取评价列表失败');
      }
    } catch (err) {
      setError(err as Error);
      console.error('获取评价列表失败:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [appId, params.page]);

  const addReview = async (reviewData: any) => {
    try {
      const response = await reviewService.create(appId, reviewData);
      
      if (response.success) {
        await fetchReviews();
        return true;
      } else {
        throw new Error(response.error?.message || '提交评价失败');
      }
    } catch (err) {
      console.error('提交评价失败:', err);
      return false;
    }
  };

  const refetch = () => {
    fetchReviews();
  };

  return {
    reviews,
    stats,
    loading,
    error,
    addReview,
    refetch,
  };
}
