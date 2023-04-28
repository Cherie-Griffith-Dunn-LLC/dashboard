// api endpoint
import Constants from 'expo-constants';

const usmEndpoint = Constants.expoConfig.extra.apiUrl;

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

// get alarms
export const getAlarms = async (bearerToken, size, priority) => {
    const response = await fetch(usmEndpoint + '/alarms?size=' + size + '&priority=' + priority, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '  + bearerToken
        }
    });
    const data = await response.json();

    return data;
};

// get events
export const getEvents = async (bearerToken, size) => {
    const response = await fetch(usmEndpoint + '/events?size=' + size, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '  + bearerToken
        }
    });
    const data = await response.json();

    return data;
};

// get investigations
export const getInvestigations = async (bearerToken, size) => {
    const response = await fetch(usmEndpoint + '/investigations?size=' + size, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '  + bearerToken
        }
    });
    const data = await response.json();

    return data;
}

// get dictionaries
export const getDictionaries = async (bearerToken, size) => {
    const response = await fetch(usmEndpoint + '/dictionaries', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '  + bearerToken
        }
    });

    const data = await response.json();

    return data;
}

// get all dark web monitoring events
export const getAllDWM = async (bearerToken, size) => {
    const response = await fetch(usmEndpoint + '/darkWebEvents?size=' + size, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '  + bearerToken
        }
    });
    const data = await response.json();

    return data;
}