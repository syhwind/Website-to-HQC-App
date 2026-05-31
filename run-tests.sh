#!/bin/bash

echo "========================================="
echo "  企业内部应用发布平台 - 测试套件"
echo "========================================="

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 检查依赖
check_dependencies() {
    echo -e "${BLUE}[1/5] 检查测试环境...${NC}"
    
    if [ ! -f "node_modules/.package-lock.json" ]; then
        echo -e "${YELLOW}警告: 未检测到 node_modules，正在安装...${NC}"
        npm install
    fi
    echo -e "${GREEN}✓ 环境检查完成${NC}"
}

# 安装后端测试依赖
install_backend() {
    echo -e "\n${BLUE}[2/5] 安装后端测试依赖...${NC}"
    cd server
    if [ ! -f "node_modules/.package-lock.json" ]; then
        npm install
    fi
    cd ..
    echo -e "${GREEN}✓ 后端依赖安装完成${NC}"
}

# 启动后端服务（如果需要）
start_backend() {
    echo -e "\n${BLUE}[3/5] 检查后端服务状态...${NC}"
    
    if curl -s "http://localhost:3001/health" > /dev/null 2>&1; then
        echo -e "${GREEN}✓ 后端服务已运行${NC}"
    else
        echo -e "${YELLOW}后端服务未运行。请手动启动后端服务:${NC}"
        echo "  cd server && npm run dev"
        echo ""
        echo -e "${YELLOW}测试将在后端服务启动后进行${NC}"
    fi
}

# 运行测试
run_tests() {
    echo -e "\n${BLUE}[4/5] 开始运行测试...${NC}"
    echo ""
    
    echo "请选择要运行的测试:"
    echo "1. 后端 API 测试"
    echo "2. 后端数据一致性专项测试"
    echo "3. 前端组件测试"
    echo "4. 运行全部测试"
    echo "5. 退出"
    echo ""
    read -p "请输入选项 (1-5): " choice
    
    case $choice in
        1)
            echo -e "\n${BLUE}运行后端 API 测试...${NC}"
            cd server
            npm run test:api
            cd ..
            ;;
        2)
            echo -e "\n${BLUE}运行数据一致性专项测试...${NC}"
            cd server
            npm run test:consistency
            cd ..
            ;;
        3)
            echo -e "\n${BLUE}运行前端组件测试...${NC}"
            npm run test:components
            ;;
        4)
            echo -e "\n${BLUE}运行全部测试...${NC}"
            echo "后端 API 测试..."
            cd server
            npm run test
            cd ..
            echo ""
            echo "前端组件测试..."
            npm run test
            ;;
        5)
            echo -e "${GREEN}退出测试${NC}"
            exit 0
            ;;
        *)
            echo -e "${RED}无效选项${NC}"
            ;;
    esac
}

# 生成报告
generate_report() {
    echo -e "\n${BLUE}[5/5] 生成测试报告...${NC}"
    
    echo ""
    echo "========================================="
    echo "  测试运行完成！"
    echo "========================================="
    echo ""
    echo "📝 测试说明:"
    echo ""
    echo "后端测试位置: /server/api.test.js 和 /server/consistency.test.js"
    echo "  - 覆盖新应用发布的完整流程"
    echo "  - 重点测试编辑前后数据一致性"
    echo "  - 验证状态切换的正确性"
    echo "  - 验证多用户并发操作的数据一致性"
    echo ""
    echo "前端测试位置: /components.test.tsx"
    echo "  - 验证前端数据展示一致性"
    echo "  - 验证编辑流程"
    echo ""
    echo "🔧 快速命令:"
    echo ""
    echo "后端:"
    echo "  cd server && npm run test:api        # API 测试"
    echo "  cd server && npm run test:consistency # 数据一致性测试"
    echo "  cd server && npm run test:coverage    # 覆盖率测试"
    echo ""
    echo "前端:"
    echo "  npm run test:components               # 组件测试"
    echo "  npm run test:coverage                 # 覆盖率测试"
    echo ""
    echo "========================================="
}

# 主流程
main() {
    check_dependencies
    install_backend
    start_backend
    run_tests
    generate_report
}

# 运行
main
