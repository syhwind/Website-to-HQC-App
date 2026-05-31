# 企业内部应用发布平台 - 数据存储方案实施指南

## 项目概述

本项目已成功实现从静态 Mock 数据到数据库驱动架构的转型，使用达梦数据库作为结构化数据存储，本地文件系统存储图片和视频资源。

## 技术架构

### 后端技术栈
- **运行时**: Node.js
- **框架**: Express.js 4.x
- **数据库**: 达梦数据库 (DM Database)
- **文件上传**: Multer
- **数据库驱动**: dm-driver

### 前端技术栈
- **框架**: React 18 + TypeScript
- **构建工具**: Vite 6
- **样式**: Tailwind CSS
- **HTTP 客户端**: Axios

## 目录结构

```
/workspace/
├── server/                           # 后端服务
│   ├── src/
│   │   ├── routes/                 # API 路由
│   │   │   ├── apps.js            # 应用管理 API
│   │   │   ├── categories.js      # 分类管理 API
│   │   │   ├── favorites.js        # 收藏管理 API
│   │   │   ├── uploads.js          # 文件上传 API
│   │   │   └── reviews.js          # 评价管理 API
│   │   ├── db/
│   │   │   ├── connection.js       # 数据库连接
│   │   │   └── init.js            # 数据库初始化
│   │   └── app.js                 # Express 应用入口
│   ├── uploads/                    # 上传文件目录
│   ├── package.json
│   └── .env.example
├── src/                             # 前端应用
│   ├── services/
│   │   └── api.ts                 # API 服务层
│   ├── hooks/
│   │   ├── useApps.ts             # 应用数据 Hook
│   │   ├── useCategories.ts        # 分类数据 Hook
│   │   ├── useFavorites.ts         # 收藏数据 Hook
│   │   └── useReviews.ts           # 评价数据 Hook
│   └── ...
├── uploads/                         # 本地文件存储
│   └── apps/
│       └── {appId}/
│           ├── icon.png
│           ├── screenshots/
│           └── videos/
├── .env                            # 环境变量
└── package.json
```

## 快速开始

### 1. 配置达梦数据库

确保已安装达梦数据库，并创建数据库：

```sql
CREATE DATABASE APP_STORE_DB;
```

### 2. 配置后端服务

```bash
cd server

# 复制环境变量配置
cp .env.example .env

# 编辑 .env 文件，配置数据库连接信息
# DB_HOST=你的数据库主机
# DB_PORT=5236
# DB_NAME=APP_STORE_DB
# DB_USER=SYSDBA
# DB_PASSWORD=你的密码

# 安装依赖
npm install

# 初始化数据库表
npm run db:init

# 启动开发服务器
npm run dev
```

后端服务将在 http://localhost:3001 运行

### 3. 配置前端应用

```bash
# 复制环境变量配置
cp .env.example .env

# 编辑 .env 文件
# VITE_API_URL=http://localhost:3001/api

# 安装依赖（如果尚未安装）
npm install

# 启动开发服务器
npm run dev
```

前端应用将在 http://localhost:5173 运行

## API 接口文档

### 应用管理 API

#### 获取应用列表
```
GET /api/apps?page=1&pageSize=12&category=xxx&keyword=xxx&sortBy=popular|latest|featured
```

#### 获取应用详情
```
GET /api/apps/:id
```

#### 创建应用
```
POST /api/apps
Body: {
  "name": "应用名称",
  "description": "应用描述",
  "categoryId": "分类ID",
  ...
}
```

#### 更新应用
```
PUT /api/apps/:id
Body: { ... }
```

#### 删除应用
```
DELETE /api/apps/:id
```

#### 更新应用状态
```
PATCH /api/apps/:id/status
Body: { "status": "active|inactive" }
```

### 分类管理 API

#### 获取分类列表
```
GET /api/categories
```

#### 创建分类
```
POST /api/categories
Body: { "name": "分类名称", "icon": "图标", "description": "描述" }
```

### 收藏管理 API

#### 获取用户收藏
```
GET /api/favorites?userId=xxx
```

#### 添加收藏
```
POST /api/favorites
Body: { "userId": "xxx", "appId": "xxx" }
```

#### 取消收藏
```
DELETE /api/favorites?userId=xxx&appId=xxx
```

### 评价管理 API

#### 获取应用评价
```
GET /api/apps/:appId/reviews?page=1&pageSize=10
```

