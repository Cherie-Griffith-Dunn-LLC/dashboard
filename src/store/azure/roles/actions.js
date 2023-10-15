import { 
    GET_CURRENT_ROLE,
    GET_CURRENT_ROLE_SUCCESS,
    GET_CURRENT_ROLE_FAIL
 } from "./actionTypes"


export const getCurrentRole = () => {
    return {
        type: GET_CURRENT_ROLE,
    }
}

export const getCurrentRoleSuccess = (response) => {
    return {
        type: GET_CURRENT_ROLE_SUCCESS,
        payload: response,
    }
}

export const getCurrentRoleFail = (error) => {
    return {
        type: GET_CURRENT_ROLE_FAIL,
        payload: error,
    }
}