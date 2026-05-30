import { useState } from 'react';
import { mockApps } from '../data/mockApps';
import { App } from '../types';

const ITEMS_PER_PAGE = 10;

function getCategoryName(category: string): string {
  const names: Record<string, string> = {
    productivity: '效率办公',
    hr: '人力资源',
    finance: '财务管理',
    dev: '研发工具',
    communication: '协同沟通',
    analytics: '数据分析',
  };
  return names[category] || category;
}

export default function ManageAppsPage() {
  const [apps, setApps] = useState<App[]>(mockApps);
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(apps.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentApps = apps.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleToggleStatus = (appId: string) => {
    setApps((prev) =>
      prev.map((app) =>
        app.id === appId
          ? {
              ...app,
              status: app.status === 'active' ? 'inactive' : 'active',
            }
          : app
      )
    );
  };

  const handleEdit = (appId: string) => {
    alert(`编辑应用: ${appId}`);
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#1E293B] mb-2">应用管理</h1>
        <p className="text-[#64748B]">管理和维护平台上的所有应用</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#F8FAFC]">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-[#64748B] uppercase tracking-wider">
                  应用名称
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-[#64748B] uppercase tracking-wider">
                  分类
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-[#64748B] uppercase tracking-wider">
                  状态
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-[#64748B] uppercase tracking-wider">
                  浏览量
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-[#64748B] uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {currentApps.map((app) => (
                <tr key={app.id} className="hover:bg-[#F8FAFC] transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <img
                        src={app.icon}
                        alt={app.name}
                        className="w-10 h-10 rounded-lg object-cover"
                      />
                      <div>
                        <p className="font-medium text-[#1E293B]">{app.name}</p>
                        <p className="text-xs text-[#94A3B8]">{app.developer}</p>
                      </div>
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
                    {app.viewCount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleToggleStatus(app.id)}
                        className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                          app.status === 'active'
                            ? 'bg-[#FEF2F2] text-[#EF4444] hover:bg-[#FEE2E2]'
                            : 'bg-[#ECFDF5] text-[#10B981] hover:bg-[#D1FAE5]'
                        }`}
                      >
                        {app.status === 'active' ? '下架' : '上线'}
                      </button>
                      <button
                        onClick={() => handleEdit(app.id)}
                        className="px-3 py-1.5 text-xs font-medium bg-[#EFF6FF] text-[#2563EB] rounded-lg hover:bg-[#DBEAFE] transition-colors"
                      >
                        编辑
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-[#E2E8F0] flex items-center justify-between">
            <p className="text-sm text-[#64748B]">
              显示 {startIndex + 1}-{Math.min(startIndex + ITEMS_PER_PAGE, apps.length)} 条，共{' '}
              {apps.length} 条
            </p>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 text-sm font-medium text-[#64748B] bg-white border border-[#E2E8F0] rounded-lg hover:bg-[#F8FAFC] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                上一页
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                    currentPage === page
                      ? 'bg-[#2563EB] text-white'
                      : 'text-[#64748B] bg-white border border-[#E2E8F0] hover:bg-[#F8FAFC]'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 text-sm font-medium text-[#64748B] bg-white border border-[#E2E8F0] rounded-lg hover:bg-[#F8FAFC] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                下一页
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
