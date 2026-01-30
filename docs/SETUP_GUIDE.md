# 🚀 Cleack - Complete Setup Guide

## 📋 Prerequisites

### Required Software

1. **Node.js** (v18 or higher)
   ```bash
   node --version  # Should be v18.0.0 or higher
   ```

2. **PostgreSQL** (v14 or higher)
   ```bash
   psql --version  # Should be 14.x or higher
   ```

3. **Redis** (v6 or higher)
   ```bash
   redis-cli --version  # Should be 6.x or higher
   ```

4. **npm** or **yarn**
   ```bash
   npm --version  # v9 or higher
   ```

### Optional Software

- **Docker** (for containerized deployment)
- **Prisma Studio** (included with Prisma)
- **Postman** or **Insomnia** (for API testing)

---

## 🛠️ Installation Steps

### 1. Clone and Install Dependencies

```bash
# Navigate to project root
cd Cleack

# Install backend dependencies
cd backend
npm install
cd ..

# Install frontend dependencies
cd frontend-web
npm install
cd ..

# Install mobile dependencies
cd mobile
npm install
cd ..
```

### 2. Database Setup

```bash
# Run automated database setup script
./scripts/setup-database.sh
```

This script will:
- ✅ Create PostgreSQL user: `cleack_user`
- ✅ Create development database: `cleack_dev`
- ✅ Create test database: `cleack_test`
- ✅ Configure Redis with password
- ✅ Run Prisma migrations
- ✅ Generate Prisma Client

**Manual Setup (if script fails):**

```bash
# 1. Create PostgreSQL user
psql -U postgres
CREATE USER cleack_user WITH PASSWORD 'iTxsLHOiQSk9BpAWtAYGlQ78r9hW52I3';
ALTER USER cleack_user CREATEDB;

# 2. Create databases
CREATE DATABASE cleack_dev OWNER cleack_user;
CREATE DATABASE cleack_test OWNER cleack_user;
GRANT ALL PRIVILEGES ON DATABASE cleack_dev TO cleack_user;
GRANT ALL PRIVILEGES ON DATABASE cleack_test TO cleack_user;
\q

# 3. Configure Redis
redis-cli CONFIG SET requirepass "zsa8oVwtk9zxbqW6SYLBF7EhwKdFuXgF"

# 4. Run Prisma migrations
cd backend
npx prisma generate
npx prisma migrate deploy
```

### 3. Seed Test Data

```bash
cd backend
npm run seed
```

This creates:
- 3 test user accounts
- Sample social media connections
- Test subscription
- Sample draws with winners
- Test organization

**Test Accounts:**
- Email: `test@cleack.local`
- Email: `admin@cleack.local`
- Email: `premium@cleack.local`
- Password: `TestPassword123!`

### 4. Environment Configuration

All environment files are already configured:
- ✅ `backend/.env` - Backend configuration
- ✅ `frontend-web/.env.local` - Frontend configuration
- ✅ `mobile/.env` - Mobile configuration

**Required API Keys** (add to `backend/.env`):

```bash
# Stripe Test Keys (get from https://dashboard.stripe.com/test/apikeys)
STRIPE_SECRET_KEY=sk_test_YOUR_TEST_KEY
STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_TEST_KEY

# Instagram/Facebook (get from https://developers.facebook.com)
INSTAGRAM_CLIENT_ID=YOUR_INSTAGRAM_APP_ID
INSTAGRAM_CLIENT_SECRET=YOUR_INSTAGRAM_APP_SECRET
FACEBOOK_APP_ID=YOUR_FACEBOOK_APP_ID
FACEBOOK_APP_SECRET=YOUR_FACEBOOK_APP_SECRET

# Google OAuth (get from https://console.cloud.google.com)
GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET=YOUR_GOOGLE_CLIENT_SECRET
```

---

## 🚀 Starting the Application

### Option 1: Start All Services (Automated)

```bash
# From project root
./scripts/start-all.sh
```

This opens 3 terminal windows:
1. **Backend API** - `http://localhost:8000`
2. **Frontend Web** - `http://localhost:3001`
3. **Mobile App** - Expo DevTools

### Option 2: Start Services Manually

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend-web
npm run dev
```

**Terminal 3 - Mobile:**
```bash
cd mobile
npm start
```

---

## 🧪 Testing the Setup

### 1. Backend API Test

```bash
# Test health endpoint
curl http://localhost:8000/health

# Expected response:
# {"status":"ok","timestamp":"...","version":"1.0.0"}
```

### 2. Login Test

```bash
# Test login with test account
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@cleack.local",
    "password": "TestPassword123!"
  }'

# Should return JWT tokens
```

### 3. Frontend Test

1. Open browser: `http://localhost:3001`
2. Click "Sign In"
3. Login with: `test@cleack.local` / `TestPassword123!`
4. Should see dashboard with 10 credits

### 4. Mobile Test

