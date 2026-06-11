// 内存存储版本的测试用例 - 不依赖达梦数据库

const { v4: uuidv4 } = require('uuid');

// 内存数据存储
let apps = [];
let categories = [
  { id: 'productivity', name: '生产力', description: '提高工作效率的应用' },
  { id: 'communication', name: '沟通协作', description: '团队沟通和协作工具' },
  { id: 'dev', name: '开发工具', description: '开发人员使用的工具' },
  { id: 'design', name: '设计工具', description: '设计和创意工具' }
];
let favorites = [];
let reviews = [];

// 初始化一些测试数据
function initTestData() {
  apps = [
    {
      id: '1',
      name: '测试应用',
      description: '用于测试的应用',
      introduction: '这是详细的应用介绍',
      categoryId: 'productivity',
      department: '测试部',
      tags: ['测试', '自动化'],
      url: 'https://test.example.com',
      developer: '测试团队',
      version: '1.0.0',
      status: 'active',
      viewCount: 0,
      favoriteCount: 0,
      rating: 0,
      reviewCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];
}

initTestData();

const appService = {
  // 获取应用列表
  getAll: (query = {}) => {
    let result = [...apps];
    if (query.categoryId) {
      result = result.filter(a => a.categoryId === query.categoryId);
    }
    if (query.search) {
      const search = query.search.toLowerCase();
      result = result.filter(a =>
        a.name.toLowerCase().includes(search) ||
        a.description.toLowerCase().includes(search)
      );
    }
    return result;
  },
  
  // 获取单个应用
  getById: (id) => {
    const app = apps.find(a => a.id === id);
    if (app) {
      app.viewCount++;
    }
    return app;
  },
  
  // 创建应用
  create: (data) => {
    const newApp = {
      id: data.id || uuidv4(),
      name: data.name,
      description: data.description,
      introduction: data.introduction || '',
      categoryId: data.categoryId,
      department: data.department || '',
      tags: data.tags || [],
      url: data.url,
      developer: data.developer || '',
      version: data.version || '1.0.0',
      status: data.status || 'active',
      features: data.features || [],
      contacts: data.contacts || [],
      screenshots: data.screenshots || [],
      viewCount: 0,
      favoriteCount: 0,
      rating: 0,
      reviewCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    apps.push(newApp);
    return newApp;
  },
  
  // 更新应用
  update: (id, data) => {
    const index = apps.findIndex(a => a.id === id);
    if (index !== -1) {
      apps[index] = {
        ...apps[index],
        ...data,
        id: id,
        updatedAt: new Date().toISOString()
      };
      return apps[index];
    }
    return null;
  },
  
  // 删除应用
  delete: (id) => {
    const index = apps.findIndex(a => a.id === id);
    if (index !== -1) {
      apps.splice(index, 1);
      return true;
    }
    return false;
  },
  
  // 更新状态
  updateStatus: (id, status) => {
    const app = apps.find(a => a.id === id);
    if (app) {
      app.status = status;
      app.updatedAt = new Date().toISOString();
      return app;
    }
    return null;
  }
};

const categoryService = {
  getAll: () => categories,
  getById: (id) => categories.find(c => c.id === id)
};

const favoriteService = {
  getByUser: (userId) => favorites.filter(f => f.userId === userId),
  add: (userId, appId) => {
    const existing = favorites.find(f => f.userId === userId && f.appId === appId);
    if (existing) return existing;
    
    const newFavorite = { userId, appId, createdAt: new Date().toISOString() };
    favorites.push(newFavorite);
    
    const app = apps.find(a => a.id === appId);
    if (app) app.favoriteCount++;
    
    return newFavorite;
  },
  remove: (userId, appId) => {
    const index = favorites.findIndex(f => f.userId === userId && f.appId === appId);
    if (index !== -1) {
      favorites.splice(index, 1);
      const app = apps.find(a => a.id === appId);
      if (app) app.favoriteCount--;
      return true;
    }
    return false;
  }
};

const reviewService = {
  getByApp: (appId) => reviews.filter(r => r.appId === appId),
  add: (appId, data) => {
    const newReview = {
      id: uuidv4(),
      appId,
      userId: data.userId,
      userName: data.userName,
      rating: data.rating,
      comment: data.comment,
      createdAt: new Date().toISOString()
    };
    reviews.push(newReview);
    
    const app = apps.find(a => a.id === appId);
    if (app) {
      app.reviewCount++;
      const appReviews = reviews.filter(r => r.appId === appId);
      const totalRating = appReviews.reduce((sum, r) => sum + r.rating, 0);
      app.rating = totalRating / appReviews.length;
    }
    
    return newReview;
  }
};

module.exports = {
  appService,
  categoryService,
  favoriteService,
  reviewService
};
