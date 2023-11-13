import { 
    POST_USERS,
    POST_USERS_SUCCESS,
    POST_USERS_FAIL,
 } from "./actionTypes"


export const postOrgUsers = () => {
    return {
        type: POST_USERS,
    }
}

export const postOrgUsersSuccess = (response) => {
    return {
        type: POST_USERS_SUCCESS,
        payload: response,
    }
}

export const postOrgUsersFail = (error) => {
    return {
        type: POST_USERS_FAIL,
        payload: error,
    }
}