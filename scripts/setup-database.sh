#!/bin/bash

# ======================================
# ContestDraw - Database Setup Script
# ======================================
# This script sets up PostgreSQL and Redis for local development
# ======================================

set -e

echo "🗄️  ContestDraw - Database Setup"
echo "=================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration from .env
DB_USER="contestdraw_user"
DB_PASSWORD="iTxsLHOiQSk9BpAWtAYGlQ78r9hW52I3"
DB_NAME="contestdraw_dev"
DB_NAME_TEST="contestdraw_test"
REDIS_PASSWORD="zsa8oVwtk9zxbqW6SYLBF7EhwKdFuXgF"

echo "📋 Configuration:"
echo "   Database User: $DB_USER"
echo "   Database Name: $DB_NAME"
echo "   Test Database: $DB_NAME_TEST"
echo ""

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo -e "${RED}❌ PostgreSQL is not installed${NC}"
    echo ""
    echo "Install PostgreSQL:"
    echo "  macOS:   brew install postgresql@15"
    echo "  Ubuntu:  sudo apt-get install postgresql postgresql-contrib"
    echo "  Windows: Download from https://www.postgresql.org/download/windows/"
    exit 1
fi

# Check if Redis is installed
if ! command -v redis-cli &> /dev/null; then
    echo -e "${YELLOW}⚠️  Redis is not installed${NC}"
    echo ""
    echo "Install Redis:"
    echo "  macOS:   brew install redis"
    echo "  Ubuntu:  sudo apt-get install redis-server"
    echo "  Windows: Download from https://redis.io/download"
    echo ""
fi

echo "1️⃣  Setting up PostgreSQL..."
echo "   Creating database user..."

# Create PostgreSQL user
psql -U postgres -c "CREATE USER $DB_USER WITH PASSWORD '$DB_PASSWORD';" 2>/dev/null || echo "   User already exists"

# Grant necessary privileges
psql -U postgres -c "ALTER USER $DB_USER CREATEDB;" 2>/dev/null || true

echo "   Creating databases..."

# Create development database
psql -U postgres -c "CREATE DATABASE $DB_NAME OWNER $DB_USER;" 2>/dev/null || echo "   Dev database already exists"

# Create test database
psql -U postgres -c "CREATE DATABASE $DB_NAME_TEST OWNER $DB_USER;" 2>/dev/null || echo "   Test database already exists"

# Grant privileges
psql -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;" 2>/dev/null || true
psql -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE $DB_NAME_TEST TO $DB_USER;" 2>/dev/null || true

echo -e "${GREEN}✅ PostgreSQL setup complete${NC}"
echo ""

# Setup Redis
if command -v redis-cli &> /dev/null; then
    echo "2️⃣  Setting up Redis..."

    # Check if Redis is running
    if redis-cli ping &> /dev/null; then
        echo "   Redis is already running"
    else
        echo "   Starting Redis..."
        # Try to start Redis
        if [[ "$OSTYPE" == "darwin"* ]]; then
            brew services start redis &> /dev/null || redis-server --daemonize yes
        elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
            sudo service redis-server start || redis-server --daemonize yes
        fi
        sleep 2
    fi

    # Set Redis password
    redis-cli CONFIG SET requirepass "$REDIS_PASSWORD" &> /dev/null || true

    echo -e "${GREEN}✅ Redis setup complete${NC}"
    echo ""
fi

# Test connections
echo "3️⃣  Testing connections..."

# Test PostgreSQL
if psql -U $DB_USER -d $DB_NAME -c "SELECT 1;" &> /dev/null; then
    echo -e "${GREEN}✅ PostgreSQL connection successful${NC}"
else
    echo -e "${RED}❌ PostgreSQL connection failed${NC}"
    exit 1
fi

# Test Redis
if command -v redis-cli &> /dev/null; then
    if redis-cli -a "$REDIS_PASSWORD" ping &> /dev/null; then
        echo -e "${GREEN}✅ Redis connection successful${NC}"
    else
        echo -e "${YELLOW}⚠️  Redis connection failed (non-critical)${NC}"
    fi
fi

echo ""
echo "4️⃣  Running Prisma migrations..."
cd "$(dirname "$0")/../backend"

# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate deploy || npx prisma migrate dev --name init

echo -e "${GREEN}✅ Database migrations complete${NC}"
echo ""

echo "=================================="
echo -e "${GREEN}🎉 Database setup complete!${NC}"
echo ""
echo "Connection strings:"
echo "  Development: postgresql://$DB_USER:$DB_PASSWORD@localhost:5432/$DB_NAME"
echo "  Test:        postgresql://$DB_USER:$DB_PASSWORD@localhost:5432/$DB_NAME_TEST"
echo "  Redis:       redis://localhost:6379 (password: $REDIS_PASSWORD)"
echo ""
echo "Next steps:"
echo "  1. Run: npm run prisma:studio (to view database)"
echo "  2. Run: npm run seed (to add test data)"
echo "  3. Run: npm run dev (to start backend)"
echo ""
