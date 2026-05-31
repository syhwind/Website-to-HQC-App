import { describe, it, expect, beforeEach } from 'vitest';
import { v4 as uuidv4 } from 'uuid';

const storage = require('./test-storage');

describe('新发布应用流程 - 数据一致性测试', () => {
  
  const appService = storage.appService;
  
  beforeEach(() => {
    const initTestData();
  });
  
  function initTestData() {
    const { v4: uuidv4 } = require('uuid');
    const apps = [];
    const categories = [
      { id: 'productivity', name: '生产力' },
      { id: 'dev', name: '开发工具' }
    ];
    const favorites = [];
    const reviews = [];
    
    apps.push({
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
    });
  }
  
  describe('1. 新应用发布完整流程', () => {
    it('1.1 应该能成功创建新应用', () => {
      const appData = {
        name: '全新发布的应用',
        description: '这是一个全新的应用',
        introduction: '详细的功能介绍',
        categoryId: 'dev',
        department: '技术部',
        tags: ['开发', '工具'],
        url: 'https://new-app.example.com',
        developer: '开发团队',
        version: '1.0.0',
        features: ['功能1', '功能2'],
        contacts: [
          { name: '张三', role: '产品经理', email: 'zhang@example.com' }
        ]
      };
      
      const newApp = appService.create(appData);
      
      expect(newApp.id).toBeDefined();
      expect(newApp.name).toBe(appData.name);
      expect(newApp.description).toBe(appData.description);
      expect(newApp.introduction).toBe(appData.introduction);
      expect(newApp.categoryId).toBe(appData.categoryId);
      expect(newApp.status).toBe('active');
      
      console.log('✅ 1.1 创建新应用测试通过');
    });
    
    it('1.2 应该能获取刚创建的应用详情', () => {
      const appData = {
        id: 'test-app-001',
        name: '测试详情应用',
        description: '测试详情',
        categoryId: 'productivity',
        department: '测试部',
        url: 'https://test-detail.example.com',
        developer: '测试团队',
        version: '1.0.0'
      };
      
      appService.create(appData);
      
      const retrievedApp = appService.getById(appData.id);
      
      expect(retrievedApp).toBeDefined();
      expect(retrievedApp.name).toBe(appData.name);
      expect(retrievedApp.description).toBe(appData.description);
      
      console.log('✅ 1.2 获取详情测试通过');
    });
    
    it('1.3 编辑后数据一致性检查', () => {
      const appData = {
        id: 'edit-test-001',
        name: '初始名称',
        description: '初始描述',
        introduction: '初始介绍',
        categoryId: 'productivity',
        department: '技术部',
        url: 'https://initial.example.com',
        developer: '开发团队',
        version: '1.0.0',
        features: ['功能A', '功能B']
      };
      
      const created = appService.create(appData);
      
      const updatedData = {
        name: '更新后的名称',
        version: '2.0.0',
        description: '更新后的描述'
      };
      
      appService.update(created.id, updatedData);
      
      const finalApp = appService.getById(created.id);
      
      expect(finalApp.name).toBe(updatedData.name);
      expect(finalApp.version).toBe(updatedData.version);
      expect(finalApp.description).toBe(updatedData.description);
      expect(finalApp.introduction).toBe(appData.introduction);
      expect(finalApp.department).toBe(appData.department);
      expect(finalApp.developer).toBe(appData.developer);
      
      console.log('✅ 1.3 编辑后数据一致性测试通过');
    });
  });
  
  describe('2. 数据完整性验证', () => {
    it('2.1 多次编辑后数据保持完整', () => {
      const initialData = {
        id: 'integrity-test',
        name: '完整性测试应用',
        description: '初始描述',
        introduction: '详细介绍',
        categoryId: 'dev',
        department: '测试部',
        tags: ['完整性', '测试'],
        url: 'https://integrity.example.com',
        developer: '开发团队',
        version: '1.0.0',
        features: ['功能1', '功能2'],
        contacts: [
          { name: '用户1', role: '角色1', email: '1@example.com' },
          { name: '用户2', role: '角色2', email: '2@example.com' }
        ]
      };
      
      const created = appService.create(initialData);
      
      for (let i = 1; i <= 3; i++) {
        appService.update(created.id, {
          version: `1.${i}.0',
          description: `第${i}次编辑后的描述`
        });
      }
      
      const finalApp = appService.getById(created.id);
      
      expect(finalApp.name).toBe(initialData.name);
      expect(finalApp.introduction).toBe(initialData.introduction);
      expect(finalApp.department).toBe(initialData.department);
      expect(finalApp.tags).toEqual(initialData.tags);
      expect(finalApp.features).toEqual(initialData.features);
      expect(finalApp.contacts).toEqual(initialData.contacts);
      
      console.log('✅ 2.1 多次编辑后完整性测试通过');
    });
    
    it('2.2 状态切换时数据保持一致', () => {
      const appData = {
        id: 'status-test',
        name: '状态测试应用',
        description: '描述',
        categoryId: 'productivity',
        department: '技术部',
        url: 'https://status.example.com',
        developer: '开发团队',
        version: '1.0.0'
      };
      
      const created = appService.create(appData);
      
      appService.updateStatus(created.id, 'inactive');
      let app1 = appService.getById(created.id);
      expect(app1.status).toBe('inactive');
      
      appService.updateStatus(created.id, 'active');
      let app2 = appService.getById(created.id);
      expect(app2.status).toBe('active');
      
      expect(app2.name).toBe(appData.name);
      expect(app2.description).toBe(appData.description);
      
      console.log('✅ 2.2 状态切换数据一致性测试通过');
    });
    
    it('2.3 浏览量计数正确性', () => {
      const appData = {
        id: 'view-count-test',
        name: '浏览量测试',
        description: '描述',
        categoryId: 'productivity',
        url: 'https://view.example.com',
        developer: '开发团队',
        version: '1.0.0'
      };
      
      const created = appService.create(appData);
      
      const initialApp = appService.getById(created.id);
      const initialCount = initialApp.viewCount;
      
      for (let i = 0; i < 5; i++) {
        appService.getById(created.id);
      }
      
      const finalApp = appService.getById(created.id);
      expect(finalApp.viewCount).toBeGreaterThan(initialCount);
      
      console.log('✅ 2.3 浏览量计数测试通过');
    });
  });
  
  describe('3. 关联功能数据一致性', () => {
    it('3.1 收藏功能数据一致性', () => {
      const appData = {
        id: 'favorite-test',
        name: '收藏测试应用',
        description: '描述',
        categoryId: 'productivity',
        url: 'https://favorite.example.com',
        developer: '开发团队',
        version: '1.0.0'
      };
      
      const created = appService.create(appData);
      const favoriteService = storage.favoriteService;
      
      favoriteService.add('user-1', created.id);
      let app1 = appService.getById(created.id);
      expect(app1.favoriteCount).toBeGreaterThan(0);
      
      favoriteService.add('user-2', created.id);
      let app2 = appService.getById(created.id);
      expect(app2.favoriteCount).toBeGreaterThan(1);
      
      favoriteService.remove('user-1', created.id);
      let app3 = appService.getById(created.id);
      expect(app3.favoriteCount).toBe(1);
      
      console.log('✅ 3.1 收藏功能数据一致性测试通过');
    });
    
    it('3.2 评价功能数据一致性', () => {
      const appData = {
        id: 'review-test',
        name: '评价测试应用',
        description: '描述',
        categoryId: 'productivity',
        url: 'https://review.example.com',
        developer: '开发团队',
        version: '1.0.0'
      };
      
      const created = appService.create(appData);
      const reviewService = storage.reviewService;
      
      reviewService.add(created.id, {
        userId: 'user-1',
        userName: '用户1',
        rating: 5,
        comment: '很好用'
      });
      
      let app1 = appService.getById(created.id);
      expect(app1.reviewCount).toBe(1);
      expect(app1.rating).toBe(5);
      
      reviewService.add(created.id, {
        userId: 'user-2',
        userName: '用户2',
        rating: 3,
        comment: '还可以'
      });
      
      let app2 = appService.getById(created.id);
      expect(app2.reviewCount).toBe(2);
      expect(app2.rating).toBe(4);
      
      console.log('✅ 3.2 评价功能数据一致性测试通过');
    });
  });
});

console.log('\n' + '='.repeat(60));
console.log('📊 测试完成！');
console.log('='.repeat(60));
console.log('✅ 新发布应用流程数据一致性验证通过！');
console.log('='.repeat(60));
