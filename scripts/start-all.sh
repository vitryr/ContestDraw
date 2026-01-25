#!/bin/bash

# ======================================
# ContestDraw - Start All Services
# ======================================
# Starts backend, frontend, and mobile in separate terminals
# ======================================

set -e

echo "🚀 Starting ContestDraw Services"
echo "=================================="

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Get the project root directory
PROJECT_ROOT="$(cd "$(dirname "$0")/.." && pwd)"

echo -e "${BLUE}📂 Project root: $PROJECT_ROOT${NC}"
echo ""

# Check if services are already running
check_port() {
    lsof -i:$1 &> /dev/null
    return $?
}

# Kill existing processes on ports
kill_port() {
    echo "   Killing process on port $1..."
    lsof -ti:$1 | xargs kill -9 2>/dev/null || true
}

# Backend port: 8000
if check_port 8000; then
    echo -e "${YELLOW}⚠️  Backend already running on port 8000${NC}"
    read -p "Kill existing process? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        kill_port 8000
    fi
fi

# Frontend port: 3001
if check_port 3001; then
    echo -e "${YELLOW}⚠️  Frontend already running on port 3001${NC}"
    read -p "Kill existing process? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        kill_port 3001
    fi
fi

echo ""
echo "1️⃣  Starting Backend API (port 8000)..."

# Start backend in new terminal
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    osascript -e "tell application \"Terminal\" to do script \"cd '$PROJECT_ROOT/backend' && echo '🔧 Backend API' && npm run dev\""
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    # Linux
    if command -v gnome-terminal &> /dev/null; then
        gnome-terminal -- bash -c "cd '$PROJECT_ROOT/backend' && echo '🔧 Backend API' && npm run dev; exec bash"
    elif command -v xterm &> /dev/null; then
        xterm -e "cd '$PROJECT_ROOT/backend' && echo '🔧 Backend API' && npm run dev" &
    else
        echo "Please start backend manually: cd backend && npm run dev"
    fi
elif [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "win32" ]]; then
    # Windows
    start cmd /k "cd /d $PROJECT_ROOT/backend && echo Backend API && npm run dev"
fi

echo -e "${GREEN}✅ Backend starting...${NC}"
echo ""
sleep 3

echo "2️⃣  Starting Frontend Web (port 3001)..."

# Start frontend in new terminal
if [[ "$OSTYPE" == "darwin"* ]]; then
    osascript -e "tell application \"Terminal\" to do script \"cd '$PROJECT_ROOT/frontend-web' && echo '🌐 Frontend Web' && npm run dev\""
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    if command -v gnome-terminal &> /dev/null; then
        gnome-terminal -- bash -c "cd '$PROJECT_ROOT/frontend-web' && echo '🌐 Frontend Web' && npm run dev; exec bash"
    elif command -v xterm &> /dev/null; then
        xterm -e "cd '$PROJECT_ROOT/frontend-web' && echo '🌐 Frontend Web' && npm run dev" &
    else
        echo "Please start frontend manually: cd frontend-web && npm run dev"
    fi
elif [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "win32" ]]; then
    start cmd /k "cd /d $PROJECT_ROOT/frontend-web && echo Frontend Web && npm run dev"
fi

echo -e "${GREEN}✅ Frontend starting...${NC}"
echo ""
sleep 2

echo "3️⃣  Starting Mobile App (Expo)..."

# Start mobile in new terminal
if [[ "$OSTYPE" == "darwin"* ]]; then
    osascript -e "tell application \"Terminal\" to do script \"cd '$PROJECT_ROOT/mobile' && echo '📱 Mobile App' && npm start\""
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    if command -v gnome-terminal &> /dev/null; then
        gnome-terminal -- bash -c "cd '$PROJECT_ROOT/mobile' && echo '📱 Mobile App' && npm start; exec bash"
    elif command -v xterm &> /dev/null; then
        xterm -e "cd '$PROJECT_ROOT/mobile' && echo '📱 Mobile App' && npm start" &
    else
        echo "Please start mobile manually: cd mobile && npm start"
    fi
elif [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "win32" ]]; then
    start cmd /k "cd /d $PROJECT_ROOT/mobile && echo Mobile App && npm start"
fi

echo -e "${GREEN}✅ Mobile app starting...${NC}"
echo ""

echo "=================================="
echo -e "${GREEN}🎉 All services starting!${NC}"
echo ""
echo "📝 Service URLs:"
echo "   Backend API:  http://localhost:8000"
echo "   Frontend Web: http://localhost:3001"
echo "   Mobile App:   Expo DevTools will open"
echo ""
echo "📚 Additional URLs:"
echo "   API Docs:     http://localhost:8000/api-docs"
echo "   Prisma Studio: npm run prisma:studio (in backend folder)"
echo ""
echo "⏹️  To stop all services:"
echo "   Close the terminal windows or run:"
echo "   lsof -ti:8000,3001 | xargs kill -9"
echo ""
