#!/bin/bash

# Installation script for verification system dependencies
# Run from project root: ./scripts/install-verification-deps.sh

set -e

echo "🔧 Installing Public Verification System Dependencies..."
echo ""

# Frontend dependencies
echo "📦 Installing frontend dependencies..."
cd frontend-web
npm install react-helmet-async
echo "✅ Frontend dependencies installed"
echo ""

# Backend dependencies (optional QR code library for production)
echo "📦 Installing backend dependencies..."
cd ../backend
npm install qrcode @types/qrcode
echo "✅ Backend dependencies installed"
echo ""

echo "✨ All dependencies installed successfully!"
echo ""
echo "Next steps:"
echo "1. Update your Prisma schema to include verificationHash and randomSeed fields"
echo "2. Run: npx prisma migrate dev --name add-verification-fields"
echo "3. Wrap your React app with HelmetProvider in main.tsx"
echo "4. Update draw execution to generate hashes"
echo ""
echo "📚 See docs/PUBLIC_VERIFICATION.md for full integration guide"
