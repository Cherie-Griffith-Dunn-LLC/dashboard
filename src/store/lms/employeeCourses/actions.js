import { 
    GET_EMPLOYEE_COURSES,
    GET_EMPLOYEE_COURSES_SUCCESS,
    GET_EMPLOYEE_COURSES_FAIL,
 } from "./actionTypes"


export const getEmployeeCourses = () => {
    return {
        type: GET_EMPLOYEE_COURSES,
    }
}

export const getEmployeeCoursesSuccess = (response) => {
    return {
        type: GET_EMPLOYEE_COURSES_SUCCESS,
        payload: response,
    }
}

export const getEmployeeCoursesFail = (error) => {
    return {
        type: GET_EMPLOYEE_COURSES_FAIL
    }
}