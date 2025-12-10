/**
 * Azure AD Authentication Configuration
 * This file contains all settings for Microsoft Authentication Library (MSAL)
 */

export const msalConfig = {
  auth: {
    // Your Azure AD Application (Client) ID
    clientId: "1d40f6b3-9072-4a0a-af48-6e423e58d0d6",
    
    // Your Azure AD Tenant ID
    authority: "https://login.microsoftonline.com/ff4945f1-e101-4ac8-a78f-798156ea9cdf",
    
    // Redirect URI after login (must match Azure AD exactly)
    redirectUri: "https://app.cyproteck.com",
    
    // Post-logout redirect
    postLogoutRedirectUri: "https://app.cyproteck.com",
    
    // Navigate to original request URL after login
    navigateToLoginRequestUrl: true,
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
