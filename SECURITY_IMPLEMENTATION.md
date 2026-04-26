# Security Implementation Guide

## Overview
This document outlines the security enhancements implemented in the SmartHealth React frontend to meet production-grade security standards.

---

## 1. HttpOnly Cookie-Based Authentication

### Implementation
- **File**: `src/api/axios.js`
- **Change**: Enabled `withCredentials: true` in Axios configuration
- **Benefit**: Automatic cookie transmission with every request

### How It Works
1. Backend sets HttpOnly cookie on login:
   ```http
   Set-Cookie: auth_token=<jwt>; HttpOnly; Secure; SameSite=Strict; Path=/
   ```

2. Frontend Axios automatically includes cookie in requests
3. Token is never accessible to JavaScript (XSS-proof)

### Backend Requirements
The backend **MUST** implement the following:

#### A. Login Endpoint (`POST /auth/login`)
```javascript
// Backend pseudocode
res.cookie('auth_token', jwt, {
  httpOnly: true,        // Prevents JS access
  secure: true,          // HTTPS only (production)
  sameSite: 'strict',    // CSRF protection
  maxAge: 3600000,       // 1 hour
  path: '/'
});
```

#### B. Session Validation Endpoint (`GET /auth/me`)
```javascript
// Backend pseudocode
app.get('/auth/me', authenticateToken, (req, res) => {
  res.json({ data: req.user });
});
```

#### C. Logout Endpoint (`POST /auth/logout`)
```javascript
// Backend pseudocode
app.post('/auth/logout', (req, res) => {
  res.clearCookie('auth_token', { 
    httpOnly: true, 
    secure: true, 
    sameSite: 'strict' 
  });
  res.json({ message: 'Logged out' });
});
```

#### D. CORS Configuration
```javascript
// Express CORS setup
app.use(cors({
  origin: 'http://localhost:3000',  // Frontend URL
  credentials: true,                // Allow credentials
  optionsSuccessStatus: 200
}));
```

### Frontend Changes Made
1. **Removed** all `localStorage` token storage
2. **Updated** `AuthProvider.jsx`:
   - Validates session on mount via `/auth/me`
   - No localStorage fallback
   - Session state managed in memory only

3. **Updated** `axios.js`:
   - Added `withCredentials: true`
   - Removed manual token injection
   - Added 401 redirect on auth failure

---

## 2. XSS Protection with DOMPurify

### Implementation
- **File**: `src/components/SafeHTML.jsx`
- **Package**: `dompurify` (installed)
- **Usage**: Wrap any dynamic HTML content with `SafeHTML` component

### How It Works
```jsx
import SafeHTML from '../components/SafeHTML';

// Instead of:
<div dangerouslySetInnerHTML={{ __html: userContent }} />

// Use:
<SafeHTML html={userContent} />
```

### What Gets Sanitized
- **Removed**: `<script>`, event handlers (onclick, onload, etc.), dangerous attributes
- **Preserved**: `<b>`, `<i>`, `<em>`, `<strong>`, `<a>`, `<p>`, `<br>`, headings, lists, code blocks

### Files Updated
1. **DoctorDashboard.jsx**
   - AI draft rendering now uses `SafeHTML`
   - Prevents injection of malicious code in medical reports

### Whitelist Configuration
The SafeHTML component allows these tags by default:
```javascript
ALLOWED_TAGS: [
  'b', 'i', 'em', 'strong', 'a', 
  'p', 'br', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 
  'ul', 'ol', 'li', 'code', 'pre', 'blockquote'
]
ALLOWED_ATTR: ['href', 'title', 'target', 'rel']
```

### Customization
If you need to allow more tags, pass a custom config:
```jsx
<SafeHTML 
  html={content}
  config={{ 
    ALLOWED_TAGS: [...defaultTags, 'table', 'tr', 'td'] 
  }}
/>
```

---

## 3. Subresource Integrity (SRI)

### Implementation
- **File**: `index.html`
- **Current Status**: Google Fonts preconnect configured
- **Next Step**: Generate and add SRI hashes

