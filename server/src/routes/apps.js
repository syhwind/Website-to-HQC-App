const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const db = require('../db/connection');

router.get('/', async (req, res) => {
  try {
    const { page = 1, pageSize = 12, category, keyword, sortBy = 'popular' } = req.query;
    const offset = (page - 1) * pageSize;
    
    let whereClause = "WHERE STATUS = 'active'";
    const params = [];
    
    if (category) {
      whereClause += " AND CATEGORY_ID = ?";
      params.push(category);
    }
    
    if (keyword) {
      whereClause += " AND (NAME LIKE ? OR DESCRIPTION LIKE ? OR TAGS LIKE ?)";
      const searchPattern = `%${keyword}%`;
      params.push(searchPattern, searchPattern, searchPattern);
    }
    
    let orderBy = 'VIEW_COUNT DESC';
    if (sortBy === 'latest') {
      orderBy = 'CREATED_AT DESC';
    } else if (sortBy === 'featured') {
      orderBy = 'IS_FEATURED DESC, CREATED_AT DESC';
    }
    
    const countSQL = `SELECT COUNT(*) as total FROM APP_INFO ${whereClause}`;
    const countResult = await db.query(countSQL, params);
    const total = countResult[0].total;
    
    const dataSQL = `
      SELECT * FROM APP_INFO 
      ${whereClause}
      ORDER BY ${orderBy}
      LIMIT ? OFFSET ?
    `;
    const apps = await db.query(dataSQL, [...params, parseInt(pageSize), offset]);
    
    for (let app of apps) {
      const screenshotsSQL = 'SELECT FILE_PATH FROM APP_SCREENSHOTS WHERE APP_ID = ? ORDER BY SORT_ORDER';
      const screenshots = await db.query(screenshotsSQL, [app.ID]);
      app.screenshots = screenshots.map(s => s.FILE_PATH);
      
      const featuresSQL = 'SELECT FEATURE FROM APP_FEATURES WHERE APP_ID = ? ORDER BY SORT_ORDER';
      const features = await db.query(featuresSQL, [app.ID]);
      app.features = features.map(f => f.FEATURE);
      
      const contactsSQL = 'SELECT * FROM APP_CONTACTS WHERE APP_ID = ?';
      const contacts = await db.query(contactsSQL, [app.ID]);
      app.contacts = contacts.map(c => ({
        id: c.ID,
        name: c.NAME,
        role: c.ROLE,
        email: c.EMAIL,
        phone: c.PHONE,
        avatar: c.AVATAR
      }));
      
      const reviewsSQL = `
        SELECT AVG(RATING) as avg_rating, COUNT(*) as count 
        FROM APP_REVIEWS 
        WHERE APP_ID = ?
      `;
      const reviewsStats = await db.query(reviewsSQL, [app.ID]);
      app.averageRating = reviewsStats[0].avg_rating || 0;
      app.reviewCount = reviewsStats[0].count || 0;
    }
    
    res.json({
      success: true,
      data: {
        items: apps,
        total,
        page: parseInt(page),
        pageSize: parseInt(pageSize),
        totalPages: Math.ceil(total / pageSize)
      }
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
    
    const appSQL = 'SELECT * FROM APP_INFO WHERE ID = ?';
    const apps = await db.query(appSQL, [id]);
    
    if (apps.length === 0) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'APP_NOT_FOUND',
          message: '应用不存在'
        }
      });
    }
    
    const app = apps[0];
    
    const viewCountSQL = 'UPDATE APP_INFO SET VIEW_COUNT = VIEW_COUNT + 1 WHERE ID = ?';
    await db.execute(viewCountSQL, [id]);
    app.viewCount += 1;
    
    const screenshotsSQL = 'SELECT FILE_PATH FROM APP_SCREENSHOTS WHERE APP_ID = ? ORDER BY SORT_ORDER';
    const screenshots = await db.query(screenshotsSQL, [id]);
    app.screenshots = screenshots.map(s => s.FILE_PATH);
    
    const featuresSQL = 'SELECT FEATURE FROM APP_FEATURES WHERE APP_ID = ? ORDER BY SORT_ORDER';
    const features = await db.query(featuresSQL, [id]);
    app.features = features.map(f => f.FEATURE);
    
    const contactsSQL = 'SELECT * FROM APP_CONTACTS WHERE APP_ID = ?';
    const contacts = await db.query(contactsSQL, [id]);
    app.contacts = contacts.map(c => ({
      id: c.ID,
      name: c.NAME,
      role: c.ROLE,
      email: c.EMAIL,
      phone: c.PHONE,
      avatar: c.AVATAR
    }));
    
    const reviewsSQL = 'SELECT * FROM APP_REVIEWS WHERE APP_ID = ? ORDER BY CREATED_AT DESC LIMIT 10';
    const reviews = await db.query(reviewsSQL, [id]);
    app.reviews = reviews.map(r => ({
      id: r.ID,
      userId: r.USER_ID,
      userName: r.USER_NAME,
      userAvatar: r.USER_AVATAR,
      rating: r.RATING,
      comment: r.COMMENT,
      createdAt: r.CREATED_AT
    }));
    
    const statsSQL = `
      SELECT AVG(RATING) as avg_rating, COUNT(*) as count 
      FROM APP_REVIEWS 
      WHERE APP_ID = ?
    `;
    const stats = await db.query(statsSQL, [id]);
    app.averageRating = stats[0].avg_rating || 0;
    app.reviewCount = stats[0].count || 0;
    
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
    const {
      name, icon, description, introduction, categoryId,
      department, tags, url, developer, version,
      screenshots = [], features = [], contacts = []
    } = req.body;
    
    const id = uuidv4();
    
    const insertAppSQL = `
      INSERT INTO APP_INFO 
      (ID, NAME, ICON, DESCRIPTION, INTRODUCTION, CATEGORY_ID, DEPARTMENT, TAGS, URL, DEVELOPER, VERSION, STATUS)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'active')
    `;
    
    await db.execute(insertAppSQL, [
      id, name, icon || '', description || '', introduction || '',
      categoryId, department, tags ? tags.join(',') : '', url, developer, version
    ]);
    
    for (let i = 0; i < screenshots.length; i++) {
      const screenshotId = uuidv4();
      const insertScreenshotSQL = `
        INSERT INTO APP_SCREENSHOTS (ID, APP_ID, FILE_PATH, SORT_ORDER)
        VALUES (?, ?, ?, ?)
      `;
      await db.execute(insertScreenshotSQL, [screenshotId, id, screenshots[i], i]);
    }
    
    for (let i = 0; i < features.length; i++) {
      const featureId = uuidv4();
      const insertFeatureSQL = `
        INSERT INTO APP_FEATURES (ID, APP_ID, FEATURE, SORT_ORDER)
        VALUES (?, ?, ?, ?)
      `;
      await db.execute(insertFeatureSQL, [featureId, id, features[i], i]);
    }
    
    for (let contact of contacts) {
      const contactId = uuidv4();
      const insertContactSQL = `
        INSERT INTO APP_CONTACTS (ID, APP_ID, NAME, ROLE, EMAIL, PHONE, AVATAR)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;
      await db.execute(insertContactSQL, [
        contactId, id, contact.name, contact.role,
        contact.email, contact.phone, contact.avatar || ''
      ]);
    }
    
    const updateCategorySQL = `
      UPDATE APP_CATEGORY 
      SET APP_COUNT = (SELECT COUNT(*) FROM APP_INFO WHERE CATEGORY_ID = ?)
      WHERE ID = ?
    `;
    await db.execute(updateCategorySQL, [categoryId, categoryId]);
    
    res.json({
      success: true,
      data: {
        id,
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
    const {
      name, icon, description, introduction, categoryId,
      department, tags, url, developer, version,
      screenshots, features, contacts, videoUrl, isFeatured
    } = req.body;
    
    const updateAppSQL = `
      UPDATE APP_INFO 
      SET NAME = ?, ICON = ?, DESCRIPTION = ?, INTRODUCTION = ?,
          CATEGORY_ID = ?, DEPARTMENT = ?, TAGS = ?, URL = ?,
          DEVELOPER = ?, VERSION = ?, VIDEO_URL = ?, IS_FEATURED = ?,
          UPDATED_AT = CURRENT_TIMESTAMP
      WHERE ID = ?
    `;
    
    await db.execute(updateAppSQL, [
      name, icon || '', description || '', introduction || '',
      categoryId, department, tags ? tags.join(',') : '', url,
      developer, version, videoUrl || '', isFeatured ? 1 : 0, id
    ]);
    
    if (screenshots !== undefined) {
      await db.execute('DELETE FROM APP_SCREENSHOTS WHERE APP_ID = ?', [id]);
      for (let i = 0; i < screenshots.length; i++) {
        const screenshotId = uuidv4();
        await db.execute(
          'INSERT INTO APP_SCREENSHOTS (ID, APP_ID, FILE_PATH, SORT_ORDER) VALUES (?, ?, ?, ?)',
          [screenshotId, id, screenshots[i], i]
        );
      }
    }
    
    if (features !== undefined) {
      await db.execute('DELETE FROM APP_FEATURES WHERE APP_ID = ?', [id]);
      for (let i = 0; i < features.length; i++) {
        const featureId = uuidv4();
        await db.execute(
          'INSERT INTO APP_FEATURES (ID, APP_ID, FEATURE, SORT_ORDER) VALUES (?, ?, ?, ?)',
          [featureId, id, features[i], i]
        );
      }
    }
    
    if (contacts !== undefined) {
      await db.execute('DELETE FROM APP_CONTACTS WHERE APP_ID = ?', [id]);
      for (let contact of contacts) {
        const contactId = uuidv4();
        await db.execute(
          'INSERT INTO APP_CONTACTS (ID, APP_ID, NAME, ROLE, EMAIL, PHONE, AVATAR) VALUES (?, ?, ?, ?, ?, ?, ?)',
          [contactId, id, contact.name, contact.role, contact.email, contact.phone, contact.avatar || '']
        );
      }
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
    
    const appSQL = 'SELECT CATEGORY_ID FROM APP_INFO WHERE ID = ?';
    const apps = await db.query(appSQL, [id]);
    
    if (apps.length === 0) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'APP_NOT_FOUND',
          message: '应用不存在'
        }
      });
    }
    
    const categoryId = apps[0].CATEGORY_ID;
    
    await db.execute('DELETE FROM APP_INFO WHERE ID = ?', [id]);
    
    if (categoryId) {
      const updateCategorySQL = `
        UPDATE APP_CATEGORY 
        SET APP_COUNT = (SELECT COUNT(*) FROM APP_INFO WHERE CATEGORY_ID = ?)
        WHERE ID = ?
      `;
      await db.execute(updateCategorySQL, [categoryId, categoryId]);
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
    
    const updateSQL = 'UPDATE APP_INFO SET STATUS = ?, UPDATED_AT = CURRENT_TIMESTAMP WHERE ID = ?';
    await db.execute(updateSQL, [status, id]);
    
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
