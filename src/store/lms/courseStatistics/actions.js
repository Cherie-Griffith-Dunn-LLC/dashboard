import { 
    GET_COURSE_STATISTICS,
    GET_COURSE_STATISTICS_SUCCESS,
    GET_COURSE_STATISTICS_FAIL,
 } from "./actionTypes"


 export const getCourseStats = () => {
    return {
        type: GET_COURSE_STATISTICS,
    }
}

export const getCourseStatsSuccess = (response) => {
    return {
        type: GET_COURSE_STATISTICS_SUCCESS,
        payload: response,
    }
}

export const getCourseStatsFail = (error) => {
    return {
        type: GET_COURSE_STATISTICS_FAIL,
        payload: error,
    }
}