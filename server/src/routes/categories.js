const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const db = require('../db/connection');

router.get('/', async (req, res) => {
  try {
    const categoriesSQL = 'SELECT * FROM APP_CATEGORY ORDER BY NAME';
    const categories = await db.query(categoriesSQL);
    
    const result = categories.map(cat => ({
      id: cat.ID,
      name: cat.NAME,
      icon: cat.ICON,
      description: cat.DESCRIPTION,
      appCount: cat.APP_COUNT
    }));
    
    res.json({
      success: true,
      data: result
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

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const categorySQL = 'SELECT * FROM APP_CATEGORY WHERE ID = ?';
    const categories = await db.query(categorySQL, [id]);
    
    if (categories.length === 0) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'CATEGORY_NOT_FOUND',
          message: '分类不存在'
        }
      });
    }
    
    const category = categories[0];
    
    res.json({
      success: true,
      data: {
        id: category.ID,
        name: category.NAME,
        icon: category.ICON,
        description: category.DESCRIPTION,
        appCount: category.APP_COUNT
      }
    });
  } catch (error) {
    console.error('获取分类详情失败:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: '获取分类详情失败'
      }
    });
  }
});

router.post('/', async (req, res) => {
  try {
    const { name, icon, description } = req.body;
    
    if (!name) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: '分类名称不能为空'
        }
      });
    }
    
    const id = uuidv4();
    
    const insertSQL = `
      INSERT INTO APP_CATEGORY (ID, NAME, ICON, DESCRIPTION, APP_COUNT)
      VALUES (?, ?, ?, ?, 0)
    `;
    
    await db.execute(insertSQL, [id, name, icon || '', description || '']);
    
    res.json({
      success: true,
      data: {
        id,
        message: '分类创建成功'
      }
    });
  } catch (error) {
    console.error('创建分类失败:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: '创建分类失败'
      }
    });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, icon, description } = req.body;
    
    const checkSQL = 'SELECT ID FROM APP_CATEGORY WHERE ID = ?';
    const categories = await db.query(checkSQL, [id]);
    
    if (categories.length === 0) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'CATEGORY_NOT_FOUND',
          message: '分类不存在'
        }
      });
    }
    
    const updateSQL = `
      UPDATE APP_CATEGORY 
      SET NAME = ?, ICON = ?, DESCRIPTION = ?, UPDATED_AT = CURRENT_TIMESTAMP
      WHERE ID = ?
    `;
    
    await db.execute(updateSQL, [name, icon || '', description || '', id]);
    
    res.json({
      success: true,
      message: '分类更新成功'
    });
  } catch (error) {
    console.error('更新分类失败:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: '更新分类失败'
      }
    });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const checkSQL = 'SELECT COUNT(*) as count FROM APP_INFO WHERE CATEGORY_ID = ?';
    const result = await db.query(checkSQL, [id]);
    
    if (result[0].count > 0) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'CATEGORY_HAS_APPS',
          message: '该分类下存在应用，无法删除'
        }
      });
    }
    
    const deleteSQL = 'DELETE FROM APP_CATEGORY WHERE ID = ?';
    await db.execute(deleteSQL, [id]);
    
    res.json({
      success: true,
      message: '分类删除成功'
    });
  } catch (error) {
    console.error('删除分类失败:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: '删除分类失败'
      }
    });
  }
});

module.exports = router;
