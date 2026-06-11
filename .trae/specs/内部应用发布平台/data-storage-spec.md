# 数据存储方案规范 - 企业内部应用发布平台

## 1. 背景与目标

### 1.1 项目现状
- 当前采用静态 Mock 数据（[src/data/mockApps.ts](file:///workspace/src/data/mockApps.ts)）
- 收藏功能使用 localStorage 持久化
- 图片和视频使用第三方占位图服务

### 1.2 改造目标
- 使用达梦数据库（DM Database）作为结构化数据存储
- 采用本地文件系统存储图片和视频
- 提供 RESTful API 接口供前端调用
- 优化数据持久化策略

## 2. 数据存储架构

### 2.1 整体架构设计

```
┌─────────────────────────────────────────────────────────────┐
│                     前端应用层 (React)                       │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                  API Service Layer                    │   │
│  │    axios / fetch → API Base URL: /api               │   │
│  └─────────────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────────────┤
│                     后端服务层 (Node.js + Express)          │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐     │
│  │ App API  │ │Upload API│ │Review API│ │Category API│    │
│  └────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘     │
├───────┴────────────┴────────────┴────────────┴─────────────────┤
│                    业务逻辑层                                │
│        Validation / Business Logic / Error Handling          │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────────┐    ┌────────────────────────┐    │
│  │    DM Database      │    │   Local File Storage    │    │
│  │  (达梦数据库)       │    │   (本地文件系统)        │    │
│  └─────────────────────┘    └────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 技术栈

| 组件 | 技术选型 | 版本 | 说明 |
|------|----------|------|------|
| 后端框架 | Express.js | 4.x | 轻量级 Node.js Web 框架 |
| 数据库驱动 | dm-driver | 最新 | 达梦数据库官方 Node.js 驱动 |
| 文件上传 | multer | 1.x | Node.js 文件上传中间件 |
| 文件路径 | express-static-files | - | 静态文件服务 |
| API 文档 | - | - | 内置 RESTful API |
| 数据库连接池 | dm-pool | - | 连接池管理 |

## 3. 数据库设计（达梦数据库）

### 3.1 数据库信息

```sql
数据库名称: APP_STORE_DB
字符集: UTF-8
表空间: MAIN
```

### 3.2 表结构设计

#### 3.2.1 应用信息表 (APP_INFO)

```sql
CREATE TABLE APP_INFO (
    ID              VARCHAR(50) PRIMARY KEY,
    NAME            VARCHAR(200) NOT NULL,
    ICON            VARCHAR(500),
    DESCRIPTION     TEXT,
    INTRODUCTION     TEXT,
    CATEGORY_ID     VARCHAR(50),
    DEPARTMENT      VARCHAR(100),
    TAGS            VARCHAR(500),
    URL             VARCHAR(500),
    DEVELOPER       VARCHAR(100),
    VERSION         VARCHAR(50),
    STATUS          VARCHAR(20) DEFAULT 'active',
    VIEW_COUNT      INT DEFAULT 0,
    FAVORITE_COUNT  INT DEFAULT 0,
    VIDEO_URL       VARCHAR(500),
    IS_FEATURED     INT DEFAULT 0,
    CREATED_AT      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UPDATED_AT      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (CATEGORY_ID) REFERENCES APP_CATEGORY(ID)
);

COMMENT ON TABLE APP_INFO IS '应用信息表';
COMMENT ON COLUMN APP_INFO.ID IS '应用唯一标识';
COMMENT ON COLUMN APP_INFO.NAME IS '应用名称';
COMMENT ON COLUMN APP_INFO.ICON IS '应用图标路径';
COMMENT ON COLUMN APP_INFO.INTRODUCTION IS '应用详细介绍';
COMMENT ON COLUMN APP_INFO.TAGS IS '应用标签，逗号分隔';
COMMENT ON COLUMN APP_INFO.STATUS IS '状态: active/inactive';
COMMENT ON COLUMN APP_INFO.IS_FEATURED IS '是否精选: 0-否, 1-是';
```

#### 3.2.2 应用截图表 (APP_SCREENSHOTS)

```sql
CREATE TABLE APP_SCREENSHOTS (
    ID          VARCHAR(50) PRIMARY KEY,
    APP_ID      VARCHAR(50) NOT NULL,
    FILE_PATH   VARCHAR(500) NOT NULL,
    SORT_ORDER  INT DEFAULT 0,
    CREATED_AT  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (APP_ID) REFERENCES APP_INFO(ID) ON DELETE CASCADE
);

COMMENT ON TABLE APP_SCREENSHOTS IS '应用截图表';
```

#### 3.2.3 应用功能表 (APP_FEATURES)

```sql
CREATE TABLE APP_FEATURES (
    ID          VARCHAR(50) PRIMARY KEY,
    APP_ID      VARCHAR(50) NOT NULL,
    FEATURE     VARCHAR(500) NOT NULL,
    SORT_ORDER  INT DEFAULT 0,
    CREATED_AT  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (APP_ID) REFERENCES APP_INFO(ID) ON DELETE CASCADE
);

COMMENT ON TABLE APP_FEATURES IS '应用功能表';
```

#### 3.2.4 联系人表 (APP_CONTACTS)

```sql
CREATE TABLE APP_CONTACTS (
    ID          VARCHAR(50) PRIMARY KEY,
    APP_ID      VARCHAR(50) NOT NULL,
    NAME        VARCHAR(100) NOT NULL,
    ROLE        VARCHAR(100),
    EMAIL       VARCHAR(200),
    PHONE       VARCHAR(50),
    AVATAR      VARCHAR(500),
    CREATED_AT  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (APP_ID) REFERENCES APP_INFO(ID) ON DELETE CASCADE
);

COMMENT ON TABLE APP_CONTACTS IS '应用联系人表';
```

#### 3.2.5 应用分类表 (APP_CATEGORY)

```sql
CREATE TABLE APP_CATEGORY (
    ID          VARCHAR(50) PRIMARY KEY,
    NAME        VARCHAR(100) NOT NULL,
    ICON        VARCHAR(100),
    DESCRIPTION VARCHAR(500),
    APP_COUNT   INT DEFAULT 0,
    CREATED_AT  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UPDATED_AT  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

COMMENT ON TABLE APP_CATEGORY IS '应用分类表';
```

#### 3.2.6 用户评价表 (APP_REVIEWS)

```sql
CREATE TABLE APP_REVIEWS (
    ID          VARCHAR(50) PRIMARY KEY,
    APP_ID      VARCHAR(50) NOT NULL,
    USER_ID     VARCHAR(50) NOT NULL,
    USER_NAME   VARCHAR(100),
    USER_AVATAR VARCHAR(500),
    RATING      INT NOT NULL CHECK (RATING >= 1 AND RATING <= 5),
    COMMENT     TEXT,
    CREATED_AT  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (APP_ID) REFERENCES APP_INFO(ID) ON DELETE CASCADE
);

COMMENT ON TABLE APP_REVIEWS IS '用户评价表';
```

#### 3.2.7 用户收藏表 (USER_FAVORITES)

```sql
CREATE TABLE USER_FAVORITES (
    ID          VARCHAR(50) PRIMARY KEY,
    USER_ID     VARCHAR(50) NOT NULL,
    APP_ID      VARCHAR(50) NOT NULL,
    CREATED_AT  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (USER_ID, APP_ID),
    FOREIGN KEY (APP_ID) REFERENCES APP_INFO(ID) ON DELETE CASCADE
);

COMMENT ON TABLE USER_FAVORITES IS '用户收藏表';
COMMENT ON COLUMN USER_FAVORITES.USER_ID IS '用户ID';
```

### 3.3 索引设计

```sql
-- 应用信息表索引
CREATE INDEX IDX_APP_NAME ON APP_INFO(NAME);
CREATE INDEX IDX_APP_CATEGORY ON APP_INFO(CATEGORY_ID);
CREATE INDEX IDX_APP_STATUS ON APP_INFO(STATUS);
CREATE INDEX IDX_APP_VIEW_COUNT ON APP_INFO(VIEW_COUNT DESC);
CREATE INDEX IDX_APP_CREATED_AT ON APP_INFO(CREATED_AT DESC);
CREATE INDEX IDX_APP_FEATURED ON APP_INFO(IS_FEATURED);

-- 截图表索引
CREATE INDEX IDX_SCREENSHOT_APP ON APP_SCREENSHOTS(APP_ID);

-- 功能表索引
CREATE INDEX IDX_FEATURE_APP ON APP_FEATURES(APP_ID);

-- 联系人表索引
CREATE INDEX IDX_CONTACT_APP ON APP_CONTACTS(APP_ID);

-- 评价表索引
CREATE INDEX IDX_REVIEW_APP ON APP_REVIEWS(APP_ID);
CREATE INDEX IDX_REVIEW_USER ON APP_REVIEWS(USER_ID);

-- 收藏表索引
CREATE INDEX IDX_FAVORITE_USER ON USER_FAVORITES(USER_ID);
CREATE INDEX IDX_FAVORITE_APP ON USER_FAVORITES(APP_ID);
```

## 4. 本地文件存储方案

### 4.1 目录结构

```
/workspace/
├── uploads/                          # 上传文件根目录
│   ├── apps/                        # 应用相关文件
│   │   ├── {appId}/
│   │   │   ├── icon.png            # 应用图标
│   │   │   ├── screenshots/        # 应用截图
│   │   │   │   ├── 1.png
│   │   │   │   ├── 2.png
│   │   │   │   └── ...
│   │   │   └── videos/             # 应用介绍视频
│   │   │       └── intro.mp4
│   │   └── ...
│   └── avatars/                     # 用户头像
│       └── {userId}.png
├── server/                          # 后端服务目录
│   ├── src/
│   │   ├── routes/                 # 路由
│   │   │   ├── apps.js            # 应用路由
│   │   │   ├── uploads.js         # 上传路由
│   │   │   └── categories.js     # 分类路由
│   │   ├── controllers/            # 控制器
│   │   ├── models/                # 数据模型
│   │   ├── services/              # 业务逻辑
│   │   ├── utils/                 # 工具函数
│   │   └── db/                    # 数据库配置
│   │       ├── connection.js      # 数据库连接
│   │       └── init.js           # 初始化脚本
│   ├── uploads/                   # 上传文件临时目录
│   ├── app.js                     # Express 应用入口
│   └── package.json
```

### 4.2 文件命名规则

```
图标文件: {appId}_icon.{ext}
截图文件: {appId}_screenshot_{index}.{ext}
视频文件: {appId}_video.{ext}
用户头像: user_{userId}_avatar.{ext}

示例:
- app-001_icon.png
- app-001_screenshot_1.png
- app-001_screenshot_2.png
- user-001_avatar.png
```

### 4.3 文件访问路径

```javascript
// 静态文件服务配置
app.use('/uploads', express.static('uploads'));

// 前端访问 URL
const iconUrl = `/uploads/apps/${appId}/icon.png`;
const screenshotUrl = `/uploads/apps/${appId}/screenshots/1.png`;
const videoUrl = `/uploads/apps/${appId}/videos/intro.mp4`;
```

### 4.4 文件上传限制

```javascript
{
  limits: {
    fileSize: 10 * 1024 * 1024,  // 最大 10MB
    files: 10                      // 最多 10 个文件
  },
  allowedTypes: {
    images: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    videos: ['video/mp4', 'video/webm']
  }
}
```

## 5. API 接口设计

### 5.1 应用管理 API

#### 5.1.1 获取应用列表
```
GET /api/apps

Query Parameters:
- page: int (default: 1)
- pageSize: int (default: 12)
- category: string (optional)
- keyword: string (optional)
- sortBy: string (popular|latest|featured)

Response:
{
  "success": true,
  "data": {
    "items": [...],
    "total": 100,
    "page": 1,
    "pageSize": 12,
    "totalPages": 9
  }
}
```

#### 5.1.2 获取应用详情
```
GET /api/apps/:id

Response:
{
  "success": true,
  "data": {
    "id": "app-001",
    "name": "OA协同办公系统",
    "icon": "/uploads/apps/app-001/icon.png",
    "screenshots": [
      "/uploads/apps/app-001/screenshots/1.png",
      "/uploads/apps/app-001/screenshots/2.png"
    ],
    "features": [...],
    "contacts": [...],
    "reviews": [...],
    ...
  }
}
```

#### 5.1.3 发布新应用
```
POST /api/apps

Request Body:
{
  "name": "新应用",
  "description": "应用描述",
  "categoryId": "productivity",
  "department": "IT部",
  "tags": ["协作", "办公"],
  "url": "https://newapp.example.com",
  "developer": "开发团队",
  "version": "1.0.0"
}

Response:
{
  "success": true,
  "data": {
    "id": "app-new-id",
    "message": "应用创建成功"
  }
}
```

#### 5.1.4 更新应用信息
```
PUT /api/apps/:id

Request Body:
{
  "name": "更新后的名称",
  "description": "更新后的描述",
  ...
}

Response:
{
  "success": true,
  "message": "应用更新成功"
}
```

#### 5.1.5 删除应用
```
DELETE /api/apps/:id

Response:
{
  "success": true,
  "message": "应用删除成功"
}
```

#### 5.1.6 更新应用状态
```
PATCH /api/apps/:id/status

Request Body:
{
  "status": "inactive"
}

Response:
{
  "success": true,
  "message": "状态更新成功"
}
```

### 5.2 文件上传 API

#### 5.2.1 上传应用图标
```
POST /api/uploads/icon/:appId

Content-Type: multipart/form-data
Body: file (image)

Response:
{
  "success": true,
  "data": {
    "path": "/uploads/apps/app-001/icon.png"
  }
}
```

#### 5.2.2 上传应用截图
```
POST /api/uploads/screenshots/:appId

Content-Type: multipart/form-data
Body: files[] (multiple images)

Response:
{
  "success": true,
  "data": {
    "paths": [
      "/uploads/apps/app-001/screenshots/1.png",
      "/uploads/apps/app-001/screenshots/2.png"
    ]
  }
}
```

#### 5.2.3 上传介绍视频
```
POST /api/uploads/video/:appId

Content-Type: multipart/form-data
Body: file (video)

Response:
{
  "success": true,
  "data": {
    "path": "/uploads/apps/app-001/videos/intro.mp4"
  }
}
```

### 5.3 收藏管理 API

#### 5.3.1 获取用户收藏
```
GET /api/favorites?userId=:userId

Response:
{
  "success": true,
  "data": {
    "items": [...],
    "total": 5
  }
}
```

#### 5.3.2 添加收藏
```
POST /api/favorites

Request Body:
{
  "userId": "user-001",
  "appId": "app-001"
}

Response:
{
  "success": true,
  "message": "收藏成功"
}
```

#### 5.3.3 取消收藏
```
DELETE /api/favorites?userId=:userId&appId=:appId

Response:
{
  "success": true,
  "message": "取消收藏成功"
}
```

### 5.4 评价管理 API

#### 5.4.1 获取应用评价
```
GET /api/apps/:appId/reviews

Query Parameters:
- page: int
- pageSize: int

Response:
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "review-001",
        "userName": "张三",
        "rating": 5,
        "comment": "很好用！",
        "createdAt": "2024-12-01"
      }
    ],
    "total": 100,
    "averageRating": 4.7
  }
}
```

#### 5.4.2 提交评价
```
POST /api/apps/:appId/reviews

