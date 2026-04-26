# Local Bonk Testing Guide

This guide explains how to set up and use Bonk-like code review functionality locally without needing the GitHub App.

## Overview

Local Bonk testing uses the **OpenCode CLI** (the same engine that powers the GitHub App version of Bonk) to run AI code reviews locally on your machine.

**Benefits:**
- 🏃 Fast iteration without pushing to GitHub
- 🔐 All reviews stay on your local machine
- 💰 Potentially lower cost (batch local testing)
- 🛠️ Test prompts before committing workflow configs
- 📊 Compare different models side-by-side

---

## Prerequisites

### Required
- Node.js 18+ (or Bun)
- Python 3.8+ (for bonk.py CLI)
- API key from OpenCode or compatible provider

### Optional
- Git (for viewing diffs)
- Docker (for sandboxed testing)

---

## Installation

### 1. Install Bun (if not already installed)

```bash
curl -fsSL https://bun.sh/install | bash
export PATH="$HOME/.bun/bin:$PATH"
```

Verify:
```bash
bun --version
```

### 2. Install OpenCode CLI

```bash
bun install -g opencode
```

Or use the provided script:
```bash
chmod +x scripts/install-opencode.sh
./scripts/install-opencode.sh
```

Verify:
```bash
opencode --version
```

### 3. Get API Key

#### Option A: OpenCode (Recommended)
1. Go to https://app.opencode.dev
2. Create free account
3. Generate API key
4. Copy key

#### Option B: Use Existing Provider
- **Anthropic**: https://console.anthropic.com
- **OpenAI**: https://platform.openai.com/api-keys
- **Google**: https://ai.google.dev/

### 4. Configure Environment

Copy the example file:
```bash
cp .env.opencode.example .env.opencode
```

Edit `.env.opencode` and add your API key:
```env
OPENCODE_API_KEY=your_key_here
MODEL=opencode/claude-opus-4-5
VERBOSE=false
```

**Keep `.env.opencode` in `.gitignore`** ✅

---

## Usage

### Method 1: Python CLI (Recommended)

Most user-friendly approach with predefined review types.

#### Setup
```bash
# Install dependencies
pip install python-dotenv

# Make script executable
chmod +x scripts/bonk.py
```

#### Commands

**Security Review**
```bash
# Full repo
python scripts/bonk.py security-review

# Specific file
python scripts/bonk.py security-review src/api/axios.js

# Specific directory
python scripts/bonk.py security-review src/context/
```

**Code Quality Review**
```bash
# Full repo
python scripts/bonk.py code-quality

# Specific file
python scripts/bonk.py code-quality src/components/SafeHTML.jsx
```

**Explain Code**
```bash
# Understand specific component
python scripts/bonk.py explain src/context/AuthProvider.jsx
```

**Test Coverage Review**
```bash
# Check test gaps
python scripts/bonk.py test-coverage src/
```

**Accessibility Review**
```bash
# A11y compliance check
python scripts/bonk.py accessibility src/pages/DoctorDashboard.jsx
```

**Custom Review**
```bash
# Your own prompt
python scripts/bonk.py custom \
  --prompt "Review for XSS vulnerabilities in dynamic content rendering" \
  src/pages/DoctorDashboard.jsx
```

### Method 2: Bash Scripts

Simpler shell-based approach.

```bash
# Security review
chmod +x scripts/review-security.sh
./scripts/review-security.sh src/api/

# Code quality review
chmod +x scripts/review-code-quality.sh
./scripts/review-code-quality.sh src/components/
```

### Method 3: Direct OpenCode CLI

Most flexible, use OpenCode directly.

```bash
opencode review src/api/axios.js --prompt \
  "Review this for security vulnerabilities related to authentication"
```

---

## Testing Different Scenarios

### Scenario 1: Security Audit Before Push

```bash
# Review all authentication code
python scripts/bonk.py security-review src/context/
python scripts/bonk.py security-review src/api/

# Review DOMPurify implementation
python scripts/bonk.py security-review src/components/SafeHTML.jsx
```

