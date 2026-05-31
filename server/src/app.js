const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

const appsRouter = require('./routes/apps');
const categoriesRouter = require('./routes/categories');
const favoritesRouter = require('./routes/favorites');
const uploadsRouter = require('./routes/uploads');
const reviewsRouter = require('./routes/reviews');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use('/api/apps', appsRouter);
app.use('/api/apps', reviewsRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/favorites', favoritesRouter);
app.use('/api/uploads', uploadsRouter);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
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
  console.log(`服务器运行在 http://localhost:${PORT}`);
  console.log(`API 端点: http://localhost:${PORT}/api`);
});

module.exports = app;
