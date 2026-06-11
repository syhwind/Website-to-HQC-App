const db = require('./connection');

const createTablesSQL = `
-- 创建分类表
CREATE TABLE IF NOT EXISTS APP_CATEGORY (
    ID VARCHAR(50) PRIMARY KEY,
    NAME VARCHAR(100) NOT NULL,
    ICON VARCHAR(100),
    DESCRIPTION VARCHAR(500),
    APP_COUNT INT DEFAULT 0,
    CREATED_AT TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UPDATED_AT TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 创建应用信息表
CREATE TABLE IF NOT EXISTS APP_INFO (
    ID VARCHAR(50) PRIMARY KEY,
    NAME VARCHAR(200) NOT NULL,
    ICON VARCHAR(500),
    DESCRIPTION TEXT,
    INTRODUCTION TEXT,
    CATEGORY_ID VARCHAR(50),
    DEPARTMENT VARCHAR(100),
    TAGS VARCHAR(500),
    URL VARCHAR(500),
    DEVELOPER VARCHAR(100),
    VERSION VARCHAR(50),
    STATUS VARCHAR(20) DEFAULT 'active',
    VIEW_COUNT INT DEFAULT 0,
    FAVORITE_COUNT INT DEFAULT 0,
    VIDEO_URL VARCHAR(500),
    IS_FEATURED INT DEFAULT 0,
    CREATED_AT TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UPDATED_AT TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (CATEGORY_ID) REFERENCES APP_CATEGORY(ID)
);

-- 创建应用截图表
CREATE TABLE IF NOT EXISTS APP_SCREENSHOTS (
    ID VARCHAR(50) PRIMARY KEY,
    APP_ID VARCHAR(50) NOT NULL,
    FILE_PATH VARCHAR(500) NOT NULL,
    SORT_ORDER INT DEFAULT 0,
    CREATED_AT TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (APP_ID) REFERENCES APP_INFO(ID) ON DELETE CASCADE
);

-- 创建应用功能表
CREATE TABLE IF NOT EXISTS APP_FEATURES (
    ID VARCHAR(50) PRIMARY KEY,
    APP_ID VARCHAR(50) NOT NULL,
    FEATURE VARCHAR(500) NOT NULL,
    SORT_ORDER INT DEFAULT 0,
    CREATED_AT TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (APP_ID) REFERENCES APP_INFO(ID) ON DELETE CASCADE
);

-- 创建联系人表
CREATE TABLE IF NOT EXISTS APP_CONTACTS (
    ID VARCHAR(50) PRIMARY KEY,
    APP_ID VARCHAR(50) NOT NULL,
    NAME VARCHAR(100) NOT NULL,
    ROLE VARCHAR(100),
    EMAIL VARCHAR(200),
    PHONE VARCHAR(50),
    AVATAR VARCHAR(500),
    CREATED_AT TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (APP_ID) REFERENCES APP_INFO(ID) ON DELETE CASCADE
);

-- 创建用户评价表
CREATE TABLE IF NOT EXISTS APP_REVIEWS (
    ID VARCHAR(50) PRIMARY KEY,
    APP_ID VARCHAR(50) NOT NULL,
    USER_ID VARCHAR(50) NOT NULL,
    USER_NAME VARCHAR(100),
    USER_AVATAR VARCHAR(500),
    RATING INT NOT NULL CHECK (RATING >= 1 AND RATING <= 5),
    COMMENT TEXT,
    CREATED_AT TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (APP_ID) REFERENCES APP_INFO(ID) ON DELETE CASCADE
);

-- 创建用户收藏表
CREATE TABLE IF NOT EXISTS USER_FAVORITES (
    ID VARCHAR(50) PRIMARY KEY,
    USER_ID VARCHAR(50) NOT NULL,
    APP_ID VARCHAR(50) NOT NULL,
    CREATED_AT TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (USER_ID, APP_ID),
    FOREIGN KEY (APP_ID) REFERENCES APP_INFO(ID) ON DELETE CASCADE
);
`;

