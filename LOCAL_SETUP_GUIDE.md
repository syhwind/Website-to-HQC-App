# 企业内部应用发布平台 - 本地运行指南

## 项目概述

这是一个完整的企业内部应用发布平台，包含前端和后端服务。

**技术栈：**
- **前端**: React 18 + TypeScript + Vite + Tailwind CSS
- **后端**: Node.js + Express.js
- **数据存储**: 支持内存存储（开发环境）和达梦数据库（生产环境）

## 前置要求

在开始之前，请确保您的系统已安装以下软件：

- **Node.js**: 版本 18.x 或更高
- **npm**: 版本 9.x 或更高（通常随 Node.js 一起安装）
- **Git**: 用于版本控制（可选）

## 快速开始

### 1. 下载项目

如果您是通过 ZIP 文件获取的项目，直接解压到您想要的目录即可。

如果是通过 Git 克隆：

```bash
git clone <repository-url>
cd workspace
```

### 2. 安装依赖

项目分为前端和后端两部分，需要分别安装依赖。

#### 安装前端依赖

在项目根目录执行：

```bash
npm install
```

#### 安装后端依赖

进入 `server` 目录并安装依赖：

```bash
cd server
npm install
cd ..
```

### 3. 配置环境变量

项目已提供环境变量示例文件，您可以直接使用或根据需要修改。

**前端环境变量**（`.env` 文件已存在）：
```
VITE_API_URL=http://localhost:3001/api
```

**后端环境变量**：
在 `server` 目录下，项目使用内存存储模式，无需额外配置数据库。

### 4. 启动后端服务

在一个终端窗口中：

```bash
cd server
node src/app-memory.js
```

后端服务将在 **http://localhost:3001** 启动。

您应该看到类似以下输出：
```
✅ 模拟数据初始化完成
🚀 服务已启动: http://localhost:3001
```

### 5. 启动前端服务

在另一个终端窗口中（保持后端服务运行）：

```bash
# 在项目根目录
npm run dev
```

前端应用将在 **http://localhost:5173** 启动（如果 5173 端口被占用，会自动使用其他端口）。

## 访问应用

打开浏览器访问：**http://localhost:5173**

### 主要功能页面

1. **首页** (`/`): 查看所有应用、分类导航
2. **应用详情** (`/app/:id`): 查看应用详细信息、评价
3. **分类页面** (`/category/:id`): 按分类浏览应用
4. **搜索页面** (`/search`): 搜索应用
5. **收藏页面** (`/favorites`): 查看收藏的应用
6. **管理后台** (`/admin`): 应用管理、发布新应用
7. **发布应用** (`/admin/publish`): 发布新应用
8. **管理应用** (`/admin/apps`): 编辑、删除、上下架应用

## 项目结构说明

```
workspace/
├── src/                      # 前端源代码
│   ├── components/           # React 组件
│   ├── context/             # React Context 状态管理
│   ├── data/                # 模拟数据
│   ├── hooks/               # 自定义 Hooks
│   ├── pages/               # 页面组件
│   ├── services/            # API 服务
│   ├── types/               # TypeScript 类型定义
│   ├── utils/               # 工具函数
│   ├── App.tsx              # 主应用组件
│   └── main.tsx             # 应用入口
├── server/                   # 后端源代码
│   ├── src/
│   │   ├── routes/          # API 路由
│   │   ├── db/              # 数据库相关
│   │   ├── app.js           # Express 应用（数据库版本）
│   │   └── app-memory.js    # Express 应用（内存版本，推荐开发使用）
│   └── package.json
├── public/                   # 静态资源
├── index.html               # HTML 入口
├── vite.config.ts           # Vite 配置
├── tailwind.config.js       # Tailwind CSS 配置
├── tsconfig.json            # TypeScript 配置
└── package.json             # 前端依赖配置
```

## 开发模式说明

### 内存存储模式（推荐用于开发）

后端默认使用内存存储模式（`app-memory.js`），这种模式：
- 无需安装数据库
- 数据存储在内存中
- 重启服务后数据会重置
- 适合快速开发和测试

### 数据库存储模式（生产环境）

如果需要使用达梦数据库持久化存储，请参考 [DEPLOYMENT-GUIDE.md](./DEPLOYMENT-GUIDE.md)。

## 常见问题

### Q: 端口被占用怎么办？

**A:** 
- 如果前端端口被占用，Vite 会自动尝试下一个可用端口（通常是 5174）
- 如果后端端口 3001 被占用，可以修改 `server/src/app-memory.js` 中的端口号

### Q: 如何重置数据？

**A:** 
- 重启后端服务即可重置所有数据到初始状态

### Q: 前端无法连接到后端 API？

**A:** 
1. 确认后端服务正在运行
2. 检查 `.env` 文件中的 `VITE_API_URL` 是否正确
3. 查看浏览器控制台的网络请求错误信息

### Q: npm install 失败？

**A:** 
1. 尝试删除 `node_modules` 和 `package-lock.json` 后重新安装
2. 检查网络连接
3. 尝试使用淘宝镜像：`npm config set registry https://registry.npmmirror.com`

## 可用脚本

### 前端脚本（在根目录执行）

```bash
npm run dev          # 启动开发服务器
npm run build        # 构建生产版本
npm run preview      # 预览生产构建
npm run lint         # 运行 ESLint 检查
npm run test         # 运行测试
```

### 后端脚本（在 server 目录执行）

```bash
node src/app-memory.js    # 启动内存存储版本（推荐）
node src/app.js           # 启动数据库版本（需要配置达梦数据库）
npm run test              # 运行后端测试
```

## 下一步

- 查看 [DEPLOYMENT-GUIDE.md](./DEPLOYMENT-GUIDE.md) 了解生产环境部署
- 查看 [TESTING.md](./TESTING.md) 了解测试指南
- 查看 [IMPLEMENTATION-SUMMARY.md](./IMPLEMENTATION-SUMMARY.md) 了解项目实现详情

## 技术支持

如有问题，请查看项目文档或联系开发团队。
