// 图标工具函数

// 基于名称生成颜色
export const generateColorFromName = (name: string): string => {
  const colors = [
    '#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', 
    '#EF4444', '#EC4899', '#14B8A6', '#6366F1',
    '#F97316', '#84CC16', '#06B6D4', '#A855F7'
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

// 基于名称生成图标URL
export const generateAvatarUrl = (name: string, size: number = 128): string => {
  const color = generateColorFromName(name);
  const initials = name.slice(0, 2).toUpperCase();
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&size=${size}&background=${color.slice(1)}&color=ffffff&bold=true`;
};

// 预设图标颜色
export const presetIconColors = [
  { color: '#3B82F6', name: '蓝色' },
  { color: '#10B981', name: '绿色' },
  { color: '#8B5CF6', name: '紫色' },
  { color: '#F59E0B', name: '橙色' },
  { color: '#EF4444', name: '红色' },
  { color: '#EC4899', name: '粉色' },
  { color: '#14B8A6', name: '青色' },
  { color: '#6366F1', name: '靛蓝' },
];

// 根据颜色和名称生成图标
export const generateIconByColorAndName = (name: string, color: string): string => {
  const initials = name.slice(0, 2).toUpperCase();
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&size=128&background=${color.slice(1)}&color=ffffff&bold=true`;
};

// 将文件转换为base64
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

// 验证图片文件
export const validateImageFile = (file: File): boolean => {
  const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  const maxSize = 2 * 1024 * 1024; // 2MB
  
  if (!validTypes.includes(file.type)) {
    alert('请上传 JPG、PNG、GIF 或 WebP 格式的图片');
    return false;
  }
  
  if (file.size > maxSize) {
    alert('图片大小不能超过 2MB');
    return false;
  }
  
  return true;
};
