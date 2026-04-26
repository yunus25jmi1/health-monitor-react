#!/bin/bash
# Local Bonk Code Quality Review Script
# Run: ./scripts/review-code-quality.sh [file-or-path]

set -e

# Load environment
if [ -f .env.opencode ]; then
    export $(cat .env.opencode | xargs)
fi

# Default to src directory
TARGET="${1:-.}"

if [ ! -e "$TARGET" ]; then
    echo "❌ Target not found: $TARGET"
    exit 1
fi

echo "📊 Running Code Quality Review on: $TARGET"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

PROMPT="Review this code for quality issues:

1. **React Best Practices**
   - Unnecessary re-renders
   - Improper hook usage (useEffect, useCallback, useMemo)
   - Missing dependency arrays
   - Memory leaks

2. **Performance**
   - Inefficient queries
   - N+1 problems
   - Unnecessary renders
   - Large bundle implications

3. **Code Cleanliness**
   - Dead code
   - Code duplication
   - Proper naming conventions
   - Code organization

4. **Error Handling**
   - Try-catch usage
   - Error propagation
   - User-friendly messages
   - Logging

5. **Testing**
   - Missing test cases
   - Test coverage gaps
   - Edge cases not covered

6. **Accessibility**
   - ARIA attributes
   - Keyboard navigation
   - Color contrast
   - Screen reader support

Provide specific examples and suggest improvements.
Be constructive and reference line numbers."

opencode review "$TARGET" --prompt "$PROMPT"
