@echo off
chcp 65001 >nul
echo ==========================================
echo 企业内部应用发布平台
echo ==========================================
echo.

REM 检查 Node.js 是否安装
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ 错误: 未找到 Node.js，请先安装 Node.js (版本 18.x 或更高)
    pause
    exit /b 1
)

echo ✅ Node.js 版本:
node --version
echo ✅ npm 版本:
npm --version
echo.

REM 检查是否已安装依赖
if not exist "node_modules" (
    echo 📦 安装前端依赖...
    call npm install
    if %errorlevel% neq 0 (
        echo ❌ 前端依赖安装失败
        pause
        exit /b 1
    )
)

if not exist "server\node_modules" (
    echo 📦 安装后端依赖...
    cd server
    call npm install
    cd ..
    if %errorlevel% neq 0 (
        echo ❌ 后端依赖安装失败
        pause
        exit /b 1
    )
)

echo.
echo ==========================================
echo 启动服务...
echo ==========================================
echo.

REM 启动后端服务
echo 🚀 启动后端服务 (端口 3001)...
start "后端服务" cmd /k "cd /d %~dp0server && node src/app-memory.js"

REM 等待一下
timeout /t 3 /nobreak >nul

echo.
echo 🚀 启动前端服务...
echo.

REM 启动前端服务
call npm run dev

pause
