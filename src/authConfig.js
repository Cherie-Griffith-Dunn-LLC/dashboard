/**
 * Azure AD Authentication Configuration
 * This file contains all settings for Microsoft Authentication Library (MSAL)
 */

export const msalConfig = {
  auth: {
    // REQUIRED: Your Azure AD Tenant ID
    // Find this in Azure Portal → Azure Active Directory → Overview → Tenant ID
    clientId: process.env.REACT_APP_AZURE_CLIENT_ID || "YOUR_CLIENT_ID_HERE",
    
    // REQUIRED: Your Azure AD Tenant ID
    // Find this in Azure Portal → Azure Active Directory → Overview → Tenant ID
    authority: `https://login.microsoftonline.com/${process.env.REACT_APP_AZURE_TENANT_ID || "YOUR_TENANT_ID_HERE"}`,
    
    // REQUIRED: Redirect URI after login
    redirectUri: process.env.REACT_APP_REDIRECT_URI || "https://app.cyproteck.com",
    
    // Post-logout redirect
    postLogoutRedirectUri: process.env.REACT_APP_REDIRECT_URI || "https://app.cyproteck.com",
    
    // IMPORTANT: Set to true for production
    navigateToLoginRequestUrl: false,
  },
  cache: {
    cacheLocation: "sessionStorage", // Use sessionStorage for security
    storeAuthStateInCookie: false,   // Set to true if you need to support IE11
  },
  system: {
    loggerOptions: {
      loggerCallback: (level, message, containsPii) => {
        if (containsPii) return;
        switch (level) {
          case 0: // Error
            console.error(message);
            break;
          case 1: // Warning
            console.warn(message);
            break;
          case 2: // Info
            console.info(message);
            break;
          case 3: // Verbose
            console.debug(message);
            break;
          default:
            break;
        }
      },
    },
  },
};

/**
 * Scopes for Microsoft Graph API
 * These determine what user data and Microsoft services your app can access
 */
export const loginRequest = {
  scopes: [
    "User.Read",           // Read user profile
    "User.ReadBasic.All",  // Read basic info of all users
    "email",               // Read user email
    "profile",             // Read user profile
    "openid",              // OpenID Connect
  ],
};

/**
 * Scopes for Microsoft Sentinel API
 * Add these to access Sentinel data
 */
export const sentinelRequest = {
  scopes: [
    "https://management.azure.com/user_impersonation", // Azure Resource Manager
  ],
};

/**
 * Scopes for Microsoft Defender API
 * Add these to access Defender data
 */
export const defenderRequest = {
  scopes: [
    "https://api.securitycenter.microsoft.com/user_impersonation", // Defender API
  ],
};

/**
 * Graph API endpoint for user profile
 */
export const graphConfig = {
  graphMeEndpoint: "https://graph.microsoft.com/v1.0/me",
  graphPhotoEndpoint: "https://graph.microsoft.com/v1.0/me/photo/$value",
};

/**
 * GitHub OAuth Configuration (for GitHub integration)
 * Note: GitHub auth should be set up through Azure AD as an Identity Provider
 */
export const githubConfig = {
  // These will be configured in Azure AD → Identity Providers → GitHub
  enabled: true,
  // The GitHub info will come through the Azure AD token
};
