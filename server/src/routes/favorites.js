const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const db = require('../db/connection');

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
    
    const favoritesSQL = `
      SELECT f.*, a.NAME, a.ICON, a.DESCRIPTION, a.URL, a.DEVELOPER, a.VERSION
      FROM USER_FAVORITES f
      INNER JOIN APP_INFO a ON f.APP_ID = a.ID
      WHERE f.USER_ID = ?
      ORDER BY f.CREATED_AT DESC
    `;
    
    const favorites = await db.query(favoritesSQL, [userId]);
    
    const result = favorites.map(fav => ({
      id: fav.ID,
      appId: fav.APP_ID,
      appName: fav.NAME,
      appIcon: fav.ICON,
      appDescription: fav.DESCRIPTION,
      appUrl: fav.URL,
      developer: fav.DEVELOPER,
      version: fav.VERSION,
      createdAt: fav.CREATED_AT
    }));
    
    res.json({
      success: true,
      data: {
        items: result,
        total: result.length
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
    
    const checkFavoriteSQL = 'SELECT ID FROM USER_FAVORITES WHERE USER_ID = ? AND APP_ID = ?';
    const existing = await db.query(checkFavoriteSQL, [userId, appId]);
    
    if (existing.length > 0) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'ALREADY_FAVORITED',
          message: '已经收藏过该应用'
        }
      });
    }
    
    const id = uuidv4();
    const insertSQL = 'INSERT INTO USER_FAVORITES (ID, USER_ID, APP_ID) VALUES (?, ?, ?)';
    await db.execute(insertSQL, [id, userId, appId]);
    
    const updateFavoriteCountSQL = `
      UPDATE APP_INFO 
      SET FAVORITE_COUNT = (SELECT COUNT(*) FROM USER_FAVORITES WHERE APP_ID = ?)
      WHERE ID = ?
    `;
    await db.execute(updateFavoriteCountSQL, [appId, appId]);
    
    res.json({
      success: true,
      message: '收藏成功'
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
    
    const deleteSQL = 'DELETE FROM USER_FAVORITES WHERE USER_ID = ? AND APP_ID = ?';
    const result = await db.execute(deleteSQL, [userId, appId]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'FAVORITE_NOT_FOUND',
          message: '收藏记录不存在'
        }
      });
    }
    
    const updateFavoriteCountSQL = `
      UPDATE APP_INFO 
      SET FAVORITE_COUNT = (SELECT COUNT(*) FROM USER_FAVORITES WHERE APP_ID = ?)
      WHERE ID = ?
    `;
    await db.execute(updateFavoriteCountSQL, [appId, appId]);
    
    res.json({
      success: true,
      message: '取消收藏成功'
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
