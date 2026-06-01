import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { appService, categoryService } from '@/services/api';

interface App {
  id: string;
  name: string;
  icon: string;
  description: string;
  viewCount: number;
  favoriteCount: number;
  rating: number;
  categoryId: string;
  department: string;
  createdAt: string;
}

interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  appCount: number;
}

function AppCard({ app, featured = false }: { app: App; featured?: boolean }) {
  return (
    <Link to={`/app/${app.id}`}>
      <div
        className={`bg-white rounded-xl p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer ${
          featured ? 'border-2 border-[#2563EB]' : 'shadow-sm'
        }`}
      >
        <div className="flex items-start space-x-4">
          <div className="text-4xl">{app.icon || '📱'}</div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-[#1E293B] truncate">
                {app.name}
              </h3>
              {featured && (
                <span className="px-2 py-1 bg-[#2563EB] text-white text-xs rounded-full">
                  精选
                </span>
              )}
            </div>
            <p className="mt-2 text-sm text-[#64748B] line-clamp-2">
              {app.description}
            </p>
            <div className="mt-4 flex items-center justify-between text-xs text-[#94A3B8]">
              <span>浏览 {app.viewCount?.toLocaleString() || 0}</span>
              <span>{app.department || '内部应用'}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

function SectionHeader({
  title,
  linkTo,
}: {
  title: string;
  linkTo?: string;
}) {
  return (
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-2xl font-bold text-[#1E293B]">{title}</h2>
      {linkTo && (
        <Link
          to={linkTo}
          className="text-[#2563EB] hover:text-[#1D4ED8] transition-colors text-sm font-medium"
        >
          查看更多 →
        </Link>
      )}
    </div>
  );
}

function CategoryNav({ categories }: { categories: Category[] }) {
  const getIcon = (id: string) => {
    const icons: Record<string, string> = {
      'productivity': '📋',
      'communication': '💬',
      'dev': '💻',
      'design': '🎨',
      'office': '📋',
      'finance': '💰',
      'hr': '👥',
      'sales': '🤝',
      'data': '📊',
      'it': '🔧',
      'operations': '🚚',
      'marketing': '📢'
    };
    return icons[id] || '📱';
  };

  return (
    <div className="mb-12">
      <SectionHeader title="应用分类" />
      <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide">
        {categories.map((category) => (
          <Link
            key={category.id}
            to={`/category/${category.id}`}
            className="flex-shrink-0 bg-white px-6 py-4 rounded-xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 text-center min-w-[140px]"
          >
            <div className="text-2xl mb-2">{getIcon(category.id)}</div>
            <div className="text-sm font-medium text-[#1E293B]">
              {category.name}
            </div>
            <div className="text-xs text-[#64748B] mt-1">
              {category.appCount || 0} 个应用
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

function FeaturedSection({ apps }: { apps: App[] }) {
  const featuredApps = apps.slice(0, 6);

  if (featuredApps.length === 0) {
    return null;
  }

  return (
    <div className="mb-12">
      <SectionHeader title="精选推荐" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {featuredApps.map((app) => (
          <AppCard key={app.id} app={app} featured />
        ))}
      </div>
    </div>
  );
}

function HotAppsSection({ apps }: { apps: App[] }) {
  const hotApps = [...apps]
    .sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0))
    .slice(0, 8);

  if (hotApps.length === 0) {
    return null;
  }

  return (
    <div className="mb-12">
      <SectionHeader title="热门应用" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {hotApps.map((app) => (
          <AppCard key={app.id} app={app} />
        ))}
      </div>
    </div>
  );
}

function NewAppsSection({ apps }: { apps: App[] }) {
  const newApps = [...apps]
    .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
    .slice(0, 8);

  if (newApps.length === 0) {
    return null;
  }

  return (
    <div className="mb-12">
      <SectionHeader title="最新上架" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {newApps.map((app) => (
          <AppCard key={app.id} app={app} />
        ))}
      </div>
    </div>
  );
}

export default function HomePage() {
  const [apps, setApps] = useState<App[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [appsRes, categoriesRes] = await Promise.all([
          appService.getApps({ page: 1, pageSize: 50 }),
          categoryService.getAll()
        ]);

        if (appsRes.success && appsRes.data.items) {
          setApps(appsRes.data.items);
        }
        
        if (categoriesRes.success && categoriesRes.data) {
          setCategories(Array.isArray(categoriesRes.data) ? categoriesRes.data : []);
        }
      } catch (err) {
        console.error('加载数据失败:', err);
        setError('加载数据失败，请稍后重试');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">加载中...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="text-5xl mb-4">⚠️</div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">加载失败</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            重新加载
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {apps.length > 0 ? (
        <>
          <FeaturedSection apps={apps} />
          {categories.length > 0 && <CategoryNav categories={categories} />}
          <HotAppsSection apps={apps} />
          <NewAppsSection apps={apps} />
        </>
      ) : (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="text-6xl mb-4">📱</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">暂无应用</h3>
            <p className="text-gray-600">当前还没有任何应用，去管理后台添加吧！</p>
          </div>
        </div>
      )}
    </div>
  );
}
