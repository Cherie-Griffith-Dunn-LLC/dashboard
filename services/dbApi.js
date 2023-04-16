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

// assign course to user
export const assignCourse = async (bearerToken, courseId) => {
    const response = await fetch(dbEndpoint + '/assignCourse', {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer '  + bearerToken,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            courseId: courseId
        })
    });
    const data = await response.json();
    return data;
};

// get all courses assigned to user
export const getCoursesByUser = async (bearerToken) => {
    const response = await fetch(dbEndpoint + '/requiredCourses', {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer '  + bearerToken
        }
    });
    const data = await response.json();
    return data;
};

//get all assignments of the organization
export const getAllAssignments = async (bearerToken) => {
    const response = await fetch(dbEndpoint + '/allCourseAssignments', {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer '  + bearerToken
        }
    });
    const data = await response.json();
    return data;
};
