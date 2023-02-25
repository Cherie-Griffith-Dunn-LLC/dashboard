const apiEndpoint = 'http://localhost:3000';

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
