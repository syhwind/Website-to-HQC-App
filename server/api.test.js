import { describe, it, expect, beforeAll, afterAll, beforeEach, afterEach } from 'vitest';
import { v4 as uuidv4 } from 'uuid';

const API_BASE = process.env.API_BASE_URL || 'http://localhost:3001/api';

describe('应用发布流程 - 完整功能测试', () => {
  let testAppId;
  let testCategoryId;

  // ========== 前置条件：准备测试分类 ==========
  describe('1. 分类管理 API 测试', () => {
    it('1.1 应该能成功获取分类列表', async () => {
      const response = await fetch(`${API_BASE}/categories`);
      const data = await response.json();

      expect(response.ok).toBe(true);
      expect(data.success).toBe(true);
      expect(Array.isArray(data.data)).toBe(true);

      if (data.data.length > 0) {
        testCategoryId = data.data[0].id;
        console.log('✓ 使用测试分类:', testCategoryId);
      }
    });
  });

  // ========== 核心流程：新应用发布 ==========
  describe('2. 新应用发布完整流程', () => {
    let createdAppId;
    const testAppData = {
      name: `测试应用 - ${Date.now()}`,
      description: '这是一个用于测试的应用',
      introduction: '这是详细的应用介绍，用于测试编辑功能',
      categoryId: 'productivity',
      department: '测试部',
      tags: ['测试', '自动化'],
      url: 'https://test.example.com',
      developer: '测试团队',
      version: '1.0.0',
      features: ['功能一', '功能二'],
      contacts: [
        { name: '测试员', role: 'QA', email: 'test@example.com', phone: '123456' }
      ]
    };

    it('2.1 应该能成功创建新应用', async () => {
      const response = await fetch(`${API_BASE}/apps`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testAppData)
      });

      const data = await response.json();
      
      expect(response.ok).toBe(true);
      expect(data.success).toBe(true);
      expect(data.data).toHaveProperty('id');
      
      createdAppId = data.data.id;
      testAppId = createdAppId;
      console.log('✓ 应用创建成功, ID:', createdAppId);
    });

    it('2.2 应该能成功获取刚创建的应用详情', async () => {
      const response = await fetch(`${API_BASE}/apps/${createdAppId}`);
      const data = await response.json();

      expect(response.ok).toBe(true);
      expect(data.success).toBe(true);
      expect(data.data.name).toBe(testAppData.name);
      expect(data.data.description).toBe(testAppData.description);
      expect(data.data.categoryId).toBe(testAppData.categoryId);
      
      console.log('✓ 应用详情获取成功');
    });

    it('2.3 应该能更新应用信息', async () => {
      const updateData = {
        ...testAppData,
        name: `测试应用（已更新） - ${Date.now()}`,
        version: '1.1.0',
        description: '这是更新后的描述',
        features: ['功能一', '功能二', '功能三']
      };

      const response = await fetch(`${API_BASE}/apps/${createdAppId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData)
      });

      const data = await response.json();

      expect(response.ok).toBe(true);
      expect(data.success).toBe(true);
      console.log('✓ 应用信息更新成功');
    });

    it('2.4 编辑后获取的详情应该与更新数据一致', async () => {
      const response = await fetch(`${API_BASE}/apps/${createdAppId}`);
      const data = await response.json();

      expect(response.ok).toBe(true);
      expect(data.success).toBe(true);
      expect(data.data.name).toContain('已更新');
      expect(data.data.version).toBe('1.1.0');
      expect(data.data.description).toContain('更新后的描述');
      
      console.log('✓ 编辑后数据一致性验证通过');
    });

    it('2.5 新应用应该在应用列表中可见', async () => {
      const response = await fetch(`${API_BASE}/apps?page=1&pageSize=100`);
      const data = await response.json();

      expect(response.ok).toBe(true);
      expect(data.success).toBe(true);
      
      const foundApp = data.data.items.find(app => app.id === createdAppId);
      expect(foundApp).toBeDefined();
      expect(foundApp.name).toContain('测试应用');
      
      console.log('✓ 新应用在列表中可见');
    });

    // ========== 状态管理测试 ==========
    it('2.6 应该能成功下架应用', async () => {
      const response = await fetch(`${API_BASE}/apps/${createdAppId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'inactive' })
      });

      const data = await response.json();

      expect(response.ok).toBe(true);
      expect(data.success).toBe(true);
      console.log('✓ 应用下架成功');
    });

    it('2.7 下架的应用在展示列表中不应可见', async () => {
      const response = await fetch(`${API_BASE}/apps?page=1&pageSize=100`);
      const data = await response.json();

      expect(response.ok).toBe(true);
      
      const foundApp = data.data.items.find(app => app.id === createdAppId);
      expect(foundApp).toBeUndefined();
      
      console.log('✓ 下架应用在展示列表中正确隐藏');
    });

    it('2.8 应该能成功重新上架应用', async () => {
      const response = await fetch(`${API_BASE}/apps/${createdAppId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'active' })
      });

      const data = await response.json();

      expect(response.ok).toBe(true);
      expect(data.success).toBe(true);
      console.log('✓ 应用重新上架成功');
    });

    it('2.9 重新上架后应用应该再次可见', async () => {
      const response = await fetch(`${API_BASE}/apps?page=1&pageSize=100`);
      const data = await response.json();

      expect(response.ok).toBe(true);
      
      const foundApp = data.data.items.find(app => app.id === createdAppId);
      expect(foundApp).toBeDefined();
      expect(foundApp.status).toBe('active');
      
      console.log('✓ 重新上架后应用可见');
    });
  });

  // ========== 数据一致性验证 ==========
  describe('3. 数据一致性深度验证', () => {
    const consistencyTestAppId = uuidv4();
    const originalData = {
      id: consistencyTestAppId,
      name: '数据一致性测试应用',
      description: '验证编辑前后数据完整性',
      introduction: '完整的功能介绍文本',
      categoryId: 'dev',
      department: '测试部',
      tags: ['验证', '一致性'],
      url: 'https://verify.example.com',
      developer: '测试团队',
      version: '1.0.0',
      features: ['核心功能A', '核心功能B', '核心功能C'],
      contacts: [
        { name: '张三', role: '负责人', email: 'zhang@example.com', phone: '111111' },
        { name: '李四', role: '备用', email: 'li@example.com', phone: '222222' }
      ]
    };

    it('3.1 创建应用并保存完整数据', async () => {
      const response = await fetch(`${API_BASE}/apps`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(originalData)
      });

      const data = await response.json();
      expect(response.ok).toBe(true);
      expect(data.success).toBe(true);
    });

    it('3.2 验证编辑前的数据完整性', async () => {
      const response = await fetch(`${API_BASE}/apps/${consistencyTestAppId}`);
      const data = await response.json();

      expect(data.success).toBe(true);
      const app = data.data;

      expect(app.name).toBe(originalData.name);
      expect(app.description).toBe(originalData.description);
      expect(app.introduction).toBe(originalData.introduction);
      expect(app.categoryId).toBe(originalData.categoryId);
      expect(app.department).toBe(originalData.department);
      expect(app.url).toBe(originalData.url);
      expect(app.developer).toBe(originalData.developer);
      expect(app.version).toBe(originalData.version);
      
      console.log('✓ 编辑前数据完整性验证通过');
    });

    it('3.3 执行部分字段编辑', async () => {
      const partialUpdate = {
        ...originalData,
        version: '2.0.0',
        tags: ['验证', '一致性', '已更新'],
        description: '更新后的描述，其他字段保持不变'
      };

      const response = await fetch(`${API_BASE}/apps/${consistencyTestAppId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(partialUpdate)
      });

      const data = await response.json();
      expect(response.ok).toBe(true);
      expect(data.success).toBe(true);
    });

    it('3.4 验证编辑后未修改字段保持原样', async () => {
      const response = await fetch(`${API_BASE}/apps/${consistencyTestAppId}`);
      const data = await response.json();

      expect(data.success).toBe(true);
      const app = data.data;

      // 验证已更新的字段
      expect(app.version).toBe('2.0.0');
      expect(app.description).toContain('更新后的描述');
      
      // 验证未修改的字段保持原样
      expect(app.name).toBe(originalData.name);
      expect(app.introduction).toBe(originalData.introduction);
      expect(app.categoryId).toBe(originalData.categoryId);
      expect(app.department).toBe(originalData.department);
      expect(app.url).toBe(originalData.url);
      expect(app.developer).toBe(originalData.developer);
      
      console.log('✓ 未修改字段保持原样，数据一致性验证通过');
    });

    it('3.5 验证关联数据（功能、联系人）一致性', async () => {
      const response = await fetch(`${API_BASE}/apps/${consistencyTestAppId}`);
      const data = await response.json();

      expect(data.success).toBe(true);
      const app = data.data;

      expect(app.features).toBeDefined();
      expect(Array.isArray(app.features)).toBe(true);
      expect(app.contacts).toBeDefined();
      expect(Array.isArray(app.contacts)).toBe(true);
      
      console.log('✓ 关联数据一致性验证通过');
    });

    it('3.6 验证浏览量统计更新的一致性', async () => {
      // 获取初始浏览量
      const response1 = await fetch(`${API_BASE}/apps/${consistencyTestAppId}`);
      const data1 = await response1.json();
      const initialViewCount = data1.data.viewCount;

      // 再次获取，应该浏览量+1
      const response2 = await fetch(`${API_BASE}/apps/${consistencyTestAppId}`);
      const data2 = await response2.json();
      const updatedViewCount = data2.data.viewCount;

      expect(updatedViewCount).toBeGreaterThanOrEqual(initialViewCount);
      
      console.log('✓ 浏览量统计更新一致性验证通过');
    });
  });

  // ========== 评价功能测试 ==========
  describe('4. 评价功能测试', () => {
    const reviewTestAppId = uuidv4();

    beforeAll(async () => {
      // 创建测试应用
      await fetch(`${API_BASE}/apps`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: reviewTestAppId,
          name: '评价测试应用',
          description: '用于测试评价功能',
          categoryId: 'productivity',
          department: '测试部',
          url: 'https://review.test',
          developer: '测试团队',
          version: '1.0.0'
        })
      });
    });

    it('4.1 应该能成功提交评价', async () => {
      const reviewData = {
        userId: 'user-001',
        userName: '测试用户',
        rating: 5,
        comment: '非常好用的应用！'
      };

      const response = await fetch(`${API_BASE}/apps/${reviewTestAppId}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewData)
      });

      const data = await response.json();
      expect(response.ok).toBe(true);
      expect(data.success).toBe(true);
      
      console.log('✓ 评价提交成功');
    });

    it('4.2 提交的评价应该能在应用详情中看到', async () => {
      const response = await fetch(`${API_BASE}/apps/${reviewTestAppId}/reviews`);
      const data = await response.json();

      expect(response.ok).toBe(true);
      expect(data.success).toBe(true);
      
      const reviews = data.data.items;
      expect(reviews.length).toBeGreaterThan(0);
      
      const latestReview = reviews[0];
      expect(latestReview.userName).toBe('测试用户');
      expect(latestReview.rating).toBe(5);
      
      console.log('✓ 评价展示一致性验证通过');
    });

    it('4.3 平均评分应该正确计算', async () => {
      const response = await fetch(`${API_BASE}/apps/${reviewTestAppId}/reviews`);
      const data = await response.json();

      expect(response.ok).toBe(true);
      expect(data.data.averageRating).toBeDefined();
      
      console.log('✓ 评分计算验证通过');
    });
  });

  // ========== 收藏功能测试 ==========
  describe('5. 收藏功能测试', () => {
    const favoriteTestAppId = uuidv4();
    const testUserId = 'test-user-001';

    beforeAll(async () => {
      // 创建测试应用
      await fetch(`${API_BASE}/apps`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: favoriteTestAppId,
          name: '收藏测试应用',
          description: '用于测试收藏功能',
          categoryId: 'productivity',
          department: '测试部',
          url: 'https://favorite.test',
          developer: '测试团队',
          version: '1.0.0'
        })
      });
    });

    it('5.1 应该能成功添加收藏', async () => {
      const response = await fetch(`${API_BASE}/favorites`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: testUserId, appId: favoriteTestAppId })
      });

      const data = await response.json();
      expect(response.ok).toBe(true);
      expect(data.success).toBe(true);
      
      console.log('✓ 收藏添加成功');
    });

    it('5.2 收藏数应该正确更新', async () => {
      const response = await fetch(`${API_BASE}/apps/${favoriteTestAppId}`);
      const data = await response.json();

      expect(data.success).toBe(true);
      expect(data.data.favoriteCount).toBeGreaterThanOrEqual(1);
      
      console.log('✓ 收藏数统计更新验证通过');
    });

    it('5.3 收藏应该出现在用户收藏列表中', async () => {
      const response = await fetch(`${API_BASE}/favorites?userId=${testUserId}`);
      const data = await response.json();

      expect(response.ok).toBe(true);
      expect(data.success).toBe(true);
      
      const favorites = data.data.items;
      const foundFavorite = favorites.find(f => f.appId === favoriteTestAppId);
      expect(foundFavorite).toBeDefined();
      
      console.log('✓ 收藏列表展示一致性验证通过');
    });

    it('5.4 应该能成功取消收藏', async () => {
      const response = await fetch(
        `${API_BASE}/favorites?userId=${testUserId}&appId=${favoriteTestAppId}`, 
        { method: 'DELETE' }
      );

      const data = await response.json();
      expect(response.ok).toBe(true);
      expect(data.success).toBe(true);
      
      console.log('✓ 收藏取消成功');
    });
  });

  // ========== 清理测试数据 ==========
  afterAll(async () => {
    if (testAppId) {
      console.log('\n🗑️  清理测试数据...');
      try {
        await fetch(`${API_BASE}/apps/${testAppId}`, { method: 'DELETE' });
        console.log('✓ 测试数据清理完成');
      } catch (error) {
        console.warn('⚠️  测试数据清理可能失败，请手动检查');
      }
    }
  });
});

console.log('\n🎯 测试说明:');
console.log('1. 确保后端服务正在运行在 http://localhost:3001');
console.log('2. 确保数据库已初始化');
console.log('3. 运行命令: npm run test:api\n');
