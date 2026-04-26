#!/bin/bash
# Install OpenCode CLI for local Bonk-like testing

echo "🚀 Installing OpenCode CLI for local code review testing..."

# Check if bun is installed
if ! command -v bun &> /dev/null; then
    echo "📦 Installing Bun (required for OpenCode)..."
    curl -fsSL https://bun.sh/install | bash
    export PATH="$HOME/.bun/bin:$PATH"
fi

# Install OpenCode CLI globally
echo "📦 Installing OpenCode CLI..."
bun install -g opencode

# Verify installation
if command -v opencode &> /dev/null; then
    echo "✅ OpenCode CLI installed successfully!"
    opencode --version
else
    echo "❌ Installation failed. Please try manual installation:"
    echo "   bun install -g opencode"
fi
