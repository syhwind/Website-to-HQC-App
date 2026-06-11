import { useParams, Link } from 'react-router-dom';
import { mockApps, mockCategories } from '../data/mockApps';
import { App } from '../types';

function AppCard({ app }: { app: App }) {
  return (
    <Link to={`/app/${app.id}`}>
      <div className="bg-white rounded-xl p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer shadow-sm">
        <div className="flex items-start space-x-4">
          <img
            src={app.icon}
            alt={app.name}
            className="w-12 h-12 rounded-lg object-cover"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-[#1E293B] truncate">
                {app.name}
              </h3>
              {app.isFeatured && (
                <span className="px-2 py-1 bg-[#2563EB] text-white text-xs rounded-full flex-shrink-0">
                  精选
                </span>
              )}
            </div>
            <p className="mt-2 text-sm text-[#64748B] line-clamp-2">
              {app.description}
            </p>
            <div className="mt-4 flex items-center justify-between text-xs text-[#94A3B8]">
              <span>浏览 {app.viewCount.toLocaleString()}</span>
              <span>{app.department}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function CategoryPage() {
  const { categoryId } = useParams<{ categoryId: string }>();
  
  const category = mockCategories.find((c) => c.id === categoryId);
  
  const filteredApps = categoryId
    ? mockApps.filter((app) => app.category === categoryId)
    : mockApps;

  return (
    <div>
      <div className="mb-6">
        <Link
          to="/"
          className="text-[#64748B] hover:text-[#2563EB] transition-colors text-sm"
        >
          返回首页
        </Link>
      </div>

      <h1 className="text-2xl font-bold text-[#1E293B] mb-6">
        {category?.name || '全部分类'}
      </h1>

      <div className="mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredApps.map((app) => (
            <AppCard key={app.id} app={app} />
          ))}
        </div>
      </div>

      {filteredApps.length === 0 && (
        <div className="text-center py-12">
          <p className="text-[#64748B]">该分类下暂无应用</p>
        </div>
      )}
    </div>
  );
}
