# 数据存储方案实施任务

## Phase 1: 后端基础设施搭建 (2天)

### 1.1 项目初始化
- [ ] 初始化 Node.js + Express 项目
  - 创建 server/ 目录结构
  - 初始化 package.json
  - 安装依赖：express, dm-driver, multer, cors, dotenv
  - 配置 TypeScript (可选)

### 1.2 数据库配置
- [ ] 创建数据库连接配置
  - 配置达梦数据库连接参数
  - 实现连接池管理
  - 添加连接错误处理
  - 创建数据库初始化脚本

### 1.3 数据库表结构
- [ ] 创建所有数据表
  - APP_INFO (应用信息表)
  - APP_SCREENSHOTS (截图表)
  - APP_FEATURES (功能表)
  - APP_CONTACTS (联系人表)
  - APP_CATEGORY (分类表)
  - APP_REVIEWS (评价表)
  - USER_FAVORITES (收藏表)
- [ ] 创建索引
  - 为常用查询字段添加索引
  - 优化查询性能

### 1.4 基础 API 实现
- [ ] 应用管理 API
  - GET /api/apps - 获取应用列表
  - GET /api/apps/:id - 获取应用详情
  - POST /api/apps - 创建应用
  - PUT /api/apps/:id - 更新应用
  - DELETE /api/apps/:id - 删除应用
  - PATCH /api/apps/:id/status - 更新状态
- [ ] 分类管理 API
  - GET /api/categories - 获取分类列表
  - GET /api/categories/:id - 获取分类详情
  - POST /api/categories - 创建分类
  - PUT /api/categories/:id - 更新分类
  - DELETE /api/categories/:id - 删除分类

## Phase 2: 文件上传服务 (1天)

### 2.1 文件上传配置
- [ ] 配置 multer 中间件
  - 设置文件大小限制
  - 配置文件类型白名单
  - 设置存储目录
- [ ] 实现文件命名策略
  - 图标文件命名规则
  - 截图文件命名规则
  - 视频文件命名规则

### 2.2 文件上传 API
- [ ] POST /api/uploads/icon/:appId - 上传应用图标
- [ ] POST /api/uploads/screenshots/:appId - 上传截图
- [ ] POST /api/uploads/video/:appId - 上传介绍视频
- [ ] DELETE /api/uploads/:filepath - 删除上传文件

### 2.3 静态文件服务
- [ ] 配置 express.static
  - 映射 /uploads 路由到 uploads/ 目录
  - 设置缓存策略
  - 配置 CORS

### 2.4 文件管理工具
- [ ] 创建文件清理脚本
  - 删除孤立文件
  - 清理过期临时文件
- [ ] 创建文件迁移工具
  - 批量重命名
  - 批量移动文件

## Phase 3: 业务 API 完善 (1天)

### 3.1 收藏功能 API
- [ ] GET /api/favorites - 获取用户收藏列表
- [ ] POST /api/favorites - 添加收藏
- [ ] DELETE /api/favorites - 取消收藏

### 3.2 评价功能 API
- [ ] GET /api/apps/:appId/reviews - 获取评价列表
- [ ] POST /api/apps/:appId/reviews - 提交评价
- [ ] GET /api/apps/:appId/reviews/stats - 获取评价统计

### 3.3 统计功能 API
- [ ] GET /api/stats/overview - 获取平台统计
- [ ] GET /api/stats/apps - 获取应用统计

## Phase 4: 前端集成 (2-3天)

### 4.1 API 服务层
- [ ] 创建 API 客户端配置
  - axios 实例配置
  - 请求拦截器
  - 响应拦截器
- [ ] 创建服务模块
  - appService (应用服务)
  - uploadService (上传服务)
  - categoryService (分类服务)
  - favoriteService (收藏服务)
  - reviewService (评价服务)

### 4.2 数据管理 Hooks
- [ ] 创建 useApps hook
- [ ] 创建 useCategories hook
- [ ] 创建 useFavorites hook
- [ ] 创建 useReviews hook

### 4.3 替换 Mock 数据
- [ ] 更新 HomePage 数据源
  - 从 API 获取精选应用
  - 从 API 获取热门应用
  - 从 API 获取最新应用
- [ ] 更新 AppDetailPage 数据源
  - 从 API 获取应用详情
  - 从 API 获取评价列表
- [ ] 更新 CategoryPage 数据源
- [ ] 更新 SearchPage 数据源

### 4.4 文件上传组件
- [ ] 创建 ImageUploader 组件
  - 支持拖拽上传
  - 支持多图上传
  - 图片预览功能
  - 上传进度显示
- [ ] 创建 VideoUploader 组件
  - 视频文件选择
  - 上传进度显示
  - 视频预览功能
- [ ] 更新应用发布表单
  - 集成图标上传
  - 集成截图上传
  - 集成视频上传

### 4.5 环境配置
- [ ] 创建 .env 示例文件
- [ ] 配置 Vite 环境变量
- [ ] 配置 API 基础 URL

## Phase 5: 优化与测试 (2天)

### 5.1 性能优化
- [ ] 实现数据缓存机制
  - 分类数据缓存
  - 应用列表缓存
  - 热门应用缓存
- [ ] 实现图片优化
  - 图片压缩
  - 响应式图片
  - 图片懒加载
- [ ] 实现 API 响应缓存

### 5.2 用户体验优化
- [ ] 添加加载状态
  - 骨架屏组件
  - 加载动画
- [ ] 添加错误处理
  - 错误边界组件
  - 重试机制
- [ ] 添加离线提示

### 5.3 测试
- [ ] 单元测试
  - 后端 API 单元测试
  - 前端组件单元测试
- [ ] 集成测试
  - API 端到端测试
  - 文件上传流程测试
- [ ] 性能测试
  - 页面加载性能
  - API 响应时间

### 5.4 文档
- [ ] 编写 API 接口文档
- [ ] 编写部署文档
- [ ] 编写使用指南

## Phase 6: 数据迁移 (可选)

### 6.1 Mock 数据迁移
- [ ] 导出 Mock 数据为 SQL
- [ ] 执行数据库初始化脚本
- [ ] 验证数据完整性
- [ ] 迁移截图文件到本地存储

### 6.2 数据验证
- [ ] 验证应用数据
- [ ] 验证分类数据
- [ ] 验证关联关系

## 任务依赖关系

```
Phase 1 (后端基础设施)
├── 项目初始化
├── 数据库配置
├── 数据库表结构
└── 基础 API 实现
    ↓
Phase 2 (文件上传服务)
├── 文件上传配置
├── 文件上传 API
├── 静态文件服务
└── 文件管理工具
    ↓
Phase 3 (业务 API 完善)
├── 收藏功能 API
├── 评价功能 API
└── 统计功能 API
    ↓
Phase 4 (前端集成)
├── API 服务层
├── 数据管理 Hooks
├── 替换 Mock 数据
└── 文件上传组件
    ↓
Phase 5 (优化与测试)
├── 性能优化
├── 用户体验优化
├── 测试
└── 文档
    ↓
Phase 6 (数据迁移 - 可选)
├── Mock 数据迁移
└── 数据验证
```

## 验收标准

### 功能验收
- [ ] 所有 API 接口正常工作
- [ ] 文件上传下载功能正常
- [ ] 前端页面正常显示数据
- [ ] 收藏和评价功能正常

### 性能验收
- [ ] API 响应时间 < 200ms
- [ ] 图片加载时间 < 1s
- [ ] 页面首次加载时间 < 3s

### 安全验收
- [ ] 文件上传安全验证通过
- [ ] API 权限控制正常
- [ ] SQL 注入防护有效
