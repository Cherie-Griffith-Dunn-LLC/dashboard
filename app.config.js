module.exports = () => {
    if (process.env.MY_ENVIRONMENT === 'production') {
      return {
        /* your production config */
        owner: 'cyproteck',
        ios: {
          supportsTablet: true,
          bundleIdentifier: "com.cyproteck.cyproteck",
          buildNumber: "0.0.1"
        },
        android: {
          package: "com.cyproteck.cyproteck",
          versionCode: 1
        },
        extra: {
            apiUrl: 'https://cyproteckapi.azurewebsites.net',
            eas: {
              projectId: "8c5fc950-3942-4d7f-aa66-43e0f9e77cef"
            }
        }
      };
    } else {
      return {
        /* your development config */
        owner: 'cyproteck',
        ios: {
          supportsTablet: true,
          bundleIdentifier: "com.cyproteck.cyproteck",
          buildNumber: "0.0.1"
        },
        android: {
          package: "com.cyproteck.cyproteck",
          versionCode: 1
        },
        extra: {
            apiUrl: 'http://localhost:3000',
            eas: {
              projectId: "8c5fc950-3942-4d7f-aa66-43e0f9e77cef"
            }
        }
      };
    }
  };
