export interface App {
  id: string;
  name: string;
  icon: string;
  description: string;
  category: string;
  department: string;
  tags: string[];
  screenshots: string[];
  url: string;
  developer: string;
  version: string;
  status: 'active' | 'inactive';
  viewCount: number;
  favoriteCount: number;
  createdAt: string;
  isFeatured?: boolean;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  appCount: number;
}
