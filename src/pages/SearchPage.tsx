import { useSearchParams, Link } from 'react-router-dom';
import { mockApps } from '../data/mockApps';
import { App } from '../types';

const popularKeywords = [
  '审批',
  '财务',
  '协作',
  '项目',
  'CRM',
  '招聘',
  '培训',
  '数据',
];

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

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  const searchResults = query
    ? mockApps.filter((app) => {
        const searchLower = query.toLowerCase();
        return (
          app.name.toLowerCase().includes(searchLower) ||
          app.description.toLowerCase().includes(searchLower) ||
          app.tags.some((tag) => tag.toLowerCase().includes(searchLower))
        );
      })
    : [];

  const popularApps = [...mockApps]
    .sort((a, b) => b.viewCount - a.viewCount)
    .slice(0, 8);

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

      {query ? (
        <>
          <h1 className="text-2xl font-bold text-[#1E293B] mb-2">
            搜索结果
          </h1>
          <p className="text-[#64748B] mb-6">
            找到 <span className="font-semibold text-[#2563EB]">{searchResults.length}</span> 个与 "{query}" 相关的结果
          </p>

          {searchResults.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {searchResults.map((app) => (
                <AppCard key={app.id} app={app} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-xl">
              <p className="text-[#64748B] mb-4">未找到相关应用</p>
              <p className="text-sm text-[#94A3B8]">
                试试其他关键词，或浏览热门应用
              </p>
            </div>
          )}
        </>
      ) : (
        <>
          <h1 className="text-2xl font-bold text-[#1E293B] mb-6">
            热门搜索
          </h1>
          <div className="flex flex-wrap gap-3 mb-12">
            {popularKeywords.map((keyword) => (
              <Link
                key={keyword}
                to={`/search?q=${encodeURIComponent(keyword)}`}
                className="px-4 py-2 bg-white rounded-full text-[#64748B] hover:text-[#2563EB] hover:bg-[#EFF6FF] transition-colors shadow-sm"
              >
                {keyword}
              </Link>
            ))}
          </div>

          <h2 className="text-xl font-bold text-[#1E293B] mb-6">
            热门应用
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularApps.map((app) => (
              <AppCard key={app.id} app={app} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