### Scenario 2: PR Preview

Test your changes before creating a PR:

```bash
# Get code quality feedback
python scripts/bonk.py code-quality

# Security check
python scripts/bonk.py security-review

# Test coverage gaps
python scripts/bonk.py test-coverage
```

### Scenario 3: New Feature Review

Review a new feature before merging:

```bash
# Review new component
python scripts/bonk.py code-quality src/components/NewComponent.jsx

# Security implications
python scripts/bonk.py security-review src/components/NewComponent.jsx

# Accessibility check
python scripts/bonk.py accessibility src/components/NewComponent.jsx
```

### Scenario 4: Explain Code Flow

Understand existing code:

```bash
# How does auth work?
python scripts/bonk.py explain src/context/

# How is DOMPurify integrated?
python scripts/bonk.py explain src/components/SafeHTML.jsx
```

### Scenario 5: Custom Analysis

Ask specific questions:

```bash
python scripts/bonk.py custom \
  --prompt "Compare localStorage vs HttpOnly cookie approaches. What are the tradeoffs?" \
  src/context/

python scripts/bonk.py custom \
  --prompt "How could an attacker exploit the patient search feature?" \
  src/pages/DoctorDashboard.jsx

python scripts/bonk.py custom \
  --prompt "Add comprehensive error handling to this API call" \
  src/api/axios.js
```

---

## Advanced Usage

### Compare Models

Test same code with different models:

```bash
# Test with Claude
export MODEL=opencode/claude-opus-4-5
python scripts/bonk.py security-review src/api/

# Test with GPT-4
export MODEL=openai/gpt-4-turbo
python scripts/bonk.py security-review src/api/

# Test with Sonnet
export MODEL=anthropic/claude-sonnet-4-20250514
python scripts/bonk.py security-review src/api/
```

### Debug Mode

Enable verbose output:

```bash
export VERBOSE=true
python scripts/bonk.py security-review src/
```

### Generate Report

Save review to file:

```bash
python scripts/bonk.py security-review src/ > security-report.md
```

### Batch Reviews

Review entire codebase systematically:

```bash
#!/bin/bash
# batch-review.sh - Review entire project

echo "🔐 Security Review" >> report.md
python scripts/bonk.py security-review >> report.md

echo -e "\n📊 Code Quality" >> report.md
python scripts/bonk.py code-quality >> report.md

echo -e "\n♿ Accessibility" >> report.md
python scripts/bonk.py accessibility >> report.md

echo "✅ Report saved to report.md"
```

Run:
```bash
chmod +x batch-review.sh
./batch-review.sh
```

---

## Review Types Explained

### Security Review
**When to use**: Before security-sensitive PRs, after adding auth code, dependency updates

**Checks**:
- Authentication/authorization
- XSS prevention
- API security
- Secrets/credentials
- CORS configuration
- Cryptography usage

**Output**: File paths, line numbers, severity levels

### Code Quality Review
**When to use**: Before any PR, after refactoring, catching performance issues

**Checks**:
- React best practices
- Performance issues
- Code duplication
- Error handling
- Type safety
- Testing coverage

**Output**: Suggestions with before/after examples

### Explain Code
**When to use**: Onboarding, understanding complex sections, refactoring prep

**Checks**:
- Purpose and architecture
- Data flow
- Key components
- Dependencies
- Entry points

**Output**: Detailed explanation with examples

### Test Coverage Review
**When to use**: Testing strategy review, before v1.0 release

**Checks**:
- Current coverage
- Critical paths
- Missing tests
- Test quality
- Mock usage

**Output**: Actionable test checklist

### Accessibility Review
**When to use**: UI component reviews, before public release

**Checks**:
- ARIA attributes
- Keyboard navigation
- Color contrast
- Screen reader support
- Focus management
- WCAG compliance

**Output**: Accessibility issues with WCAG criteria

---

## Output Format

### Review Output Example

