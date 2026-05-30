import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { mockApps, mockCategories } from '../data/mockApps';
import { CategoryTag } from '../components/common/CategoryTag';
import { useFavoritesStore } from '../context/FavoritesContext';

export const AppDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [selectedScreenshot, setSelectedScreenshot] = useState<string | null>(null);
  const { addFavorite, removeFavorite, isFavorite } = useFavoritesStore();

  const app = mockApps.find((a) => a.id === id);
  const categoryInfo = mockCategories.find((cat) => cat.id === app?.category);

  if (!app) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h1 className="text-2xl font-bold text-slate-800 mb-2">应用未找到</h1>
          <p className="text-slate-500 mb-6">抱歉，您查找的应用不存在或已下架</p>
          <Link
            to="/"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            返回首页
          </Link>
        </div>
      </div>
    );
  }

  const isAppFavorite = isFavorite(app.id);

  const handleToggleFavorite = () => {
    if (isAppFavorite) {
      removeFavorite(app.id);
    } else {
      addFavorite(app);
    }
  };

  const handleOpenApp = () => {
    window.open(app.url, '_blank', 'noopener,noreferrer');
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 py-6">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="mb-6">
          <ol className="flex items-center space-x-2 text-sm">
            <li>
              <Link to="/" className="text-slate-500 hover:text-blue-600 transition-colors">
                首页
              </Link>
            </li>
            <li className="text-slate-300">/</li>
            <li>
              <Link
                to={`/?category=${app.category}`}
                className="text-slate-500 hover:text-blue-600 transition-colors"
              >
                {categoryInfo?.name || app.category}
              </Link>
            </li>
            <li className="text-slate-300">/</li>
            <li className="text-slate-800 font-medium truncate">{app.name}</li>
          </ol>
        </nav>

        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="p-6 sm:p-8 border-b border-slate-100">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <img
                src={app.icon}
                alt={app.name}
                className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl object-cover shadow-md flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-3">{app.name}</h1>
                <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                  <div className="flex items-center">
                    <span className="text-slate-400 mr-2">开发商：</span>
                    <span>{app.developer}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-slate-400 mr-2">版本：</span>
                    <span className="font-mono text-blue-600">{app.version}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-slate-400 mr-2">部门：</span>
                    <span>{app.department}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 mt-6 pt-6 border-t border-slate-100">
              <button
                onClick={handleOpenApp}
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 active:bg-blue-800 transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
                打开应用
              </button>
              <button
                onClick={handleToggleFavorite}
                className={`inline-flex items-center px-5 py-3 rounded-xl font-medium transition-all duration-200 border-2 ${
                  isAppFavorite
                    ? 'bg-red-50 border-red-200 text-red-600 hover:bg-red-100'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 hover:border-slate-300'
                }`}
              >
                <svg
                  className={`w-5 h-5 mr-2 transition-transform duration-200 ${isAppFavorite ? 'scale-110' : ''}`}
                  fill={isAppFavorite ? 'currentColor' : 'none'}
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
                {isAppFavorite ? '已收藏' : '收藏'}
              </button>
            </div>
          </div>

          <div className="p-6 sm:p-8 border-b border-slate-100">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">应用介绍</h2>
            <p className="text-slate-600 leading-relaxed whitespace-pre-line">{app.description}</p>
          </div>

          {app.screenshots && app.screenshots.length > 0 && (
            <div className="p-6 sm:p-8 border-b border-slate-100">
              <h2 className="text-lg font-semibold text-slate-800 mb-4">截图预览</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {app.screenshots.map((screenshot, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedScreenshot(screenshot)}
                    className="relative aspect-[4/3] rounded-xl overflow-hidden group cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    <img
                      src={screenshot}
                      alt={`${app.name} 截图 ${index + 1}`}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                      <svg
                        className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                        />
                      </svg>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="p-6 sm:p-8">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">基本信息</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-slate-50 rounded-xl p-4">
                <div className="text-sm text-slate-400 mb-1">分类</div>
                <CategoryTag category={app.category} showIcon />
              </div>
              <div className="bg-slate-50 rounded-xl p-4">
                <div className="text-sm text-slate-400 mb-1">标签</div>
                <div className="flex flex-wrap gap-2">
                  {app.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 text-slate-600"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="bg-slate-50 rounded-xl p-4">
                <div className="text-sm text-slate-400 mb-1">浏览次数</div>
                <div className="flex items-center text-slate-800">
                  <svg className="w-5 h-5 mr-2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                  <span className="font-medium">{app.viewCount.toLocaleString()}</span>
                  <span className="text-slate-400 ml-1">次</span>
                </div>
              </div>
              <div className="bg-slate-50 rounded-xl p-4">
                <div className="text-sm text-slate-400 mb-1">上架时间</div>
                <div className="flex items-center text-slate-800">
                  <svg className="w-5 h-5 mr-2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <span className="font-medium">{formatDate(app.createdAt)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {selectedScreenshot && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80"
            onClick={() => setSelectedScreenshot(null)}
          >
            <div className="relative max-w-5xl max-h-full">
              <button
                onClick={() => setSelectedScreenshot(null)}
                className="absolute -top-12 right-0 text-white hover:text-slate-300 transition-colors"
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <img
                src={selectedScreenshot}
                alt="截图预览"
                className="max-w-full max-h-[85vh] rounded-xl shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
