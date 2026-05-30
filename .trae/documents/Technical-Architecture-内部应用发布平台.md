# 企业内部应用发布平台 - 技术架构文档

## 1. 架构设计

```
┌─────────────────────────────────────────────────────────────┐
│                        前端应用层                           │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐         │
│  │  首页    │ │ 详情页  │ │ 分类页  │ │ 管理后台 │         │
│  └────┬────┘ └────┬────┘ └────┬────┘ └────┬────┘         │
├───────┴───────────┴───────────┴───────────┴─────────────────┤
│                       状态管理层                              │
│              React Context / LocalStorage                    │
├─────────────────────────────────────────────────────────────┤
│                       数据层                                  │
│                   Mock JSON Data                             │
├─────────────────────────────────────────────────────────────┤
│                     基础层                                    │
│            Vite + React 18 + TailwindCSS                    │
└─────────────────────────────────────────────────────────────┘
```

## 2. 技术栈说明

| 技术类别 | 技术选型 | 版本 | 说明 |
|----------|----------|------|------|
| 框架 | React | 18.x | 核心 UI 框架 |
| 构建工具 | Vite | 5.x | 快速开发和构建 |
| 样式方案 | Tailwind CSS | 3.x | 原子化 CSS |
| 路由 | React Router | 6.x | SPA 路由管理 |
| 图标 | Lucide React | 最新 | 轻量级图标库 |
| 字体 | Google Fonts | - | 思源黑体 + Inter |

## 3. 路由定义

| 路由路径 | 页面组件 | 功能说明 |
|----------|----------|----------|
| `/` | HomePage | 首页，应用精选推荐 |
| `/app/:id` | AppDetailPage | 应用详情页 |
| `/category/:categoryId` | CategoryPage | 分类应用列表 |
| `/search` | SearchPage | 搜索结果页 |
| `/favorites` | FavoritesPage | 我的收藏 |
| `/admin` | AdminPage | 管理后台首页 |
| `/admin/publish` | PublishAppPage | 发布新应用 |
| `/admin/apps` | ManageAppsPage | 应用管理列表 |

## 4. 组件结构

```
src/
├── components/
│   ├── layout/
│   │   ├── Header.tsx          # 顶部导航栏
│   │   ├── Footer.tsx          # 页脚
│   │   └── Layout.tsx         # 页面布局组件
│   ├── common/
│   │   ├── AppCard.tsx        # 应用卡片组件
│   │   ├── SearchBar.tsx      # 搜索框组件
│   │   ├── CategoryTag.tsx    # 分类标签组件
│   │   └── EmptyState.tsx     # 空状态组件
│   └── admin/
│       ├── AppForm.tsx        # 应用发布表单
│       └── AppTable.tsx       # 应用管理表格
├── pages/
│   ├── HomePage.tsx
│   ├── AppDetailPage.tsx
│   ├── CategoryPage.tsx
│   ├── SearchPage.tsx
│   ├── FavoritesPage.tsx
│   ├── AdminPage.tsx
│   ├── PublishAppPage.tsx
│   └── ManageAppsPage.tsx
├── data/
│   └── mockApps.ts            # 模拟应用数据
├── context/
│   └── FavoritesContext.tsx   # 收藏状态管理
├── types/
│   └── index.ts               # TypeScript 类型定义
└── App.tsx
```

## 5. 数据模型定义

### 5.1 应用类型 (App)

```typescript
interface App {
  id: string;
  name: string;
  icon: string;
  description: string;
  category: string;
  department: string;
  tags: string[];
  screenshots: string[];
  url: string;
  developer: string;
  version: string;
  status: 'active' | 'inactive';
  viewCount: number;
  favoriteCount: number;
  createdAt: string;
}
```

### 5.2 收藏数据类型 (Favorite)

```typescript
interface Favorite {
  appId: string;
  createdAt: string;
}
```

### 5.3 分类数据 (Category)

```typescript
interface Category {
  id: string;
  name: string;
  icon: string;
  appCount: number;
}
```

## 6. Mock 数据结构

```typescript
// 应用数据示例
const mockApps: App[] = [
  {
    id: 'app-001',
    name: '企业协同办公平台',
    icon: '/icons/app1.png',
    description: '一站式协同办公解决方案，支持文档协作、项目管理...',
    category: 'productivity',
    department: 'IT部门',
    tags: ['协作', '办公', '文档'],
    screenshots: ['/screenshots/app1-1.png'],
    url: 'https://oa.company.com',
    developer: 'IT研发中心',
    version: '3.2.1',
    status: 'active',
    viewCount: 12580,
    favoriteCount: 892,
    createdAt: '2024-01-15'
  },
  // ... 更多应用数据
];

// 分类数据
const mockCategories: Category[] = [
  { id: 'productivity', name: '效率办公', icon: 'Briefcase', appCount: 12 },
  { id: 'hr', name: '人力资源', icon: 'Users', appCount: 8 },
  { id: 'finance', name: '财务管理', icon: 'Calculator', appCount: 6 },
  { id: 'dev', name: '研发工具', icon: 'Code', appCount: 15 },
  { id: 'communication', name: '沟通协作', icon: 'MessageSquare', appCount: 10 },
  { id: 'analytics', name: '数据分析', icon: 'BarChart', appCount: 7 },
];
```

## 7. 页面功能实现要点

### 7.1 首页 (HomePage)
- 精选推荐：展示 `isFeatured: true` 的应用
- 热门应用：按 `viewCount` 降序取前 8 个
- 最新上架：按 `createdAt` 降序取前 8 个
- 分类导航：展示所有分类及数量

### 7.2 应用详情页 (AppDetailPage)
- 通过 `useParams()` 获取应用 ID
- 从 Mock 数据中查找对应应用
- 浏览量 +1 更新
- 收藏按钮状态由 FavoritesContext 管理

### 7.3 分类页 (CategoryPage)
- 通过 `useParams()` 获取分类 ID
- 筛选 `category === 分类ID` 的应用
- 支持分页展示

### 7.4 搜索功能
- 基于应用名称、描述、标签进行过滤
- 支持模糊匹配
- 搜索词高亮显示

### 7.5 收藏功能
- 使用 React Context 存储收藏状态
- 收藏数据持久化到 LocalStorage
- 支持添加/移除收藏

### 7.6 管理后台
- 表单验证必填项
- 应用列表支持编辑和状态切换
- 统计数据实时计算

## 8. 样式规范

### 8.1 颜色变量

```css
:root {
  --color-primary: #2563EB;
  --color-primary-hover: #1D4ED8;
  --color-secondary: #3B82F6;
  --color-accent: #10B981;
  --color-background: #F8FAFC;
  --color-surface: #FFFFFF;
  --color-text-primary: #1E293B;
  --color-text-secondary: #64748B;
  --color-border: #E2E8F0;
}
```

### 8.2 响应式断点

```css
/* 移动端 */
@media (max-width: 768px) { ... }

/* 平板端 */
@media (min-width: 768px) and (max-width: 1200px) { ... }

/* 桌面端 */
@media (min-width: 1200px) { ... }
```

## 9. 性能优化

- 图片懒加载
- 组件按需加载 (React.lazy)
- 数据缓存策略
- 防抖搜索输入
