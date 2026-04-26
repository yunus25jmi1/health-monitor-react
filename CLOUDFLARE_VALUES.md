# 🎯 CLOUDFLARE PAGES SETUP - EXACT VALUES TO USE

## 📋 Quick Reference: Copy-Paste Values

---

## 1. Cloudflare Pages Project Setup

### Project Name
```
health-monitor-react
```

### Build Settings
```
Framework preset:        Vite
Build command:           npm install && npm run build
Build output directory:  dist
Root directory:          (leave empty or /)
```

---

## 2. Environment Variables

### In Cloudflare Pages Dashboard

**Production Environment:**
```
Variable Name:  VITE_API_URL
Variable Value: https://health.yunus.eu.org/api/v1
```

**Preview Environment (Optional):**
```
Variable Name:  VITE_API_URL
Variable Value: http://localhost:8080/api/v1
```

---

## 3. GitHub Secrets

### In GitHub Repository Settings
Go to: Settings > Secrets and variables > Actions

**Add these 3 secrets:**

### Secret 1: API Token
```
Name:  CLOUDFLARE_API_TOKEN
Value: [Copy from Cloudflare API Tokens page]
       └─ Profile > API Tokens > Create Token
       └─ Use template: "Edit Cloudflare Workers"
       └─ ⚠️ Can only view once! Save it safely!
```

### Secret 2: Account ID
```
Name:  CLOUDFLARE_ACCOUNT_ID
Value: [Copy from Cloudflare Dashboard]
       └─ Dashboard > Overview > Account ID
```

### Secret 3: API URL
```
Name:  VITE_API_URL
Value: https://health.yunus.eu.org/api/v1
```

---

## 4. How to Get Cloudflare Credentials

### Get CLOUDFLARE_ACCOUNT_ID

1. Open: https://dash.cloudflare.com
2. Click "Overview" in sidebar
3. Look for "Account ID" in the right panel
4. Click "Copy" icon
5. Paste into GitHub secret

### Get CLOUDFLARE_API_TOKEN

