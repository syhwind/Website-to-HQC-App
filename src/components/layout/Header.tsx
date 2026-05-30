import { useState } from 'react';
import { Link } from 'react-router-dom';
import { SearchBar } from '../common/SearchBar';

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { to: '/', label: '首页' },
    { to: '/categories', label: '分类' },
    { to: '/favorites', label: '收藏' },
    { to: '/admin', label: '管理后台' },
  ];

  const handleSearch = (keyword: string) => {
    console.log('Search:', keyword);
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-xl">📦</span>
              </div>
              <span className="text-xl font-bold text-slate-800">
                企业应用中心
              </span>
            </Link>
          </div>

          <div className="hidden md:flex flex-1 max-w-2xl mx-8">
            <SearchBar onSearch={handleSearch} />
          </div>

          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-slate-600 hover:text-blue-600 transition-colors duration-200 font-medium"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6 text-slate-600"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden pb-4">
            <div className="mb-4">
              <SearchBar onSearch={handleSearch} />
            </div>
            <div className="space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-4 py-2 text-slate-600 hover:text-blue-600 hover:bg-slate-50 rounded-lg transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
