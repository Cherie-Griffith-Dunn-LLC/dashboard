module.exports = () => {
    if (process.env.MY_ENVIRONMENT === 'production') {
      return {
        /* your production config */
        extra: {
            apiUrl: 'https://cyproteckapi.azurewebsites.net'
        }
      };
    } else {
      return {
        /* your development config */
        extra: {
            apiUrl: 'http://localhost:3000'
        }
      };
    }
  };