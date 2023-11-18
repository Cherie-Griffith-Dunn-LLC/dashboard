import { 
    GET_REQUIRED_COURSES,
    GET_REQUIRED_COURSES_SUCCESS,
    GET_REQUIRED_COURSES_FAIL,
 } from "./actionTypes"


export const getRequiredCourses = () => {
    return {
        type: GET_REQUIRED_COURSES,
    }
}

export const getRequiredCoursesSuccess = (response) => {
    return {
        type: GET_REQUIRED_COURSES_SUCCESS,
        payload: response,
    }
}

export const getRequiredCoursesFail = (error) => {
    return {
        type: GET_REQUIRED_COURSES_FAIL,
        payload: error,
    }
}