import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockCategories } from '../data/mockApps';
import { 
  generateAvatarUrl, 
  generateIconByColorAndName, 
  presetIconColors,
  fileToBase64,
  validateImageFile 
} from '../utils/iconUtils';

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
  const fileInputRef = useRef<HTMLInputElement>(null);
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
  const [isUploading, setIsUploading] = useState(false);

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

  // 处理图标名称变化，自动生成图标
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
    // 当名称改变时，自动生成新图标
    if (name === 'name' && value.trim()) {
      const newIcon = generateAvatarUrl(value);
      setFormData((prev) => ({ ...prev, icon: newIcon }));
    }
  };

  // 随机生成图标
  const handleRandomIcon = () => {
    const name = formData.name || 'APP';
    const randomColor = presetIconColors[Math.floor(Math.random() * presetIconColors.length)];
    const newIcon = generateIconByColorAndName(name, randomColor.color);
    setFormData((prev) => ({ ...prev, icon: newIcon }));
    setErrors((prev) => ({ ...prev, icon: undefined }));
  };

  // 处理图标上传
  const handleIconUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && validateImageFile(file)) {
      setIsUploading(true);
      try {
        const base64 = await fileToBase64(file);
        setFormData((prev) => ({ ...prev, icon: base64 }));
        setErrors((prev) => ({ ...prev, icon: undefined }));
      } catch (error) {
        console.error('上传失败:', error);
        alert('图片上传失败，请重试');
      } finally {
        setIsUploading(false);
      }
    }
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
              onChange={handleNameChange}
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
              应用图标 <span className="text-[#EF4444]">*</span>
            </label>
            <div className="space-y-4">
              {/* 图标预览和上传区域 */}
              <div className="flex items-start space-x-6">
                {/* 图标预览 */}
                <div className="flex-shrink-0">
                  {formData.icon ? (
                    <img
                      src={formData.icon}
                      alt="图标预览"
                      className="w-24 h-24 rounded-xl object-cover border-2 border-[#E2E8F0]"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-xl bg-[#F8FAFC] border-2 border-dashed border-[#E2E8F0] flex items-center justify-center">
                      <span className="text-4xl">📷</span>
                    </div>
                  )}
                </div>
                
                {/* 操作按钮 */}
                <div className="flex-1 space-y-3">
                  <div className="flex items-center space-x-3">
                    <button
                      type="button"
                      onClick={handleRandomIcon}
                      className="px-4 py-2 bg-[#8B5CF6] text-white rounded-lg hover:bg-[#7C3AED] transition-colors text-sm font-medium"
                    >
                      🎲 随机生成
                    </button>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploading}
                      className="px-4 py-2 bg-[#10B981] text-white rounded-lg hover:bg-[#059669] transition-colors text-sm font-medium disabled:opacity-50"
                    >
                      {isUploading ? '上传中...' : '📤 上传图标'}
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/gif,image/webp"
                      onChange={handleIconUpload}
                      className="hidden"
                    />
                  </div>
                  <p className="text-xs text-[#94A3B8]">
                    支持 JPG、PNG、GIF、WebP 格式，文件小于 2MB
                  </p>
                </div>
              </div>
              
              {/* 颜色选择 */}
              <div>
                <label className="block text-xs text-[#64748B] mb-2">
                  选择颜色（与名称组合生成图标）
                </label>
                <div className="flex items-center space-x-2">
                  {presetIconColors.map((item) => (
                    <button
                      key={item.color}
                      type="button"
                      onClick={() => {
                        const name = formData.name || 'APP';
                        const newIcon = generateIconByColorAndName(name, item.color);
                        setFormData((prev) => ({ ...prev, icon: newIcon }));
                      }}
                      className="w-8 h-8 rounded-full hover:scale-110 transition-transform"
                      style={{ backgroundColor: item.color }}
                      title={item.name}
                    />
                  ))}
                </div>
              </div>

              {/* 手动输入URL（可选） */}
              <div>
                <label className="block text-xs text-[#64748B] mb-2">
                  或输入图标URL
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
            </div>
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
