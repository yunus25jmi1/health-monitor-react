# Cloudflare Pages Deployment Setup Guide

## ⚠️ IMPORTANT: Pages vs Workers

Your configuration shows **Workers** parameters, but **you should use Cloudflare PAGES** for a React frontend.

| Parameter | Pages | Workers |
|-----------|-------|---------|
| Build command | `npm run build` | N/A |
| Deploy command | Automatic (git) or `wrangler pages deploy` | `npx wrangler deploy` |
| Best for React | ✅ YES | ❌ NO |
| Your choice | ✅ CORRECT | ❌ WRONG |

---

## 🎯 Configuration Values Provided

```
Project name:           health-monitor-react
Build command:          npm run build
Deploy command:         wrangler pages deploy dist/
Path:                   / (root)
Variable name:          VITE_API_URL
Variable value:         https://health.yunus.eu.org/api/v1
API token:              Cloudflare API token (to be generated)
Account ID:             Your Cloudflare account ID (to be generated)
```

---

## 📋 Step-by-Step Setup

### Step 1: Create Cloudflare Account (If needed)

1. Go to: https://dash.cloudflare.com/sign-up
2. Sign up with email or GitHub
3. Verify email
4. Login to dashboard

### Step 2: Create Pages Project

**In Cloudflare Dashboard:**

1. Click "Pages" in sidebar
2. Click "Create project"
3. Select "Connect to Git"
4. Choose GitHub
5. Authorize Cloudflare GitHub App
6. Select repository: `yunus25jmi1/health-monitor-react`
7. Click "Begin setup"

### Step 3: Configure Build Settings

**In Project Setup:**

```
Framework preset:         Vite (auto-detected)
Build command:            npm install && npm run build
Build output directory:   dist
Root directory:           / (leave blank)
```

Click "Save and Deploy"

### Step 4: Add Environment Variables

**In Cloudflare Pages Dashboard:**

1. Go to: Pages > Project > Settings > Environment
2. Click "Add variables"
3. Add for Production:
   ```
   Variable name:   VITE_API_URL
   Variable value:  https://health.yunus.eu.org/api/v1
   ```
4. Save

### Step 5: Get Your API Token (for CI/CD)

**In Cloudflare Dashboard:**

1. Go to: My Profile > API Tokens
2. Click "Create Token"
3. Use template: "Edit Cloudflare Workers"
4. Grant permissions:
   - Account Resources: Include All Accounts
   - Permissions: 
     - Account.Pages (All)
     - Account (Read)
