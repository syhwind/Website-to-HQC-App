import { Link } from 'react-router-dom';
import { useFavoritesStore } from '../context/FavoritesContext';
import { mockApps } from '../data/mockApps';

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="text-6xl mb-6">📁</div>
      <h3 className="text-xl font-semibold text-[#1E293B] mb-2">
        暂无收藏应用
      </h3>
      <p className="text-[#64748B] mb-6">
        快去首页发现感兴趣的应用吧！
      </p>
      <Link
        to="/"
        className="px-6 py-3 bg-[#2563EB] text-white rounded-lg hover:bg-[#1D4ED8] transition-colors font-medium"
      >
        去首页看看
      </Link>
    </div>
  );
}

function FavoriteCard({ app }: { app: typeof mockApps[0] }) {
  const { removeFavorite } = useFavoritesStore();

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <div className="flex items-start space-x-4">
        <img
          src={app.icon}
          alt={app.name}
          className="w-14 h-14 rounded-xl object-cover"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-[#1E293B] truncate">
              {app.name}
            </h3>
            <button
              onClick={() => removeFavorite(app.id)}
              className="text-[#EF4444] hover:text-[#DC2626] transition-colors p-1"
              title="取消收藏"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
          <p className="mt-2 text-sm text-[#64748B] line-clamp-2">
            {app.description}
          </p>
          <div className="mt-4 flex items-center justify-between">
            <span className="px-2 py-1 bg-[#F1F5F9] text-[#64748B] text-xs rounded-full">
              {app.category === 'productivity' && '效率办公'}
              {app.category === 'hr' && '人力资源'}
              {app.category === 'finance' && '财务管理'}
              {app.category === 'dev' && '研发工具'}
              {app.category === 'communication' && '协同沟通'}
              {app.category === 'analytics' && '数据分析'}
            </span>
            <a
              href={app.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#2563EB] hover:text-[#1D4ED8] text-sm font-medium"
            >
              访问 →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function FavoritesPage() {
  const { favorites } = useFavoritesStore();
  const favoriteApps = mockApps.filter((app) =>
    favorites.some((fav) => fav.id === app.id)
  );

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#1E293B] mb-2">
          我的收藏
          {favoriteApps.length > 0 && (
            <span className="ml-2 text-lg font-normal text-[#64748B]">
              ({favoriteApps.length})
            </span>
          )}
        </h1>
        <p className="text-[#64748B]">
          已收藏的应用可以在这里快速访问
        </p>
      </div>

      {favoriteApps.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {favoriteApps.map((app) => (
            <FavoriteCard key={app.id} app={app} />
          ))}
        </div>
      )}
    </div>
  );
}
