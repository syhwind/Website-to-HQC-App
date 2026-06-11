const express = require('express');
const router = express.Router();
const db = require('../db/memory');

router.get('/', async (req, res) => {
  try {
    const categories = db.categories.getAll();
    
    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error('获取分类列表失败:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: '获取分类列表失败'
      }
    });
  }
});

module.exports = router;
