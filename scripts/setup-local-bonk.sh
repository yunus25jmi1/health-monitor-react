#!/bin/bash
# Quick setup script for local Bonk testing

set -e

echo "🚀 Local Bonk Setup"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Check Bun
echo "📦 Checking Bun..."
if ! command -v bun &> /dev/null; then
    echo "   Installing Bun..."
    curl -fsSL https://bun.sh/install | bash
    export PATH="$HOME/.bun/bin:$PATH"
    echo "   ✅ Bun installed"
else
    echo "   ✅ Bun already installed"
fi

# Check OpenCode
echo "📦 Checking OpenCode CLI..."
if ! command -v opencode &> /dev/null; then
    echo "   Installing OpenCode..."
    bun install -g opencode
    echo "   ✅ OpenCode installed"
else
    echo "   ✅ OpenCode already installed"
fi

# Create .env.opencode
echo "🔑 Setting up environment..."
if [ ! -f .env.opencode ]; then
    cp .env.opencode.example .env.opencode
    echo "   ✅ Created .env.opencode"
    echo ""
    echo "   ⚠️  IMPORTANT: Edit .env.opencode and add your API key:"
    echo "   - Get key from https://app.opencode.dev (or your provider)"
    echo "   - Edit: nano .env.opencode"
    echo "   - Add: OPENCODE_API_KEY=your_key_here"
else
    echo "   ✅ .env.opencode already exists"
fi

# Make scripts executable
echo "🔧 Making scripts executable..."
chmod +x scripts/bonk.py 2>/dev/null || true
chmod +x scripts/review-security.sh 2>/dev/null || true
chmod +x scripts/review-code-quality.sh 2>/dev/null || true
chmod +x scripts/install-opencode.sh 2>/dev/null || true
echo "   ✅ Scripts ready"

# Install Python dependencies
echo "📚 Checking Python dependencies..."
if command -v pip &> /dev/null; then
    pip install -q python-dotenv 2>/dev/null || true
    echo "   ✅ Python dependencies installed"
else
    echo "   ⚠️  Python pip not found - install manually: pip install python-dotenv"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Setup Complete!"
echo ""
echo "📖 Next Steps:"
echo "1. Edit .env.opencode and add your OpenCode API key"
echo "2. Get key: https://app.opencode.dev"
echo "3. Test: python scripts/bonk.py security-review"
echo ""
echo "📚 Documentation:"
echo "   Read: LOCAL_BONK_TESTING.md"
echo ""
echo "🎯 Quick Commands:"
echo "   python scripts/bonk.py security-review      # Security review"
echo "   python scripts/bonk.py code-quality         # Code quality"
echo "   python scripts/bonk.py explain src/api/     # Explain code"
echo "   python scripts/bonk.py accessibility        # A11y check"
echo ""
