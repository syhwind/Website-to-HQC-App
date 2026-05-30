import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockCategories } from '../data/mockApps';

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

export default function PublishAppPage() {
  const navigate = useNavigate();
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
    if (validateForm()) {
      alert('应用发布成功！');
      navigate('/admin');
    }
  };

  const handleCancel = () => {
    navigate('/admin');
  };

  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#1E293B] mb-2">发布新应用</h1>
        <p className="text-[#64748B]">填写应用信息并提交审核</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-8">
        <div className="space-y-6">
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
            提交发布
          </button>
        </div>
      </form>
    </div>
  );
}
