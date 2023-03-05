module.exports = () => {
    if (process.env.MY_ENVIRONMENT === 'production') {
      return {
        /* your production config */
        owner: 'msaleem',
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
        owner: 'msaleem',
        extra: {
            apiUrl: 'http://localhost:3000',
            eas: {
              projectId: "8c5fc950-3942-4d7f-aa66-43e0f9e77cef"
            }
        }
      };
    }
  };
