import { ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-[#2563EB] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">App</span>
              </div>
              <span className="text-[#1E293B] font-semibold text-lg hidden sm:block">
                企业应用中心
              </span>
            </Link>

            <nav className="hidden md:flex items-center space-x-6">
              <Link
                to="/"
                className="text-[#1E293B] hover:text-[#2563EB] transition-colors"
              >
                首页
              </Link>
              <Link
                to="/category/tools"
                className="text-[#1E293B] hover:text-[#2563EB] transition-colors"
              >
                分类
              </Link>
              <Link
                to="/search"
                className="text-[#1E293B] hover:text-[#2563EB] transition-colors"
              >
                搜索
              </Link>
              <Link
                to="/favorites"
                className="text-[#1E293B] hover:text-[#2563EB] transition-colors"
              >
                我的收藏
              </Link>
              <Link
                to="/admin"
                className="text-[#1E293B] hover:text-[#2563EB] transition-colors"
              >
                管理后台
              </Link>
            </nav>

            <div className="flex items-center space-x-4">
              <button className="p-2 text-[#1E293B] hover:text-[#2563EB] transition-colors">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </button>
              <div className="w-8 h-8 bg-[#2563EB] rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">用</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-sm text-[#64748B]">
            <p>© 2024 企业内部应用发布平台. 保留所有权利.</p>
            <p className="mt-2">技术支持: 技术支持团队 | 联系方式: support@company.com</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
