#!/bin/bash

# 企业内部应用发布平台 - 快速启动脚本
# 使用方法: ./start.sh

echo "=========================================="
echo "企业内部应用发布平台"
echo "=========================================="
echo ""

# 检查 Node.js 是否安装
if ! command -v node &> /dev/null; then
    echo "❌ 错误: 未找到 Node.js，请先安装 Node.js (版本 18.x 或更高)"
    exit 1
fi

echo "✅ Node.js 版本: $(node --version)"
echo "✅ npm 版本: $(npm --version)"
echo ""

# 检查是否已安装依赖
if [ ! -d "node_modules" ]; then
    echo "📦 安装前端依赖..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ 前端依赖安装失败"
        exit 1
    fi
fi

if [ ! -d "server/node_modules" ]; then
    echo "📦 安装后端依赖..."
    cd server && npm install && cd ..
    if [ $? -ne 0 ]; then
        echo "❌ 后端依赖安装失败"
        exit 1
    fi
fi

echo ""
echo "=========================================="
echo "启动服务..."
echo "=========================================="
echo ""

# 在后台启动后端服务
echo "🚀 启动后端服务 (端口 3001)..."
cd server
node src/app-memory.js > ../backend.log 2>&1 &
BACKEND_PID=$!
cd ..

# 等待后端启动
sleep 3

# 检查后端是否启动成功
if kill -0 $BACKEND_PID 2>/dev/null; then
    echo "✅ 后端服务已启动 (PID: $BACKEND_PID)"
    echo "📋 后端日志: tail -f backend.log"
else
    echo "❌ 后端服务启动失败，请检查 backend.log"
    exit 1
fi

echo ""
echo "🚀 启动前端服务..."
echo ""

# 保存后端 PID 以便清理
echo $BACKEND_PID > .backend.pid

# 启动前端服务
npm run dev

# 清理
echo ""
echo "正在停止后端服务..."
if [ -f .backend.pid ]; then
    kill $(cat .backend.pid) 2>/dev/null
    rm -f .backend.pid
fi
echo "✅ 服务已停止"