1. Open: https://dash.cloudflare.com
2. Click your profile icon (bottom left)
3. Go to "My Profile"
4. Click "API Tokens" tab
5. Click "Create Token" button
6. Select template: "Edit Cloudflare Workers"
7. Leave settings as default
8. Click "Continue to summary"
9. Click "Create Token"
10. ⚠️ **COPY THE TOKEN IMMEDIATELY** (won't show again!)
11. Paste into GitHub secret: CLOUDFLARE_API_TOKEN

---

## 5. Cloudflare Pages Configuration (wrangler.toml)

**Already created! Shows:**
```toml
name = "health-monitor-react"
type = "javascript"

[build]
command = "npm install && npm run build"
cwd = "./"

[build.upload]
dir = "dist"

[env.production.vars]
VITE_API_URL = "https://health.yunus.eu.org/api/v1"
```

---

## 6. GitHub Actions Workflow

**Already created at:** `.github/workflows/deploy-pages.yml`

**Triggers:**
- Automatic deployment on `git push origin main`
- Preview deployment on pull requests

---

## 7. Deployment Commands

### Option A: Automatic (Recommended)
```bash
git push origin main
# Cloudflare automatically builds and deploys
```

### Option B: Manual via Wrangler
```bash
npm install -g @cloudflare/wrangler
wrangler login
npm run build
wrangler pages deploy dist/
```

### Option C: Using Helper Script
```bash
./scripts/setup-cloudflare.sh
./scripts/deploy-cloudflare.sh
```

---

## 8. Verification Checklist

### Before Deployment
```
☐ Cloudflare account created
☐ Pages project created: health-monitor-react
☐ GitHub repo connected
☐ Build command set: npm install && npm run build
☐ Build output set: dist
☐ Environment variable VITE_API_URL added
☐ CLOUDFLARE_ACCOUNT_ID saved from Cloudflare
☐ CLOUDFLARE_API_TOKEN saved from Cloudflare (⚠️ One-time view!)
☐ All 3 GitHub secrets added
☐ Workflow file: .github/workflows/deploy-pages.yml exists
```

### After Deployment
```
☐ Deployment shows "Success" in Cloudflare
☐ Site loads at: https://health-monitor-react.pages.dev
☐ No console errors (F12 > Console)
☐ API calls working (F12 > Network)
☐ Login page accessible
☐ Navigation works
```

---

## 9. URLs You'll Get

### Production
```
https://health-monitor-react.pages.dev
```

### Preview (per branch)
```
https://main--health-monitor-react.pages.dev
https://dev--health-monitor-react.pages.dev
https://feature-name--health-monitor-react.pages.dev
```

### Custom Domain (Optional)
```
https://health.yourdomain.com
(Set up in Pages > Custom Domain)
```

---

## 10. Environment Variable Reference

### What They Do

| Variable | Value | Used For |
|----------|-------|----------|
| VITE_API_URL | https://health.yunus.eu.org/api/v1 | API endpoint location |

### Where They're Used

In your code (`src/api/axios.js`):
```javascript
baseURL: import.meta.env.VITE_API_URL || 'https://health.yunus.eu.org/api/v1'
```

---

## 11. Troubleshooting Configuration

### Build Fails
```
✓ Verify locally: npm run build
✓ Check build output: ls -la dist/
✓ Ensure dist/ has index.html
```

### Environment Variables Not Working
```
✓ Rebuild after adding variables (git push)
✓ Check variable name exactly matches: VITE_API_URL
✓ Check value has no extra spaces: https://health.yunus.eu.org/api/v1
```

### Deployment Not Triggering
```
✓ Verify GitHub workflow exists: .github/workflows/deploy-pages.yml
✓ Check GitHub secrets are added
✓ Verify you pushed to main branch
✓ Check GitHub Actions log for errors
```

---

## 12. Step-by-Step Setup (Copy-Paste Ready)

### Step 1: Get Cloudflare Credentials
```
1. Go to: https://dash.cloudflare.com
2. Copy Account ID (Overview > Account ID)
3. Create API Token (Profile > API Tokens > Create > Edit Cloudflare Workers)
4. Save both values safely
```

### Step 2: Add GitHub Secrets
```bash
# Open GitHub: Settings > Secrets and variables > Actions

# Add Secret 1
Name:  CLOUDFLARE_API_TOKEN
Value: [paste your API token]

# Add Secret 2
Name:  CLOUDFLARE_ACCOUNT_ID
Value: [paste your account ID]

# Add Secret 3
Name:  VITE_API_URL
Value: https://health.yunus.eu.org/api/v1
```

### Step 3: Connect GitHub to Cloudflare Pages
```
1. Go to: https://dash.cloudflare.com/pages
2. Create project > Connect to Git
3. Authorize & select: yunus25jmi1/health-monitor-react
4. Build settings:
   - Command: npm install && npm run build
   - Output: dist
5. Add environment variable:
   - Name: VITE_API_URL
   - Value: https://health.yunus.eu.org/api/v1
6. Click "Save and Deploy"
```

### Step 4: Deploy
```bash
git push origin main

# Cloudflare automatically:
# 1. Clones repo
# 2. Runs: npm install && npm run build
# 3. Deploys dist/
# 4. Available in 1-2 minutes
```

### Step 5: Verify
```
1. Check: https://health-monitor-react.pages.dev
2. Open DevTools (F12)
3. Check Console tab for errors
4. Check Network tab for API calls
5. Test login and navigation
```

---

## 13. Your Exact Configuration Summary

```yaml
Project:
  name: health-monitor-react
  type: React SPA (Vite)
  repository: yunus25jmi1/health-monitor-react
  
Build:
  command: npm install && npm run build
  output: dist/
  framework: Vite
  
Environment:
  VITE_API_URL: https://health.yunus.eu.org/api/v1
  
Deployment:
  type: Cloudflare Pages
  trigger: Git push to main
  method: Automatic (GitHub Actions)
  
URLs:
  production: https://health-monitor-react.pages.dev
  preview: https://[branch]--health-monitor-react.pages.dev
```

---

## ✅ Ready to Deploy!

Everything is configured and ready. Just follow the 12 steps above!

**Time to deploy: ~5 minutes** ⏱️

---

## 📞 Need Help?

- **Cloudflare Pages Docs**: https://developers.cloudflare.com/pages/
- **Cloudflare API Tokens**: https://dash.cloudflare.com/profile/api-tokens
- **GitHub Secrets**: https://docs.github.com/en/actions/security-guides/encrypted-secrets
- **Our Guide**: CLOUDFLARE_SETUP_GUIDE.md