const createIndexesSQL = `
-- 应用信息表索引
CREATE INDEX IF NOT EXISTS IDX_APP_NAME ON APP_INFO(NAME);
CREATE INDEX IF NOT EXISTS IDX_APP_CATEGORY ON APP_INFO(CATEGORY_ID);
CREATE INDEX IF NOT EXISTS IDX_APP_STATUS ON APP_INFO(STATUS);
CREATE INDEX IF NOT EXISTS IDX_APP_VIEW_COUNT ON APP_INFO(VIEW_COUNT DESC);
CREATE INDEX IF NOT EXISTS IDX_APP_CREATED_AT ON APP_INFO(CREATED_AT DESC);
CREATE INDEX IF NOT EXISTS IDX_APP_FEATURED ON APP_INFO(IS_FEATURED);

-- 截图表索引
CREATE INDEX IF NOT EXISTS IDX_SCREENSHOT_APP ON APP_SCREENSHOTS(APP_ID);

-- 功能表索引
CREATE INDEX IF NOT EXISTS IDX_FEATURE_APP ON APP_FEATURES(APP_ID);

-- 联系人表索引
CREATE INDEX IF NOT EXISTS IDX_CONTACT_APP ON APP_CONTACTS(APP_ID);

-- 评价表索引
CREATE INDEX IF NOT EXISTS IDX_REVIEW_APP ON APP_REVIEWS(APP_ID);
CREATE INDEX IF NOT EXISTS IDX_REVIEW_USER ON APP_REVIEWS(USER_ID);

-- 收藏表索引
CREATE INDEX IF NOT EXISTS IDX_FAVORITE_USER ON USER_FAVORITES(USER_ID);
CREATE INDEX IF NOT EXISTS IDX_FAVORITE_APP ON USER_FAVORITES(APP_ID);
`;

const insertInitialDataSQL = `
-- 插入初始分类数据
INSERT INTO APP_CATEGORY (ID, NAME, ICON, DESCRIPTION) VALUES 
('productivity', '效率办公', 'briefcase', '提升办公效率的工具和应用'),
('hr', '人力资源', 'users', '人力资源管理和员工服务'),
('finance', '财务管理', 'dollar-sign', '财务报销和资金管理'),
('dev', '研发工具', 'code', '开发、测试和运维工具'),
('communication', '协同沟通', 'message-circle', '即时通讯和协同办公'),
('analytics', '数据分析', 'bar-chart', '数据分析和可视化')
ON DUPLICATE KEY UPDATE NAME=VALUES(NAME);
`;

async function initDatabase() {
  try {
    console.log('开始初始化数据库...');
    
    await db.createPool();
    
    console.log('创建数据表...');
    const statements = createTablesSQL.split(';').filter(s => s.trim());
    for (const statement of statements) {
      if (statement.trim()) {
        try {
          await db.execute(statement);
        } catch (error) {
          if (!error.message.includes('already exists')) {
            console.error('执行 SQL 失败:', error.message);
          }
        }
      }
    }
    
    console.log('创建索引...');
    const indexStatements = createIndexesSQL.split(';').filter(s => s.trim());
    for (const statement of indexStatements) {
      if (statement.trim()) {
        try {
          await db.execute(statement);
        } catch (error) {
          if (!error.message.includes('already exists')) {
            console.error('执行索引 SQL 失败:', error.message);
          }
        }
      }
    }
    
    console.log('插入初始数据...');
    const dataStatements = insertInitialDataSQL.split(';').filter(s => s.trim());
    for (const statement of dataStatements) {
      if (statement.trim()) {
        try {
          await db.execute(statement);
        } catch (error) {
          console.error('插入数据失败:', error.message);
        }
      }
    }
    
    console.log('数据库初始化完成！');
    
    const connected = await db.testConnection();
    if (connected) {
      console.log('数据库连接测试通过');
    }
    
    await db.closePool();
    
    return true;
  } catch (error) {
    console.error('数据库初始化失败:', error);
    return false;
  }
}

if (require.main === module) {
  initDatabase()
    .then(success => {
      if (success) {
        console.log('✅ 数据库初始化成功');
        process.exit(0);
      } else {
        console.error('❌ 数据库初始化失败');
        process.exit(1);
      }
    })
    .catch(error => {
      console.error('❌ 数据库初始化出错:', error);
      process.exit(1);
    });
}

module.exports = { initDatabase };
