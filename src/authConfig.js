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
