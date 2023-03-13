import Constants from 'expo-constants';


const apiEndpoint = Constants.expoConfig.extra.apiUrl;

export const getMe = async (token) => {
    const response = await fetch(apiEndpoint + '/user', {
            headers: {
            Authorization: `Bearer ${token}`,
            },
        });
    const data = await response.json();
    return data;
};

// get user's role
export const getRole = async (bearerToken) => {
    const response = await fetch(apiEndpoint + '/user/role', {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer '  + bearerToken
        }
    });
    const data = await response.json();
    return data;
};

// get all users
export const getUsers = async (bearerToken) => {
    const response = await fetch(apiEndpoint + '/users', {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer '  + bearerToken
        }
    });
    const data = await response.json();
    return data;
};


// make post request with email in body
export const getTenantId = async (email) => {
    const response = await fetch(apiEndpoint + '/tenant', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email }),
    });
    const data = await response.json();
    return data;
}