import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { SearchBar } from '../common/SearchBar';
import { useTheme } from '../../hooks/useTheme';

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { theme, setTheme, toggleTheme, themes } = useTheme();
  const [showThemeDropdown, setShowThemeDropdown] = useState(false);

  const navLinks = [
    { to: '/', label: '首页' },
    { to: '/category/productivity', label: '分类' },
    { to: '/favorites', label: '收藏' },
    { to: '/admin', label: '管理后台' },
  ];

  const handleSearch = (keyword: string) => {
    if (keyword.trim()) {
      navigate(`/search?q=${encodeURIComponent(keyword)}`);
    } else {
      navigate('/search');
    }
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
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
                className="text-slate-600 hover:text-primary-600 transition-colors duration-200 font-medium"
              >
                {link.label}
              </Link>
            ))}
            
            {/* 主题切换按钮 */}
            <div className="relative">
              <button
                onClick={() => setShowThemeDropdown(!showThemeDropdown)}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors"
                title="切换主题"
              >
                <span 
                  className="w-5 h-5 rounded-full border-2 border-slate-300"
                  style={{ backgroundColor: themes.find(t => t.value === theme)?.color }}
                />
                <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                </svg>
              </button>
              
              {/* 主题下拉菜单 */}
              {showThemeDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-200 py-2 z-50">
                  <div className="px-4 py-2 text-sm font-medium text-slate-700 border-b border-slate-100">
                    选择主题
                  </div>
                  {themes.map((t) => (
                    <button
                      key={t.value}
                      onClick={() => {
                        setTheme(t.value);
                        setShowThemeDropdown(false);
                      }}
                      className={`w-full flex items-center space-x-3 px-4 py-2 text-left hover:bg-slate-50 transition-colors ${
                        theme === t.value ? 'bg-primary-50 text-primary-700' : 'text-slate-700'
                      }`}
                    >
                      <span 
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: t.color }}
                      />
                      <span>{t.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
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
                  className="block px-4 py-2 text-slate-600 hover:text-primary-600 hover:bg-slate-50 rounded-lg transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              
              {/* 移动端主题切换 */}
              <div className="border-t border-slate-200 pt-3 mt-3">
                <div className="px-4 py-2 text-sm font-medium text-slate-700">
                  选择主题
                </div>
                <div className="grid grid-cols-3 gap-2 px-4">
                  {themes.map((t) => (
                    <button
                      key={t.value}
                      onClick={() => {
                        setTheme(t.value);
                      }}
                      className={`flex flex-col items-center py-2 rounded-lg transition-all ${
                        theme === t.value 
                          ? 'bg-primary-100 ring-2 ring-primary-500' 
                          : 'bg-slate-50 hover:bg-slate-100'
                      }`}
                    >
                      <span 
                        className="w-6 h-6 rounded-full mb-1"
                        style={{ backgroundColor: t.color }}
                      />
                      <span className="text-xs text-slate-600">
                        {t.label.replace('主题', '')}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
