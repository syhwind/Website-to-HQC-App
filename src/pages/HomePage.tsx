import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { App, Category } from '../types';
import { useAppContext } from '../context/AppContext';
import { useTheme } from '../hooks/useTheme';

function AppCard({ app, featured = false }: { app: App; featured?: boolean }) {
  return (
    <Link to={`/app/${app.id}`}>
      <div
        className={`bg-white rounded-xl p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer ${
          featured ? 'border-2 border-primary-600' : 'shadow-sm'
        }`}
      >
        <div className="flex items-start space-x-4">
          {app.icon && app.icon.startsWith('http') ? (
            <img
              src={app.icon}
              alt={app.name}
              className="w-12 h-12 rounded-lg object-cover"
            />
          ) : (
            <div className="w-12 h-12 rounded-lg bg-[#E2E8F0] flex items-center justify-center text-2xl">
              {app.icon || '📱'}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-[#1e293b] truncate">
                {app.name}
              </h3>
              {app.isFeatured && (
                <span className="px-2 py-1 bg-primary-600 text-white text-xs rounded-full">
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
  linkText,
}: {
  title: string;
  linkTo: string;
  linkText: string;
}) {
  return (
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-2xl font-bold text-[#1e293b]">{title}</h2>
      <Link
        to={linkTo}
        className="text-primary-600 hover:text-primary-700 transition-colors text-sm font-medium"
      >
        {linkText}
      </Link>
    </div>
  );
}

function CategoryNav({ categories }: { categories: Category[] }) {
  return (
    <div className="mb-8">
      <SectionHeader title="分类浏览" linkTo="/search" linkText="查看全部" />
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {categories.map((category) => (
          <Link
            key={category.id}
            to={`/category/${category.id}`}
            className="flex flex-col items-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all"
          >
            <span className="text-4xl mb-2">{category.icon}</span>
            <span className="text-sm font-medium text-[#1e293b]">
              {category.name}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}

function FeaturedSection({ apps }: { apps: App[] }) {
  const featuredApps = apps.filter((app) => app.isFeatured);
  if (featuredApps.length === 0) return null;

  return (
    <div className="mb-12">
      <SectionHeader title="精选推荐" linkTo="/search" linkText="查看全部" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {featuredApps.slice(0, 3).map((app) => (
          <AppCard key={app.id} app={app} featured />
        ))}
      </div>
    </div>
  );
}

function HotAppsSection({ apps }: { apps: App[] }) {
  const hotApps = [...apps].sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0));

  return (
    <div className="mb-12">
      <SectionHeader title="热门应用" linkTo="/search" linkText="查看全部" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {hotApps.slice(0, 8).map((app) => (
          <AppCard key={app.id} app={app} />
        ))}
      </div>
    </div>
  );
}

function NewAppsSection({ apps }: { apps: App[] }) {
  const newApps = [...apps].sort((a, b) => {
    const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return dateB - dateA;
  });

  return (
    <div className="mb-12">
      <SectionHeader title="最新上架" linkTo="/search" linkText="查看全部" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {newApps.slice(0, 8).map((app) => (
          <AppCard key={app.id} app={app} />
        ))}
      </div>
    </div>
  );
}

export default function HomePage() {
  const { apps: appsFromContext, categories: categoriesFromContext, loading, error, refreshApps } = useAppContext();
  useTheme();

  // 安全检查
  const apps = Array.isArray(appsFromContext) ? appsFromContext : [];
  const categories = Array.isArray(categoriesFromContext) ? categoriesFromContext : [];

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