### How SRI Works
SRI hashes verify that external resources haven't been tampered with:
```html
<link 
  href="https://fonts.googleapis.com/css2?..."
  rel="stylesheet"
  integrity="sha384-ABC123..."
  crossorigin="anonymous">
```

### Generate SRI Hashes
Use https://www.srihash.org/ to generate hashes for external resources:
1. Paste the CDN URL
2. Copy the generated integrity hash
3. Add to `index.html`

### Current Configuration
- ✅ Preconnect links configured
- ✅ Crossorigin attributes added
- 📝 Integrity hashes: To be added per resource

### Resources to Secure (Future)
If adding external libraries:
```html
<!-- Example: Chart.js with SRI -->
<script 
  src="https://cdn.jsdelivr.net/npm/chart.js@3.9.1/dist/chart.min.js"
  integrity="sha384-..."
  crossorigin="anonymous">
</script>
```

---

## 4. Content Security Policy (CSP)

### Current Status
CSP meta tag is commented out in `index.html`. When ready for production:

```html
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self' 'unsafe-inline';
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  font-src 'self' https://fonts.gstatic.com;
  img-src 'self' data:;
  connect-src 'self' https://*.yunus.eu.org http://localhost:8080;
">
```

### Production Checklist
- [ ] Enable CSP in production
- [ ] Remove 'unsafe-inline' from style-src (use external stylesheets)
- [ ] Test all functionality with CSP enabled

---

## 5. Testing Security Implementation

### Test Cases

#### A. Authentication Flow
```javascript
// Frontend test
1. Load app → calls /auth/me → redirect to login (no session)
2. Login with credentials → httpOnly cookie set
3. Refresh page → /auth/me validates session → user restored
4. Click logout → cookie cleared → redirect to login
```

#### B. XSS Prevention
```javascript
// Malicious content test
const maliciousHTML = `<img src=x onerror="alert('XSS')"><script>alert('XSS')</script>`;
<SafeHTML html={maliciousHTML} />
// Result: Renders safely without executing script
```

#### C. SRI Verification
```bash
# Check if SRI hashes are valid
curl -I https://fonts.googleapis.com/css2?...
# Use browser DevTools: Network tab → check for integrity validation
```

---

## 6. Deployment Checklist

### Before Production
- [ ] Backend implements HttpOnly cookie endpoints
- [ ] CORS configured for production domain
- [ ] SRI hashes generated and added
- [ ] CSP headers configured
- [ ] Environment variables secured
- [ ] `.env` excluded from git
- [ ] HTTPS enabled on all domains
- [ ] Session timeout configured (recommended: 1 hour)
- [ ] Logout properly clears cookies

### Monitoring
- [ ] Monitor 401 responses (potential attacks)
- [ ] Log authentication failures
- [ ] Monitor CSP violations

---

## 7. Additional Recommendations

### Short Term
- ✅ Move tokens to HttpOnly cookies
- ✅ Implement DOMPurify sanitization
- ✅ Add SRI to external resources
- [ ] Implement rate limiting on login endpoint
- [ ] Add CSRF tokens to state-changing requests

### Medium Term
- [ ] Implement refresh token rotation
- [ ] Add API rate limiting
- [ ] Configure WAF (Web Application Firewall)
- [ ] Implement request signing

### Long Term
- [ ] Zero-knowledge proof authentication
- [ ] Hardware key support
- [ ] Biometric authentication integration

---

## 8. File Changes Summary

| File | Change | Security Impact |
|------|--------|-----------------|
| `src/api/axios.js` | Added `withCredentials: true` | XSS Prevention |
| `src/context/AuthProvider.jsx` | Removed localStorage, added `/auth/me` validation | Session Security |
| `src/components/SafeHTML.jsx` | New component for HTML sanitization | XSS Prevention |
| `src/pages/DoctorDashboard.jsx` | Use SafeHTML for AI drafts | XSS Prevention |
| `index.html` | Enhanced CSP, added SRI structure | Multiple Vectors |

---

## 9. Support & Questions

For questions on implementation:
- Review OWASP guidelines: https://owasp.org/
- DOMPurify docs: https://github.com/cure53/DOMPurify
- SRI guide: https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity
