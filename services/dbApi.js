import Constants from 'expo-constants';

const dbEndpoint = Constants.expoConfig.extra.apiUrl;

// get all users
export const getDbUsers = async (bearerToken) => {
    const response = await fetch(dbEndpoint + '/employees', {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer '  + bearerToken
        }
    });
    const data = await response.json();
    return data;
};

// get all courses
export const getDbCourses = async (bearerToken) => {
    const response = await fetch(dbEndpoint + '/courses', {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer '  + bearerToken
        }
    });
    const data = await response.json();
    return data;
};