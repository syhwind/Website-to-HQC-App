import { useState } from 'react';
import { mockApps, mockCategories } from '../data/mockApps';
import { App } from '../types';
import { useAppContext } from '../context/AppContext';

const ITEMS_PER_PAGE = 10;

interface FormData {
  name: string;
  description: string;
  icon: string;
  url: string;
  category: string;
  department: string;
  developer: string;
  version: string;
  tags: string;
}

interface FormErrors {
  name?: string;
  description?: string;
  icon?: string;
  url?: string;
}

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
  const { apps, categories, updateApp, refreshApps } = useAppContext();
  const [currentPage, setCurrentPage] = useState(1);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingApp, setEditingApp] = useState<App | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    icon: '',
    url: '',
    category: '',
    department: '',
    developer: '',
    version: '',
    tags: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const totalPages = Math.ceil(apps.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentApps = apps.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleToggleStatus = (appId: string) => {
    const app = apps.find(a => a.id === appId);
    if (app) {
      updateApp(appId, {
        status: app.status === 'active' ? 'inactive' : 'active',
      });
    }
  };

  const handleEdit = (appId: string) => {
    const app = apps.find((a) => a.id === appId);
    if (app) {
      setEditingApp(app);
      setFormData({
        name: app.name,
        description: app.description,
        icon: app.icon,
        url: app.url,
        category: app.category,
        department: app.department,
        developer: app.developer,
        version: app.version,
        tags: app.tags.join(','),
      });
      setIsEditModalOpen(true);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = '请输入应用名称';
    }
    if (!formData.description.trim()) {
      newErrors.description = '请输入应用描述';
    }
    if (!formData.icon.trim()) {
      newErrors.icon = '请输入应用图标 URL';
    }
    if (!formData.url.trim()) {
      newErrors.url = '请输入访问地址 URL';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm() && editingApp) {
      updateApp(editingApp.id, {
        name: formData.name,
        description: formData.description,
        icon: formData.icon,
        url: formData.url,
        category: formData.category,
        department: formData.department,
        developer: formData.developer,
        version: formData.version,
        tags: formData.tags.split(',').map((tag) => tag.trim()).filter(Boolean),
      });
      setIsEditModalOpen(false);
      setEditingApp(null);
    }
  };

  const handleCancel = () => {
    setIsEditModalOpen(false);
    setEditingApp(null);
    setErrors({});
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
              显示 {startIndex + 1}-{Math.min(startIndex + ITEMS_PER_PAGE, apps.length)} 条，共 {apps.length} 条
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

      {/* 编辑模态框 */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-[#1E293B]">编辑应用</h2>
                  <p className="text-[#64748B]">修改应用信息</p>
                </div>
                <button
                  onClick={handleCancel}
                  className="text-[#64748B] hover:text-[#1E293B] text-2xl font-bold"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-[#1E293B] mb-2">
                    应用名称 <span className="text-[#EF4444]">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="请输入应用名称"
                    className={`w-full px-4 py-3 rounded-lg border ${
                      errors.name ? 'border-[#EF4444]' : 'border-[#E2E8F0]'
                    } focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 outline-none transition-all`}
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-[#EF4444]">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#1E293B] mb-2">
                    应用描述 <span className="text-[#EF4444]">*</span>
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="请输入应用描述"
                    rows={4}
                    className={`w-full px-4 py-3 rounded-lg border ${
                      errors.description ? 'border-[#EF4444]' : 'border-[#E2E8F0]'
                    } focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 outline-none transition-all resize-none`}
                  />
                  {errors.description && (
                    <p className="mt-1 text-sm text-[#EF4444]">{errors.description}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#1E293B] mb-2">
                    应用图标 URL <span className="text-[#EF4444]">*</span>
                  </label>
                  <input
                    type="url"
                    name="icon"
                    value={formData.icon}
                    onChange={handleChange}
                    placeholder="https://example.com/icon.png"
                    className={`w-full px-4 py-3 rounded-lg border ${
                      errors.icon ? 'border-[#EF4444]' : 'border-[#E2E8F0]'
                    } focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 outline-none transition-all`}
                  />
                  {errors.icon && (
                    <p className="mt-1 text-sm text-[#EF4444]">{errors.icon}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#1E293B] mb-2">
                    访问地址 URL <span className="text-[#EF4444]">*</span>
                  </label>
                  <input
                    type="url"
                    name="url"
                    value={formData.url}
                    onChange={handleChange}
                    placeholder="https://example.com/app"
                    className={`w-full px-4 py-3 rounded-lg border ${
                      errors.url ? 'border-[#EF4444]' : 'border-[#E2E8F0]'
                    } focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 outline-none transition-all`}
                  />
                  {errors.url && (
                    <p className="mt-1 text-sm text-[#EF4444]">{errors.url}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#1E293B] mb-2">
                    所属分类
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-[#E2E8F0] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 outline-none transition-all bg-white"
                  >
                    <option value="">请选择分类</option>
                    {mockCategories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#1E293B] mb-2">
                    所属部门
                  </label>
                  <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    placeholder="请输入所属部门"
                    className="w-full px-4 py-3 rounded-lg border border-[#E2E8F0] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#1E293B] mb-2">
                    开发商/负责人
                  </label>
                  <input
                    type="text"
                    name="developer"
                    value={formData.developer}
                    onChange={handleChange}
                    placeholder="请输入开发商或负责人"
                    className="w-full px-4 py-3 rounded-lg border border-[#E2E8F0] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#1E293B] mb-2">
                    版本号
                  </label>
                  <input
                    type="text"
                    name="version"
                    value={formData.version}
                    onChange={handleChange}
                    placeholder="如：1.0.0"
                    className="w-full px-4 py-3 rounded-lg border border-[#E2E8F0] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#1E293B] mb-2">
                    标签
                  </label>
                  <input
                    type="text"
                    name="tags"
                    value={formData.tags}
                    onChange={handleChange}
                    placeholder="多个标签用逗号分隔，如：审批,流程,管理"
                    className="w-full px-4 py-3 rounded-lg border border-[#E2E8F0] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 outline-none transition-all"
                  />
                  <p className="mt-1 text-xs text-[#94A3B8]">
                    多个标签用逗号分隔
                  </p>
                </div>

                <div className="flex items-center justify-end space-x-4 mt-8 pt-6 border-t border-[#E2E8F0]">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-6 py-3 text-[#64748B] hover:text-[#1E293B] hover:bg-[#F8FAFC] rounded-lg transition-colors font-medium"
                  >
                    取消
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-[#2563EB] text-white rounded-lg hover:bg-[#1D4ED8] transition-colors font-medium"
                  >
                    保存修改
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
