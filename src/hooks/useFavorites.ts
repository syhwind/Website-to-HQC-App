import { useState, useEffect } from 'react';
import { favoriteService } from '../services/api';

export function useFavorites(userId) {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFavorites = async () => {
    if (!userId) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await favoriteService.getByUser(userId);
      
      if (response.success) {
        setFavorites(response.data.items);
      } else {
        throw new Error(response.error?.message || '获取收藏列表失败');
      }
    } catch (err) {
      setError(err);
      console.error('获取收藏列表失败:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, [userId]);

  const addFavorite = async (appId) => {
    try {
      const response = await favoriteService.add(userId, appId);
      
      if (response.success) {
        await fetchFavorites();
        return true;
      } else {
        throw new Error(response.error?.message || '添加收藏失败');
      }
    } catch (err) {
      console.error('添加收藏失败:', err);
      return false;
    }
  };

  const removeFavorite = async (appId) => {
    try {
      const response = await favoriteService.remove(userId, appId);
      
      if (response.success) {
        await fetchFavorites();
        return true;
      } else {
        throw new Error(response.error?.message || '取消收藏失败');
      }
    } catch (err) {
      console.error('取消收藏失败:', err);
      return false;
    }
  };

  const isFavorite = (appId) => {
    return favorites.some(fav => fav.appId === appId);
  };

  const refetch = () => {
    fetchFavorites();
  };

  return {
    favorites,
    loading,
    error,
    addFavorite,
    removeFavorite,
    isFavorite,
    refetch,
  };
}
