import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { App } from '../types';

interface FavoritesState {
  favorites: App[];
  addFavorite: (app: App) => void;
  removeFavorite: (appId: string) => void;
  isFavorite: (appId: string) => boolean;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favorites: [],
      addFavorite: (app: App) => {
        set((state) => {
          if (state.favorites.some((fav) => fav.id === app.id)) {
            return state;
          }
          return { favorites: [...state.favorites, app] };
        });
      },
      removeFavorite: (appId: string) => {
        set((state) => ({
          favorites: state.favorites.filter((fav) => fav.id !== appId),
        }));
      },
      isFavorite: (appId: string) => {
        return get().favorites.some((fav) => fav.id === appId);
      },
    }),
    {
      name: 'favorites-storage',
    }
  )
);
