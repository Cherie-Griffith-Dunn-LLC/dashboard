/**
 * Azure AD Authentication Configuration
 * Multi-tenant support for MSSP and client organizations
 */
export const msalConfig = {
  auth: {
    clientId:
      process.env.REACT_APP_ENTRA_CLIENT_ID ||
      "1d40f6b3-9072-4a0a-af48-6e423e58d0d6",
    authority: "https://login.microsoftonline.com/organizations",

    // Redirect URI after login (must match Azure AD exactly)
    redirectUri:
      process.env.REACT_APP_ENTRA_REDIRECT_URI || "https://app.cyproteck.com",

    // Post-logout redirect
    postLogoutRedirectUri:
      process.env.REACT_APP_ENTRA_REDIRECT_URI || "https://app.cyproteck.com",
  },
  cache: {
    cacheLocation: "sessionStorage",
    storeAuthStateInCookie: false,
  },
};

/**
 * Scopes for login request
 */
export const loginRequest = {
  scopes:
    process.env.REACT_APP_CUSTOMER_PORTAL_ENABLED === "true" &&
    process.env.REACT_APP_PORTAL_API_SCOPE
      ? [process.env.REACT_APP_PORTAL_API_SCOPE]
      : ["User.Read"],
};

/**
 * Scopes for Microsoft Graph API
 */
export const graphConfig = {
  graphMeEndpoint: "https://graph.microsoft.com/v1.0/me",
};
