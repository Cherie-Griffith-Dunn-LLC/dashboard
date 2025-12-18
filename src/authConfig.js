/**
 * Azure AD Authentication Configuration
 * Multi-tenant support for MSSP and client organizations
 */
export const msalConfig = {
  auth: {
    clientId: "1d40f6b3-9072-4a0a-af48-6e423e58d0d6",
    authority: "https://login.microsoftonline.com/common",
    
    // Redirect URI after login (must match Azure AD exactly)
    redirectUri: "https://app.cyproteck.com",
    
    // Post-logout redirect
    postLogoutRedirectUri: "https://app.cyproteck.com",
  },
  cache: {
    cacheLocation: "sessionStorage",
    storeAuthStateInCookie: false,
  }
};

/**
 * Scopes for login request
 */
export const loginRequest = {
  scopes: ["User.Read"]
};

/**
 * Scopes for Microsoft Graph API
 */
export const graphConfig = {
  graphMeEndpoint: "https://graph.microsoft.com/v1.0/me"
};
```

---

## 📋 **DEPLOYMENT STEPS:**

### **1. Replace authConfig.js:**
1. Go to GitHub → `src/authConfig.js`
2. Click **Edit (✏️)**
3. **Select ALL** (Ctrl+A)
4. **Delete**
5. **Paste** the code above
6. Scroll to bottom
7. Commit message: `Enable multi-tenant authentication - change authority to common`
8. Click **"Commit changes"**

### **2. Wait for Deployment:**
- Go to **Actions** tab
- Wait for green ✅ (2-3 minutes)

### **3. Clear Browser Cache:**
- **Ctrl + Shift + Delete**
- Clear all cache
- Close browser completely

---

## 📋 **NEXT: ADMIN CONSENT FOR CGD LLC**

After the code deploys, click this URL:

### **Admin Consent URL (Click This):**
```
https://login.microsoftonline.com/0d9acab6-2b9d-4883-8617-f3fdea4b02d6/adminconsent?client_id=1d40f6b3-9072-4a0a-af48-6e423e58d0d6&redirect_uri=https://app.cyproteck.com
