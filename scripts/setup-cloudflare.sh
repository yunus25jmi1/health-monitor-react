#!/bin/bash
# Cloudflare Pages Setup Helper Script
# This script helps you configure environment variables and secrets

set -e

echo "🚀 Cloudflare Pages Setup Helper"
echo "═══════════════════════════════════════════════════════════"
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Step 1: Verify configuration
echo "📋 Verifying project configuration..."
echo ""

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "${RED}❌ Not a git repository!${NC}"
    echo "Run: git init && git add . && git commit -m 'initial commit'"
    exit 1
fi

# Check if package.json exists
if [ ! -f "package.json" ]; then
    echo "${RED}❌ package.json not found!${NC}"
    exit 1
fi

# Check build script
BUILD_CMD=$(grep -o '"build"[^}]*' package.json | grep -o '"[^"]*"' | tail -1 | tr -d '"')
if [ -z "$BUILD_CMD" ] || [ "$BUILD_CMD" != "vite build" ]; then
    echo "${YELLOW}⚠️  Build script might not be 'vite build'${NC}"
    echo "Current: $BUILD_CMD"
fi

echo "${GREEN}✅ Project configuration verified${NC}"
echo ""

# Step 2: Configuration Values
echo "📝 Configuration Values for Cloudflare Pages:"
echo "═══════════════════════════════════════════════════════════"
echo ""

cat << 'EOF'
📌 COPY THESE SETTINGS INTO CLOUDFLARE PAGES:

Project Name:
  └─ health-monitor-react

Build Settings:
  Framework preset:     Vite (auto-detected)
  Build command:        npm install && npm run build
  Build output dir:     dist
  Root directory:       / (leave blank)

Environment Variables (Add in Pages Settings):
  Variable name:   VITE_API_URL
  Variable value:  https://health.yunus.eu.org/api/v1

GitHub Secrets (Add in GitHub Repository Settings):
  Secret 1: CLOUDFLARE_API_TOKEN (from Cloudflare dashboard)
  Secret 2: CLOUDFLARE_ACCOUNT_ID (from Cloudflare dashboard)
  Secret 3: VITE_API_URL = https://health.yunus.eu.org/api/v1

EOF

echo ""
echo "═══════════════════════════════════════════════════════════"
echo ""

# Step 3: Credentials needed
echo "🔑 You'll need to get these from Cloudflare:"
echo ""

cat << 'EOF'
1. CLOUDFLARE_ACCOUNT_ID
   └─ Dashboard > Overview > Copy Account ID

2. CLOUDFLARE_API_TOKEN
   └─ Profile > API Tokens > Create Token
   └─ Use template: Edit Cloudflare Workers
   └─ Save it somewhere safe (can't view again!)

EOF

echo ""
read -p "Do you have your Cloudflare Account ID ready? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "👉 Get it from: https://dash.cloudflare.com"
    echo "   Dashboard > Overview > Copy Account ID"
    echo ""
fi

# Step 4: Environment file
echo "📄 Creating local environment template..."

cat > .env.local.template << 'EOF'
# Local development environment
VITE_API_URL=https://health.yunus.eu.org/api/v1

# For local Bonk testing
OPENCODE_API_KEY=your_key_here
EOF

echo "${GREEN}✅ Created .env.local.template${NC}"
echo ""

# Step 5: Verify GitHub workflow
echo "🔄 Verifying GitHub Actions workflow..."

if [ -f ".github/workflows/deploy-pages.yml" ]; then
    echo "${GREEN}✅ GitHub workflow found: .github/workflows/deploy-pages.yml${NC}"
else
    echo "${RED}❌ GitHub workflow not found!${NC}"
    exit 1
fi

echo ""

# Step 6: Git status
echo "📌 Git Status:"
echo "═══════════════════════════════════════════════════════════"

git status --short

echo ""

# Step 7: Next steps
echo "🎯 Next Steps:"
echo "═══════════════════════════════════════════════════════════"
echo ""

cat << 'EOF'
1. Create/Login to Cloudflare Account
   └─ https://dash.cloudflare.com/sign-up

2. Create Pages Project
   └─ Pages > Create project > Connect to Git
   └─ Select: yunus25jmi1/health-monitor-react
   └─ Authorize Cloudflare app on GitHub

3. Configure Build Settings
   └─ Build command: npm install && npm run build
   └─ Build output: dist
   └─ Root directory: (leave blank)

4. Add Environment Variables
   └─ Pages > Project > Settings > Environment
   └─ Add: VITE_API_URL = https://health.yunus.eu.org/api/v1

5. Get Cloudflare Credentials
   └─ Account ID: Dashboard > Overview > Copy Account ID
   └─ API Token: Profile > API Tokens > Create Token
     (Use template: Edit Cloudflare Workers)

6. Add GitHub Secrets
   └─ Go to GitHub: Settings > Secrets and variables > Actions
   └─ Add 3 secrets:
     1. CLOUDFLARE_API_TOKEN (from step 5)
     2. CLOUDFLARE_ACCOUNT_ID (from step 5)
     3. VITE_API_URL = https://health.yunus.eu.org/api/v1

7. Deploy
   └─ git push origin main
   └─ Watch Cloudflare > Pages > Deployments
   └─ Your site will be live in 1-2 minutes!

EOF

echo ""
echo "═══════════════════════════════════════════════════════════"
echo "${GREEN}✅ Setup helper complete!${NC}"
echo ""
echo "📚 For detailed instructions, read: CLOUDFLARE_SETUP_GUIDE.md"
echo ""
echo "🚀 Ready to deploy! Follow the steps above."
echo ""
