const dm = require('dm-driver');

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 5236,
  database: process.env.DB_NAME || 'APP_STORE_DB',
  user: process.env.DB_USER || 'SYSDBA',
  password: process.env.DB_PASSWORD || 'SYSDBA'
};

let pool = null;

async function createPool() {
  try {
    pool = await dm.createPool({
      ...dbConfig,
      poolMin: 2,
      poolMax: 10,
      poolIncrement: 2
    });
    console.log('数据库连接池创建成功');
    return pool;
  } catch (error) {
    console.error('数据库连接池创建失败:', error);
    throw error;
  }
}

async function getConnection() {
  if (!pool) {
    await createPool();
  }
  return await pool.getConnection();
}

async function query(sql, params = []) {
  const connection = await getConnection();
  try {
    const [results] = await connection.query(sql, params);
    return results;
  } finally {
    connection.release();
  }
}

async function execute(sql, params = []) {
  const connection = await getConnection();
  try {
    const [results] = await connection.execute(sql, params);
    return results;
  } finally {
    connection.release();
  }
}

async function transaction(callback) {
  const connection = await getConnection();
  try {
    await connection.beginTransaction();
    const result = await callback(connection);
    await connection.commit();
    return result;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

async function testConnection() {
  try {
    const connection = await getConnection();
    console.log('数据库连接测试成功');
    connection.release();
    return true;
  } catch (error) {
    console.error('数据库连接测试失败:', error);
    return false;
  }
}

async function closePool() {
  if (pool) {
    await pool.end();
    pool = null;
    console.log('数据库连接池已关闭');
  }
}

module.exports = {
  createPool,
  getConnection,
  query,
  execute,
  transaction,
  testConnection,
  closePool,
  dbConfig
};
