# Smart Health Frontend

Medical-grade React frontend for the Smart Health Monitoring System. Built with Vite, Tailwind CSS, and TanStack Query.

## 🚀 Getting Started

1.  **Install dependencies**:
    ```bash
    npm install
    ```

2.  **Configure Environment**:
    The `.env` file is set to point to `http://localhost:8080/api/v1`.

3.  **Run Development Server**:
    ```bash
    npm run dev
    ```
    The app will run on [http://localhost:3000](http://localhost:3000).

## 🛡️ Security Implementation

Following the **Frontend Security Checklist**, this project implements:

-   **XSS Protection**:
    -   Uses React's automatic JSX escaping for all user/AI-generated content.
    -   Strict **Content Security Policy (CSP)** implemented via meta tags to restrict script sources and connections.
-   **Clickjacking Protection**:
    -   `X-Frame-Options: DENY` meta tag included.
-   **Secure API Communication**:
    -   Axios interceptors handle JWT injection securely.
    -   No hardcoded secrets or API keys in the source code.
-   **Role-Based Access Control (RBAC)**:
    -   Protected routes prevent unauthorized access to Doctor/Patient portals.
-   **Port Synchronization**:
    -   Locked to port `3000` to match Backend CORS policy.

### ⚠️ Production Recommendations
-   **Token Storage**: Move from `localStorage` to **HttpOnly Cookies** for JWT to prevent theft via potential XSS.
-   **Sanitization**: If rendering complex Markdown in the Doctor Portal, integrate `DOMPurify`.
-   **Subresource Integrity (SRI)**: Use SRI for any external CDN scripts/styles.

## 📁 Project Structure
- `src/api`: Axios configuration and interceptors.
- `src/components`: Reusable UI components and Protected Routes.
- `src/context`: Auth state management.
- `src/pages`: Portal-specific views (Doctor, Patient, Landing).
- `src/hooks`: Custom hooks for data fetching.
