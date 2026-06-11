const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const db = require('../db/connection');

const UPLOAD_DIR = process.env.UPLOAD_DIR || path.join(__dirname, '../../uploads');

const imageFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);
  
  if (extname && mimetype) {
    return cb(null, true);
  }
  cb(new Error('只支持图片文件: jpeg, jpg, png, gif, webp'));
};

const videoFilter = (req, file, cb) => {
  const allowedTypes = /mp4|webm/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);
  
  if (extname && mimetype) {
    return cb(null, true);
  }
  cb(new Error('只支持视频文件: mp4, webm'));
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const appId = req.params.appId;
    const uploadType = req.path.includes('screenshots') ? 'screenshots' : 
                      req.path.includes('video') ? 'videos' : 'icon';
    
    let destPath = path.join(UPLOAD_DIR, 'apps', appId);
    
    if (uploadType === 'screenshots') {
      destPath = path.join(UPLOAD_DIR, 'apps', appId, 'screenshots');
    } else if (uploadType === 'videos') {
      destPath = path.join(UPLOAD_DIR, 'apps', appId, 'videos');
    } else if (uploadType === 'icon') {
      destPath = path.join(UPLOAD_DIR, 'apps', appId);
    }
    
    if (!fs.existsSync(destPath)) {
      fs.mkdirSync(destPath, { recursive: true });
    }
    
    cb(null, destPath);
  },
  filename: (req, file, cb) => {
    const appId = req.params.appId;
    const uploadType = req.path.includes('screenshots') ? 'screenshots' : 
                      req.path.includes('video') ? 'videos' : 'icon';
    
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname).toLowerCase();
    
    let filename;
    if (uploadType === 'icon') {
      filename = `${appId}_icon${ext}`;
    } else if (uploadType === 'videos') {
      filename = `${appId}_video${ext}`;
    } else {
      const existingFiles = fs.readdirSync(path.join(UPLOAD_DIR, 'apps', appId, 'screenshots'));
      const screenshotIndex = existingFiles.filter(f => f.includes('screenshot')).length + 1;
      filename = `${appId}_screenshot_${screenshotIndex}${ext}`;
    }
    
    cb(null, filename);
  }
});

const uploadIcon = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: imageFilter
});

const uploadScreenshots = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024, files: 10 },
  fileFilter: imageFilter
});

const uploadVideo = multer({
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter: videoFilter
});

router.post('/icon/:appId', uploadIcon.single('file'), async (req, res) => {
  try {
    const { appId } = req.params;
    
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: '请上传图标文件'
        }
      });
    }
    
    const filePath = `/uploads/apps/${appId}/${req.file.filename}`;
    
    const updateSQL = 'UPDATE APP_INFO SET ICON = ?, UPDATED_AT = CURRENT_TIMESTAMP WHERE ID = ?';
    await db.execute(updateSQL, [filePath, appId]);
    
    res.json({
      success: true,
      data: {
        path: filePath,
        filename: req.file.filename,
        size: req.file.size
      }
    });
  } catch (error) {
    console.error('上传图标失败:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'UPLOAD_ERROR',
        message: '上传图标失败'
      }
    });
  }
});

router.post('/screenshots/:appId', uploadScreenshots.array('files', 10), async (req, res) => {
  try {
    const { appId } = req.params;
    
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: '请上传截图文件'
        }
      });
    }
    
    const paths = [];
    
    for (let i = 0; i < req.files.length; i++) {
      const file = req.files[i];
      const filePath = `/uploads/apps/${appId}/screenshots/${file.filename}`;
      paths.push(filePath);
      
      const screenshotId = uuidv4();
      const insertSQL = `
        INSERT INTO APP_SCREENSHOTS (ID, APP_ID, FILE_PATH, SORT_ORDER)
        VALUES (?, ?, ?, ?)
      `;
      await db.execute(insertSQL, [screenshotId, appId, filePath, i]);
    }
    
    res.json({
      success: true,
      data: {
        paths,
        count: paths.length
      }
    });
  } catch (error) {
    console.error('上传截图失败:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'UPLOAD_ERROR',
        message: '上传截图失败'
      }
    });
  }
});

router.post('/video/:appId', uploadVideo.single('file'), async (req, res) => {
  try {
    const { appId } = req.params;
    
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: '请上传视频文件'
        }
      });
    }
    
    const filePath = `/uploads/apps/${appId}/videos/${req.file.filename}`;
    
    const updateSQL = 'UPDATE APP_INFO SET VIDEO_URL = ?, UPDATED_AT = CURRENT_TIMESTAMP WHERE ID = ?';
    await db.execute(updateSQL, [filePath, appId]);
    
    res.json({
      success: true,
      data: {
        path: filePath,
        filename: req.file.filename,
        size: req.file.size
      }
    });
  } catch (error) {
    console.error('上传视频失败:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'UPLOAD_ERROR',
        message: '上传视频失败'
      }
    });
  }
});

router.delete('/:filepath(*)', async (req, res) => {
  try {
    const { filepath } = req.params;
    const fullPath = path.join(UPLOAD_DIR, filepath);
    
    if (!fs.existsSync(fullPath)) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'FILE_NOT_FOUND',
          message: '文件不存在'
        }
      });
    }
    
    fs.unlinkSync(fullPath);
    
    const relativePath = '/' + filepath;
    const deleteScreenshotSQL = 'DELETE FROM APP_SCREENSHOTS WHERE FILE_PATH = ?';
    await db.execute(deleteScreenshotSQL, [relativePath]);
    
    res.json({
      success: true,
      message: '文件删除成功'
    });
  } catch (error) {
    console.error('删除文件失败:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: '删除文件失败'
      }
    });
  }
});

module.exports = router;
