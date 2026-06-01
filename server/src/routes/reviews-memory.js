const express = require('express');
const router = express.Router();
const db = require('../db/memory');

router.get('/:appId/reviews', async (req, res) => {
  try {
    const { appId } = req.params;
    
    const result = db.reviews.getByApp(appId);
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('获取评价列表失败:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: '获取评价列表失败'
      }
    });
  }
});

router.post('/:appId/reviews', async (req, res) => {
  try {
    const { appId } = req.params;
    const { userId, userName, rating, comment } = req.body;
    
    if (!userId || !userName || !rating) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: '用户信息和评分不能为空'
        }
      });
    }
    
    const review = db.reviews.add(appId, { userId, userName, rating, comment });
    
    res.json({
      success: true,
      data: review
    });
  } catch (error) {
    console.error('添加评价失败:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: '添加评价失败'
      }
    });
  }
});

module.exports = router;
