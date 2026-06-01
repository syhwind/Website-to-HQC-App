import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

// 模拟数据，在 API 失败时使用
const MOCK_APPS = [
  {
    id: '1',
    name: '项目管理系统',
    description: '企业级项目管理和协作平台',
    introduction: '这是一个功能强大的项目管理系统，支持任务分配、进度跟踪、团队协作等功能。',
    icon: '📋',
    categoryId: 'productivity',
    department: '技术部',
    tags: ['项目管理', '协作', '敏捷开发'],
    url: 'https://projects.example.com',
    developer: '技术团队',
    version: '2.5.0',
    viewCount: 1256,
    favoriteCount: 89,
    rating: 4.8,
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '2',
    name: '在线文档平台',
    description: '企业知识库和文档协作工具',
    introduction: '强大的文档编辑和协作平台，支持 Markdown、实时协作、版本管理等功能。',
    icon: '📝',
    categoryId: 'productivity',
    department: '技术部',
    tags: ['文档', '协作', '知识库'],
    url: 'https://docs.example.com',
    developer: '技术团队',
    version: '3.1.0',
    viewCount: 2341,
    favoriteCount: 156,
    rating: 4.9,
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '3',
    name: '代码审查工具',
    description: '专业的代码审查和质量保证平台',
    introduction: '支持多种编程语言的代码审查工具，提供静态代码分析、自动审查等功能。',
    icon: '🔍',
    categoryId: 'dev',
    department: '技术部',
    tags: ['代码审查', 'DevOps', '质量保证'],
    url: 'https://code-review.example.com',
    developer: 'DevOps 团队',
    version: '1.8.0',
    viewCount: 892,
    favoriteCount: 45,
    rating: 4.6,
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '4',
    name: '团队沟通平台',
    description: '即时通讯和团队沟通工具',
    introduction: '功能完善的企业即时通讯工具，支持群聊、私聊、文件共享等功能。',
    icon: '💬',
    categoryId: 'communication',
    department: '行政部',
    tags: ['沟通', '即时通讯', '团队'],
    url: 'https://chat.example.com',
    developer: '行政团队',
    version: '4.2.0',
    viewCount: 3567,
    favoriteCount: 234,
    rating: 4.7,
    createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '5',
    name: '设计资源库',
    description: 'UI 设计资源和组件库',
    introduction: '企业级设计资源库，包含组件库、图标库、设计规范等。',
    icon: '🎨',
    categoryId: 'design',
    department: '设计部',
    tags: ['设计', 'UI', '资源库'],
    url: 'https://design.example.com',
    developer: '设计团队',
    version: '2.0.0',
    viewCount: 567,
    favoriteCount: 78,
    rating: 4.5,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '6',
    name: 'API 网关管理',
    description: '统一的 API 管理和网关平台',
    introduction: '企业 API 管理平台，提供 API 文档、网关、监控等功能。',
    icon: '🌐',
    categoryId: 'dev',
    department: '技术部',
    tags: ['API', '网关', '微服务'],
    url: 'https://api.example.com',
    developer: '架构团队',
    version: '1.5.0',
    viewCount: 445,
    favoriteCount: 32,
    rating: 4.4,
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

const MOCK_CATEGORIES = [
  { id: 'productivity', name: '生产力', description: '提高工作效率的应用', icon: '📊', appCount: 2 },
  { id: 'communication', name: '沟通协作', description: '团队沟通和协作工具', icon: '💬', appCount: 1 },
  { id: 'dev', name: '开发工具', description: '开发人员使用的工具', icon: '💻', appCount: 2 },
  { id: 'design', name: '设计工具', description: '设计和创意工具', icon: '🎨', appCount: 1 },
];

interface App {
  id: string;
  name: string;
  description: string;
  icon: string;
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
          featured ? 'border-2 border-[#2563eb]' : 'shadow-sm'
        }`}
      >
        <div className="flex items-start space-x-4">
          <div className="text-4xl">{app.icon || '📱'}</div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-[#1e293b] truncate">
                {app.name}
              </h3>
              {featured && (
                <span className="px-2 py-1 bg-[#2563eb] text-white text-xs rounded-full">
                  精选
                </span>
              )}
            </div>
            <p className="mt-2 text-sm text-[#64748b] line-clamp-2">
              {app.description}
            </p>
            <div className="mt-4 flex items-center justify-between text-xs text-[#94a3b8]">
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
      <h2 className="text-2xl font-bold text-[#1e293b]">{title}</h2>
      {linkTo && (
        <Link
          to={linkTo}
          className="text-[#2563eb] hover:text-[#1d4ed8] transition-colors text-sm font-medium"
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
      'productivity': '📊',
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
            <div className="text-sm font-medium text-[#1e293b]">
              {category.name}
            </div>
            <div className="text-xs text-[#64748b] mt-1">
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
        
        // 首先尝试从 API 加载
        try {
          const API_BASE_URL = 'http://localhost:3001/api';
          
          const [appsRes, categoriesRes] = await Promise.all([
            fetch(`${API_BASE_URL}/apps?page=1&pageSize=50`).then(r => r.json()),
            fetch(`${API_BASE_URL}/categories`).then(r => r.json()),
          ]);

          console.log('API 响应:', appsRes, categoriesRes);
          
          if (appsRes.success && appsRes.data) {
            const loadedApps = appsRes.data.items || appsRes.data || [];
            setApps(loadedApps);
          }
          
          if (categoriesRes.success && categoriesRes.data) {
            const loadedCategories = Array.isArray(categoriesRes.data) ? categoriesRes.data : [];
            setCategories(loadedCategories);
          }
          
          console.log('从 API 加载成功');
        } catch (apiErr) {
          console.log('API 加载失败，使用模拟数据:', apiErr);
          // API 失败时使用模拟数据
          setApps(MOCK_APPS);
          setCategories(MOCK_CATEGORIES);
        }
        
      } catch (err) {
        console.error('加载数据失败:', err);
        setError('加载数据失败，请稍后重试');
        // 出错时也使用模拟数据
        setApps(MOCK_APPS);
        setCategories(MOCK_CATEGORIES);
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

  if (error && apps.length === 0) {
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
