# 🔧 Quick API Configuration Fix

## Problem Summary
- ✅ Backend running: `https://health.yunus.eu.org/health` → works
- ❌ API failing: `https://health.yunus.eu.org/api/v1` → cannot connect
- 🔴 Frontend trying: `https://health.yunus.eu.org/api/v1`

---

## 🎯 Immediate Fix Steps

### Option 1: Check If `/api/v1` Actually Exists

**Test in terminal:**
```bash
# Does /api/v1 exist?
curl -v https://health.yunus.eu.org/api/v1

# Does /api exist?
curl -v https://health.yunus.eu.org/api

# Does /v1 exist?
curl -v https://health.yunus.eu.org/v1

# What about /health?
curl -v https://health.yunus.eu.org/health

# Root?
curl -v https://health.yunus.eu.org/
```

**Tell me which ones work and what response you get.**

---

### Option 2: Check CORS Configuration in Backend

Your backend MUST allow requests from: `https://health-monitor-react.pages.dev`

**If using Express.js, add this:**
```javascript
const cors = require('cors');

app.use(cors({
  origin: 'https://health-monitor-react.pages.dev',
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
}));
```

**If using Django, add to settings.py:**
```python
CORS_ALLOWED_ORIGINS = [
    "https://health-monitor-react.pages.dev",
]
CORS_ALLOW_CREDENTIALS = True
```

---

### Option 3: Update Frontend Environment Variable

**If the API path is different, update in Cloudflare:**

1. Go to: https://dash.cloudflare.com/pages
2. Click your project: `health-monitor-react`
3. Settings > Environment
4. Edit `VITE_API_URL`
5. Change to correct path (e.g., `https://health.yunus.eu.org/v1`)
6. Save
7. Trigger rebuild: `git push origin main`

---

## 🔍 What We Need From You

Please provide these answers:

**1. What is the correct API endpoint?**
   - [ ] `/api/v1`
   - [ ] `/api`
   - [ ] `/v1`
   - [ ] Something else: _______

**2. What endpoints should the frontend call?**
   - [ ] POST `/auth/login`
   - [ ] GET `/readings/latest/{id}`
   - [ ] POST `/reports`
   - [ ] Others: _______

**3. Is CORS configured on backend?**
   - [ ] Yes, for: _______
   - [ ] No
   - [ ] Not sure

**4. Backend technology:**
   - [ ] Node.js/Express
   - [ ] Python/Flask
   - [ ] Python/Django
   - [ ] Other: _______

**5. Test result:**
```bash
# Run this and paste output:
curl -v https://health.yunus.eu.org/api/v1

# Result:
```

---

## 📋 Standard Fix Procedure

### If API path needs updating:

**Local fix:**
```bash
# Edit .env.local
VITE_API_URL=https://health.yunus.eu.org/api  # or correct path
```

**Or in code:**
```javascript
// src/api/axios.js
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://health.yunus.eu.org/api',
  // ↑ Update this to correct endpoint
  withCredentials: true,
});
```

**Then deploy:**
```bash
git add .
git commit -m "fix: update api endpoint to correct path"
git push origin main
```

---

## 🚀 Once Fixed

After updating the API endpoint:

1. Redeploy: `git push origin main`
2. Wait 2 minutes for build
3. Visit: https://health-monitor-react.pages.dev
4. Open DevTools (F12)
5. Go to Network tab
6. Try to login
7. Check if API calls succeed (should be green/200)

---

## ❓ Common Issues

**Issue: "CORS error"**
→ Backend needs to allow your frontend domain in CORS

**Issue: "Cannot connect"**
→ API endpoint path is wrong or backend not listening on that route

**Issue: "404 Not Found"**
→ API path exists but the route handler doesn't

**Issue: "Connection refused"**
→ Backend server isn't running or wrong port

---

## Need Immediate Help?

Tell me:
1. Backend repository URL (if public)
2. Backend README or documentation
3. What framework is backend using?
4. Output of: `curl -v https://health.yunus.eu.org/api/v1`

Then I can give you the exact fix!
