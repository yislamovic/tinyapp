#!/bin/bash
# Production deployment script for TinyApp

set -e

echo "🚀 Starting TinyApp production deployment..."

# Check if .env file exists
if [ ! -f .env ]; then
    echo "⚠️  Warning: .env file not found. Using .env.example as template."
    echo "Please create a .env file with your production configuration."
    cp .env.example .env
    echo "Created .env file from .env.example. Please update it with your production values!"
    exit 1
fi

# Pull latest changes (if using git)
if [ -d .git ]; then
    echo "📦 Pulling latest changes..."
    git pull
fi

# Stop existing containers
echo "🛑 Stopping existing containers..."
docker-compose -f docker-compose.prod.yml down

# Remove old images (optional - uncomment if you want to clean up)
# docker image prune -f

# Build and start containers
echo "🔨 Building production image..."
docker-compose -f docker-compose.prod.yml build --no-cache

echo "▶️  Starting production containers..."
docker-compose -f docker-compose.prod.yml up -d

# Show status
echo "✅ Deployment complete!"
echo ""
echo "Container status:"
docker-compose -f docker-compose.prod.yml ps

echo ""
echo "View logs with: docker-compose -f docker-compose.prod.yml logs -f"
echo "Access the app at: http://localhost:3000"
