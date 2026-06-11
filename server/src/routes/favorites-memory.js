const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const db = require('../db/memory');

router.get('/', async (req, res) => {
  try {
    const { userId } = req.query;
    
    if (!userId) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: '用户ID不能为空'
        }
      });
    }
    
    const favorites = db.favorites.getByUser(userId);
    
    res.json({
      success: true,
      data: {
        items: favorites,
        total: favorites.length
      }
    });
  } catch (error) {
    console.error('获取收藏列表失败:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: '获取收藏列表失败'
      }
    });
  }
});

router.post('/', async (req, res) => {
  try {
    const { userId, appId } = req.body;
    
    if (!userId || !appId) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: '用户ID和应用ID不能为空'
        }
      });
    }
    
    const favorite = db.favorites.add(userId, appId);
    
    res.json({
      success: true,
      data: favorite
    });
  } catch (error) {
    console.error('添加收藏失败:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: '添加收藏失败'
      }
    });
  }
});

router.delete('/', async (req, res) => {
  try {
    const { userId, appId } = req.query;
    
    if (!userId || !appId) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: '用户ID和应用ID不能为空'
        }
      });
    }
    
    const deleted = db.favorites.remove(userId, appId);
    
    res.json({
      success: true,
      message: deleted ? '取消收藏成功' : '收藏不存在'
    });
  } catch (error) {
    console.error('取消收藏失败:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: '取消收藏失败'
      }
    });
  }
});

module.exports = router;
