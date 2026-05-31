import { Link } from 'react-router-dom';
import { mockApps } from '../data/mockApps';

function StatCard({
  title,
  value,
  icon,
  color,
}: {
  title: string;
  value: number | string;
  icon: string;
  color: string;
}) {
  const colorClasses: Record<string, string> = {
    blue: 'bg-[#EFF6FF] text-[#2563EB]',
    green: 'bg-[#ECFDF5] text-[#10B981]',
    purple: 'bg-[#F5F3FF] text-[#8B5CF6]',
    orange: 'bg-[#FFF7ED] text-[#F97316]',
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-[#64748B] mb-1">{title}</p>
          <p className="text-3xl font-bold text-[#1E293B]">{value}</p>
        </div>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${colorClasses[color]}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

function QuickAction({
  title,
  description,
  icon,
  to,
  primary = false,
}: {
  title: string;
  description: string;
  icon: string;
  to: string;
  primary?: boolean;
}) {
  return (
    <Link
      to={to}
      className={`block p-6 rounded-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${
        primary
          ? 'bg-[#2563EB] text-white'
          : 'bg-white shadow-sm hover:bg-white'
      }`}
    >
      <div className="flex items-center space-x-4">
        <div className={`text-3xl ${primary ? '' : 'opacity-80'}`}>
          {icon}
        </div>
        <div>
          <h3 className={`font-semibold text-lg ${primary ? '' : 'text-[#1E293B]'}`}>
            {title}
          </h3>
          <p className={`text-sm ${primary ? 'text-white/80' : 'text-[#64748B]'}`}>
            {description}
          </p>
        </div>
      </div>
    </Link>
  );
}

function RecentAppsTable() {
  const recentApps = [...mockApps]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const getCategoryName = (category: string) => {
    const names: Record<string, string> = {
      productivity: '效率办公',
      hr: '人力资源',
      finance: '财务管理',
      dev: '研发工具',
      communication: '协同沟通',
      analytics: '数据分析',
    };
    return names[category] || category;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-[#E2E8F0]">
        <h3 className="font-semibold text-[#1E293B]">最近发布</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-[#F8FAFC]">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#64748B] uppercase tracking-wider">
                应用名称
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#64748B] uppercase tracking-wider">
                分类
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#64748B] uppercase tracking-wider">
                状态
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#64748B] uppercase tracking-wider">
                发布时间
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E2E8F0]">
            {recentApps.map((app) => (
              <tr key={app.id} className="hover:bg-[#F8FAFC] transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-3">
                    <img
                      src={app.icon}
                      alt={app.name}
                      className="w-10 h-10 rounded-lg object-cover"
                    />
                    <span className="font-medium text-[#1E293B]">
                      {app.name}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#64748B]">
                  {getCategoryName(app.category)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      app.status === 'active'
                        ? 'bg-[#ECFDF5] text-[#10B981]'
                        : 'bg-[#FEF2F2] text-[#EF4444]'
                    }`}
                  >
                    {app.status === 'active' ? '已上线' : '已下架'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#64748B]">
                  {app.createdAt}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function AdminPage() {
  const totalApps = mockApps.length;
  const activeApps = mockApps.filter((app) => app.status === 'active').length;
  const totalViews = mockApps.reduce((sum, app) => sum + app.viewCount, 0);
  const totalFavorites = mockApps.reduce((sum, app) => sum + app.favoriteCount, 0);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#1E293B] mb-2">管理后台</h1>
        <p className="text-[#64748B]">欢迎回来！以下是应用平台的数据概览</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="应用总数"
          value={totalApps}
          icon="📱"
          color="blue"
        />
        <StatCard
          title="已上线"
          value={activeApps}
          icon="✅"
          color="green"
        />
        <StatCard
          title="总浏览量"
          value={totalViews.toLocaleString()}
          icon="👁️"
          color="purple"
        />
        <StatCard
          title="总收藏量"
          value={totalFavorites.toLocaleString()}
          icon="⭐"
          color="orange"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <QuickAction
          title="发布新应用"
          description="添加新的应用到平台"
          icon="🚀"
          to="/admin/publish"
          primary
        />
        <QuickAction
          title="管理应用"
          description="编辑、修改或下架应用"
          icon="⚙️"
          to="/admin/apps"
        />
      </div>

      <RecentAppsTable />
    </div>
  );
}