#### 提交评价
```
POST /api/apps/:appId/reviews
Body: { "userId": "xxx", "userName": "张三", "rating": 5, "comment": "评价内容" }
```

### 文件上传 API

#### 上传应用图标
```
POST /api/uploads/icon/:appId
Content-Type: multipart/form-data
Body: file (image)
```

#### 上传应用截图
```
POST /api/uploads/screenshots/:appId
Content-Type: multipart/form-data
Body: files[] (multiple images)
```

#### 上传介绍视频
```
POST /api/uploads/video/:appId
Content-Type: multipart/form-data
Body: file (video)
```

## 前端集成示例

### 1. 使用 Hook 获取数据

```typescript
import { useApps, useCategories, useAppDetail } from './hooks';

// 在组件中使用
function AppList() {
  const { apps, loading, error, pagination } = useApps({
    page: 1,
    pageSize: 12,
    category: 'productivity',
    sortBy: 'popular'
  });

  if (loading) return <div>加载中...</div>;
  if (error) return <div>错误: {error.message}</div>;

  return (
    <div>
      {apps.map(app => (
        <AppCard key={app.id} app={app} />
      ))}
    </div>
  );
}
```

### 2. 使用文件上传服务

```typescript
import { uploadService } from './services/api';

async function handleUpload() {
  const file = event.target.files[0];
  
  try {
    const response = await uploadService.uploadIcon(appId, file, (progress) => {
      console.log('上传进度:', progress);
    });
    
    if (response.success) {
      console.log('上传成功:', response.data.path);
    }
  } catch (error) {
    console.error('上传失败:', error);
  }
}
```

## 文件存储方案

### 存储策略

1. **图片存储**
   - 应用图标: `/uploads/apps/{appId}/{appId}_icon.png`
   - 应用截图: `/uploads/apps/{appId}/screenshots/{appId}_screenshot_{index}.png`

2. **视频存储**
   - 介绍视频: `/uploads/apps/{appId}/videos/{appId}_video.mp4`

3. **访问路径**
   - 前端通过 `/uploads/...` 路径访问文件
   - 后端配置了静态文件服务

### 文件大小限制

- 图标: 5MB
- 截图: 10MB/张
- 视频: 50MB

## 数据库表结构

### 主要数据表

1. **APP_INFO** - 应用信息表
2. **APP_CATEGORY** - 应用分类表
3. **APP_SCREENSHOTS** - 应用截图表
4. **APP_FEATURES** - 应用功能表
5. **APP_CONTACTS** - 联系人表
6. **APP_REVIEWS** - 评价表
7. **USER_FAVORITES** - 收藏表

## 环境变量配置

### 后端 (.env)

```bash
DB_HOST=localhost
DB_PORT=5236
DB_NAME=APP_STORE_DB
DB_USER=SYSDBA
DB_PASSWORD=SYSDBA
PORT=3001
NODE_ENV=development
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=10485760
```

### 前端 (.env)

```bash
VITE_API_URL=http://localhost:3001/api
VITE_APP_TITLE=企业内部应用发布平台
```

## 部署注意事项

### 1. 数据库配置
- 确保达梦数据库已启动并可访问
- 配置正确的数据库连接信息
- 运行 `npm run db:init` 初始化数据库表

### 2. 文件存储
- 确保 `uploads` 目录有写入权限
- 生产环境建议配置 Nginx 静态文件服务
- 定期清理过期文件

### 3. 环境变量
- 生产环境务必配置正确的环境变量
- 不要将敏感信息提交到版本控制

### 4. CORS 配置
- 后端已配置 CORS
- 如有需要可调整允许的域名

## 故障排查

### 数据库连接失败
1. 检查数据库服务是否启动
2. 验证数据库连接信息
3. 检查防火墙设置

### 文件上传失败
1. 检查上传目录权限
2. 验证文件大小限制
3. 确认文件类型是否允许

### API 请求失败
1. 检查后端服务是否运行
2. 验证 API 基础 URL 配置
3. 查看浏览器控制台错误信息

## 后续优化建议

1. **缓存策略**: 实现 Redis 缓存提高性能
2. **CDN 加速**: 将静态文件迁移到 CDN
3. **图片压缩**: 添加图片压缩和格式转换
4. **监控告警**: 集成应用性能监控
5. **备份策略**: 配置数据库定期备份
6. **日志管理**: 完善日志记录和分析

## 联系方式

如有问题，请联系技术支持团队。
