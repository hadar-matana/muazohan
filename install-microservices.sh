#!/bin/bash

echo "🚀 Installing dependencies for all microservices..."

echo "📦 Installing main server dependencies..."
cd apps/server
pnpm install

echo "📦 Installing S3 server dependencies..."
cd ../s3-server
pnpm install

echo "📦 Installing PostgreSQL server dependencies..."
cd ../postgres-server
pnpm install

echo "✅ All dependencies installed successfully!"
echo ""
echo "🎯 To start all servers:"
echo "Terminal 1: cd apps/server && pnpm dev"
echo "Terminal 2: cd apps/s3-server && pnpm dev"
echo "Terminal 3: cd apps/postgres-server && pnpm dev"
echo ""
echo "📖 See MICROSERVICES_README.md for detailed documentation"
