# Local Bonk Testing - Quick Reference

## Installation (5 minutes)

```bash
# 1. Run setup script
chmod +x scripts/setup-local-bonk.sh
./scripts/setup-local-bonk.sh

# 2. Get API key from https://app.opencode.dev

# 3. Add to .env.opencode
nano .env.opencode
# Add: OPENCODE_API_KEY=your_key_here
```

## Commands

### Security Review
```bash
python scripts/bonk.py security-review          # Full repo
python scripts/bonk.py security-review src/api/ # Specific folder
python scripts/bonk.py security-review src/api/axios.js  # Single file
```

### Code Quality
```bash
python scripts/bonk.py code-quality
python scripts/bonk.py code-quality src/components/SafeHTML.jsx
```

### Explain Code
```bash
python scripts/bonk.py explain src/context/AuthProvider.jsx
```

### Test Coverage
```bash
python scripts/bonk.py test-coverage src/
```

### Accessibility
```bash
python scripts/bonk.py accessibility src/pages/DoctorDashboard.jsx
```

### Custom Prompt
```bash
python scripts/bonk.py custom \
  --prompt "Find XSS vulnerabilities" \
  src/pages/
```

## Common Workflows

### Before Creating PR
```bash
python scripts/bonk.py security-review
python scripts/bonk.py code-quality
python scripts/bonk.py accessibility
```

### Review Authentication Changes
```bash
python scripts/bonk.py security-review src/context/
python scripts/bonk.py security-review src/api/
python scripts/bonk.py explain src/context/AuthProvider.jsx
```

### Audit Specific Feature
```bash
# Feature in src/pages/NewFeature.jsx
python scripts/bonk.py security-review src/pages/NewFeature.jsx
python scripts/bonk.py code-quality src/pages/NewFeature.jsx
python scripts/bonk.py accessibility src/pages/NewFeature.jsx
```

## Advanced

### Save to File
```bash
python scripts/bonk.py security-review > security-report.md
```

### Compare Models
```bash
# Test with different models
export MODEL=opencode/claude-opus-4-5
python scripts/bonk.py security-review

export MODEL=openai/gpt-4-turbo
python scripts/bonk.py security-review
```

### Verbose Debug
```bash
export VERBOSE=true
python scripts/bonk.py security-review src/
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "OpenCode CLI not found" | `bun install -g opencode` |
| "OPENCODE_API_KEY not found" | Edit `.env.opencode` and add key |
| "Invalid API key" | Get new key from https://app.opencode.dev |
| "File not found" | Use path relative to repo root |
| Slow response | Check internet, try simpler prompt |

## Review Types

| Type | Use Case | Command |
|------|----------|---------|
| Security | Auth, XSS, secrets | `security-review` |
| Quality | Bugs, perf, style | `code-quality` |
| Explain | Understand code | `explain` |
| Testing | Test gaps | `test-coverage` |
| Accessibility | A11y issues | `accessibility` |
| Custom | Specific question | `custom --prompt "..."` |

## Cost Tips

- ✅ Test locally before GitHub
- ✅ Review specific files, not entire repo
- ✅ Batch multiple reviews
- ✅ Use cheaper models (Claude vs GPT-4)

## Documentation

- Full guide: `LOCAL_BONK_TESTING.md`
- GitHub Bonk: `.github/workflows/bonk.yml`
- Setup guide: `.github/workflows/bonk-security-review.yml`
- PR auto-review: `.github/workflows/bonk-pr-review.yml`

---

**Get started in 5 minutes!**
```bash
./scripts/setup-local-bonk.sh
```