Request Body:
{
  "userId": "user-001",
  "userName": "张三",
  "rating": 5,
  "comment": "非常好用的系统"
}

Response:
{
  "success": true,
  "message": "评价提交成功"
}
```

### 5.5 分类管理 API

#### 5.5.1 获取所有分类
```
GET /api/categories

Response:
{
  "success": true,
  "data": [
    {
      "id": "productivity",
      "name": "效率办公",
      "icon": "briefcase",
      "appCount": 12
    }
  ]
}
```

## 6. 前端集成方案

### 6.1 API 服务层

```typescript
// src/services/api.ts
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 响应拦截器
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

export const appService = {
  getApps: (params) => apiClient.get('/apps', { params }),
  getAppById: (id) => apiClient.get(`/apps/${id}`),
  createApp: (data) => apiClient.post('/apps', data),
  updateApp: (id, data) => apiClient.put(`/apps/${id}`, data),
  deleteApp: (id) => apiClient.delete(`/apps/${id}`),
  updateStatus: (id, status) => apiClient.patch(`/apps/${id}/status`, { status }),
};

export const uploadService = {
  uploadIcon: (appId, file) => {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient.post(`/uploads/icon/${appId}`, formData);
  },
  uploadScreenshots: (appId, files) => {
    const formData = new FormData();
    files.forEach((file) => formData.append('files', file));
    return apiClient.post(`/uploads/screenshots/${appId}`, formData);
  },
  uploadVideo: (appId, file) => {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient.post(`/uploads/video/${appId}`, formData);
  },
};

