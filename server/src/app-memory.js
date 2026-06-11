const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

const appsRouter = require('./routes/apps-memory');
const categoriesRouter = require('./routes/categories-memory');
const favoritesRouter = require('./routes/favorites-memory');
const uploadsRouter = require('./routes/uploads-memory');
const reviewsRouter = require('./routes/reviews-memory');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const uploadDir = path.join(__dirname, '../uploads');
app.use('/uploads', express.static(uploadDir));

app.use('/api/apps', appsRouter);
app.use('/api/apps', (req, res, next) => {
  next();
}, reviewsRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/favorites', favoritesRouter);
app.use('/api/uploads', uploadsRouter);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), version: '1.0.0' });
});

app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    success: false,
    error: {
      code: err.code || 'SERVER_ERROR',
      message: err.message || '服务器内部错误',
      details: err.details || {}
    }
  });
});

app.listen(PORT, () => {
  console.log('🚀 企业应用发布平台 - 后端服务已启动');
  console.log(`📍 服务器地址: http://localhost:${PORT}`);
  console.log(`🔗 API 端点: http://localhost:${PORT}/api`);
  console.log(`💊 健康检查: http://localhost:${PORT}/api/health`);
  console.log('📦 使用内存存储，数据不会持久化');
  console.log('');
});

module.exports = app;
