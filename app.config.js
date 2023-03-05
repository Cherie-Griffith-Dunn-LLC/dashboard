module.exports = () => {
    if (process.env.MY_ENVIRONMENT === 'production') {
      return {
        /* your production config */
        owner: 'msaleem',
        extra: {
            apiUrl: 'https://cyproteckapi.azurewebsites.net'
        }
      };
    } else {
      return {
        /* your development config */
        owner: 'msaleem',
        extra: {
            apiUrl: 'http://localhost:3000'
        }
      };
    }
  };
