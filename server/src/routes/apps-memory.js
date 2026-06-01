const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const db = require('../db/memory');

router.get('/', async (req, res) => {
  try {
    const { page = 1, pageSize = 12, category, keyword, sortBy = 'popular' } = req.query;
    
    const result = db.apps.getAll({ page, pageSize, category, keyword, sortBy });
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('获取应用列表失败:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: '获取应用列表失败'
      }
    });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const app = db.apps.getById(id);
    
    if (!app) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'APP_NOT_FOUND',
          message: '应用不存在'
        }
      });
    }
    
    const reviews = db.reviews.getByApp(id);
    app.reviews = reviews.items;
    app.averageRating = reviews.averageRating;
    app.reviewCount = reviews.count;
    
    res.json({
      success: true,
      data: app
    });
  } catch (error) {
    console.error('获取应用详情失败:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: '获取应用详情失败'
      }
    });
  }
});

router.post('/', async (req, res) => {
  try {
    const newApp = db.apps.create(req.body);
    
    res.json({
      success: true,
      data: {
        id: newApp.id,
        message: '应用创建成功'
      }
    });
  } catch (error) {
    console.error('创建应用失败:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: '创建应用失败'
      }
    });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedApp = db.apps.update(id, req.body);
    
    if (!updatedApp) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'APP_NOT_FOUND',
          message: '应用不存在'
        }
      });
    }
    
    res.json({
      success: true,
      message: '应用更新成功'
    });
  } catch (error) {
    console.error('更新应用失败:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: '更新应用失败'
      }
    });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = db.apps.delete(id);
    
    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'APP_NOT_FOUND',
          message: '应用不存在'
        }
      });
    }
    
    res.json({
      success: true,
      message: '应用删除成功'
    });
  } catch (error) {
    console.error('删除应用失败:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: '删除应用失败'
      }
    });
  }
});

router.patch('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!['active', 'inactive'].includes(status)) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: '无效的状态值'
        }
      });
    }
    
    const updatedApp = db.apps.updateStatus(id, status);
    
    if (!updatedApp) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'APP_NOT_FOUND',
          message: '应用不存在'
        }
      });
    }
    
    res.json({
      success: true,
      message: '状态更新成功'
    });
  } catch (error) {
    console.error('更新状态失败:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: '更新状态失败'
      }
    });
  }
});

module.exports = router;
