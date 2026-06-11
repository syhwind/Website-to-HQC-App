import { useState, useEffect } from 'react';
import { categoryService } from '../services/api';
import { Category } from '../types';

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await categoryService.getAll();
      
      if (response.success) {
        setCategories(response.data);
      } else {
        throw new Error(response.error?.message || '获取分类列表失败');
      }
    } catch (err) {
      setError(err as Error);
      console.error('获取分类列表失败:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const refetch = () => {
    fetchCategories();
  };

  return { categories, loading, error, refetch };
}

export function useCategory(id: string) {
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchCategory = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await categoryService.getById(id);
      
      if (response.success) {
        setCategory(response.data);
      } else {
        throw new Error(response.error?.message || '获取分类详情失败');
      }
    } catch (err) {
      setError(err as Error);
      console.error('获取分类详情失败:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategory();
  }, [id]);

  return { category, loading, error, refetch: fetchCategory };
}
