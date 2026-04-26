# API Endpoint Discovery Guide

## Current Status

Backend Health Check:
```
✅ https://health.yunus.eu.org/health → {"status":"ok"}
```

Backend API Endpoints:
```
❌ /api/v1     → 404
❌ /api        → 404  
❌ /v1         → 404
❌ /           → 404
```

**Result: Backend is running, but API routes not found at expected paths**

---

## 🔍 What Frontend Needs

Your frontend is trying to call these endpoints:

### Authentication
```
POST /auth/login
POST /auth/logout
GET /auth/me
```

### Readings
```
GET /readings/latest/{patientId}
GET /readings/{patientId}
POST /readings
```

### Reports
```
GET /reports/pending
POST /reports/{id}/approve
PATCH /reports/{id}
GET /reports/{id}/pdf
GET /reports/patient/{patientId}
```

---

## 🎯 What We Need to Find

Your backend must define these routes SOMEWHERE. We need to find where.

### Check These Locations:

**In backend repository:**
1. Root folder `README.md` or `.md` files
2. Look for "API endpoints" or "Routes" section
3. Check Express/Flask app files for route definitions
4. Look for Swagger/OpenAPI documentation

**Common locations by framework:**

**Node.js/Express:**
- `server.js`
- `app.js`
- `routes/` folder
- `controllers/` folder

**Python/Django:**
- `urls.py`
- `views.py`
- API documentation

**Python/Flask:**
- `app.py` or `main.py`
- `routes/` folder

---

## 📊 Example Backend Structures

### If using Express.js:
```javascript
// Probably looks like:
app.post('/auth/login', ...)
app.get('/readings/latest/:id', ...)
app.get('/reports/pending', ...)

// OR with prefix:
app.use('/api/v1', require('./routes/api'));
app.use('/health', require('./routes/health'));
```

### If using Django/Flask:
```python
# Probably looks like:
@app.route('/auth/login', methods=['POST'])
@app.route('/readings/latest/<id>', methods=['GET'])
@app.route('/reports/pending', methods=['GET'])

# OR with blueprint:
api_bp = Blueprint('api', __name__, url_prefix='/api/v1')
```

---

## ✅ What To Do Now

### Step 1: Find Your Backend Code
- Do you have access to backend repository?
- Is it public on GitHub?
- Where is backend running?

### Step 2: Look for Route Definitions
- Search for files with route definitions
- Look for your endpoint paths
- Find what prefix they use (if any)

### Step 3: Tell Me
- The correct base URL: `https://health.yunus.eu.org/[what]`
- Example: `/health/api` or `/api/health` or something else?

### Step 4: Update Frontend
Once we know the path:
1. Update `VITE_API_URL` in Cloudflare
2. Redeploy
3. Test

---

## 🆘 Backend Information Needed

Please provide (any/all of these):

```
1. Backend repository URL (public GitHub?)
   → 

2. Backend framework
   ☐ Node.js/Express
   ☐ Python/Flask
   ☐ Python/Django
   ☐ Java/Spring
   ☐ Other: ___________

3. Backend documentation
   → Can you share README or API docs?

4. Backend route examples
   → What are your actual endpoint paths?

5. Backend running at
   → https://health.yunus.eu.org/ ?
   → Or different server?
   → Different port?
```

---

## 🚀 Once You Provide Backend Info

I'll help you:
1. ✅ Identify correct API paths
2. ✅ Update frontend configuration
3. ✅ Fix CORS if needed
4. ✅ Redeploy and test
5. ✅ Verify everything works

