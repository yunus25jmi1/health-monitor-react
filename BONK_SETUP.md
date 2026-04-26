# Bonk Code Review Setup Guide

Bonk is an AI-powered code review agent that integrates with GitHub to provide automated code reviews, security audits, and documentation assistance.

## Installation Steps

### Step 1: Install the GitHub App
1. Go to https://github.com/apps/ask-bonk
2. Click "Install" 
3. Select your account (`yunus25jmi1`)
4. Choose "Only select repositories"
5. Select `health-monitor-react`
6. Click "Install"

### Step 2: Add API Key to Repository Secrets

#### Get Your OpenCode API Key
1. Visit https://app.opencode.dev
2. Create a free account
3. Generate an API key
4. Copy the key

#### Add to GitHub Secrets
1. Go to your repository settings: `Settings > Secrets and variables > Actions`
2. Click "New repository secret"
3. Name: `OPENCODE_API_KEY`
4. Value: Paste your API key
5. Click "Add secret"

### Step 3: Verify Workflows
The workflow files are already created in `.github/workflows/`:
- ✅ `bonk.yml` - Manual review trigger
- ✅ `bonk-security-review.yml` - Scheduled security audits (Mondays 9AM UTC)
- ✅ `bonk-pr-review.yml` - Automatic PR reviews

## How to Use Bonk

### Option 1: Manual Code Review on PR/Issue
Mention Bonk in any PR comment or issue:

```
/bonk review this for security issues
```

or

```
@ask-bonk explain how the authentication flow works
```

### Option 2: Review-Only on PR Comments
Comment on a specific line in a PR:

```
/bonk why are we using dangerouslySetInnerHTML here?
```

### Option 3: Automatic PR Review
Every PR automatically gets reviewed by Bonk (read-only comments only).

### Option 4: Scheduled Security Audits
Runs every Monday at 9 AM UTC. Creates issues if vulnerabilities found.

## Example Prompts

### Security Review
```
/bonk review src/api/axios.js for security vulnerabilities
```

### Explain Code
```
@ask-bonk explain the AuthProvider implementation and how it differs from the old localStorage approach
```

### Generate Documentation
```
/bonk add comprehensive JSDoc comments to all exported functions in src/api/axios.js
```

### Performance Review
```
/bonk review DoctorDashboard.jsx for performance issues and unnecessary re-renders
```

### Accessibility Audit
```
/bonk audit this component for accessibility issues (ARIA, keyboard nav, etc.)
```

### Cross-file Analysis
```
/bonk how is authentication propagated through the entire application? Check all auth-related files
```

## Workflow Descriptions

### 1. bonk.yml (Manual Trigger)
**When it runs**: When you mention `/bonk` or `@ask-bonk`  
**What it does**: Responds to your query or request  
**Permissions**: Full read/write  
**Use for**: 
- Code reviews
- Questions about the codebase
- Bug analysis
- Documentation
- General assistance

**Example triggers**:
```
/bonk review this PR
@ask-bonk fix this bug
/bonk add tests for authentication
```

### 2. bonk-security-review.yml (Scheduled)
**When it runs**: Every Monday at 9 AM UTC (or manually via workflow_dispatch)  
**What it does**: Comprehensive security audit  
**Permissions**: Full read/write  
**Use for**:
- Automated security scanning
- Dependency vulnerability checking
- Authentication/authorization review
- XSS prevention verification
- Environment variable auditing

**Triggers**:
- Automatic: Every Monday 9 AM UTC
- Manual: Go to Actions > Scheduled Security Review > Run workflow

### 3. bonk-pr-review.yml (Automatic)
**When it runs**: Every PR opened or updated  
**What it does**: Automated code review with suggestions  
**Permissions**: Read-only (can comment but not push)  
**Use for**:
- Security review
- Code quality checks
- React best practices
- Accessibility audit
- Testing suggestions

