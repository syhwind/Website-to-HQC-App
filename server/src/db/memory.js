// 内存存储 - 替代达梦数据库
const { v4: uuidv4 } = require('uuid');

// 内存数据存储
let apps = [];
let categories = [
  { id: 'productivity', name: '生产力', description: '提高工作效率的应用', icon: '📊' },
  { id: 'communication', name: '沟通协作', description: '团队沟通和协作工具', icon: '💬' },
  { id: 'dev', name: '开发工具', description: '开发人员使用的工具', icon: '💻' },
  { id: 'design', name: '设计工具', description: '设计和创意工具', icon: '🎨' }
];
let favorites = [];
let reviews = [];

// 初始化模拟数据
function initMockData() {
  apps = [
    {
      id: '1',
      name: '项目管理系统',
      description: '企业级项目管理和协作平台',
      introduction: '这是一个功能强大的项目管理系统，支持任务分配、进度跟踪、团队协作等功能。',
      icon: '📋',
      categoryId: 'productivity',
      department: '技术部',
      tags: ['项目管理', '协作', '敏捷开发'],
      url: 'https://projects.example.com',
      developer: '技术团队',
      version: '2.5.0',
      status: 'active',
      viewCount: 1256,
      favoriteCount: 89,
      rating: 4.8,
      reviewCount: 35,
      isFeatured: 1,
      features: ['任务看板', '甘特图', '里程碑管理', '团队协作', '进度报告'],
      screenshots: [],
      contacts: [
        { id: 'c1', name: '张三', role: '产品经理', email: 'zhang@example.com', phone: '13800138001', avatar: '' },
        { id: 'c2', name: '李四', role: '技术支持', email: 'li@example.com', phone: '13800138002', avatar: '' }
      ],
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: '2',
      name: '在线文档平台',
      description: '企业知识库和文档协作工具',
      introduction: '强大的文档编辑和协作平台，支持 Markdown、实时协作、版本管理等功能。',
      icon: '📝',
      categoryId: 'productivity',
      department: '技术部',
      tags: ['文档', '协作', '知识库'],
      url: 'https://docs.example.com',
      developer: '技术团队',
      version: '3.1.0',
      status: 'active',
      viewCount: 2341,
      favoriteCount: 156,
      rating: 4.9,
      reviewCount: 67,
      isFeatured: 1,
      features: ['实时协作编辑', 'Markdown 支持', '版本历史', '权限管理', '搜索功能'],
      screenshots: [],
      contacts: [
        { id: 'c3', name: '王五', role: '产品经理', email: 'wang@example.com', phone: '13800138003', avatar: '' }
      ],
      createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: '3',
      name: '代码审查工具',
      description: '专业的代码审查和质量保证平台',
      introduction: '支持多种编程语言的代码审查工具，提供静态代码分析、自动审查等功能。',
      icon: '🔍',
      categoryId: 'dev',
      department: '技术部',
      tags: ['代码审查', 'DevOps', '质量保证'],
      url: 'https://code-review.example.com',
      developer: 'DevOps 团队',
      version: '1.8.0',
      status: 'active',
      viewCount: 892,
      favoriteCount: 45,
      rating: 4.6,
      reviewCount: 23,
      isFeatured: 0,
      features: ['多语言支持', '静态分析', '自动评论', 'CI/CD 集成'],
      screenshots: [],
      contacts: [],
      createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: '4',
      name: '团队沟通平台',
      description: '即时通讯和团队沟通工具',
      introduction: '功能完善的企业即时通讯工具，支持群聊、私聊、文件共享等功能。',
      icon: '💬',
      categoryId: 'communication',
      department: '行政部',
      tags: ['沟通', '即时通讯', '团队'],
      url: 'https://chat.example.com',
      developer: '行政团队',
      version: '4.2.0',
      status: 'active',
      viewCount: 3567,
      favoriteCount: 234,
      rating: 4.7,
      reviewCount: 89,
      isFeatured: 1,
      features: ['即时消息', '群聊管理', '文件共享', '视频会议', '消息已读'],
      screenshots: [],
      contacts: [
        { id: 'c4', name: '赵六', role: '管理员', email: 'zhao@example.com', phone: '13800138004', avatar: '' }
      ],
      createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: '5',
      name: '设计资源库',
      description: 'UI 设计资源和组件库',
      introduction: '企业级设计资源库，包含组件库、图标库、设计规范等。',
      icon: '🎨',
      categoryId: 'design',
      department: '设计部',
      tags: ['设计', 'UI', '资源库'],
      url: 'https://design.example.com',
      developer: '设计团队',
      version: '2.0.0',
      status: 'active',
      viewCount: 567,
      favoriteCount: 78,
      rating: 4.5,
      reviewCount: 18,
      isFeatured: 0,
      features: ['组件库', '图标库', '设计规范', 'Figma 插件'],
      screenshots: [],
      contacts: [],
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: '6',
      name: 'API 网关管理',
      description: '统一的 API 管理和网关平台',
      introduction: '企业 API 管理平台，提供 API 文档、网关、监控等功能。',
      icon: '🌐',
      categoryId: 'dev',
      department: '技术部',
      tags: ['API', '网关', '微服务'],
      url: 'https://api.example.com',
      developer: '架构团队',
      version: '1.5.0',
      status: 'active',
      viewCount: 445,
      favoriteCount: 32,
      rating: 4.4,
      reviewCount: 12,
      isFeatured: 0,
      features: ['API 文档', '网关路由', '监控告警', '限流熔断'],
      screenshots: [],
      contacts: [],
      createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];

  reviews = [
    { id: 'r1', appId: '1', userId: 'u1', userName: '用户A', userAvatar: '', rating: 5, comment: '非常好用的项目管理工具！', createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() },
    { id: 'r2', appId: '1', userId: 'u2', userName: '用户B', userAvatar: '', rating: 4, comment: '功能强大，希望能加一些定制功能', createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() },
    { id: 'r3', appId: '2', userId: 'u3', userName: '用户C', userAvatar: '', rating: 5, comment: '文档协作非常方便', createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() }
  ];

  console.log('✅ 模拟数据初始化完成');
}

initMockData();

module.exports = {
  // 应用管理
  apps: {
    getAll: (query = {}) => {
      let result = apps.filter(a => a.status === 'active');
      
      if (query.category) {
        result = result.filter(a => a.categoryId === query.category);
      }
      
      if (query.keyword) {
        const keyword = query.keyword.toLowerCase();
        result = result.filter(a => 
          a.name.toLowerCase().includes(keyword) ||
          a.description.toLowerCase().includes(keyword) ||
          (a.tags && a.tags.some(t => t.toLowerCase().includes(keyword)))
        );
      }
      
      if (query.sortBy === 'latest') {
        result = result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      } else if (query.sortBy === 'featured') {
        result = result.sort((a, b) => (b.isFeatured || 0) - (a.isFeatured || 0) || new Date(b.createdAt) - new Date(a.createdAt));
      } else {
        result = result.sort((a, b) => b.viewCount - a.viewCount);
      }
      
      const page = parseInt(query.page) || 1;
      const pageSize = parseInt(query.pageSize) || 12;
      const offset = (page - 1) * pageSize;
      
      const items = result.slice(offset, offset + pageSize);
      
      return {
        items,
        total: result.length,
        page,
        pageSize,
        totalPages: Math.ceil(result.length / pageSize)
      };
    },
    
    getById: (id) => {
      const app = apps.find(a => a.id === id);
      if (app) {
        app.viewCount = (app.viewCount || 0) + 1;
      }
      return app;
    },
    
    create: (data) => {
      const newApp = {
        id: data.id || uuidv4(),
        name: data.name,
        description: data.description || '',
        introduction: data.introduction || '',
        icon: data.icon || '📱',
        categoryId: data.categoryId,
        department: data.department || '',
        tags: data.tags || [],
        url: data.url,
        developer: data.developer || '',
        version: data.version || '1.0.0',
        status: 'active',
        viewCount: 0,
        favoriteCount: 0,
        rating: 0,
        reviewCount: 0,
        isFeatured: data.isFeatured ? 1 : 0,
        videoUrl: data.videoUrl || '',
        features: data.features || [],
        contacts: data.contacts || [],
        screenshots: data.screenshots || [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      apps.push(newApp);
      return newApp;
    },
    
    update: (id, data) => {
      const index = apps.findIndex(a => a.id === id);
      if (index !== -1) {
        apps[index] = {
          ...apps[index],
          ...data,
          id,
          updatedAt: new Date().toISOString()
        };
        return apps[index];
      }
      return null;
    },
    
    delete: (id) => {
      const index = apps.findIndex(a => a.id === id);
      if (index !== -1) {
        apps.splice(index, 1);
        return true;
      }
      return false;
    },
    
    updateStatus: (id, status) => {
      const app = apps.find(a => a.id === id);
      if (app) {
        app.status = status;
        app.updatedAt = new Date().toISOString();
        return app;
      }
      return null;
    }
  },
  
  categories: {
    getAll: () => {
      return categories.map(cat => ({
        ...cat,
        appCount: apps.filter(a => a.categoryId === cat.id && a.status === 'active').length
      }));
    },
    getById: (id) => categories.find(c => c.id === id)
  },
  
  favorites: {
    getByUser: (userId) => {
      const userFavorites = favorites.filter(f => f.userId === userId);
      return userFavorites.map(f => {
        const app = apps.find(a => a.id === f.appId);
        return { ...f, app };
      }).filter(f => f.app);
    },
    
    add: (userId, appId) => {
      const existing = favorites.find(f => f.userId === userId && f.appId === appId);
      if (existing) return existing;
      
      const newFavorite = { 
        id: uuidv4(), 
        userId, 
        appId, 
        createdAt: new Date().toISOString() 
      };
      favorites.push(newFavorite);
      
      const app = apps.find(a => a.id === appId);
      if (app) app.favoriteCount = (app.favoriteCount || 0) + 1;
      
      return newFavorite;
    },
    
    remove: (userId, appId) => {
      const index = favorites.findIndex(f => f.userId === userId && f.appId === appId);
      if (index !== -1) {
        favorites.splice(index, 1);
        const app = apps.find(a => a.id === appId);
        if (app) app.favoriteCount = Math.max(0, (app.favoriteCount || 0) - 1);
        return true;
      }
      return false;
    },
    
    check: (userId, appId) => {
      return !!favorites.find(f => f.userId === userId && f.appId === appId);
    }
  },
  
  reviews: {
    getByApp: (appId) => {
      try {
        const appReviews = reviews.filter(r => r.appId === appId);
        const sorted = appReviews.sort((a, b) => {
          try {
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          } catch {
            return 0;
          }
        });
        const averageRating = appReviews.length > 0 
          ? appReviews.reduce((sum, r) => sum + (typeof r.rating === 'number' ? r.rating : 5), 0) / appReviews.length 
          : 0;
        return {
          items: sorted.slice(0, 10),
          averageRating: averageRating,
          count: appReviews.length
        };
      } catch (error) {
        console.error('获取评价列表失败:', error);
        return {
          items: [],
          averageRating: 0,
          count: 0
        };
      }
    },
    
    add: (appId, data) => {
      // 安全检查
      const safeData = data || {};
      const rating = typeof safeData.rating === 'number' 
        ? Math.max(1, Math.min(5, safeData.rating)) 
        : 5;
      
      const newReview = {
        id: uuidv4(),
        appId: appId || '',
        userId: safeData.userId || 'anonymous',
        userName: safeData.userName || '匿名用户',
        userAvatar: safeData.userAvatar || '',
        rating: rating,
        comment: safeData.comment || '',
        createdAt: new Date().toISOString()
      };
      reviews.push(newReview);
      
      try {
        const app = apps.find(a => a.id === appId);
        if (app) {
          const appReviews = reviews.filter(r => r.appId === appId);
          app.reviewCount = appReviews.length;
          app.rating = appReviews.length > 0 
            ? appReviews.reduce((sum, r) => sum + (typeof r.rating === 'number' ? r.rating : 5), 0) / appReviews.length 
            : 0;
        }
      } catch (error) {
        console.error('更新应用评分失败:', error);
        // 即使更新评分失败，也不影响评价的创建
      }
      
      return newReview;
    }
  }
};
