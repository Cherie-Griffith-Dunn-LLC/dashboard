import { 
    GET_CURRENT_USER,
    GET_CURRENT_USER_SUCCESS,
    GET_CURRENT_USER_FAIL,
 } from "./actionTypes"


export const getCurrentUser = () => {
    return {
        type: GET_CURRENT_USER,
    }
}

export const getCurrentUserSuccess = (response) => {
    return {
        type: GET_CURRENT_USER_SUCCESS,
        payload: response,
    }
}

export const getCurrentUserFail = (error) => {
    return {
        type: GET_CURRENT_USER_FAIL,
        payload: error,
    }
}