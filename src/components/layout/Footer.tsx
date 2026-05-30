export const Footer = () => {
  return (
    <footer className="bg-slate-800 text-slate-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">企业应用中心</h3>
            <p className="text-sm text-slate-400">
              统一的企业内部应用分发门户，让每一位员工都能快速发现和使用公司内部工具。
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold text-lg mb-4">快速链接</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/" className="hover:text-white transition-colors">
                  首页
                </a>
              </li>
              <li>
                <a href="/categories" className="hover:text-white transition-colors">
                  应用分类
                </a>
              </li>
              <li>
                <a href="/favorites" className="hover:text-white transition-colors">
                  我的收藏
                </a>
              </li>
              <li>
                <a href="/admin" className="hover:text-white transition-colors">
                  管理后台
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold text-lg mb-4">技术支持</h3>
            <div className="space-y-2 text-sm">
              <p>📧 support@example.com</p>
              <p>📞 400-123-4567</p>
              <p>⏰ 工作时间：周一至周五 9:00-18:00</p>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-700 mt-8 pt-6 text-center text-sm text-slate-400">
          <p>© 2024 企业应用中心 版权所有 | 技术支持：信息中心</p>
        </div>
      </div>
    </footer>
  );
};