**Features**:
- Non-intrusive (doesn't push code)
- Leaves detailed comments
- Suggests improvements
- Checks for vulnerabilities

## Configuration

### Use Different AI Model
Edit `.github/workflows/bonk.yml`:

```yaml
with:
  model: "anthropic/claude-sonnet-4-20250514"  # Change model
```

Supported models:
- `opencode/claude-opus-4-5` (default, most powerful)
- `anthropic/claude-sonnet-4-20250514`
- `openai/gpt-4-turbo`
- `google/gemini-2.0-flash`

### Change Security Review Schedule
Edit `.github/workflows/bonk-security-review.yml` cron expression:

```yaml
schedule:
  - cron: "0 9 * * 1"  # Current: Monday 9 AM UTC
  # Examples:
  # "0 9 * * *"     # Every day at 9 AM UTC
  # "0 0 * * 0"     # Every Sunday at midnight UTC
  # "30 2 * * 1-5"  # Weekdays at 2:30 AM UTC
```

## Troubleshooting

### Workflow Not Triggering
1. Check that the GitHub App is installed: Settings > Integrations > GitHub Apps
2. Verify API key is added to secrets: Settings > Secrets and variables > Actions
3. Check workflow syntax: Go to Actions tab for errors

### "Repository not found" Error
- GitHub App not properly installed on the repository
- Reinstall: Uninstall and reinstall the ask-bonk app

### "Invalid API key" Error
- API key expired or incorrect
- Generate new key at https://app.opencode.dev
- Update the secret

### Workflow runs but no response
1. Check Actions tab for workflow logs
2. Verify model name is correct
3. Check OPENCODE_API_KEY secret is set

## Monitoring

### View Workflow Runs
1. Go to repository
2. Click "Actions" tab
3. Select workflow name to see history

### Global Bonk Stats
Visit https://ask-bonk.silverlock.workers.dev/stats to see Bonk usage across all repos.

## Cost Considerations

- **OpenCode API**: Typically $0.01-0.03 per request depending on model
- **GitHub App**: Free
- **Workflows**: Included in GitHub Actions free tier (2,000 minutes/month)

## Best Practices

### 1. Be Specific in Prompts
❌ Bad: `/bonk review this`  
✅ Good: `/bonk review DoctorDashboard.jsx for XSS vulnerabilities and performance issues`

### 2. Use for Complex Reviews
❌ Use Bonk for: "Is this variable named well?" (too simple)  
✅ Use Bonk for: "Explain the authentication flow and check for security issues"

### 3. Follow Up on Suggestions
- Bonk suggests, but you decide
- Always review AI suggestions before merging
- Don't blindly accept all recommendations

### 4. Context Matters
- Bonk works better with full file context
- Link to related files in your prompt
- Provide background on the feature

### 5. Security-First Approach
- Run `/bonk security review` on all auth-related code
- Schedule weekly security audits (already configured)
- Ask about specific attack vectors

## Advanced Usage

### Review Specific Files
```
/bonk security review src/context/AuthProvider.jsx and src/api/axios.js
```

### Multi-step Tasks
```
/bonk:

1. Add comprehensive JSDoc comments to SafeHTML.jsx
2. Add error handling for edge cases
3. Add usage examples in comments
4. Check for any potential security issues
```

### Cross-repo Analysis (with Bonk Pro)
```
/bonk compare how authentication is handled in the frontend 
vs the backend repo at yunus25jmi1/health-backend
```

## Next Steps

1. ✅ Workflows created
2. 📌 Install GitHub App at https://github.com/apps/ask-bonk
3. 🔑 Add OPENCODE_API_KEY to repository secrets
4. 🧪 Test with a comment on a PR: `/bonk help`
5. 📅 Security reviews will auto-run every Monday

## Support

- Bonk Documentation: https://github.com/ask-bonk/ask-bonk
- OpenCode Docs: https://opencode.dev/docs
- Issues: Create issue mentioning what went wrong

---

**Last Updated**: 2026-04-26  
**Bonk Version**: Latest (auto-updates)  
**Health Monitor React**: v1.0.0