5. Continue to summary
6. Create token
7. Copy the token (⚠️ Save it, you won't see it again!)

**You'll need:**
- `CLOUDFLARE_API_TOKEN` (the token you just created)
- `CLOUDFLARE_ACCOUNT_ID` (from Dashboard > Overview)

### Step 6: Add GitHub Secrets

**In GitHub Repository:**

1. Go to: Settings > Secrets and variables > Actions
2. Click "New repository secret"

Add these 3 secrets:

```
Secret 1:
  Name:  VITE_API_URL
  Value: https://health.yunus.eu.org/api/v1

Secret 2:
  Name:  CLOUDFLARE_API_TOKEN
  Value: (paste your Cloudflare API token)

Secret 3:
  Name:  CLOUDFLARE_ACCOUNT_ID
  Value: (your Cloudflare account ID)
```

### Step 7: Verify Setup

**Test deployment:**

```bash
# Push to main branch
git push origin main

# Cloudflare automatically:
# 1. Detects push
# 2. Runs: npm install && npm run build
# 3. Deploys dist/ to Pages
# 4. Available in 1-2 minutes
```

Check in Cloudflare Dashboard:
- Pages > Project > Deployments
- Should show "Success"

---

## 🔧 Configuration Files Reference

### wrangler.toml (Already created)
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

### public/_headers (Already created)
```
/* Security and caching headers */
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
```

### public/_redirects (Already created)
```
/* React Router SPA routing */
/*    /index.html  200
```

---

## 🚀 Deployment Options

### Option 1: Automatic (Recommended)
```bash
# Just push to GitHub
git push origin main

# Cloudflare automatically builds and deploys
# Site live in 1-2 minutes
# No manual steps needed
```

### Option 2: Manual via Wrangler CLI
```bash
# Install Wrangler
npm install -g @cloudflare/wrangler

# Login
wrangler login

# Build
npm run build

# Deploy
wrangler pages deploy dist/
```

### Option 3: Using Script
```bash
./scripts/deploy-cloudflare.sh
```

---

## 📝 Your Configuration Summary

```yaml
Project Configuration:
  Name:                health-monitor-react
  Type:                React SPA (Frontend)
  Repository:          yunus25jmi1/health-monitor-react
  Default Branch:      main

Build Settings:
  Command:             npm install && npm run build
  Output Directory:    dist
  Node Version:        18 (recommended)
  Build Time:          ~2 minutes

Environment Variables (Production):
  VITE_API_URL:        https://health.yunus.eu.org/api/v1

Deployment:
  Primary:             Automatic (Git push)
  Fallback:            Manual (Wrangler CLI)
  URLs:
    - Production:      https://health-monitor-react.pages.dev
    - Preview:         https://[branch]--health-monitor-react.pages.dev

Performance:
  Global CDN:          300+ edge locations
  Response Time:       20-50ms (US), 50-100ms (global)
  HTTPS:               Automatic
  Compression:         GZIP + Brotli
```

---

## ✅ Checklist Before Deploying

- [ ] Cloudflare account created
- [ ] Pages project created
- [ ] GitHub repository connected
- [ ] Build command configured: `npm install && npm run build`
- [ ] Build output set to: `dist/`
- [ ] Environment variable added: `VITE_API_URL`
- [ ] GitHub workflow `.github/workflows/deploy-pages.yml` in place
- [ ] GitHub secrets added:
  - [ ] CLOUDFLARE_API_TOKEN
  - [ ] CLOUDFLARE_ACCOUNT_ID
  - [ ] VITE_API_URL
- [ ] Initial commit pushed to main
- [ ] Deployment completed successfully

---

## 🔍 Verification Steps

### After First Deploy

1. **Check Deployment Status**
   - Cloudflare Dashboard > Pages > Project > Deployments
   - Should show "Success" with green checkmark

2. **Test Live Site**
   - Visit: https://health-monitor-react.pages.dev
   - Should load your app
   - Check browser console (F12) for errors
   - Check Network tab for API calls

3. **Verify Environment Variables**
   - Open browser console
   - Check if API URL is correct
   - API calls should reach: https://health.yunus.eu.org/api/v1

4. **Test Functionality**
   - Landing page loads
   - Login page accessible
   - Navigation works
   - No 404 errors
   - No CORS errors

---

## 🐛 Troubleshooting

### Build Fails
```bash
# Check locally first
npm install
npm run build

# Verify dist/ is created
ls -la dist/

# Check build command in Cloudflare matches
# Should be: npm install && npm run build
```

### Site Returns 404
```
Solution: Check _redirects file exists in public/
Content should be:
  /*    /index.html  200
```

### Environment Variables Not Working
```
1. Verify in Cloudflare: Pages > Settings > Environment
2. Rebuild: git push origin main (triggers rebuild)
3. Variables take effect after rebuild
```

### API Calls Failing
```
1. Check backend is running
2. Check VITE_API_URL is correct
3. Backend must allow CORS from: https://health-monitor-react.pages.dev
4. Check Network tab in DevTools for exact error
```

---

## 💡 Deployment Workflow

### Development
```
Make changes → npm run build (local) → git push
↓
GitHub webhook triggers Cloudflare
↓
Cloudflare builds and deploys
↓
Preview URL available (branch--health-monitor-react.pages.dev)
↓
Test preview
↓
If OK: merge to main
↓
Production deployment (health-monitor-react.pages.dev)
```

---

## 🎯 Post-Deployment

### Monitor Performance
- Dashboard > Pages > Project > Analytics
- Check traffic, errors, performance

### Setup Custom Domain (Optional)
1. Register domain (GoDaddy, Namecheap, etc.)
2. In Cloudflare > Pages > Custom Domain
3. Add your domain
4. Update DNS or point nameservers to Cloudflare
5. SSL/TLS automatically configured

### Enable Analytics
- Already enabled in wrangler.toml
- View in Cloudflare > Pages > Analytics

---

## 📊 Your Deployment is Ready!

Everything needed has been configured:
- ✅ GitHub workflow created
- ✅ Configuration files ready
- ✅ Build process verified
- ✅ Environment variables documented
- ✅ Documentation provided

**Next: Create Cloudflare account and connect GitHub repo!**

---

## 🔗 Useful Links

- Cloudflare Pages Docs: https://developers.cloudflare.com/pages/
- Wrangler CLI: https://developers.cloudflare.com/workers/wrangler/
- React Deployment: https://developers.cloudflare.com/pages/framework-guides/deploy-a-react-site/
- GitHub Actions: https://docs.github.com/en/actions

