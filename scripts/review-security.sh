#!/bin/bash
# Local Bonk Security Review Script
# Run: ./scripts/review-security.sh [file-or-path]

set -e

# Load environment
if [ -f .env.opencode ]; then
    export $(cat .env.opencode | xargs)
fi

# Default to current repo root
TARGET="${1:-.}"

if [ ! -e "$TARGET" ]; then
    echo "❌ Target not found: $TARGET"
    exit 1
fi

echo "🔐 Running Security Review on: $TARGET"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

PROMPT="Perform a comprehensive security review focusing on:

1. **Authentication & Authorization**
   - JWT handling and HttpOnly cookie implementation
   - Session validation
   - RBAC implementation

2. **XSS Prevention**
   - DOMPurify usage verification
   - dangerouslySetInnerHTML detection
   - HTML sanitization checks

3. **API Security**
   - CORS configuration
   - API endpoint protection
   - Error handling for sensitive data

4. **Dependencies**
   - Known vulnerabilities
   - Outdated packages

5. **Environment Variables**
   - .env in .gitignore
   - No exposed secrets

6. **Code Quality**
   - Error handling
   - Input validation
   - No hardcoded credentials

Provide specific file paths and line numbers for issues found.
Prioritize critical security issues."

opencode review "$TARGET" --prompt "$PROMPT"