export const categoryService = {
  getAll: () => apiClient.get('/categories'),
};

export const favoriteService = {
  getByUser: (userId) => apiClient.get('/favorites', { params: { userId } }),
  add: (userId, appId) => apiClient.post('/favorites', { userId, appId }),
  remove: (userId, appId) => apiClient.delete('/favorites', { params: { userId, appId } }),
};

export const reviewService = {
  getByApp: (appId, params) => apiClient.get(`/apps/${appId}/reviews`, { params }),
  create: (appId, data) => apiClient.post(`/apps/${appId}/reviews`, data),
};
```

### 6.2 数据管理 Hooks

```typescript
// src/hooks/useApps.ts
import { useState, useEffect } from 'react';
import { appService } from '../services/api';

export function useApps(params) {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({});

  useEffect(() => {
    const fetchApps = async () => {
      try {
        setLoading(true);
        const response = await appService.getApps(params);
        setApps(response.data.items);
        setPagination({
          total: response.data.total,
          page: response.data.page,
          pageSize: response.data.pageSize,
        });
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchApps();
  }, [params]);

  return { apps, loading, error, pagination };
}
```

### 6.3 环境配置

```bash
# .env
VITE_API_URL=http://localhost:3001/api
VITE_APP_TITLE=企业内部应用发布平台
```

## 7. 实施计划

### 7.1 Phase 1: 后端基础设施 (1-2天)
- [ ] 初始化 Node.js + Express 项目
- [ ] 配置达梦数据库连接
- [ ] 创建数据库表结构
- [ ] 实现基础 CRUD API

### 7.2 Phase 2: 文件上传服务 (1天)
- [ ] 配置 multer 文件上传
- [ ] 实现本地文件存储逻辑
- [ ] 配置静态文件服务
- [ ] 实现文件清理机制

### 7.3 Phase 3: 前端集成 (2-3天)
- [ ] 创建 API 服务层
- [ ] 实现数据获取 Hooks
- [ ] 替换 Mock 数据为 API 调用
- [ ] 实现文件上传组件

### 7.4 Phase 4: 优化与测试 (1-2天)
- [ ] 实现错误处理和重试机制
- [ ] 添加加载状态和骨架屏
- [ ] 性能优化（缓存、懒加载）
- [ ] 集成测试

## 8. 数据库连接配置

### 8.1 达梦数据库连接参数

```javascript
// server/src/db/connection.js
const dm = require('dm-driver');

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5236,
  database: process.env.DB_NAME || 'APP_STORE_DB',
  user: process.env.DB_USER || 'SYSDBA',
  password: process.env.DB_PASSWORD || 'SYSDBA',
};

module.exports = dbConfig;
```

### 8.2 连接池配置

```javascript
const pool = dm.createPool({
  ...dbConfig,
  poolMin: 2,
  poolMax: 10,
  poolIncrement: 2,
});
```

## 9. 错误处理策略

### 9.1 后端错误响应

```javascript
// 统一错误响应格式
{
  "success": false,
  "error": {
    "code": "APP_NOT_FOUND",
    "message": "应用不存在",
    "details": {}
  }
}
```

### 9.2 错误代码定义

| 错误代码 | HTTP 状态码 | 说明 |
|---------|------------|------|
| APP_NOT_FOUND | 404 | 应用不存在 |
| VALIDATION_ERROR | 400 | 数据验证失败 |
| UPLOAD_ERROR | 400 | 文件上传失败 |
| UNAUTHORIZED | 401 | 未授权访问 |
| FORBIDDEN | 403 | 无权限操作 |
| SERVER_ERROR | 500 | 服务器内部错误 |

## 10. 安全考虑

### 10.1 文件上传安全
- 文件类型白名单验证
- 文件大小限制
- 文件名随机化处理
- 恶意文件扫描（可选）

### 10.2 API 安全
- 输入数据验证
- SQL 注入防护
- CORS 配置
- 请求频率限制

### 10.3 数据安全
- 敏感信息加密存储
- 数据库连接加密
- 定期数据备份

## 11. 监控与日志

### 11.1 日志记录
- API 请求日志
- 数据库操作日志
- 文件上传日志
- 错误日志

### 11.2 监控指标
- API 响应时间
- 数据库查询性能
- 文件存储使用量
- 并发连接数
