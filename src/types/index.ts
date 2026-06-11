export interface Contact {
  name: string;
  role: string;
  email: string;
  phone: string;
  avatar?: string;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  createdAt: string;
}

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
  videoUrl?: string;
  introduction?: string;
  features?: string[];
  contacts?: Contact[];
  reviews?: Review[];
  averageRating?: number;
  reviewCount?: number;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  appCount: number;
}