1. Expo DevTools should open automatically
2. Scan QR code with Expo Go app (iOS/Android)
3. App should load on your device
4. Login with test credentials

---

## 📊 Useful Commands

### Backend

```bash
cd backend

# Development server
npm run dev

# Build for production
npm run build

# Run tests
npm test
npm run test:coverage

# Prisma commands
npm run prisma:studio      # Open Prisma Studio
npm run prisma:generate    # Generate Prisma Client
npm run prisma:migrate     # Run migrations
npx prisma migrate dev --name your_migration_name

# Seed database
npm run seed

# Lint
npm run lint
```

### Frontend

```bash
cd frontend-web

# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run tests
npm test

# Type checking
npm run typecheck
```

### Mobile

```bash
cd mobile

# Start Expo
npm start

# Start with specific platform
npm run ios
npm run android
npm run web

# Build for production
eas build --platform ios
eas build --platform android

# Submit to stores
eas submit --platform ios
eas submit --platform android
```

---

## 🔍 Verification Checklist

- [ ] PostgreSQL running on port 5432
- [ ] Redis running on port 6379
- [ ] Backend API running on port 8000
- [ ] Frontend web running on port 3001
- [ ] Can login with test account
- [ ] Prisma Studio accessible
- [ ] Mobile app connects to backend
- [ ] Test data seeded successfully

### Quick Verification Script

```bash
# Check all services
echo "Checking PostgreSQL..."
psql -U cleack_user -d cleack_dev -c "SELECT 1;"

echo "Checking Redis..."
redis-cli -a zsa8oVwtk9zxbqW6SYLBF7EhwKdFuXgF ping

echo "Checking Backend..."
curl http://localhost:8000/health

echo "Checking Frontend..."
curl -I http://localhost:3001
```

---

## 🐛 Troubleshooting

### Database Connection Error

```
Error: P1001: Can't reach database server
```

**Solution:**
```bash
# Check if PostgreSQL is running
pg_isready

# Start PostgreSQL
brew services start postgresql@15  # macOS
sudo service postgresql start       # Linux
```

### Redis Connection Error

```
Error: Redis connection refused
```

**Solution:**
```bash
# Check if Redis is running
redis-cli ping

# Start Redis
brew services start redis           # macOS
sudo service redis-server start     # Linux
```

### Port Already in Use

```
Error: Port 8000 is already in use
```

**Solution:**
```bash
# Find process using port
lsof -ti:8000

# Kill the process
lsof -ti:8000 | xargs kill -9
```

### Prisma Client Not Generated

```
Error: Cannot find module '@prisma/client'
```

**Solution:**
```bash
cd backend
npx prisma generate
```

### Environment Variables Not Loaded

```
Error: JWT_SECRET is not defined
```

**Solution:**
```bash
# Verify .env file exists
ls -la backend/.env

# If missing, copy from example
cp backend/.env.example backend/.env
```

---

## 📚 Additional Resources

- [API Documentation](http://localhost:8000/api-docs)
- [Prisma Studio](http://localhost:5555) - Run `npm run prisma:studio`
- [Backend Code](./backend/README.md)
- [Frontend Code](./frontend-web/README.md)
- [Mobile Code](./mobile/README.md)

---

## 🎯 Next Steps

1. **Configure Social Media APIs** - Add real API keys for Instagram, Facebook, etc.
2. **Setup Stripe** - Configure payment processing
3. **Test All Features** - Go through each feature systematically
4. **Run Tests** - Ensure all tests pass
5. **Deploy to Staging** - Test in staging environment

---

## 💡 Pro Tips

1. **Use Prisma Studio** for database visualization
   ```bash
   cd backend
   npm run prisma:studio
   ```

2. **Enable Hot Reload** for faster development
   - Backend: Uses `nodemon` automatically
   - Frontend: Uses Vite HMR automatically
   - Mobile: Shake device for dev menu

3. **Check Logs** for debugging
   ```bash
   # Backend logs
   tail -f backend/logs/combined.log

   # Frontend console
   # Open browser DevTools (F12)

   # Mobile logs
   # View in Expo DevTools
   ```

4. **Use Test Data** for development
   - All test accounts have 10+ credits
   - Sample draws already created
   - No need for real social media connections during development

---

## ⚠️ Security Notes

**DO NOT:**
- ❌ Commit `.env` files to Git
- ❌ Share database passwords publicly
- ❌ Use development secrets in production
- ❌ Expose API keys in client code

**DO:**
- ✅ Keep all secrets in `.env` files
- ✅ Use environment-specific configurations
- ✅ Rotate secrets regularly
- ✅ Use different credentials for dev/staging/production

---

## 🆘 Getting Help

If you encounter issues:

1. **Check logs** - Most errors are logged with details
2. **Verify environment** - Ensure all required services are running
3. **Clean install** - Delete `node_modules` and reinstall
4. **Reset database** - Drop and recreate databases
5. **Check memory** - Update swarm memory for coordination details

---

**Setup Complete! Happy Coding! 🎉**
