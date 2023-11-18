import { 
    GET_COURSE_URL,
    GET_COURSE_URL_SUCCESS,
    GET_COURSE_URL_FAIL,
 } from "./actionTypes"


export const viewCourse = () => {
    return {
        type: GET_COURSE_URL,
    }
}

export const viewCourseSuccess = (response) => {
    return {
        type: GET_COURSE_URL_SUCCESS,
        payload: response,
    }
}

export const viewCourseFail = (error) => {
    return {
        type: GET_COURSE_URL_FAIL,
        payload: error,
    }
}