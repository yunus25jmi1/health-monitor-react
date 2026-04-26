#!/bin/bash
# Cloudflare Pages Deployment Script
# Usage: ./scripts/deploy-cloudflare.sh

set -e

echo "🚀 Cloudflare Pages Deployment Script"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if git is clean
echo "📋 Checking git status..."
if [ -n "$(git status --porcelain)" ]; then
    echo "${YELLOW}⚠️  Uncommitted changes detected:${NC}"
    git status --short
    read -p "Continue deployment? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "❌ Deployment cancelled"
        exit 1
    fi
fi

# Check if wrangler is installed
echo "🔍 Checking Wrangler CLI..."
if ! command -v wrangler &> /dev/null; then
    echo "${YELLOW}Wrangler not found. Installing...${NC}"
    npm install -g @cloudflare/wrangler
fi

# Build the project
echo ""
echo "🔨 Building project..."
npm run build

# Check if build succeeded
if [ ! -d "dist" ]; then
    echo "${YELLOW}❌ Build failed: dist/ folder not found${NC}"
    exit 1
fi

echo "${GREEN}✅ Build successful${NC}"
echo "   Build size: $(du -sh dist | cut -f1)"

# Deploy to Cloudflare Pages
echo ""
echo "📤 Deploying to Cloudflare Pages..."
wrangler pages deploy dist/

echo ""
echo "${GREEN}✅ Deployment successful!${NC}"
echo ""
echo "📍 Your site is live:"
echo "   ${BLUE}https://health-monitor-react.pages.dev${NC}"
echo ""
echo "📊 View deployment details:"
echo "   https://dash.cloudflare.com"
echo ""
echo "🔗 View live site:"
echo "   Open browser to: https://health-monitor-react.pages.dev"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Optional: Open in browser
read -p "Open deployed site in browser? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    if command -v open &> /dev/null; then
        open "https://health-monitor-react.pages.dev"
    elif command -v xdg-open &> /dev/null; then
        xdg-open "https://health-monitor-react.pages.dev"
    elif command -v start &> /dev/null; then
        start "https://health-monitor-react.pages.dev"
    fi
fi
