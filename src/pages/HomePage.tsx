import { Link } from 'react-router-dom';

interface App {
  id: string;
  name: string;
  icon: string;
  description: string;
  viewCount: number;
  createdAt: string;
  category: string;
}

const mockApps: App[] = [
  {
    id: '1',
    name: '企业邮箱',
    icon: '📧',
    description: '企业级邮件系统，支持日程管理和邮件归档',
    viewCount: 12580,
    createdAt: '2024-01-15',
    category: '办公协作',
  },
  {
    id: '2',
    name: '项目管理',
    icon: '📋',
    description: '敏捷项目管理系统，支持看板和甘特图',
    viewCount: 9860,
    createdAt: '2024-02-20',
    category: '办公协作',
  },
  {
    id: '3',
    name: '财务报销',
    icon: '💰',
    description: '移动端报销系统，审批流程自动化',
    viewCount: 8540,
    createdAt: '2024-01-28',
    category: '财务',
  },
  {
    id: '4',
    name: '人力资源',
    icon: '👥',
    description: '员工档案管理、考勤和绩效评估',
    viewCount: 7230,
    createdAt: '2024-03-05',
    category: '人力资源',
  },
  {
    id: '5',
    name: '客户管理',
    icon: '🤝',
    description: 'CRM系统，追踪销售线索和客户关系',
    viewCount: 6920,
    createdAt: '2024-02-10',
    category: '销售',
  },
  {
    id: '6',
    name: '知识库',
    icon: '📚',
    description: '企业知识管理，文档协作和版本控制',
    viewCount: 5680,
    createdAt: '2024-03-12',
    category: '办公协作',
  },
  {
    id: '7',
    name: '视频会议',
    icon: '🎥',
    description: '高清视频会议，支持屏幕共享和录制',
    viewCount: 11200,
    createdAt: '2024-01-05',
    category: '办公协作',
  },
  {
    id: '8',
    name: '数据分析',
    icon: '📊',
    description: '可视化数据分析平台，支持自定义报表',
    viewCount: 4890,
    createdAt: '2024-02-25',
    category: '数据',
  },
  {
    id: '9',
    name: '供应链管理',
    icon: '🚚',
    description: '采购、库存和物流全流程管理',
    viewCount: 3450,
    createdAt: '2024-03-18',
    category: '运营',
  },
  {
    id: '10',
    name: 'IT服务台',
    icon: '🔧',
    description: '工单系统和IT资产管理系统',
    viewCount: 4200,
    createdAt: '2024-02-08',
    category: 'IT服务',
  },
];

interface Category {
  id: string;
  name: string;
  count: number;
}

const categories: Category[] = [
  { id: 'office', name: '办公协作', count: 28 },
  { id: 'finance', name: '财务', count: 15 },
  { id: 'hr', name: '人力资源', count: 12 },
  { id: 'sales', name: '销售', count: 18 },
  { id: 'data', name: '数据分析', count: 9 },
  { id: 'it', name: 'IT服务', count: 11 },
  { id: 'operations', name: '运营', count: 14 },
  { id: 'marketing', name: '市场营销', count: 8 },
];

function AppCard({ app, featured = false }: { app: App; featured?: boolean }) {
  return (
    <Link to={`/app/${app.id}`}>
      <div
        className={`bg-white rounded-xl p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer ${
          featured ? 'border-2 border-[#2563EB]' : 'shadow-sm'
        }`}
      >
        <div className="flex items-start space-x-4">
          <div className="text-4xl">{app.icon}</div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-[#1E293B] truncate">
                {app.name}
              </h3>
              {featured && (
                <span className="px-2 py-1 bg-[#2563EB] text-white text-xs rounded-full">
                  精选
                </span>
              )}
            </div>
            <p className="mt-2 text-sm text-[#64748B] line-clamp-2">
              {app.description}
            </p>
            <div className="mt-4 flex items-center justify-between text-xs text-[#94A3B8]">
              <span>浏览 {app.viewCount.toLocaleString()}</span>
              <span>{app.category}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

function SectionHeader({
  title,
  linkTo,
}: {
  title: string;
  linkTo: string;
}) {
  return (
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-2xl font-bold text-[#1E293B]">{title}</h2>
      <Link
        to={linkTo}
        className="text-[#2563EB] hover:text-[#1D4ED8] transition-colors text-sm font-medium"
      >
        查看更多 →
      </Link>
    </div>
  );
}

function CategoryNav() {
  return (
    <div className="mb-12">
      <SectionHeader title="应用分类" linkTo="/category/all" />
      <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide">
        {categories.map((category) => (
          <Link
            key={category.id}
            to={`/category/${category.id}`}
            className="flex-shrink-0 bg-white px-6 py-4 rounded-xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 text-center min-w-[140px]"
          >
            <div className="text-2xl mb-2">
              {category.id === 'office' && '📋'}
              {category.id === 'finance' && '💰'}
              {category.id === 'hr' && '👥'}
              {category.id === 'sales' && '🤝'}
              {category.id === 'data' && '📊'}
              {category.id === 'it' && '🔧'}
              {category.id === 'operations' && '🚚'}
              {category.id === 'marketing' && '📢'}
            </div>
            <div className="text-sm font-medium text-[#1E293B]">
              {category.name}
            </div>
            <div className="text-xs text-[#64748B] mt-1">
              {category.count} 个应用
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

function FeaturedSection() {
  const featuredApps = mockApps.filter((app) =>
    ['1', '2', '7', '3', '5', '8'].includes(app.id)
  );

  return (
    <div className="mb-12">
      <SectionHeader title="精选推荐" linkTo="/category/featured" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {featuredApps.map((app) => (
          <AppCard key={app.id} app={app} featured />
        ))}
      </div>
    </div>
  );
}

function HotAppsSection() {
  const hotApps = [...mockApps]
    .sort((a, b) => b.viewCount - a.viewCount)
    .slice(0, 8);

  return (
    <div className="mb-12">
      <SectionHeader title="热门应用" linkTo="/category/hot" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {hotApps.map((app) => (
          <AppCard key={app.id} app={app} />
        ))}
      </div>
    </div>
  );
}

function NewAppsSection() {
  const newApps = [...mockApps]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 8);

  return (
    <div className="mb-12">
      <SectionHeader title="最新上架" linkTo="/category/new" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {newApps.map((app) => (
          <AppCard key={app.id} app={app} />
        ))}
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <div>
      <FeaturedSection />
      <CategoryNav />
      <HotAppsSection />
      <NewAppsSection />
    </div>
  );
}
