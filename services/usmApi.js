// api endpoint
const usmEndpoint = 'http://localhost:3000/api/2.0';

// oauth login
export const getOauth = async (authString) => {
    const response = await fetch(usmEndpoint + '/oauth/token?grant_type=client_credentials', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Basic '  + btoa(authString)
        }
    });
    const data = await response.json();

    return data;
};

// get alerts
export const getAlerts = async (bearerToken) => {
    const response = await fetch(usmEndpoint + '/alarms', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '  + bearerToken
        }
    });
    const data = await response.json();
    console.log(data);

    return data;
};

// get events
export const getEvents = async (bearerToken) => {
    const response = await fetch(usmEndpoint + '/events', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '  + bearerToken
        }
    });
    const data = await response.json();
    console.log(data);

    return data;
};