```
🔐 Security Review: src/api/axios.js
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## Critical Issues

### 1. Missing withCredentials Configuration
**File**: src/api/axios.js:12
**Severity**: CRITICAL
**Description**: HttpOnly cookies won't be sent with requests
**Fix**: Add `withCredentials: true` to axios config
**Status**: ✅ Already implemented

## High Priority

### 2. localStorage Token Storage
**File**: src/context/AuthProvider.jsx (OLD)
**Severity**: HIGH
**Description**: JWT stored in localStorage vulnerable to XSS
**Fix**: Use HttpOnly cookies instead
**Status**: ✅ Fixed in new implementation
```

---

## Troubleshooting

### Error: "OpenCode CLI not found"

```bash
# Install it
bun install -g opencode

# Or verify installation
which opencode
```

### Error: "OPENCODE_API_KEY not found"

```bash
# Check .env.opencode exists
ls -la .env.opencode

# Add it if missing
cp .env.opencode.example .env.opencode
# Edit and add your API key
```

### Error: "Invalid API key"

1. Verify key format (should be long string)
2. Generate new key from provider
3. Check expiration
4. Verify correct provider selected

### Error: "File not found"

Ensure path is relative to repo root:
```bash
# ✅ Correct
python scripts/bonk.py security-review src/api/

# ❌ Wrong
python scripts/bonk.py security-review ../src/api/
```

### Slow Response

- Check internet connection
- API provider may be rate-limited
- Try simpler prompt
- Use faster model

### Verbose Debugging

```bash
export VERBOSE=true
python scripts/bonk.py security-review src/
```

---

## Integration with Development Workflow

### Pre-commit Hook

Create `.git/hooks/pre-commit`:
```bash
#!/bin/bash
echo "🔍 Running security check..."
python scripts/bonk.py security-review src/ || exit 1
```

Make executable:
```bash
chmod +x .git/hooks/pre-commit
```

### Pre-PR Check

Before creating PR:
```bash
# Full checks
python scripts/bonk.py security-review
python scripts/bonk.py code-quality
python scripts/bonk.py accessibility
```

### CI/CD Integration

In GitHub Actions, before using Bonk bot:
```bash
# Local test first
python scripts/bonk.py security-review || exit 1
```

---

## Cost Considerations

### Per-Review Costs

Average costs (varies by provider):
- **OpenCode API**: $0.01-0.03 per review
- **OpenAI GPT-4**: $0.03-0.06 per review
- **Anthropic Claude**: $0.01-0.05 per review

### Cost Optimization

1. **Local testing first** - Save API calls by testing locally
2. **Batch reviews** - Test multiple files together
3. **Specific targets** - Review specific files, not entire repo
4. **Off-peak hours** - Some providers cheaper at off-peak times

---

## Workflow Examples

### Daily Security Check

```bash
# Run every morning
python scripts/bonk.py security-review > /tmp/security-check-$(date +%Y%m%d).md
```

### Pre-Release Audit

```bash
python scripts/bonk.py security-review
python scripts/bonk.py code-quality
python scripts/bonk.py accessibility
python scripts/bonk.py test-coverage

echo "✅ Pre-release audit complete"
```

### Feature Code Review

```bash
# New feature in src/pages/NewFeature.jsx
python scripts/bonk.py security-review src/pages/NewFeature.jsx
python scripts/bonk.py code-quality src/pages/NewFeature.jsx
python scripts/bonk.py accessibility src/pages/NewFeature.jsx
```

---

## Next Steps

1. ✅ Install Bun: `curl -fsSL https://bun.sh/install | bash`
2. ✅ Install OpenCode: `bun install -g opencode`
3. ✅ Get API key: https://app.opencode.dev
4. ✅ Create .env.opencode with API key
5. ✅ Test: `python scripts/bonk.py security-review src/`

---

## Resources

- OpenCode Documentation: https://opencode.dev/docs
- GitHub Bonk: https://github.com/ask-bonk/ask-bonk
- OpenCode GitHub: https://github.com/opencode-dev/opencode
- OWASP Security: https://owasp.org/

---

## Support

For issues or questions:
1. Check troubleshooting section
2. Enable verbose mode
3. Check OpenCode logs
4. File issue on GitHub

