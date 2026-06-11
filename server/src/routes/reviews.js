const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const db = require('../db/connection');

router.get('/:appId/reviews', async (req, res) => {
  try {
    const { appId } = req.params;
    const { page = 1, pageSize = 10 } = req.query;
    const offset = (page - 1) * pageSize;
    
    const countSQL = 'SELECT COUNT(*) as total FROM APP_REVIEWS WHERE APP_ID = ?';
    const countResult = await db.query(countSQL, [appId]);
    const total = countResult[0].total;
    
    const reviewsSQL = `
      SELECT * FROM APP_REVIEWS 
      WHERE APP_ID = ?
      ORDER BY CREATED_AT DESC
      LIMIT ? OFFSET ?
    `;
    const reviews = await db.query(reviewsSQL, [appId, parseInt(pageSize), offset]);
    
    const statsSQL = `
      SELECT AVG(RATING) as avg_rating, COUNT(*) as count 
      FROM APP_REVIEWS 
      WHERE APP_ID = ?
    `;
    const stats = await db.query(statsSQL, [appId]);
    
    const result = {
      items: reviews.map(r => ({
        id: r.ID,
        userId: r.USER_ID,
        userName: r.USER_NAME,
        userAvatar: r.USER_AVATAR,
        rating: r.RATING,
        comment: r.COMMENT,
        createdAt: r.CREATED_AT
      })),
      total,
      averageRating: stats[0].avg_rating || 0,
      page: parseInt(page),
      pageSize: parseInt(pageSize),
      totalPages: Math.ceil(total / pageSize)
    };
    
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
    const { userId, userName, userAvatar, rating, comment } = req.body;
    
    if (!userId || !rating) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: '用户ID和评分不能为空'
        }
      });
    }
    
    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: '评分必须在1-5之间'
        }
      });
    }
    
    const checkAppSQL = 'SELECT ID FROM APP_INFO WHERE ID = ?';
    const apps = await db.query(checkAppSQL, [appId]);
    
    if (apps.length === 0) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'APP_NOT_FOUND',
          message: '应用不存在'
        }
      });
    }
    
    const id = uuidv4();
    const insertSQL = `
      INSERT INTO APP_REVIEWS (ID, APP_ID, USER_ID, USER_NAME, USER_AVATAR, RATING, COMMENT)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    
    await db.execute(insertSQL, [id, appId, userId, userName || '', userAvatar || '', rating, comment || '']);
    
    res.json({
      success: true,
      data: {
        id,
        message: '评价提交成功'
      }
    });
  } catch (error) {
    console.error('提交评价失败:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: '提交评价失败'
      }
    });
  }
});

module.exports = router;
