import { mockCategories } from '../../data/mockApps';

interface CategoryTagProps {
  category: string;
  showIcon?: boolean;
}

const categoryIcons: Record<string, string> = {
  productivity: '💼',
  hr: '👥',
  finance: '💰',
  dev: '💻',
  communication: '💬',
  analytics: '📊',
};

export const CategoryTag = ({ category, showIcon = false }: CategoryTagProps) => {
  const categoryInfo = mockCategories.find((cat) => cat.id === category);
  const displayName = categoryInfo?.name || category;
  const icon = categoryIcons[category] || '📦';

  return (
    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-600">
      {showIcon && <span className="mr-1">{icon}</span>}
      {displayName}
    </span>
  );
};
